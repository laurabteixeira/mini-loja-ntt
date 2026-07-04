import { INestApplication } from '@nestjs/common/interfaces';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { CacheService } from '../src/cache/cache.service';
import { createTestApp } from './test-app';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cache: CacheService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    cache = app.get(CacheService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await cache.delByPattern('product:*');
    await cache.delByPattern('products:list:*');
  });

  it('GET /health returns database and redis status', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.databaseConnected).toBe(true);
        expect(response.body.redisConnected).toBe(true);
      });
  });
});

describe('Categories (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  it('returns 409 when deleting category with linked products (ADR-007)', async () => {
    const category = await prisma.category.create({ data: { name: 'Electronics' } });
    await prisma.product.create({
      data: {
        name: 'Phone',
        description: 'Smartphone',
        price: 999.99,
        categoryId: category.id,
      },
    });

    await request(app.getHttpServer())
      .delete(`/categories/${category.id}`)
      .expect(409);
  });
});

describe('Products cache (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cache: CacheService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    cache = app.get(CacheService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await cache.delByPattern('product:*');
    await cache.delByPattern('products:list:*');
  });

  it('caches product detail and invalidates on update', async () => {
    const category = await prisma.category.create({ data: { name: 'Books' } });
    const created = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'NestJS Guide',
        description: 'Backend patterns',
        price: 49.9,
        categoryId: category.id,
      })
      .expect(201);

    const productId = created.body.id;

    await request(app.getHttpServer()).get(`/products/${productId}`).expect(200);
    expect(await cache.get(`product:${productId}`)).not.toBeNull();

    await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send({ name: 'NestJS Guide (2nd ed.)' })
      .expect(200);

    expect(await cache.get(`product:${productId}`)).toBeNull();
  });

  it('caches paginated list and invalidates on create', async () => {
    const category = await prisma.category.create({ data: { name: 'Games' } });

    await request(app.getHttpServer()).get('/products?page=1&limit=10').expect(200);
    expect(await cache.get('products:list:page=1:limit=10')).not.toBeNull();

    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Board Game',
        description: 'Family fun',
        price: 79.9,
        categoryId: category.id,
      })
      .expect(201);

    expect(await cache.get('products:list:page=1:limit=10')).toBeNull();
  });
});

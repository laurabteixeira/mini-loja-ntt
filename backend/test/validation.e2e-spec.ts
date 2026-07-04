import { INestApplication } from '@nestjs/common/interfaces';
import * as request from 'supertest';
import { FIELD_LIMITS } from '../src/common/validation/field-limits';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './test-app';

describe('Input validation (e2e)', () => {
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

  async function createCategory(name = 'Validation Test Category') {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({ name })
      .expect(201);

    return response.body.id as number;
  }

  it('POST /categories rejects name above max length', () => {
    const oversizedName = 'A'.repeat(FIELD_LIMITS.categoryName + 1);

    return request(app.getHttpServer())
      .post('/categories')
      .send({ name: oversizedName })
      .expect(400);
  });

  it('POST /categories rejects unknown fields', () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Valid', injected: true })
      .expect(400);
  });

  it('GET /products/:id rejects non-positive id', () => {
    return request(app.getHttpServer()).get('/products/-1').expect(400);
  });

  it('GET /products/:id rejects malformed id', () => {
    return request(app.getHttpServer()).get('/products/1abc').expect(400);
  });

  it('GET /categories/:id rejects malformed id', () => {
    return request(app.getHttpServer()).get('/categories/1abc').expect(400);
  });

  it('GET /products rejects search above max length', () => {
    const oversizedSearch = 'A'.repeat(FIELD_LIMITS.querySearch + 1);

    return request(app.getHttpServer())
      .get(`/products?search=${oversizedSearch}`)
      .expect(400);
  });

  it('GET /products rejects page above max', () => {
    return request(app.getHttpServer())
      .get(`/products?page=${FIELD_LIMITS.queryPageMax + 1}`)
      .expect(400);
  });

  it('POST /products rejects name above max length', async () => {
    const categoryId = await createCategory();

    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'A'.repeat(FIELD_LIMITS.productName + 1),
        description: 'Valid description',
        price: 10,
        categoryId,
      })
      .expect(400);
  });

  it('POST /products rejects description above max length', async () => {
    const categoryId = await createCategory();

    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Valid Product',
        description: 'A'.repeat(FIELD_LIMITS.productDescription + 1),
        price: 10,
        categoryId,
      })
      .expect(400);
  });

  it('POST /products rejects imageUrl above max length', async () => {
    const categoryId = await createCategory();
    const oversizedPath = 'a'.repeat(
      FIELD_LIMITS.productImageUrl - 'https://x.com/'.length + 1,
    );

    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Valid Product',
        description: 'Valid description',
        price: 10,
        categoryId,
        imageUrl: `https://x.com/${oversizedPath}`,
      })
      .expect(400);
  });

  it('POST /products rejects price above max', async () => {
    const categoryId = await createCategory('Price Test Category');

    return request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Valid Product',
        description: 'Valid description',
        price: FIELD_LIMITS.productPriceMax + 1,
        categoryId,
      })
      .expect(400);
  });

  it('PATCH /products/:id rejects name above max length', async () => {
    const categoryId = await createCategory();
    const created = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Valid Product',
        description: 'Valid description',
        price: 10,
        categoryId,
      })
      .expect(201);

    return request(app.getHttpServer())
      .patch(`/products/${created.body.id}`)
      .send({ name: 'A'.repeat(FIELD_LIMITS.productName + 1) })
      .expect(400);
  });

  it('PATCH /categories/:id rejects name above max length', async () => {
    const categoryId = await createCategory('Patch Test Category');

    return request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .send({ name: 'A'.repeat(FIELD_LIMITS.categoryName + 1) })
      .expect(400);
  });

  it('PATCH /products/:id rejects empty body', async () => {
    const categoryId = await createCategory();
    const created = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Valid Product',
        description: 'Valid description',
        price: 10,
        categoryId,
      })
      .expect(201);

    return request(app.getHttpServer())
      .patch(`/products/${created.body.id}`)
      .send({})
      .expect(400);
  });
});

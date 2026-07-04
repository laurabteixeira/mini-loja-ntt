import { INestApplication } from '@nestjs/common/interfaces';
import * as request from 'supertest';
import { createTestApp } from './test-app';

describe('Throttling (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.THROTTLE_ENABLED = 'true';
    process.env.THROTTLE_HEALTH_LIMIT = '3';
    app = await createTestApp();
  });

  afterAll(async () => {
    delete process.env.THROTTLE_ENABLED;
    delete process.env.THROTTLE_HEALTH_LIMIT;
    await app.close();
  });

  it('returns 429 when health rate limit is exceeded', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await request(app.getHttpServer()).get('/health').expect(200);
    }

    await request(app.getHttpServer()).get('/health').expect(429);
  });
});

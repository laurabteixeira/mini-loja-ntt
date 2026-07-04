import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Mini Loja API')
    .setDescription(
      'REST API for products and categories. Redis cache-aside on GET /products and GET /products/:id (see docs/03-cache-strategy.md).',
    )
    .setVersion('1.0')
    .addTag('health', 'Service health and dependency checks')
    .addTag('categories', 'Category CRUD')
    .addTag(
      'products',
      'Product CRUD — list and detail reads are cached in Redis',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Mini Loja API — Swagger',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  });
}

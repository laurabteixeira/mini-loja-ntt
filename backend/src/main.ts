import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>(
    'CORS_ORIGIN',
    'http://localhost:5173',
  );
  const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim());
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean | string) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
        return;
      }

      if (
        nodeEnv !== 'production' &&
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, origin);
        return;
      }

      callback(null, false);
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(configService.get<string>('PORT', '3000'));
  await app.listen(port, '0.0.0.0');
}

bootstrap();

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getHealth() {
    let databaseConnected = false;
    let redisConnected = false;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      databaseConnected = true;
    } catch {
      databaseConnected = false;
    }

    redisConnected = await this.redis.ping();

    return {
      status: 'ok',
      service: 'mini-loja-api',
      databaseConnected,
      redisConnected,
      databaseUrlConfigured: Boolean(
        this.configService.get<string>('DATABASE_URL'),
      ),
      redisUrlConfigured: Boolean(
        this.configService.get<string>('REDIS_URL'),
      ),
    };
  }
}

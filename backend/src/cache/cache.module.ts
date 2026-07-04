import { Global, Module } from '@nestjs/common';
import { CACHE_CLIENT } from './cache.constants';
import { CacheService } from './cache.service';
import { RedisCacheClient } from './providers/redis-cache.client';

@Global()
@Module({
  providers: [
    CacheService,
    {
      provide: CACHE_CLIENT,
      useClass: RedisCacheClient,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}

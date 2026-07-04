import { Inject, Injectable } from '@nestjs/common';
import { CacheClient } from './cache.client';
import { CACHE_CLIENT } from './cache.constants';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_CLIENT) private readonly client: CacheClient) {}

  ping(): Promise<boolean> {
    return this.client.ping();
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    return this.client.set(key, value, ttlSeconds);
  }

  del(key: string): Promise<void> {
    return this.client.del(key);
  }

  delByPattern(pattern: string): Promise<number> {
    return this.client.delByPattern(pattern);
  }
}

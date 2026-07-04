import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
  getOptionsToken,
  getStorageToken,
} from '@nestjs/throttler';
import {
  getHealthThrottleLimit,
  getHealthThrottleTtl,
  isThrottlingEnabled,
} from './throttle.config';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  constructor(
    @Inject(getOptionsToken()) options: ThrottlerModuleOptions,
    @Inject(getStorageToken()) storageService: ThrottlerStorage,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(options, storageService, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (await this.shouldSkip(context)) {
      return true;
    }

    const { req } = this.getRequestResponse(context);
    const isHealthRoute = req.path === '/health' || req.url?.startsWith('/health');

    if (isHealthRoute) {
      if (!isThrottlingEnabled(this.configService)) {
        return true;
      }

      const namedThrottler =
        this.throttlers.find((throttler) => throttler.name === 'default') ??
        this.throttlers[0];
      const ttl = getHealthThrottleTtl(this.configService);

      return this.handleRequest({
        context,
        limit: getHealthThrottleLimit(this.configService),
        ttl,
        throttler: namedThrottler,
        blockDuration: ttl,
        getTracker: namedThrottler.getTracker ?? this.commonOptions.getTracker!,
        generateKey:
          namedThrottler.generateKey ?? this.commonOptions.generateKey!,
      });
    }

    return super.canActivate(context);
  }
}

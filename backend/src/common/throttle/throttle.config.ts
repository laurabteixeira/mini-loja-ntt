import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import {
  THROTTLE_DEFAULT_LIMIT,
  THROTTLE_DEFAULT_TTL_MS,
  THROTTLE_HEALTH_LIMIT,
} from './throttle.constants';

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
}

export function isThrottlingEnabled(configService: ConfigService): boolean {
  const explicit = configService.get<string>('THROTTLE_ENABLED');

  if (explicit !== undefined) {
    return explicit === 'true';
  }

  return configService.get<string>('NODE_ENV') !== 'test';
}

export function buildThrottlerOptions(
  configService: ConfigService,
): ThrottlerModuleOptions {
  if (!isThrottlingEnabled(configService)) {
    return [{ ttl: THROTTLE_DEFAULT_TTL_MS, limit: 100_000 }];
  }

  return [
    {
      name: 'default',
      ttl: parsePositiveInt(
        configService.get<string>('THROTTLE_TTL'),
        THROTTLE_DEFAULT_TTL_MS,
      ),
      limit: parsePositiveInt(
        configService.get<string>('THROTTLE_LIMIT'),
        THROTTLE_DEFAULT_LIMIT,
      ),
    },
  ];
}

export function getHealthThrottleLimit(
  configService: ConfigService,
): number {
  return parsePositiveInt(
    configService.get<string>('THROTTLE_HEALTH_LIMIT'),
    THROTTLE_HEALTH_LIMIT,
  );
}

export function getHealthThrottleTtl(
  configService: ConfigService,
): number {
  return parsePositiveInt(
    configService.get<string>('THROTTLE_TTL'),
    THROTTLE_DEFAULT_TTL_MS,
  );
}

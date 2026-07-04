import { BadRequestException } from '@nestjs/common';

export const EMPTY_PARTIAL_UPDATE_MESSAGE =
  'At least one field must be provided for update';

export function assertHasUpdateFields<T extends object>(
  payload: T,
  message = EMPTY_PARTIAL_UPDATE_MESSAGE,
): void {
  if (Object.keys(payload).length === 0) {
    throw new BadRequestException(message);
  }
}

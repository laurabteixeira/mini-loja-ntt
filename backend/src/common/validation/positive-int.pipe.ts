import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    if (!POSITIVE_INTEGER_PATTERN.test(value)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    const parsed = Number.parseInt(value, 10);

    if (parsed < 1) {
      throw new BadRequestException(
        'Validation failed (positive integer is expected)',
      );
    }

    return parsed;
  }
}

export const positiveIntPipe = new PositiveIntPipe();

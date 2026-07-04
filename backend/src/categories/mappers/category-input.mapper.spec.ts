import { BadRequestException } from '@nestjs/common';
import { CategoryInputMapper } from './category-input.mapper';

describe('CategoryInputMapper', () => {
  it('maps create DTO to persistence input', () => {
    expect(CategoryInputMapper.toCreateInput({ name: 'Books' })).toEqual({
      name: 'Books',
    });
  });

  it('throws when update payload is empty', () => {
    expect(() => CategoryInputMapper.toUpdateInput({})).toThrow(
      BadRequestException,
    );
  });
});

import { BadRequestException } from '@nestjs/common';
import { ProductInputMapper } from './product-input.mapper';

describe('ProductInputMapper', () => {
  it('maps create DTO to persistence input', () => {
    expect(
      ProductInputMapper.toCreateInput({
        name: 'Phone',
        description: 'Smartphone',
        price: 999.99,
        categoryId: 1,
        imageUrl: 'https://example.com/phone.png',
      }),
    ).toEqual({
      name: 'Phone',
      description: 'Smartphone',
      price: 999.99,
      categoryId: 1,
      imageUrl: 'https://example.com/phone.png',
    });
  });

  it('throws when update payload is empty', () => {
    expect(() => ProductInputMapper.toUpdateInput({})).toThrow(
      BadRequestException,
    );
  });

  it('normalizes empty imageUrl to null on update', () => {
    expect(ProductInputMapper.toUpdateInput({ imageUrl: '' })).toEqual({
      imageUrl: null,
    });
  });
});

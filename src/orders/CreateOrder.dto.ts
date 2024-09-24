import { IsArray, IsNotEmpty, IsUUID, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductIdDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID único del producto que forma parte de la orden', example: 'a7f4d5e6-3c48-45c3-9a6e-7a9f348a123d' })
  id: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'ID del usuario que está realizando la orden', example: 'b5a7a5c8-3f48-4745-88b9-1a4e64c8489d' })
  userId: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'La orden debe contener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => ProductIdDto)
  @ApiProperty({
    description: 'Lista de productos que forman parte de la orden. Debe contener al menos un producto.',
    type: [ProductIdDto],
    example: [
      { id: 'a7f4d5e6-3c48-45c3-9a6e-7a9f348a123d' },
      { id: 'b5a7a5c8-3f48-4745-88b9-1a4e64c8489d' }
    ]
  })
  products: ProductIdDto[];
}

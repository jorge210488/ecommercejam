import { PartialType } from "@nestjs/mapped-types";
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "El nombre del producto, no puede estar vacío.",
    example: "Samsung Galaxy S22+",
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "Descripción del producto, no puede estar vacío.",
    example: "Celular de alta gamma de Samsung",
  })
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0' })
  @ApiProperty({
    description: "Precio del producto, debe tener como máximo 2 decimales.",
    example: 959.54,
  })
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'El stock no puede ser negativo' })
  @ApiProperty({
    description: "Cantidad en stock del producto, debe ser un número entero.",
    example: 50,
  })
  stock: number;

  
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: "El ID de la categoría a la que pertenece el producto, debe ser un UUID válido.",
    example: "84e8f918-df87-4073-83d7-7cd8ebe17c8d",
  })
  categoryId: string;

  @IsOptional()
  @IsString()
  @ApiHideProperty()
  imgUrl?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'Ejemplo de datos de actualización de producto',
    example: 'Samsung Galaxy S23+'
  })
  name?:string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      description: "El nombre de la categoría, no puede estar vacío",
      example: "Laptops",
  })
    name: string;
  }
  
import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString, Length, matches, Matches, Validate, ValidateIf } from "class-validator";
import { MatchPassword } from "../decorators/match.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    @ApiProperty({
        description: "El nombre del usuario, no puede estar vacío, debe tener como mínimo 3 caracteres y un máximo de 80",
        example: "Jorge Martínez",
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        description: "El email del usuario, debe tener la estructura valida de un email y no puede estar vacío",
        example: "jorge@email.com",
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]/, {
        message: 'El Password debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*',
    })
    @ApiProperty({
        description: "El password del usuario, no puede estar vacío, debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*",
        example: "Prueba123!",
    })
    password: string;

    // ? valida directamente dentro del DTO
    @IsNotEmpty()
    @Validate(MatchPassword, ['password']) // <- es el DTO password
    @ApiProperty({
        description: "Debe coincidir con el campo password",
        example: "Prueba123!",
    })
    confirmPassword: string;

    @IsOptional()
    @IsString()
    @Length(3, 80)
    @ApiProperty({
        description: "La dirección del usuario, debe tener entre 3 y 80 caracteres. Es opcional.",
        example: "Avenida falsa 123",
        required: false,
    })
    address: string;
    
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({
        description: "El número de teléfono del usuario, debe ser un número entero",
        example: 123456789,
    })
    phone: number;

    @IsOptional()
    @IsString()
    @Length(5, 20)
    @ApiProperty({
        description: "El país del usuario, debe tener entre 5 y 20 caracteres. Es opcional.",
        example: "Argentina",
        required: false,
    })
    country?: string;

    @IsOptional()
    @IsString()
    @Length(5, 20)
    @ApiProperty({
        description: "La ciudad del usuario, debe tener entre 5 y 20 caracteres. Es opcional.",
        example: "Buenos Aires",
        required: false,
    })
    city?: string;
}
 
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
      description: 'Ejemplo de datos de actualización del usuario',
      example: {
        name: 'Jorge García',
        email: 'jorgemartinez@email.com',
        phone: 11655455,
        address: 'Av. Córboba 1245',
        country: 'Argentina',
        city: 'Santa Fe',
      }
    })
    example?: any;
  }
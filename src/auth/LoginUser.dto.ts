import { ApiProperty, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "../users/CreateUser.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto extends PickType(CreateUserDto, ['email']) {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Password del usuario, no puede estar vacío",
        example: "Prueba123!",
    })
    password: string; 
}

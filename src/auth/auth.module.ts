import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersRepository } from "../users/users.repository";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [UsersModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./Users.entity";


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, UsersRepository],
    controllers: [UsersController],
    exports: [UsersRepository],
})
export class UsersModule {}
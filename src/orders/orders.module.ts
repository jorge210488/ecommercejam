import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../orders/Orders.entity";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { ProductsRepository } from "../products/products.repository";
import { UsersRepository } from "../users/users.repository";
import { OrdersRepository } from "./orders.repository";
import { OrderDetailsRepository } from "./orderDetails.repository";
import { ProductsModule } from "../products/products.module";
import { UsersModule } from "../users/users.module";
import { OrderDetail } from "./OrderDetails.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderDetail]), ProductsModule, UsersModule],
    providers: [OrdersService, OrdersRepository, OrderDetailsRepository,],
    controllers: [OrdersController],
})
export class OrdersModule {}
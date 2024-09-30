import { Controller, Param, Get, HttpCode, Post, Body, ParseUUIDPipe, UseGuards, UseInterceptors } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto} from "./CreateOrder.dto";
import { AuthGuard } from "../auth/AuthGuard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OrderPermissionInterceptor } from "../interceptors/orderPermission.interceptor";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
    constructor (private readonly ordersService: OrdersService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @UseInterceptors(OrderPermissionInterceptor)
    @HttpCode(200)
    @Get(":id")
    async getOrderById(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.ordersService.getOrderById(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @UseInterceptors(OrderPermissionInterceptor)
    @HttpCode(201)
        @Post()
    async addOrder(@Body() orderData: CreateOrderDto) {
          return this.ordersService.addOrder(orderData);
        }
}
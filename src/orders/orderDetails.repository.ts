import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetail } from "../orders/OrderDetails.entity";
import { Repository } from "typeorm";


@Injectable()
export class OrderDetailsRepository {
    constructor (
        @InjectRepository(OrderDetail) private readonly orderDetailsRepository: Repository<OrderDetail | undefined>,
    ){}

    async addOrderDetails (orderDetails: OrderDetail): Promise<OrderDetail> {
        const newOrderDetails = await this.orderDetailsRepository.save(orderDetails);
        return newOrderDetails;
    }
}
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./Orders.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrdersRepository {
    constructor(
         @InjectRepository(Order) private readonly ordersRepository: Repository<Order | undefined>, 
    ){}

    async getOrder(id: string): Promise<Order> {
        try {
            const order = await this.ordersRepository.findOne({
                where: { id },
                relations: ['user', 'orderDetail', 'orderDetail.products'],
            });
    
            if (!order) {
                throw new NotFoundException(`Orden con el id ${id} no encontrada`);
            }
    
            if (!order.user || !order.user.id) {
                throw new BadRequestException('El usuario asociado a la orden no tiene un ID.');
            }
    
            if (!order.orderDetail) {
                throw new BadRequestException('El detalle de la orden no está disponible.');
            }
    
            if (!order.orderDetail.products || order.orderDetail.products.length === 0) {
                throw new BadRequestException('No se encontraron productos en el detalle de la orden.');
            }
    
            return order;
        } catch (error) {
            throw error;
        }
    }
    

async addOrder(order: Order): Promise<Order> {
    try {
        const newOrder = await this.ordersRepository.save(order);
        return newOrder;
    } catch (error) {
        throw error;  
    }
}  
}

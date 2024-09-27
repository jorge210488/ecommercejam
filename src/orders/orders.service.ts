import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { OrdersRepository } from "./orders.repository";
import { Order } from "./Orders.entity";
import { ProductsRepository } from "../products/products.repository";
import { UsersRepository } from "../users/users.repository";
import { OrderDetail } from "./OrderDetails.entity";
import { OrderDetailsRepository } from "./orderDetails.repository";
import { CreateOrderDto } from "./CreateOrder.dto";
import { OrderResponse } from "../interfaces/order-response.interface";

@Injectable()
export class OrdersService {
    constructor (
        private ordersRepository: OrdersRepository,
        private productsRepository: ProductsRepository,
        private usersRepository: UsersRepository,
        private orderDetailsRepository: OrderDetailsRepository,
    ){}

    async addOrder(orderData: CreateOrderDto): Promise<OrderResponse> {
        const user = await this.usersRepository.getById(orderData.userId);

        const order = new Order();
        order.user = user;
        order.date = new Date();

        const productIds = orderData.products.map(product => product.id);
        const uniqueProductIds = new Set(productIds);
        if (uniqueProductIds.size !== productIds.length) {
          throw new BadRequestException('No se pueden agregar productos duplicados en la orden.');
        }
    
        let totalPrice = 0;
        const products = [];

        for (const productData of orderData.products) {
          const product = await this.productsRepository.getById(productData.id);    
          if (product.stock <= 0) {
            throw new NotFoundException(`Producto ${product.name} sin stock`);
          }
    
          await this.productsRepository.updateProduct(product.id, { stock: product.stock - 1 });
    
          totalPrice += Number(product.price);
          products.push(product);
        }
        const saveOrder = await this.ordersRepository.addOrder(order);
    
        const orderDetail = new OrderDetail();
        orderDetail.products = products;
        orderDetail.price = totalPrice;
        orderDetail.order = saveOrder;

        const saveOrderDetail = await this.orderDetailsRepository.addOrderDetails(orderDetail);
    
        saveOrder.orderDetail = saveOrderDetail;
        await this.ordersRepository.addOrder(saveOrder);
    
        return {
          id: saveOrder.id,
          totalPrice: saveOrderDetail.price,
          products: saveOrderDetail.products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
          })),
        };
      }
    
      async getOrderById(id: string) {
        const order = await this.ordersRepository.getOrder(id);
    
        const orderProducts = order.orderDetail.products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
        }));
    
        return {
            orderId: order.id,
            date: order.date,
            price: order.orderDetail.price,
            // Descomentar para agregar la info del usuario
            // user: {
            //     id: order.user.id,
            //     name: order.user.name,
            // },
            products: orderProducts,
        };
    }
}
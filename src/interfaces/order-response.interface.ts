import { Order } from '../orders/Orders.entity'; 
import { Product } from '../products/Products.entity'; 

export interface OrderResponse extends Partial<Order> {
  totalPrice: number;
  products: Pick<Product, 'id' | 'name' | 'price'>[];
}
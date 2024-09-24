import { IsNumber } from "class-validator";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Orders.entity";
import { Product } from "../products/Products.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "orderDetails" })
export class OrderDetail {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ description: 'ID único del detalle de la orden generado automáticamente como UUID', example: 'f7d2a3c4-7b5a-48d8-b5a9-a09f7532c63d' })
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty({
        description: 'Precio total de los productos en el detalle de la orden, con hasta 2 decimales.',
        example: 299.99
    })
    price: number;

    @OneToOne(() => Order, order => order.orderDetail, { nullable: false })
    @JoinColumn({ name: "order_id" })
    @ApiProperty({
        description: 'Orden asociada a este detalle de orden. Relación uno a uno con la entidad Order.',
        type: () => Order
    })
    order: Order;

    @ManyToMany(() => Product, product => product.orderDetails)
    @JoinTable()
    @ApiProperty({
        description: 'Lista de productos incluidos en el detalle de la orden. Relación muchos a muchos con la entidad Product.',
        type: () => [Product]
    })
    products: Product[];
}

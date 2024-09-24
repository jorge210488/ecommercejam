import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/Users.entity"; 
import { OrderDetail } from "./OrderDetails.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "orders" })
export class Order {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ description: 'ID único de la orden generado automáticamente como UUID', example: 'b5a7a5c8-3f48-4745-88b9-1a4e64c8489d' })
    id: string;

    @Column()
    @ApiProperty({ description: 'Se genera automatico con la Fecha en que se generó la orden', example: '2023-09-15T08:00:00Z' })
    date: Date;

    @ManyToOne(() => User, user => user.orders, { nullable: false })
    @ApiProperty({
        description: 'Usuario que realizó la orden. Referencia a la entidad de usuario, pero omite el campo de password.',
        type: () => User
    })
    user: Omit<User, 'password'>; 

    @OneToOne(() => OrderDetail, orderDetail => orderDetail.order, { cascade: true })
    @JoinColumn()
    @ApiProperty({
        description: 'Detalle de la orden, relación uno a uno con la entidad OrderDetail.',
        type: () => OrderDetail
    })
    orderDetail: OrderDetail;
}

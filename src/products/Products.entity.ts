import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { v4 as uuid } from "uuid";
import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../categories/Categories.entity";
import { OrderDetail } from "../orders/OrderDetails.entity";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: 'ID único del producto generado automáticamente como UUID', example: uuid() })
  id: string; 

  @Column({ type: "varchar", length: 50, nullable: false })
  @ApiProperty({
    description: 'Nombre del producto. Este campo es obligatorio.',
    example: 'Iphone 15',
    maxLength: 50
  })
  name: string;

  @Column({ type: "varchar", nullable: false })
  @ApiProperty({
    description: 'Descripción detallada del producto. Este campo es obligatorio.',
    example: 'El mejor smartphone del mercado con tecnología avanzada.'
  })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({
    description: 'Precio del producto en formato decimal con hasta 2 decimales. Este campo es obligatorio.',
    example: 934.65
  })
  price: number;

  @Column({ type: "int", nullable: false })
  @ApiProperty({
    description: 'Cantidad de productos en stock. Debe ser un número entero. Este campo es obligatorio.',
    example: 50
  })
  stock: number;

  @Column({ type: "text", nullable: false, default: 'https://dogdiscoveries.com/wp-content/uploads/2016/04/samoyed-smiling.png' })
  @ApiProperty({
    description: 'URL de la imagen del producto. Debe ser una URL válida. Si no se proporciona, se asigna un valor por defecto.',
    example: 'https://example.com/product-image.png',
    default: 'https://dogdiscoveries.com/wp-content/uploads/2016/04/samoyed-smiling.png'
  })
  imgUrl: string;

  @ManyToOne(() => Category, category => category.products, { nullable: false })
  @ApiProperty({
    description: 'Categoría a la que pertenece el producto. Este campo es obligatorio y hace referencia a una categoría existente.',
    type: () => Category
  })
  category?: Category;

  @ManyToMany(() => OrderDetail, orderDetail => orderDetail.products)
  @ApiProperty({
    description: 'Detalles de las órdenes asociadas al producto. Esta propiedad es opcional.',
    type: () => [OrderDetail],
    required: false
  })
  orderDetails?: OrderDetail[];
}

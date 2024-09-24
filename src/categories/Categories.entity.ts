import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/Products.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ description: 'ID único de la categoría generado automáticamente como UUID', example: 'a7f4d5e6-3c48-45c3-9a6e-7a9f348a123d' })
    id: string;

    @Column({ length: 50, nullable: false, unique: true })
    @ApiProperty({
        description: 'Nombre único de la categoría. Este campo es obligatorio y debe ser único.',
        example: 'Laptops',
        maxLength: 50
    })
    name: string;

    @OneToMany(() => Product, product => product.category)
    @ApiProperty({
        description: 'Lista de productos asociados a la categoría. Relación uno a muchos con la entidad Product.',
        type: () => [Product]
    })
    products: Product[];
}

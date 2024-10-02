import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../orders/Orders.entity"; 
import {v4 as uuid} from "uuid";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ description: 'ID único del usuario generado automáticamente como UUID', example: uuid() })
    id: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    @ApiProperty({
        description: 'Nombre completo del usuario. Este campo es obligatorio.',
        example: 'Jorge Martínez',
        maxLength: 50 //Hay discrepancia con lo que que dice el DTO, se deja igual por requisitos de la Homework
    })
    name: string;

    @Column({ type: "varchar", unique: true, nullable: false, length: 50 })
    @ApiProperty({
        description: 'Correo electrónico usuario. Este campo es obligatorio y debe ser único en la base de datos.',
        example: 'jorge@email.com',
        maxLength: 50,
        uniqueItems: true
    })
    @IsEmail()
    email: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    @ApiProperty({
        description: 'Contraseña del usuario. Este campo es obligatorio. Se recomienda almacenar de manera segura (ej: hash).',
        example: 'hashedpassword123',
        maxLength: 100 //En la homework se pedía 20, pero al password hasheado ocupa más espacios por eso se hace el ajuste
    })
    password: string;    

    @Column({ type: "int" })
    @ApiProperty({
        description: 'Número de teléfono del usuario, almacenado como un entero. Debe ser un número válido entero.',
        example: 11345543
    })
    phone: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    @ApiProperty({
        description: 'País de residencia del usuario. Este campo es opcional.',
        example: 'Argentina',
        maxLength: 50 //Hay discrepancia con lo que que dice el DTO, se deja igual por requisitos de la Homework
    })
    country?: string;

    @Column({ type: "varchar", length: 50, nullable: true  })
    @ApiProperty({
        description: 'Ciudad de residencia del usuario. Este campo es opcional.',
        example: 'Buenos Aires',
        maxLength: 50 //Hay discrepancia con lo que que dice el DTO, se deja igual por requisitos de la Homework
    })
    city?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    @ApiProperty({
        description: 'Dirección del usuario. Puede incluir información como calle, número, etc. Este campo es opcional.',
        example: 'Av. Corrientes 1234',
        maxLength: 100
    })
    address?: string;    

    @Column({ default: false })
    @ApiProperty({
        description: 'Indica si el usuario tiene privilegios de administrador. El valor predeterminado es "false".',
        example: false
    })
    isAdmin?: boolean;

    @OneToMany(() => Order, order => order.user)
    @ApiProperty({
        description: 'Lista de órdenes asociadas al usuario. Esta propiedad puede ser opcional hasta que el usario no genere una orden.',
        type: () => [Order],
        required: false
    })
    orders?: Order[]; 
}

















// /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
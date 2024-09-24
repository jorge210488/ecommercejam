import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../products/Products.entity";

@Injectable()
export class CloudinaryRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async updateProductImage(id: string, imgUrl: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }
        product.imgUrl = imgUrl;

        return this.productRepository.save(product);
    }
}

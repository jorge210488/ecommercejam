import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../products/Products.entity";
import { validateProductExists } from "../helpers/validation.helper";

@Injectable()
export class CloudinaryRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async updateProductImage(id: string, imgUrl: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        validateProductExists(product, id);
        product.imgUrl = imgUrl;
        return this.productRepository.save(product);
    }
}

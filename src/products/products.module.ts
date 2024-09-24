import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ProductsRepository } from "./products.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./Products.entity";
import { CategoriesModule } from "../categories/categories.module";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), CategoriesModule],
    providers: [ProductsService, ProductsRepository],
    controllers: [ProductsController],
    exports: [ProductsRepository],
})
export class ProductsModule {}

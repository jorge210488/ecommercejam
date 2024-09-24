import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "../categories/Categories.entity";
import { CategoriesService } from "./categories.service";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesController } from "./categories.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoriesService, CategoriesRepository],
    controllers: [CategoriesController],
    exports: [CategoriesRepository, CategoriesService],
})
export class CategoriesModule {}
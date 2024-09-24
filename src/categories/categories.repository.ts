import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../categories/Categories.entity";
import { Repository } from "typeorm";


@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    ) {}

    async addCategories(category: Category): Promise<Category> {
        try {
          const existingCategory = await this.categoriesRepository.findOne({
            where: { name: category.name },
          });
          if (existingCategory) {
            throw new BadRequestException(`La categoría con el nombre '${category.name}' ya existe.`);
          }
          const newCategory = await this.categoriesRepository.save(category);
          return newCategory;
        } catch (error) {
          throw error;
        }
    }
      

    async getCategories(): Promise<Category[]> {
        try {
            const categories = await this.categoriesRepository.find();
            return categories;
        } catch (error) {
            throw error;
        }
    }
}

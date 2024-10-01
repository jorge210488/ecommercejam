import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../categories/Categories.entity";
import { Repository } from "typeorm";
import { validateCategoryExists } from "../helpers/validation.helper";


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

    async getCategoryById(id: string): Promise<Category> {
      try {
        const category = await this.categoriesRepository.findOne({ where: { id } });
        validateCategoryExists(category, id);
        return category;
      } catch (error) {
        throw error;
      }
    }

    async getCategoryByName(name: string): Promise<Category> {
      try {
        const category = await this.categoriesRepository.findOne({ where: { name } });
        validateCategoryExists(category, name);
        return category;
      } catch (error) {
        throw error;
      }
    }
}

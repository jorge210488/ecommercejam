import { BadRequestException, Injectable } from "@nestjs/common";
import { Category } from "../categories/Categories.entity";
import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./CreateCategory.dto";


@Injectable()
export class CategoriesService { 
    constructor( 
        private categoriesRepository: CategoriesRepository,
    ) {}

    async addCategory(categoryData: CreateCategoryDto): Promise<Category> {

      const category = new Category();
      category.name = categoryData.name;

        return this.categoriesRepository.addCategories(category);
    }

    async preloadCategories(): Promise<{ category: string, status: string }[]> {
      const productsData: { category:string}[] = require('../assets/products.json');
      const categoriesData = productsData.map(item => item.category);
      const uniqueCategories = Array.from(new Set(categoriesData));

      const result: { category: string, status: string }[] = [];
    
      for (const categoryName of uniqueCategories) {
        const category = new Category();
        category.name = categoryName;
        try {
          await this.categoriesRepository.addCategories(category);
          result.push({ category: category.name, status: 'Cargada exitosamente' });
        } catch (error) {
          if (error instanceof BadRequestException) {
            result.push({ category: categoryName, status: error.message });
          } else {
            console.error(`Error al intentar cargar la categoría '${categoryName}':`, error);
            throw error;
          }
        }
      }
      return result;
    }
      
    async getCategories(): Promise<Category[]> {
        return this.categoriesRepository.getCategories();
    }
}
 
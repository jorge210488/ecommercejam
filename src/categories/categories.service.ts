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

    async preloadCategories(): Promise<void> {
      const productsData: { category:string}[] = require('../assets/products.json');
      const categoriesData = productsData.map(item => item.category);
      const uniqueCategories = Array.from(new Set(categoriesData));
    
      for (const categoryName of uniqueCategories) {
        const category = new Category();
        category.name = categoryName;
        try {
          await this.categoriesRepository.addCategories(category);
          console.log(`Categoria '${category.name}' cargada exitosamente`);
        } catch (error) {
          if (error instanceof BadRequestException) {
            console.log(error.message);
          } else {
            console.error(`Error al intentar cargar la categoría '${categoryName}':`, error);
            throw error;
          }
        }
      }
    }
      
    async getCategories(): Promise<Category[]> {
        return this.categoriesRepository.getCategories();
    }
}
 
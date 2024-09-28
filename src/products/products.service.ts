import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { CategoriesRepository } from "../categories/categories.repository";
import { CategoriesService } from "../categories/categories.service";
import { Product } from "./Products.entity";
import { CreateProductDto, UpdateProductDto } from "./CreateProduct.dto";
import { validateCategoryExists, validateRequestBodyNotEmpty } from "../helpers/validation.helper";

@Injectable()
export class ProductsService {
    constructor(
        private productsRepository: ProductsRepository,
        private categoriesRepository: CategoriesRepository,
        private categoriesService: CategoriesService,
    ) {}

    async getProducts(page:number, limit:number): Promise <{
        page: number;
        limit: number;
        total: number,
        products: Product[];
    }>{
        return this.productsRepository.getProducts(page, limit);
    }
    
    async getProductById(id: string) {
        return this.productsRepository.getById(id);
    }
    
    
    async createProduct(productData: CreateProductDto): Promise<Product> {
        const category = await this.categoriesRepository.getCategories()
        .then(categories => categories.find(cat => cat.id === productData.categoryId));
        
        validateCategoryExists(category, productData.categoryId);

        const product = new Product();
        product.name = productData.name;
        product.description = productData.description;
        product.price = productData.price;
        product.stock = productData.stock;
        product.imgUrl = productData.imgUrl;
        product.category = category;

        return this.productsRepository.createProduct(product);
    }
    
    async onModuleInit() {
        console.log("Inicializando precarga de categorías...");
        await this.categoriesService.preloadCategories();
        console.log("Inicializando precarga de productos...");
        await this.preloadProducts();
      }

    async preloadProducts(): Promise<{ product: string, status: string }[]> {
      const productsData: { name: string; description: string; price: number; stock: number; category: string; }[] = require('../assets/products.json');
        const categories = await this.categoriesRepository.getCategories();

        const result: { product: string, status: string }[] = [];

        for (const productData of productsData) {
          const product = new Product();
          product.name = productData.name;
          product.description = productData.description;
          product.price = productData.price;
          product.stock = productData.stock;
      
          try {
            const category = categories.find(cat => cat.name === productData.category);      
            validateCategoryExists(category, productData.category);
            product.category = category;
            await this.productsRepository.createProduct(product);
            result.push({ product: product.name, status: 'Cargado exitosamente' });
          } catch (error) {
            if (error instanceof BadRequestException) {
              result.push({ product: productData.name, status: error.message });
            } else {
              console.error(`Error al intentar cargar el producto '${productData.name}':`, error);
              throw error; 
            }
          }
        }
        return result;
      }
      
    async updateProduct(id: string, updateData: UpdateProductDto): Promise<Product> {
      validateRequestBodyNotEmpty(updateData);
        return this.productsRepository.updateProduct(id, updateData);
    }

    async deleteProduct(id:string): Promise<string> {
        return this.productsRepository.deleteProduct(id);
    }
}

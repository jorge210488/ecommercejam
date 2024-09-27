import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Product } from './Products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateProductExists } from '../helpers/validation.helper';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
  ) {}
  
  // private products: Product[] = getInitialProducts(); 

  async getProducts(page: number = 1, limit: number = 5): Promise<{
    page: number,
    limit: number,
    total: number,
    products: Product[];
  }> {
    try {
      const [products, total] = await this.productsRepository.findAndCount({
        skip: (page - 1) * limit, 
        take: limit,
        relations: ['category'],              
      });
  
      return {
        page,
        limit,
        total,
        products,
      };
    } catch (error) {
      throw new InternalServerErrorException("Error al obtener los productos");
    }
  }

async getById(id: string): Promise<Product | undefined> {
  try {
    const product = await this.productsRepository.findOne({ where: { id } });
    validateProductExists(product, id);
    return product;
  } catch (error) {
    throw error;
  }
}

async createProduct(product: Product): Promise<Product> {
  try {
    const existingProduct = await this.productsRepository.findOne({
      where: { name: product.name },
    });

    if (existingProduct) {
      throw new BadRequestException(`El producto con el nombre '${product.name}' ya existe.`);
    }
    const newProduct = await this.productsRepository.save(product);
    return newProduct;
  } catch (error) {
    throw error;
  }
}

  async updateProduct(id: string, updateData: Partial<Product>): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });
      validateProductExists(product, id);
      const updatedProduct = { ...product, ...updateData };
      await this.productsRepository.save(updatedProduct);
  
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
  
  async deleteProduct(id: string): Promise<string> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });
      validateProductExists(product, id);
      await this.productsRepository.remove(product);
      return `Producto con el id ${id} ha sido eliminado exitosamente`; 
    } catch (error) {
      throw error;
    }
  }  
}

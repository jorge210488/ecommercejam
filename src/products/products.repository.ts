import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Product } from './Products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
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
      if (!product) {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }
      const updatedProduct = { ...product, ...updateData };
      await this.productsRepository.save(updatedProduct);
  
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }
  

  async deleteProduct(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Producto con el id ${id} no encontrado`);
      }
      await this.productsRepository.remove(product);
      return product;
    } catch (error) {
      throw error;
    }
  }
  
}

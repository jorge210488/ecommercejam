import { NotFoundException, BadRequestException } from '@nestjs/common';

// Validación para el usuario
export function validateUserExists(user: any, id: string): void {
  if (!user) {
    throw new NotFoundException(`Usuario con id ${id} no encontrado`);
  }
}

// Validación para el producto
export function validateProductExists(product: any, id: string): void {
  if (!product) {
    throw new NotFoundException(`Producto con id ${id} no encontrado`);
  }
}

// Validación para el nombre del producto
export function validateProductNameExists(existingProduct: any, name: string): void {
  if (existingProduct) {
    throw new BadRequestException(`El producto con el nombre '${name}' ya existe.`);
  }
}

// Validación para la categoría
export function validateCategoryExists(category: any, identifier: string): void {
    if (!category) {
      throw new NotFoundException(`Categoría con '${identifier}' no encontrada`);
    }
  }
 
// Validación para el email
export function validateEmailExists(userEmail: any): void {
  if (userEmail) {
    throw new BadRequestException('Email ya existe');
  }
}

// Validación para verificar que el cuerpo de la solicitud no esté vacío
export function validateRequestBodyNotEmpty(updateData: any): void {
    if (!Object.keys(updateData).length) {
      throw new BadRequestException('El cuerpo de la solicitud no puede estar vacío');
    }
}

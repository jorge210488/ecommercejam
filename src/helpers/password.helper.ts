import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (!hashedPassword) {
      throw new BadRequestException("Password no pudo ser hashed");
    }

    return hashedPassword;
  } catch (error) {
    throw new BadRequestException("Error al hashear la contraseña");
  }
}

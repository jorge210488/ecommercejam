import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './Users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
) {}

  // private users: User[] = getInitialUsers(); 

  async getUsers(page: number = 1, limit: number = 5): Promise<{
    page: number;
    limit: number;
    users: Omit<User, 'password' | 'isAdmin'>[];
  }> {
    const skip = (page - 1) * limit; 
  
    try {
      const [users, total] = await this.usersRepository.findAndCount({
        skip, 
        take: limit, 
      });
  
      // Excluir el campo password de cada usuario
      const usersWithoutPassword = users.map(({ password, isAdmin, ...rest }) => rest);
  
      return {
        page,
        limit,
        users: usersWithoutPassword,
      };
    } catch (error) {
      throw error;
    }
  }
  
  async getById(id: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: {orders: {
          orderDetail: true
        }},
      });
  
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
  
      const { password, isAdmin, orders, ...rest } = user; 
  
      const userOrders = orders.map(order => ({
        id: order.id,
        date: order.date,
      }));
  
      return {
        ...rest,
        orders,
      };
    } catch (error) {
      throw error;
    }
  }
  
async createUser(user: User): Promise<Omit<User, "password">> {
  try {
    const checkEmail = await this.usersRepository.findOne({ where: { email: user.email } });
    if (checkEmail) {
      throw new BadRequestException(`El email ${user.email} ya está en uso`);
    }
    const newUser = await this.usersRepository.save(user);
    const {isAdmin, password, ...result } = newUser;
    return result;
  } catch (error) {
    throw error;
  }
}

async updateUser(id: string, updateData: Partial<User>): Promise<Omit<User, 'password' | 'isAdmin'>> {
  try {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const updatedUser = Object.assign(user, updateData);
    const savedUser = await this.usersRepository.save(updatedUser);

    const { password, isAdmin, ...result } = savedUser;
    
    return result;
  } catch (error) {
    throw error;
  }
}

async deleteUser(id: string): Promise<User> {
  try {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.usersRepository.remove(user);
    return user;
  } catch (error) {
    throw error;
  }
}

async findEmail(email: string): Promise<User | undefined> {
  try {
    return await this.usersRepository.findOne({ where: { email } });
  } catch (error) {
    throw error; 
  }
}
}

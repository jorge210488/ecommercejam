import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./Users.entity";
import { UpdateUserDto } from "./CreateUser.dto";
import { validateRequestBodyNotEmpty } from "../helpers/validation.helper";

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository){}

    async getUsers(page: number, limit: number): Promise<{
        page:number;
        limit: number;
        users: Omit<User, 'password' | 'isAdmin'>[];
        }> {
        return this.usersRepository.getUsers(page, limit);
      }

      async getUserById(id: string) {
          return await this.usersRepository.getById(id);
      }

      // async createUser(userData: CreateUserDto): Promise<User> {
      //   const user = new User();
      //   user.name = userData.name;
      //   user.email = userData.email;
      //   user.password = userData.password;
      //   user.address = userData.address;
      //   user.phone = userData.phone;
      //   user.country = userData.country;
      //   user.city = userData.city;
      
      //   return await this.usersRepository.createUser(user); 
      // }
    
    async updateUser(id: string, updateData: UpdateUserDto): Promise<Omit<User, 'password' | 'isAdmin'>> {
      validateRequestBodyNotEmpty(updateData);
          return await this.usersRepository.updateUser(id, updateData);
      }      

    async deleteUser(id: string): Promise<User> {
          return await this.usersRepository.deleteUser(id); 
      }      
}
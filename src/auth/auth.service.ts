import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../users/users.repository";
import { LoginUserDto } from "./LoginUser.dto";
import { CreateUserDto } from "../users/CreateUser.dto";
import { User } from "../users/Users.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Role } from "./role.enum";
import { SigninResponse } from '../interfaces/signin-response.interface';
import { validateEmailExists } from "../helpers/validation.helper";
import { hashPassword } from "../helpers/password.helper";

@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository,
      private readonly jwtService: JwtService,
    ) {}

    async getAuth(){
        return "Get Auth";
    }

    async signup(userData: CreateUserDto): Promise<Omit<User, "password">> {
      const userEmail = await this.usersRepository.findEmail(userData.email);
      
      validateEmailExists(userEmail);
      const hashedPassword = await hashPassword(userData.password);

      const user = new User();
      user.name = userData.name;
      user.email = userData.email;
      user.password = userData.password;
      user.address = userData.address;
      user.phone = userData.phone;
      user.country = userData.country;
      user.city = userData.city;

      return await this.usersRepository.createUser({...user, password:hashedPassword}); 
    }

    async signin(loginUserDto: LoginUserDto): Promise<SigninResponse> {
      const { email, password } = loginUserDto;
      const user = await this.usersRepository.findEmail(email);
  
      if (!user) {
          throw new BadRequestException('Credenciales incorrectas');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
          throw new BadRequestException('Credenciales incorrectas');
      }

      const userPayload = {
        sub:user.id,
        id:user.id,
        email:user.email,
        roles: [user.isAdmin ? Role.Admin : Role.User],
      }
      const token = this.jwtService.sign(userPayload);
  
      return {
          message: 'Login exitoso',
          user: {
              id: user.id,
              email: user.email,
              name: user.name, 
          },
          token,
      };
  }

  async updateUserAdmin(id: string, isAdmin: boolean): Promise<Omit<User, 'password' | 'isAdmin'>> {
    const user = await this.usersRepository.getById(id);
    const updatedUser = await this.usersRepository.updateUser(id, { isAdmin });
    return updatedUser;
  }
} 
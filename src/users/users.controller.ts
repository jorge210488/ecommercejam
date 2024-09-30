import { Controller, Get, Post, Put, Delete, HttpCode, Param, Body, UseGuards, Query, Req, Request, BadRequestException, NotFoundException, ParseUUIDPipe, ParseIntPipe, DefaultValuePipe, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./Users.entity";
import { AuthGuard } from "../auth/AuthGuard";
import { UpdateUserDto } from "./CreateUser.dto";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../auth/role.enum";
import { RolesGuard } from "../auth/RolesGuard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserPermissionInterceptor } from "../interceptors/userPermission.interceptor";

@ApiTags("Users")
@Controller("users")
    export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}


    @ApiBearerAuth()
    @HttpCode(200)
    @Get()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 5 })
       async getUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, // Recibe el parámetro de query 'page'
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number // Recibe el parámetro de query 'limit'
      ) {

        return await this.usersService.getUsers(page, limit);
      }
    
      @ApiBearerAuth()
      @UseGuards(AuthGuard)
      @UseInterceptors(UserPermissionInterceptor)
      @HttpCode(200)
      @Get(':id')
      async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
        return await this.usersService.getUserById(id);
      }

        // @HttpCode(201)
        // @Post()
        // async createUser(@Body() user: CreateUserDto) {
        //     const newUser = await this.usersService.createUser(user);
        //     return newUser;
        // }
        
        @ApiBearerAuth()
        @UseGuards(AuthGuard)
        @UseInterceptors(UserPermissionInterceptor)        
        @HttpCode(200)
        @Put(':id')
        async updateUser(
          @Param('id', new ParseUUIDPipe()) id: string,
          @Body() updateData: UpdateUserDto) {
          return await this.usersService.updateUser(id, updateData);
        }
    
        @ApiBearerAuth()
        @UseGuards(AuthGuard)
        @UseInterceptors(UserPermissionInterceptor)
        @HttpCode(200)
        @Delete(':id')
        async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
          return await this.usersService.deleteUser(id);
        }        
}
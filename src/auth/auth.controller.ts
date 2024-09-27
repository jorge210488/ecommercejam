import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./LoginUser.dto";
import { CreateUserDto } from "../users/CreateUser.dto";
import { AuthGuard } from "./AuthGuard";
import { RolesGuard } from "./RolesGuard";
import { Role } from "./role.enum";
import { Roles } from "../decorators/roles.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EmailLowercaseInterceptor } from "../interceptors/emailLowercase.interceptor";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @HttpCode(200)
    @Get()
    @UseGuards(AuthGuard)
    async getAuth() {
        return await this.authService.getAuth(); 
    } 

    @HttpCode(201)
    @Post('signup')
    @UseInterceptors(EmailLowercaseInterceptor)
    async signup(@Body() user:CreateUserDto){
        const newUser = await this.authService.signup(user);
        return newUser;
    }

    @HttpCode(201)
    @Post('signin')
    async signin(@Body() loginUser: LoginUserDto) {
        return await this.authService.signin(loginUser);
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Put(':id/admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async updateUserAdmin(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { isAdmin }: { isAdmin: boolean }) {
    return await this.authService.updateUserAdmin(id, isAdmin);
}  
}
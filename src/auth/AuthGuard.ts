import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { Role } from "./role.enum";

// function validateRequest(request: Request) {
//     const authHeader = request.headers["authorization"];
    
//     if (!authHeader) {
//         throw new BadRequestException("Authorization header está faltando");
//     }

//     const headerSeparado = authHeader.split("Basic: ");

//     if (headerSeparado.length !== 2) {
//         throw new BadRequestException("Formato de Authorization incorrecto. Se esperaba 'Basic: <email>:<password>'");
//     }

//     const [email, password] = headerSeparado[1].split(":");

//     if (email.trim() === "" || !password) {
//         throw new BadRequestException("El email y el password son obligatorios");
//     }

//     return true;
// }

@Injectable() 
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService
    ){}
   
   async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers["authorization"]?.split(" ")[1] ?? "";
        if(!token){
            throw new UnauthorizedException("Bearer token no encontrado");
        }
        try{
            const secret = process.env.JWT_SECRET;
            const payload = this.jwtService.verify(token, { secret});
            payload.iat = new Date(payload.iat * 1000);
            payload.exp = new Date(payload.exp * 1000);
            request.user = payload;
            console.log({payload});
            return true;
        } catch (error){
            throw new UnauthorizedException("Token Invalido");
        }
    }
}

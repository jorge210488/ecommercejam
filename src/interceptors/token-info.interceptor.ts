import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class TokenInfoInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const user = request.user; // Accedemos a request.user, que es modificado por el AuthGuard
  
      return next.handle().pipe(
        map((data) => {
          if (user) {
            // Adjuntamos la información del token solo si request.user existe
            const { iat, exp } = user;
            return {
              ...data, // mantenemos la respuesta original
              tokenInfo: {
                issuedAt: iat,
                expiresAt: exp,
              },
            };
          }
          return data; // Si no hay user, retornamos la respuesta original
        }),
      );
    }
  }
  
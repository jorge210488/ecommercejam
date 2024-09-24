import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
@Injectable()
export class EmailLowercaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Verifica si existe un email en el body y si es una cadena
    if (request.body && typeof request.body.email === 'string') {
      // Transforma el
      request.body.email = request.body.email.toLowerCase();
    }

    // Continúa con el flujo de la solicitud
    return next.handle();
  }
}
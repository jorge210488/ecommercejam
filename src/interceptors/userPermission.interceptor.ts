import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    ForbiddenException
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class UserPermissionInterceptor implements NestInterceptor {
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const userIdFromToken = request.user.id || request.user.sub;
      const userIdFromParams = request.params.id;
      const userRoles = request.user.roles;

      if (userRoles && userRoles.includes('admin')) { 
        return next.handle();
      }
      if (userIdFromToken !== userIdFromParams) {
        throw new ForbiddenException('No tienes permiso para realizar esta acción en otro usuario.');
      }
      return next.handle();
    }
  }
  
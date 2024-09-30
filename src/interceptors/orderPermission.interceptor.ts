import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    ForbiddenException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { OrdersRepository } from '../orders/orders.repository'; // Asegúrate de importar tu OrdersRepository
  
  @Injectable()
  export class OrderPermissionInterceptor implements NestInterceptor {
    constructor(private readonly ordersRepository: OrdersRepository) {}  // Inyectar el repositorio de órdenes
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const userIdFromToken = request.user.id || request.user.sub;
      const userIdFromBody = request.body.userId || null;
      const userRoles = request.user.roles;
  
      if (userRoles && userRoles.includes('admin')) { 
        return next.handle();
      }
  
      if (userIdFromBody && userIdFromToken !== userIdFromBody) {
        throw new ForbiddenException('No tienes permiso para realizar esta acción en otro usuario.');
      }
  
      // Si no hay userId en el body, verificarlo desde la orden
      if (!userIdFromBody && request.params.id) {
        const order = await this.ordersRepository.getOrder(request.params.id);
        if (order.user.id !== userIdFromToken) {
          throw new ForbiddenException('No tienes permiso para realizar esta acción en esta orden.');
        }
      }
      return next.handle();
    }
  }
  
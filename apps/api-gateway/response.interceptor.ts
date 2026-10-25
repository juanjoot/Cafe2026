import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // ✅ Si ya es paginada (tiene .data), no volver a envolver
        if (data && typeof data === 'object' && 'data' in data) {
          return {
            status: 'success',
            ...data, // deja intacto el resultado paginado
          };
        }

        // ✅ Si es un objeto o arreglo normal, envolver en .data
        return {
          status: 'success',
          data,
        };
      }),
    );
  }
}

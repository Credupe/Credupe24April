import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Wraps every successful controller response in the shape the frontend expects:
 *   { success: true, data: <payload>, error: null }
 * If a handler already returns that shape (e.g. when it also wants to set
 * pagination metadata), we pass it through untouched.
 */
@Injectable()
export class ResponseInterceptor<T = any> implements NestInterceptor<T, any> {
  intercept(_ctx: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'success' in (payload as any) && 'data' in (payload as any)) {
          return payload;
        }
        return { success: true, data: payload ?? null, error: null };
      }),
    );
  }
}

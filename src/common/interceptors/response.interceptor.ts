import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const handler = context.getHandler();
    const request = ctx.getRequest();

    if(handler.name === 'tripayCallback' || handler.name === 'cryptomusCallback'){
      return next.handle();
    }
    return next.handle().pipe(
      map(data => {
        /*
          with or without meta
          in controller -> 
            with meta => return data
            without meta => return [data, meta]
        */
        if (Array.isArray(data)) {
          if (Array.isArray(data[0]) && data.length > 1 && typeof data[1] === 'object' && data[1] !== null) {
            const result = {
              statusCode: response.statusCode,
              data: data[0]
            };
          
            if (data[1] !== undefined) {
              result['meta'] = data[1];
            } 
            result['message'] = 'Request successful';
            return result;
          }
        }

        return {
          statusCode: response.statusCode,
          data: data,
          message: 'Request successful',
        }
      }),
      catchError(error => {
        let statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        let message = error.message || 'Internal server error';
        
        if (error instanceof HttpException) {
          const response = error.getResponse();
          if (typeof response === 'object' && response !== null) {
            const responseObject = response as any;
            statusCode = responseObject.statusCode || statusCode;
            message = responseObject.message || message;
          }
        }

        return throwError(() => ({
          statusCode: statusCode,
          message: message,
          error: error.response || null,
        }));
      })
    );
  }
}

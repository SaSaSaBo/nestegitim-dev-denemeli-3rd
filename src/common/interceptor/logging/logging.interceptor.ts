// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle();
//   }
// }


import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    console.log(`Incoming request: ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap(() => console.log(`Response for ${method} ${url} took ${Date.now() - now}ms`)),
      );
  }
}

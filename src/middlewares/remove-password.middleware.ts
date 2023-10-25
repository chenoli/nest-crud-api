import {
  CallHandler,
  Injectable,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

import { tap, Observable } from 'rxjs';

import { sanitize } from '@src/utils/sanitize';

@Injectable()
export class RemovePasswordMiddleware implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(tap((data) => sanitize(data, 'password')));
  }
}

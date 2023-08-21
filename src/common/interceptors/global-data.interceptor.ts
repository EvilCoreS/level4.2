import { map, Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
@Injectable()
export class TransformResponseData implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseBody) => {
        const meta = responseBody.meta;
        delete responseBody.meta;
        return {
          meta: meta,
          data: responseBody,
        };
      }),
    );
  }
}

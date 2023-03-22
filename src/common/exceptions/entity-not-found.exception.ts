import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

@Catch(QueryFailedError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse<Response>();
    const request: Request = context.getRequest<Request>();
    const { url } = request;
    const name = 'Entity not found';

    const errorResponse = {
      statusCode: HttpStatus.NOT_FOUND,
      message: name,
      path: url,
      timestamp: new Date().toISOString(),
    };
    response.status(HttpStatus.NOT_FOUND).json(errorResponse);
  }
}

import { ApiQuery } from '@nestjs/swagger';

export const OptionalQueryDecorator =
  (): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiQuery({ name: 'offset', required: false })(
      target,
      propertyKey,
      descriptor,
    );
    ApiQuery({ name: 'count', required: false })(
      target,
      propertyKey,
      descriptor,
    );
  };

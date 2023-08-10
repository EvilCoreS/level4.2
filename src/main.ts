import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dataSource from '../database/db.datasource';
import { ConfigService } from '@nestjs/config';
import { TransformResponseData } from './common/interceptors/global-data.interceptor';
import { GlobalFilterException } from './common/exceptions/global-filter.exception';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get('port');
  const env = config.get('env');
  if (!port) throw new Error('Missing PORT');

  app.setGlobalPrefix('api');
  // app.useGlobalFilters(new GlobalFilterException());
  app.useGlobalInterceptors(new TransformResponseData());
  app.use(cookieParser());

  if (env === 'dev' || env === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Level 4.2')
      .setDescription('My level 4.2 nestjs app')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
  }

  dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });

  app.listen(port, () => {
    console.log(`http://localhost:${port}/swagger`);
  });
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Level 4.2')
    .setDescription('Level 4.2 from shpp course')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme('v3');
  const options = {
    customCss: theme.getBuffer('dark'),
  };

  SwaggerModule.setup('swagger', app, document, options);

  await app.listen(3000);
  console.log(`http://localhost:3000/swagger`);
}
bootstrap();

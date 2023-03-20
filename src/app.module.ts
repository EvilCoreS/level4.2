import { Module } from '@nestjs/common';
import { EntityModule } from './entity/entity.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './database/db.config';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PATH_TO_PUBLIC } from './images/images.service';

@Module({
  imports: [
    EntityModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
    ImagesModule,
    ServeStaticModule.forRoot({
      rootPath: __dirname + `/../${PATH_TO_PUBLIC}`,
    }),
  ],
})
export class AppModule {}

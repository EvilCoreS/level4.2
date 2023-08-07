import { Module } from '@nestjs/common';
import { EntityModule } from './entity/entity.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PATH_TO_PUBLIC } from './images/images.service';
import typeormConfig from '../database/db.config';
import { getEnvData } from './common/config/config';

@Module({
  imports: [
    EntityModule,
    ConfigModule.forRoot({ isGlobal: true, load: [getEnvData] }),
    TypeOrmModule.forRoot(typeormConfig),
    ImagesModule,
    ServeStaticModule.forRoot({
      rootPath: PATH_TO_PUBLIC,
    }),
  ],
})
export class AppModule {}

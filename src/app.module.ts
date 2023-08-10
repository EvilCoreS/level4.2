import { Module } from '@nestjs/common';
import { EntityModule } from './entity/entity.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PATH_TO_PUBLIC } from './images/images.service';
import typeormConfig from '../database/db.config';
import { getEnvData } from './common/config/config';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    EntityModule,
    ConfigModule.forRoot({ isGlobal: true, load: [getEnvData] }),
    TypeOrmModule.forRoot(typeormConfig),
    ImagesModule,
    ServeStaticModule.forRoot({
      rootPath: PATH_TO_PUBLIC,
    }),
    AuthModule,
    UserModule,
  ],
  providers: [UserService],
})
export class AppModule {}

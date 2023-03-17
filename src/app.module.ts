import { Module } from '@nestjs/common';
import { EntityModule } from './entity/entity.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './database/db.config';

@Module({
  imports: [
    EntityModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
  ],
})
export class AppModule {}

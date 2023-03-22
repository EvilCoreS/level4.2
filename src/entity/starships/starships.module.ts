import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { ImagesService } from '../../images/images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Starship } from './entities/starship.entity';
import { StarshipRepository } from './starships.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Starship])],
  controllers: [StarshipsController],
  providers: [StarshipsService, ImagesService, StarshipRepository],
})
export class StarshipsModule {}

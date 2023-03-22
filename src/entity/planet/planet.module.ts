import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { ImagesService } from '../../images/images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { PlanetRepository } from './planet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Planet])],
  controllers: [PlanetController],
  providers: [PlanetService, ImagesService, PlanetRepository],
})
export class PlanetModule {}

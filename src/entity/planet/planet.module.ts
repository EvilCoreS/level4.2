import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { ImagesService } from '../../images/images.service';

@Module({
  controllers: [PlanetController],
  providers: [PlanetService, ImagesService],
})
export class PlanetModule {}

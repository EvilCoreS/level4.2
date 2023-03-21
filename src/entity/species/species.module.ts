import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { ImagesService } from '../../images/images.service';

@Module({
  controllers: [SpeciesController],
  providers: [SpeciesService, ImagesService],
})
export class SpeciesModule {}

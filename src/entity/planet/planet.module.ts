import { Module } from '@nestjs/common';
import { PlanetService } from './planet.service';
import { PlanetController } from './planet.controller';
import { ImagesService } from '../../images/images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planet } from './entities/planet.entity';
import { PlanetRepository } from './planet.repository';
import { FileService } from '../../file-services/file/file.service';
import { BucketService } from '../../file-services/bucket/bucket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Planet])],
  controllers: [PlanetController],
  providers: [
    PlanetService,
    ImagesService,
    PlanetRepository,
    FileService,
    BucketService,
  ],
})
export class PlanetModule {}

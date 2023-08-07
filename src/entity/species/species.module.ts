import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { ImagesService } from '../../images/images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { SpeciesRepository } from './species.repository';
import { FileService } from '../../file-services/file/file.service';
import { BucketService } from '../../file-services/bucket/bucket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Species])],
  controllers: [SpeciesController],
  providers: [
    SpeciesService,
    ImagesService,
    SpeciesRepository,
    FileService,
    BucketService,
  ],
})
export class SpeciesModule {}

import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { ImagesService } from '../../images/images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { FilmRepository } from './film.repository';
import { FileService } from '../../file-services/file/file.service';
import { BucketService } from '../../file-services/bucket/bucket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Film])],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    ImagesService,
    FilmRepository,
    FileService,
    BucketService,
  ],
})
export class FilmsModule {}

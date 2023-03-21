import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { ImagesService } from '../../images/images.service';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, ImagesService],
})
export class FilmsModule {}

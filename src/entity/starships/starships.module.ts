import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { ImagesService } from '../../images/images.service';

@Module({
  controllers: [StarshipsController],
  providers: [StarshipsService, ImagesService],
})
export class StarshipsModule {}

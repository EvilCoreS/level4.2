import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { FileService } from '../file-services/file/file.service';
import { BucketService } from '../file-services/bucket/bucket.service';

@Module({
  controllers: [ImagesController],
  imports: [],
  providers: [ImagesService, FileService, BucketService],
})
export class ImagesModule {}

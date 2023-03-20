import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Delete(':id')
  deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.deleteImageById(id);
  }
}

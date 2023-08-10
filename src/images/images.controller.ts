import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Image')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Delete(':id')
  @Roles(Role.Admin)
  deleteImage(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.deleteImageById(id);
  }
}

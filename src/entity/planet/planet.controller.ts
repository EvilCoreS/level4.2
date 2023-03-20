import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PlanetService } from './planet.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { PlanetRelationsDto } from './dto/planet-relations.dto';

@Controller('planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  create(
    @Body(ValidationPipe) createPlanetDto: CreatePlanetDto,
    @UploadedFiles(uploadFilesSizeConfig(500000)) files: Express.Multer.File[],
  ) {
    return this.planetService.create(createPlanetDto, files);
  }

  @Get()
  findAll() {
    return this.planetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planetService.findOne(+id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePlanetDto: UpdatePlanetDto,
    @UploadedFiles(uploadFilesSizeConfig(500000)) files: Express.Multer.File[],
  ) {
    return this.planetService.update(id, updatePlanetDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planetService.remove(id);
  }

  @Put('/relation/:id')
  async addRelations(
    @Body(ValidationPipe) dto: PlanetRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.planetService.addRelations(dto, id);
  }
}

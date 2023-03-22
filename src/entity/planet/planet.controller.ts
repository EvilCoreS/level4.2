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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { PlanetService } from './planet.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { PlanetRelationsDto } from './dto/planet-relations.dto';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';

@Controller('planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  create(
    @Body(ValidationPipe) createPlanetDto: CreatePlanetDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.planetService.create(createPlanetDto, files);
  }

  @Get()
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.planetService.findAll(offset, count);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planetService.findOne(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePlanetDto: UpdatePlanetDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
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

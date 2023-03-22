import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePlanetDto } from '../planet/dto/create-planet.dto';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { StarshipsRelationsDto } from './dto/starships-relations.dto';

@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  create(
    @Body(ValidationPipe) dto: CreateStarshipDto,
    @UploadedFiles(uploadFilesSizeConfig(500000)) files: Express.Multer.File[],
  ) {
    return this.starshipsService.create(dto, files);
  }

  @Get()
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.starshipsService.findAll(offset, count);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.starshipsService.findOne(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateStarshipDto,
    @UploadedFiles(uploadFilesSizeConfig(500000)) files: Express.Multer.File[],
  ) {
    return this.starshipsService.update(id, dto, files);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.starshipsService.remove(id);
  }

  @Put('/relation/:id')
  async addRelations(
    @Body(ValidationPipe) dto: StarshipsRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.starshipsService.addRelations(dto, id);
  }
}

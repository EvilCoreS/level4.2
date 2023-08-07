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
  Query,
  ParseIntPipe,
  Put,
  DefaultValuePipe,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { FilmRelationsDto } from './dto/film-relations.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  create(
    @Body(ValidationPipe) createFilmDto: CreateFilmDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.filmsService.create(createFilmDto, files);
  }

  @Get()
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.filmsService.findAll(offset, count);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateFilmDto: UpdateFilmDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.filmsService.update(id, updateFilmDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.remove(id);
  }

  @Put('/relation/:id')
  addRelations(
    @Body(ValidationPipe) dto: FilmRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.filmsService.addRelations(dto, id);
  }
}

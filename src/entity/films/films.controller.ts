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
  UseGuards,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { FilmRelationsDto } from './dto/film-relations.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Film')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @Roles(Role.Admin)
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
  @Roles(Role.Admin, Role.User)
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.filmsService.paginate({ page: offset, limit: count });
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.remove(id);
  }

  @Put('/relation/:id')
  @Roles(Role.Admin)
  addRelations(
    @Body(ValidationPipe) dto: FilmRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.filmsService.addRelations(dto, id);
  }
}

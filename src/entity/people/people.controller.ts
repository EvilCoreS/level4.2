import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  DefaultValuePipe,
  UseFilters,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { PeopleRelationsDto } from './dto/people-relations.dto';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { EntityNotFoundExceptionFilter } from '../../common/exceptions/entity-not-found.exception';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body(ValidationPipe) createPersonDto: CreatePersonDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.peopleService.create(createPersonDto, files);
  }

  @Get()
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.peopleService.paginate({ page: offset, limit: count });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.findOne(id);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.peopleService.update(id, updatePersonDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.remove(id);
  }

  @UseFilters(EntityNotFoundExceptionFilter)
  @Put('/relation/:id')
  async addRelations(
    @Body(ValidationPipe) dto: PeopleRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.peopleService.addRelations(dto, id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { SpeciesRelationsDto } from './dto/species-relations.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Species')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  create(
    @Body(ValidationPipe) createSpeciesDto: CreateSpeciesDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.speciesService.create(createSpeciesDto, files);
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.speciesService.paginate({ page: offset, limit: count });
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.speciesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSpeciesDto: UpdateSpeciesDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.speciesService.update(id, updateSpeciesDto, files);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.speciesService.remove(id);
  }

  @Put('/relation/:id')
  @Roles(Role.Admin)
  async addRelations(
    @Body(ValidationPipe) dto: SpeciesRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.speciesService.addRelations(dto, id);
  }
}

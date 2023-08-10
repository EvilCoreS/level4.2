import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { StarshipsRelationsDto } from './dto/starships-relations.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Starship')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body(ValidationPipe) dto: CreateStarshipDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.starshipsService.create(dto, files);
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.starshipsService.paginate({ page: offset, limit: count });
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.starshipsService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateStarshipDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.starshipsService.update(id, dto, files);
  }
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.starshipsService.remove(id);
  }

  @Put('/relation/:id')
  @Roles(Role.Admin)
  async addRelations(
    @Body(ValidationPipe) dto: StarshipsRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.starshipsService.addRelations(dto, id);
  }
}

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
  UseGuards,
} from '@nestjs/common';
import { PlanetService } from './planet.service';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { PlanetRelationsDto } from './dto/planet-relations.dto';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
@ApiTags('Planet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('planet')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body(ValidationPipe) createPlanetDto: CreatePlanetDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.planetService.create(createPlanetDto, files);
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.planetService.paginate({ page: offset, limit: count });
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planetService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planetService.remove(id);
  }

  @Put('/relation/:id')
  @Roles(Role.Admin)
  async addRelations(
    @Body(ValidationPipe) dto: PlanetRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.planetService.addRelations(dto, id);
  }
}

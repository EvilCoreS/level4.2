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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { VehiclesRelationsDto } from './dto/vehicles-relations.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Vehicle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body(ValidationPipe) dto: CreateVehicleDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.vehiclesService.create(dto, files);
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.vehiclesService.paginate({ page: offset, limit: count });
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateVehicleDto,
    @UploadedFiles(uploadFilesSizeConfig(process.env['MAX_FILE_SIZE']))
    files: Express.Multer.File[],
  ) {
    return this.vehiclesService.update(id, dto, files);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.remove(id);
  }

  @Put('/relation/:id')
  @Roles(Role.Admin)
  async addRelations(
    @Body(ValidationPipe) dto: VehiclesRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.vehiclesService.addRelations(dto, id);
  }
}

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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateStarshipDto } from '../starships/dto/create-starship.dto';
import { uploadFilesSizeConfig } from '../../common/config/upload-files-size.config';
import { OptionalQueryDecorator } from '../../common/decorators/optional-query.decorator';
import { UpdateStarshipDto } from '../starships/dto/update-starship.dto';
import { StarshipsRelationsDto } from "../starships/dto/starships-relations.dto";
import { VehiclesRelationsDto } from "./dto/vehicles-relations.dto";

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  create(
    @Body(ValidationPipe) dto: CreateVehicleDto,
    @UploadedFiles(uploadFilesSizeConfig(500000)) files: Express.Multer.File[],
  ) {
    return this.vehiclesService.create(dto, files);
  }

  @Get()
  @OptionalQueryDecorator()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number,
  ) {
    return this.vehiclesService.findAll(offset, count);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateVehicleDto,
    @UploadedFiles(uploadFilesSizeConfig(500000)) files: Express.Multer.File[],
  ) {
    return this.vehiclesService.update(id, dto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.remove(id);
  }

  @Put('/relation/:id')
  async addRelations(
    @Body(ValidationPipe) dto: VehiclesRelationsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.vehiclesService.addRelations(dto, id);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ImagesService } from '../../images/images.service';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Vehicle } from './entities/vehicle.entity';
import { relationsSaver } from '../../common/functions/relations-saver';
import { VehiclesRelationsDto } from './dto/vehicles-relations.dto';
import { VehiclesRepository } from './vehicles.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import dataSource from '../../../database/db.datasource';
@Injectable()
export class VehiclesService {
  constructor(
    private imageService: ImagesService,
    @Inject(VehiclesRepository) private vehicleRepository: VehiclesRepository,
  ) {}

  async create(dto: CreateVehicleDto, files: Express.Multer.File[]) {
    const filesInfo = await this.imageService.uploadFile(files);
    const objToSave = plainToInstance(Vehicle, dto);
    objToSave.images = filesInfo;
    return this.vehicleRepository.save(objToSave);
  }

  async paginate(options: IPaginationOptions) {
    return paginate(dataSource.getRepository(Vehicle), options, {
      relations: ['pilots', 'images', 'films'],
      loadEagerRelations: false,
    });
  }

  async findAll(offset = 0, count = 10) {
    return this.vehicleRepository.findAll(offset, count, [
      'pilots',
      'images',
      'films',
    ]);
  }

  async findOne(id: number) {
    return this.vehicleRepository.findOneById(id, [
      'pilots',
      'images',
      'films',
    ]);
  }

  async update(
    id: number,
    dto: UpdateVehicleDto,
    files: Express.Multer.File[],
  ) {
    const vehicle = await this.vehicleRepository.findOneById(id, ['images']);
    const newImages = await this.imageService.uploadFile(files);
    newImages.map((newImage) => {
      const findIndex = vehicle.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        this.imageService.deleteImages([vehicle.images[findIndex]]);
        plainToClassFromExist(vehicle.images[findIndex], newImage);
      } else vehicle.images.push(newImage);
    });
    return this.vehicleRepository.save(plainToClassFromExist(vehicle, dto));
  }

  async remove(id: number) {
    const deleteInfo = await this.vehicleRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: VehiclesRelationsDto, id: number) {
    return relationsSaver(Vehicle, dto, id);
  }
}

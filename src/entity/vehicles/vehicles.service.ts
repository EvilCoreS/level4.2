import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ImagesService, PATH_TO_PUBLIC } from '../../images/images.service';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Image } from '../../images/entities/image.entity';
import dataSource from '../../database/db.config';
import { Vehicle } from './entities/vehicle.entity';
import fs from 'fs';
import { relationsSaver } from '../../common/functions/relations-saver';
import { VehiclesRelationsDto } from './dto/vehicles-relations.dto';

@Injectable()
export class VehiclesService {
  constructor(private imageService: ImagesService) {}

  async create(dto: CreateVehicleDto, files: Express.Multer.File[]) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Vehicle, dto);
    objToSave.images = filesInfo;
    return await dataSource.manager.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await dataSource.manager.find(Vehicle, {
      loadEagerRelations: false,
      relations: ['pilots', 'images', 'films'],
      take: count,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const vehicle = await dataSource.manager.findOne(Vehicle, {
      where: { id },
      loadEagerRelations: false,
      relations: ['pilots', 'images', 'films'],
    });
    if (!vehicle) throw new NotFoundException('Incorrect id');
    return vehicle;
  }

  async update(
    id: number,
    dto: UpdateVehicleDto,
    files: Express.Multer.File[],
  ) {
    const vehicle = await dataSource.manager.findOneBy(Vehicle, { id });
    if (!vehicle) throw new NotFoundException('Incorrect id');
    const newImages = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    newImages.map((newImage) => {
      const findIndex = vehicle.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        try {
          fs.unlinkSync(
            `./${PATH_TO_PUBLIC}/${vehicle.images[findIndex].file_name}`,
          );
        } catch (e) {
          console.log(e);
        }
        plainToClassFromExist(vehicle.images[findIndex], newImage);
      } else vehicle.images.push(newImage);
    });
    return await dataSource.manager.save(plainToClassFromExist(vehicle, dto));
  }

  async remove(id: number) {
    const vehicle = await dataSource.manager.findOneBy(Vehicle, { id });
    if (!vehicle) throw new NotFoundException('Incorrect id');
    const deleteInfo = await dataSource.manager.remove(vehicle);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: VehiclesRelationsDto, id: number) {
    return await relationsSaver(Vehicle, dto, id);
  }
}

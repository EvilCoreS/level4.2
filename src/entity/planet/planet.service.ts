import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { UpdatePlanetDto } from './dto/update-planet.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Image } from '../../images/entities/image.entity';
import dataSource from '../../database/db.config';
import { ImagesService, PATH_TO_PUBLIC } from '../../images/images.service';
import { Planet } from './entities/planet.entity';
import { PlanetRelationsDto } from './dto/planet-relations.dto';
import fs from 'fs';
import { relationsSaver } from '../../common/functions/relations-saver';
@Injectable()
export class PlanetService {
  constructor(private imageService: ImagesService) {}

  async create(createPlanetDto: CreatePlanetDto, files: Express.Multer.File[]) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Planet, createPlanetDto);
    objToSave.images = filesInfo;
    return await dataSource.manager.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await dataSource.manager.find(Planet, {
      loadEagerRelations: false,
      relations: ['residents', 'images', 'films'],
      take: count,
      skip: offset,
    });
  }

  async findOne(id: number) {
    const planet = await dataSource.manager.findOne(Planet, {
      where: { id },
      loadEagerRelations: false,
      relations: ['residents', 'images', 'films'],
    });
    if (!planet) throw new NotFoundException('Incorrect id');
    return planet;
  }

  async update(
    id: number,
    updatePlanetDto: UpdatePlanetDto,
    files: Express.Multer.File[],
  ) {
    const planet = await dataSource.manager.findOneBy(Planet, { id });
    if (!planet) throw new NotFoundException('Incorrect id');
    const newImages = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    newImages.map((newImage) => {
      const findIndex = planet.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        try {
          fs.unlinkSync(
            `./${PATH_TO_PUBLIC}/${planet.images[findIndex].file_name}`,
          );
        } catch (e) {
          console.log(e);
        }
        plainToClassFromExist(planet.images[findIndex], newImage);
      } else planet.images.push(newImage);
    });
    return await dataSource.manager.save(
      plainToClassFromExist(planet, updatePlanetDto),
    );
  }

  async remove(id: number) {
    const planet = await dataSource.manager.findOneBy(Planet, { id });
    if (!planet) throw new NotFoundException('Incorrect id');
    const deleteInfo = await dataSource.manager.remove(planet);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: PlanetRelationsDto, id: number) {
    return await relationsSaver(Planet, dto, id);
  }
}

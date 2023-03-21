import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Image } from '../../images/entities/image.entity';
import dataSource from '../../database/db.config';
import { ImagesService, PATH_TO_PUBLIC } from '../../images/images.service';
import { Species } from './entities/species.entity';
import fs from 'fs';
import { relationsSaver } from '../../common/functions/relations-saver';
import { SpeciesRelationsDto } from './dto/species-relations.dto';

@Injectable()
export class SpeciesService {
  constructor(private imageService: ImagesService) {}

  async create(
    createSpeciesDto: CreateSpeciesDto,
    files: Express.Multer.File[],
  ) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Species, createSpeciesDto);
    objToSave.images = filesInfo;
    return await dataSource.manager.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await dataSource.manager.find(Species, {
      loadEagerRelations: false,
      relations: ['people', 'images', 'films', 'homeworld'],
      take: count,
      skip: offset,
    });
  }

  async findOne(id: number) {
    return await dataSource.manager.findOne(Species, {
      where: { id },
      loadEagerRelations: false,
      relations: ['people', 'images', 'films', 'homeworld'],
    });
  }

  async update(
    id: number,
    updateSpeciesDto: UpdateSpeciesDto,
    files: Express.Multer.File[],
  ) {
    const species = await dataSource.manager.findOneBy(Species, { id });
    if (!species) throw new BadRequestException('Incorrect id');
    const newImages = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    newImages.map((newImage) => {
      const findIndex = species.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        try {
          fs.unlinkSync(
            `./${PATH_TO_PUBLIC}/${species.images[findIndex].file_name}`,
          );
        } catch (e) {
          console.log(e);
        }
        plainToClassFromExist(species.images[findIndex], newImage);
      } else species.images.push(newImage);
    });
    return await dataSource.manager.save(
      plainToClassFromExist(species, updateSpeciesDto),
    );
  }

  async remove(id: number) {
    const species = await dataSource.manager.findOneBy(Species, { id });
    if (!species) throw new BadRequestException('Incorrect id');
    const deleteInfo = await dataSource.manager.remove(species);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: SpeciesRelationsDto, id: number) {
    return await relationsSaver(Species, dto, id);
  }
}

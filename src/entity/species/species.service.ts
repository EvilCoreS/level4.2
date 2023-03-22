import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { SpeciesRepository } from './species.repository';
import { of } from 'rxjs';

@Injectable()
export class SpeciesService {
  constructor(
    private imageService: ImagesService,
    @Inject(SpeciesRepository) private speciesRepository: SpeciesRepository,
  ) {}

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
    return await this.speciesRepository.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await this.speciesRepository.findAll(offset, count, [
      'people',
      'images',
      'films',
      'homeworld',
    ]);
  }

  async findOne(id: number) {
    return await this.speciesRepository.findOneById(id, [
      'people',
      'images',
      'films',
      'homeworld',
    ]);
  }

  async update(
    id: number,
    updateSpeciesDto: UpdateSpeciesDto,
    files: Express.Multer.File[],
  ) {
    const species = await this.speciesRepository.findOneById(id);
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
    return await this.speciesRepository.save(
      plainToClassFromExist(species, updateSpeciesDto),
    );
  }

  async remove(id: number) {
    const deleteInfo = await this.speciesRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: SpeciesRelationsDto, id: number) {
    return await relationsSaver(Species, dto, id);
  }
}

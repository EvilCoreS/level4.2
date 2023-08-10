import { Inject, Injectable } from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ImagesService } from '../../images/images.service';
import { Species } from './entities/species.entity';
import { relationsSaver } from '../../common/functions/relations-saver';
import { SpeciesRelationsDto } from './dto/species-relations.dto';
import { SpeciesRepository } from './species.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import dataSource from '../../../database/db.datasource';
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
    const filesInfo = await this.imageService.uploadFile(files);
    const objToSave = plainToInstance(Species, createSpeciesDto);
    objToSave.images = filesInfo;
    return this.speciesRepository.save(objToSave);
  }

  async paginate(options: IPaginationOptions) {
    return paginate(dataSource.getRepository(Species), options, {
      relations: ['people', 'images', 'films', 'homeworld'],
      loadEagerRelations: false,
    });
  }

  async findAll(offset = 0, count = 10) {
    return this.speciesRepository.findAll(offset, count, [
      'people',
      'images',
      'films',
      'homeworld',
    ]);
  }

  async findOne(id: number) {
    return this.speciesRepository.findOneById(id, [
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
    const species = await this.speciesRepository.findOneById(id, ['images']);
    const newImages = await this.imageService.uploadFile(files);
    newImages.map((newImage) => {
      const findIndex = species.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        this.imageService.deleteImages([species.images[findIndex]]);
        plainToClassFromExist(species.images[findIndex], newImage);
      } else species.images.push(newImage);
    });
    return this.speciesRepository.save(
      plainToClassFromExist(species, updateSpeciesDto),
    );
  }

  async remove(id: number) {
    const deleteInfo = await this.speciesRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: SpeciesRelationsDto, id: number) {
    return relationsSaver(Species, dto, id);
  }
}

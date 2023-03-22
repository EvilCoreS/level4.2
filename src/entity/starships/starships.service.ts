import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Image } from '../../images/entities/image.entity';
import dataSource from '../../database/db.config';
import { ImagesService, PATH_TO_PUBLIC } from '../../images/images.service';
import { Starship } from './entities/starship.entity';
import fs from 'fs';
import { relationsSaver } from '../../common/functions/relations-saver';
import { StarshipsRelationsDto } from './dto/starships-relations.dto';
import { StarshipRepository } from './starships.repository';

@Injectable()
export class StarshipsService {
  constructor(
    private imageService: ImagesService,
    @Inject(StarshipRepository) private starshipRepository: StarshipRepository,
  ) {}
  async create(dto: CreateStarshipDto, files: Express.Multer.File[]) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Starship, dto);
    objToSave.images = filesInfo;
    return await this.starshipRepository.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await this.starshipRepository.findAll(offset, count, [
      'pilots',
      'images',
      'films',
    ]);
  }

  async findOne(id: number) {
    return await this.starshipRepository.findOneById(id, [
      'pilots',
      'images',
      'films',
    ]);
  }

  async update(
    id: number,
    dto: UpdateStarshipDto,
    files: Express.Multer.File[],
  ) {
    const starship = await this.starshipRepository.findOneById(id, ['images']);
    const newImages = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    newImages.map((newImage) => {
      const findIndex = starship.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        try {
          fs.unlinkSync(
            `./${PATH_TO_PUBLIC}/${starship.images[findIndex].file_name}`,
          );
        } catch (e) {
          console.log(e);
        }
        plainToClassFromExist(starship.images[findIndex], newImage);
      } else starship.images.push(newImage);
    });
    return await this.starshipRepository.save(
      plainToClassFromExist(starship, dto),
    );
  }

  async remove(id: number) {
    const deleteInfo = await this.starshipRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: StarshipsRelationsDto, id: number) {
    return await relationsSaver(Starship, dto, id);
  }
}

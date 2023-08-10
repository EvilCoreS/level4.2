import { Inject, Injectable } from '@nestjs/common';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ImagesService } from '../../images/images.service';
import { Starship } from './entities/starship.entity';
import { relationsSaver } from '../../common/functions/relations-saver';
import { StarshipsRelationsDto } from './dto/starships-relations.dto';
import { StarshipRepository } from './starships.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import dataSource from '../../../database/db.datasource';
@Injectable()
export class StarshipsService {
  constructor(
    private imageService: ImagesService,
    @Inject(StarshipRepository) private starshipRepository: StarshipRepository,
  ) {}
  async create(dto: CreateStarshipDto, files: Express.Multer.File[]) {
    const filesInfo = await this.imageService.uploadFile(files);
    const objToSave = plainToInstance(Starship, dto);
    objToSave.images = filesInfo;
    return this.starshipRepository.save(objToSave);
  }

  async paginate(options: IPaginationOptions) {
    return paginate(dataSource.getRepository(Starship), options, {
      relations: ['pilots', 'images', 'films'],
      loadEagerRelations: false,
    });
  }

  async findAll(offset = 0, count = 10) {
    return this.starshipRepository.findAll(offset, count, [
      'pilots',
      'images',
      'films',
    ]);
  }

  async findOne(id: number) {
    return this.starshipRepository.findOneById(id, [
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
    const newImages = await this.imageService.uploadFile(files);
    newImages.map((newImage) => {
      const findIndex = starship.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        this.imageService.deleteImages([starship.images[findIndex]]);
        plainToClassFromExist(starship.images[findIndex], newImage);
      } else starship.images.push(newImage);
    });
    return this.starshipRepository.save(plainToClassFromExist(starship, dto));
  }

  async remove(id: number) {
    const deleteInfo = await this.starshipRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: StarshipsRelationsDto, id: number) {
    return relationsSaver(Starship, dto, id);
  }
}

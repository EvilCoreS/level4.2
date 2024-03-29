import { Inject, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ImagesService } from '../../images/images.service';
import { Film } from './entities/film.entity';
import { FilmRelationsDto } from './dto/film-relations.dto';
import { relationsSaver } from '../../common/functions/relations-saver';
import { FilmRepository } from './film.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import dataSource from '../../../database/db.datasource';

@Injectable()
export class FilmsService {
  constructor(
    private imageService: ImagesService,
    @Inject(FilmRepository) private filmRepository: FilmRepository,
  ) {}

  async create(createFilmDto: CreateFilmDto, files: Express.Multer.File[]) {
    const filesInfo = await this.imageService.uploadFile(files);
    const objToSave = plainToInstance(Film, createFilmDto);
    objToSave.images = filesInfo;
    return this.filmRepository.save(objToSave);
  }

  async paginate(options: IPaginationOptions) {
    return paginate(dataSource.getRepository(Film), options, {
      relations: [
        'images',
        'characters',
        'planets',
        'species',
        'starships',
        'vehicles',
      ],
      loadEagerRelations: false,
    });
  }

  async findAll(offset = 0, count = 10) {
    return this.filmRepository.findAll(offset, count, [
      'images',
      'characters',
      'planets',
      'species',
      'starships',
      'vehicles',
    ]);
  }

  async findOne(id: number) {
    return this.filmRepository.findOneById(id, [
      'images',
      'characters',
      'planets',
      'species',
      'starships',
      'vehicles',
    ]);
  }

  async update(
    id: number,
    updateFilmDto: UpdateFilmDto,
    files: Express.Multer.File[],
  ) {
    const film = await this.filmRepository.findOneById(id, ['images']);
    const newImages = await this.imageService.uploadFile(files);
    newImages.map((newImage) => {
      const findIndex = film.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        this.imageService.deleteImages([film.images[findIndex]]);
        plainToClassFromExist(film.images[findIndex], newImage);
      } else film.images.push(newImage);
    });
    return this.filmRepository.save(plainToClassFromExist(film, updateFilmDto));
  }

  async remove(id: number) {
    const deleteInfo = await this.filmRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: FilmRelationsDto, id: number) {
    return relationsSaver(Film, dto, id);
  }
}

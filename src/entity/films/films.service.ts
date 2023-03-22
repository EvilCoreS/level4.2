import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Image } from '../../images/entities/image.entity';
import dataSource from '../../database/db.config';
import { ImagesService, PATH_TO_PUBLIC } from '../../images/images.service';
import { Film } from './entities/film.entity';
import fs from 'fs';
import { FilmRelationsDto } from './dto/film-relations.dto';
import { relationsSaver } from '../../common/functions/relations-saver';
import { FilmRepository } from './film.repository';

@Injectable()
export class FilmsService {
  constructor(
    private imageService: ImagesService,
    @Inject(FilmRepository) private filmRepository: FilmRepository,
  ) {}

  async create(createFilmDto: CreateFilmDto, files: Express.Multer.File[]) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Film, createFilmDto);
    objToSave.images = filesInfo;
    return await this.filmRepository.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await this.filmRepository.findAll(offset, count, [
      'images',
      'characters',
      'planets',
      'species',
      'starships',
      'vehicles',
    ]);
  }

  async findOne(id: number) {
    return await this.filmRepository.findOneById(id, [
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
    const newImages = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    newImages.map((newImage) => {
      const findIndex = film.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        try {
          fs.unlinkSync(
            `./${PATH_TO_PUBLIC}/${film.images[findIndex].file_name}`,
          );
        } catch (e) {
          console.log(e);
        }
        plainToClassFromExist(film.images[findIndex], newImage);
      } else film.images.push(newImage);
    });
    return await this.filmRepository.save(
      plainToClassFromExist(film, updateFilmDto),
    );
  }

  async remove(id: number) {
    const deleteInfo = await this.filmRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: FilmRelationsDto, id: number) {
    return await relationsSaver(Film, dto, id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class FilmsService {
  constructor(private imageService: ImagesService) {}

  async create(createFilmDto: CreateFilmDto, files: Express.Multer.File[]) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Film, createFilmDto);
    objToSave.images = filesInfo;
    return await dataSource.manager.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await dataSource.manager.find(Film, {
      skip: offset,
      take: count,
      relations: ['images', 'characters', 'planets'],
      loadEagerRelations: false,
    });
  }

  async findOne(id: number) {
    const film = await dataSource.manager.findOne(Film, {
      where: { id },
      relations: ['images', 'characters', 'planets'],
      loadEagerRelations: false,
    });
    if (!film) throw new BadRequestException('Incorrect id');
    return film;
  }

  async update(
    id: number,
    updateFilmDto: UpdateFilmDto,
    files: Express.Multer.File[],
  ) {
    const film = await dataSource.manager.findOneBy(Film, { id });
    if (!film) throw new BadRequestException('Incorrect id');
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
    return await dataSource.manager.save(
      plainToClassFromExist(film, updateFilmDto),
    );
  }

  async remove(id: number) {
    const film = await dataSource.manager.findOneBy(Film, { id: id });
    if (!film) throw new NotFoundException('Incorrect id');
    const deleteInfo = await dataSource.manager.remove(film);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: FilmRelationsDto, id: number) {
    return await relationsSaver(Film, dto, id);
  }
}

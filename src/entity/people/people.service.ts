import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import dataSource from '../../database/db.config';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { Person } from './entities/person.entity';
import { ImagesService, PATH_TO_PUBLIC } from '../../images/images.service';
import { Image } from '../../images/entities/image.entity';
import * as fs from 'fs';
import { PeopleRelationsDto } from './dto/people-relations.dto';
import { relationsSaver } from '../../common/functions/relations-saver';

@Injectable()
export class PeopleService {
  constructor(private imageService: ImagesService) {}
  async create(createPersonDto: CreatePersonDto, files: Express.Multer.File[]) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Person, createPersonDto);
    objToSave.images = filesInfo;
    return await dataSource.manager.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await dataSource.manager.find(Person, {
      skip: offset,
      take: count,
      loadEagerRelations: false,
      relations: ['images', 'homeworld', 'films', 'species'],
    });
  }

  async findOne(id: number) {
    const person = await dataSource.manager.findOne(Person, {
      where: { id },
      loadEagerRelations: false,
      relations: ['images', 'homeworld', 'films', 'species'],
    });
    if (!person) throw new NotFoundException('Incorrect id');
    return person;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    files: Express.Multer.File[],
  ) {
    const person = await dataSource.manager.findOneBy(Person, { id: id });
    if (!person) throw new NotFoundException('Incorrect id');
    const newImages = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    newImages.map((newImage) => {
      const findIndex = person.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        try {
          fs.unlinkSync(
            `./${PATH_TO_PUBLIC}/${person.images[findIndex].file_name}`,
          );
        } catch (e) {
          console.log(e);
        }
        plainToClassFromExist(person.images[findIndex], newImage);
      } else person.images.push(newImage);
    });
    return await dataSource.manager.save(
      plainToClassFromExist(person, updatePersonDto),
    );
  }

  async remove(id: number) {
    const person = await dataSource.manager.findOneBy(Person, { id: id });
    if (!person) throw new NotFoundException('Incorrect id');
    const deleteInfo = await dataSource.manager.remove(person);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: PeopleRelationsDto, id: number) {
    return await relationsSaver(Person, dto, id);
  }
}

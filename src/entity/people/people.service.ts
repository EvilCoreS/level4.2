import { Inject, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ImagesService, PATH_TO_PUBLIC } from '../../images/images.service';
import { Image } from '../../images/entities/image.entity';
import * as fs from 'fs';
import { PeopleRelationsDto } from './dto/people-relations.dto';
import { relationsSaver } from '../../common/functions/relations-saver';
import { PersonRepository } from './person.repository';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    private imageService: ImagesService,
    @Inject(PersonRepository)
    private personRepository: PersonRepository,
  ) {}
  async create(createPersonDto: CreatePersonDto, files: Express.Multer.File[]) {
    const filesInfo = plainToInstance(
      Image,
      this.imageService.uploadFile(files),
    );
    const objToSave = plainToInstance(Person, createPersonDto);
    objToSave.images = filesInfo;
    return await this.personRepository.save(objToSave);
  }

  async findAll(offset = 0, count = 10) {
    return await this.personRepository.findAll(offset, count, [
      'images',
      'homeworld',
      'films',
      'species',
      'starships',
      'vehicles',
    ]);
  }

  async findOne(id: number) {
    return await this.personRepository.findOneById(id, [
      'images',
      'homeworld',
      'films',
      'species',
      'starships',
      'vehicles',
    ]);
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    files: Express.Multer.File[],
  ) {
    const person = await this.personRepository.findOneById(id, ['images']);
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
    return await this.personRepository.save(
      plainToClassFromExist(person, updatePersonDto),
    );
  }

  async remove(id: number) {
    const deleteInfo = await this.personRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: PeopleRelationsDto, id: number) {
    return await relationsSaver(Person, dto, id);
  }
}

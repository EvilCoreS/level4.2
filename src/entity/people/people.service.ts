import { Inject, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { ImagesService } from '../../images/images.service';
import { PeopleRelationsDto } from './dto/people-relations.dto';
import { relationsSaver } from '../../common/functions/relations-saver';
import { PersonRepository } from './person.repository';
import { Person } from './entities/person.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import dataSource from '../../../database/db.datasource';

@Injectable()
export class PeopleService {
  constructor(
    private imageService: ImagesService,
    @Inject(PersonRepository)
    private personRepository: PersonRepository,
  ) {}
  async create(createPersonDto: CreatePersonDto, files: Express.Multer.File[]) {
    const filesInfo = await this.imageService.uploadFile(files);
    const objToSave = plainToInstance(Person, createPersonDto);
    objToSave.images = filesInfo;
    return this.personRepository.save(objToSave);
  }

  async paginate(options: IPaginationOptions) {
    return paginate(dataSource.getRepository(Person), options);
  }

  async findAll(offset = 0, count = 10) {
    return this.personRepository.findAll(offset, count, [
      'images',
      'homeworld',
      'films',
      'species',
      'starships',
      'vehicles',
    ]);
  }

  async findOne(id: number) {
    return this.personRepository.findOneById(id, [
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
    const newImages = await this.imageService.uploadFile(files);
    newImages.map((newImage) => {
      const findIndex = person.images.findIndex(
        (image) => image.original_name === newImage.original_name,
      );
      if (findIndex >= 0) {
        this.imageService.deleteImages([person.images[findIndex]]);
        plainToClassFromExist(person.images[findIndex], newImage);
      } else person.images.push(newImage);
    });
    return this.personRepository.save(
      plainToClassFromExist(person, updatePersonDto),
    );
  }

  async remove(id: number) {
    const deleteInfo = await this.personRepository.remove(id);
    await this.imageService.deleteImages(deleteInfo.images);
    return deleteInfo;
  }

  async addRelations(dto: PeopleRelationsDto, id: number) {
    return relationsSaver(Person, dto, id);
  }
}

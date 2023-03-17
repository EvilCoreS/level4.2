import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import dataSource from '../../database/db.config';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  async create(createPersonDto: CreatePersonDto) {
    return await dataSource.manager.save(plainToClass(Person, createPersonDto));
  }

  async findAll(offset = 0, count = 10) {
    return await dataSource.manager.find(Person, {
      skip: offset,
      take: count,
    });
  }

  async findOne(id: number) {
    const person = await dataSource.manager.findOneBy(Person, { id: id });
    if (!!person) return person;
    else throw new NotFoundException('Incorrect id');
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const person = await dataSource.manager.findOneBy(Person, { id: id });
    if (!!person) {
      return await dataSource.manager.save(
        plainToClassFromExist(person, updatePersonDto),
      );
    } else throw new NotFoundException('Incorrect id');
  }

  async remove(id: number) {
    const person = await dataSource.manager.findOneBy(Person, { id: id });
    return await dataSource.manager.remove(person);
  }
}

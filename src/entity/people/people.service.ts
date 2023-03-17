import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PeopleService {
  idCounter = 0;
  database = [];
  create(createPersonDto: CreatePersonDto) {
    const objToAdd = { id: ++this.idCounter };
    Object.assign(objToAdd, createPersonDto);
    this.database.push(objToAdd);
    return objToAdd;
  }

  findAll(order: number, count: number) {
    const arr = this.database.slice(order);
    return arr.slice(0, count);
  }

  findOne(id: number) {
    return this.database.find((elem) => elem.id === id);
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    const indexObj = this.database.findIndex((elem) => elem.id === id);
    Object.assign(this.database[indexObj], updatePersonDto);
    return this.database[indexObj];
  }

  remove(id: number) {
    const indexObj = this.database.findIndex((elem) => elem.id === id);
    this.database.splice(indexObj, 1);
    return 'Deleted';
  }
}

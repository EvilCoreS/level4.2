import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  findAll(order = 0, count = 10) {
    const arr = this.database.slice(order);
    return arr.slice(0, count);
  }

  findOne(id: number) {
    const item = this.database.find((elem) => elem.id === id);
    if (item !== undefined) return item;
    else throw new NotFoundException('Incorrect id');
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    const indexObj = this.database.findIndex((elem) => elem.id === id);
    if (indexObj >= 0) {
      Object.assign(this.database[indexObj], updatePersonDto);
      return this.database[indexObj];
    } else throw new NotFoundException('Incorrect id');
  }

  remove(id: number) {
    const indexObj = this.database.findIndex((elem) => elem.id === id);
    if (indexObj >= 0) {
      this.database.splice(indexObj, 1);
      return 'Deleted';
    } else throw new NotFoundException('Incorrect id');
  }
}

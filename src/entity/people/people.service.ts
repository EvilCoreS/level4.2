import { Inject, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PeopleRepositoryInterface } from './interfaces/people.repository.interface';
import { Person } from './entities/person.entity';
import { PeopleRepository } from './people.repository';

@Injectable()
export class PeopleService {
  constructor(
    @Inject('PeopleRepositoryInterface')
    private readonly peopleRepository: PeopleRepository,
  ) {}

  async findAll(offset: number, limit: number) {
    return await this.peopleRepository.findAll(offset, limit);
  }
  async create(createPersonDto: CreatePersonDto) {
    const people = new Person();
    Object.assign(people, createPersonDto);
    return await this.peopleRepository.save(people);
  }
  async findOne(id: number) {
    return await this.peopleRepository.findByID(id);
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const people = new Person();
    Object.assign(people, updatePersonDto);
    people.id = id;

    const updatePeople = await this.peopleRepository.preload(people);
    return await this.peopleRepository.save(updatePeople);
  }

  async remove(id: number) {
    const people = await this.peopleRepository.findByID(id);
    return await this.peopleRepository.remove(people);
  }
}

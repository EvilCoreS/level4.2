import { Injectable } from '@nestjs/common';
import { GeneralRepository } from '../../repository/general.repository';
import { Person } from './entities/person.entity';
import { PeopleRepositoryInterface } from './interfaces/people.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleRepository
  extends GeneralRepository<Person>
  implements PeopleRepositoryInterface
{
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
  ) {
    super(peopleRepository);
  }

  async findAll(offset: number, limit: number): Promise<Person[]> {
    return await this.peopleRepository.find({
      skip: offset,
      take: limit,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../repositories/base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonRepositoryInterface } from './person.repository.interface';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonRepository
  extends BaseAbstractRepository<Person>
  implements PersonRepositoryInterface
{
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {
    super(personRepository);
  }
}

import { GeneralRepositoryInterface } from '../../../repository/general.repository.interface';
import { Person } from '../entities/person.entity';

export type PeopleRepositoryInterface = GeneralRepositoryInterface<Person>;

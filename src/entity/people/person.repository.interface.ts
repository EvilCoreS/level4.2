import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { Person } from './entities/person.entity';

export type PersonRepositoryInterface = BaseInterfaceRepository<Person>;

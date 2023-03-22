import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { Starship } from './entities/starship.entity';

export type StarshipsRepositoryInterface = BaseInterfaceRepository<Starship>;

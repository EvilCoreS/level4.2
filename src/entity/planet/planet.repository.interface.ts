import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { Planet } from './entities/planet.entity';

export type PlanetRepositoryInterface = BaseInterfaceRepository<Planet>;

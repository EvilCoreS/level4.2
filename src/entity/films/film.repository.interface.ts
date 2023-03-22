import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { Film } from './entities/film.entity';

export type FilmRepositoryInterface = BaseInterfaceRepository<Film>;

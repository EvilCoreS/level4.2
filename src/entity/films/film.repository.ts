import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../repositories/base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmRepositoryInterface } from './film.repository.interface';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmRepository
  extends BaseAbstractRepository<Film>
  implements FilmRepositoryInterface
{
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {
    super(filmRepository);
  }
}

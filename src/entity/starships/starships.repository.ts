import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../repositories/base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Starship } from './entities/starship.entity';
import { StarshipsRepositoryInterface } from './starships.repository.interface';

@Injectable()
export class StarshipRepository
  extends BaseAbstractRepository<Starship>
  implements StarshipsRepositoryInterface
{
  constructor(
    @InjectRepository(Starship)
    private readonly starshipRepository: Repository<Starship>,
  ) {
    super(starshipRepository);
  }
}

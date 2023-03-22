import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../repositories/base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';
import { SpeciesRepositoryIntreface } from './species.repository.intreface';

@Injectable()
export class SpeciesRepository
  extends BaseAbstractRepository<Species>
  implements SpeciesRepositoryIntreface
{
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {
    super(speciesRepository);
  }
}

import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../repositories/base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanetRepositoryInterface } from './planet.repository.interface';
import { Planet } from './entities/planet.entity';

@Injectable()
export class PlanetRepository
  extends BaseAbstractRepository<Planet>
  implements PlanetRepositoryInterface
{
  constructor(
    @InjectRepository(Planet)
    private readonly planetRepository: Repository<Planet>,
  ) {
    super(planetRepository);
  }
}

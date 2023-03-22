import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../repositories/base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesRepositoryInterface } from './vehicles.repository.interface';

@Injectable()
export class VehiclesRepository
  extends BaseAbstractRepository<Vehicle>
  implements VehiclesRepositoryInterface
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {
    super(vehicleRepository);
  }
}

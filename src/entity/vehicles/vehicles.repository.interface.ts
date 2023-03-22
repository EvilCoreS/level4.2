import { BaseInterfaceRepository } from '../../repositories/base/base.interface.repository';
import { Vehicle } from './entities/vehicle.entity';

export type VehiclesRepositoryInterface = BaseInterfaceRepository<Vehicle>;

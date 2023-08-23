import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import { plainToInstance } from 'class-transformer';
import { Vehicle } from '../../src/entity/vehicles/entities/vehicle.entity';

export class VehiclesSeed implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const name = 'vehicles';
    await RelationBuilder.fetchData(name);

    await connection.manager.save(
      RelationBuilder.data[name].map((entity) => {
        return plainToInstance(
          Vehicle,
          RelationBuilder.deleteRelations(entity),
        );
      }),
    );
  }
}

import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import { plainToInstance } from 'class-transformer';
import { Planet } from '../../src/entity/planet/entities/planet.entity';

export class PlanetsSeed implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const name = 'planets';
    await RelationBuilder.fetchData(name);

    await connection.manager.save(
      RelationBuilder.data[name].map((entity) => {
        return plainToInstance(Planet, RelationBuilder.deleteRelations(entity));
      }),
    );
  }
}

import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import { plainToInstance } from 'class-transformer';
import { Species } from '../../src/entity/species/entities/species.entity';

export class SpeciesSeed implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const name = 'species';
    await RelationBuilder.fetchData(name);

    await connection.manager.save(
      RelationBuilder.data[name].map((entity) => {
        return plainToInstance(
          Species,
          RelationBuilder.deleteRelations(entity),
        );
      }),
    );
  }
}

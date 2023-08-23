import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import { plainToInstance } from 'class-transformer';
import { Starship } from '../../src/entity/starships/entities/starship.entity';

export class StarshipsSeed implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const name = 'starships';
    await RelationBuilder.fetchData(name);

    await connection.manager.save(
      RelationBuilder.data[name].map((entity) => {
        return plainToInstance(
          Starship,
          RelationBuilder.deleteRelations(entity),
        );
      }),
    );
  }
}

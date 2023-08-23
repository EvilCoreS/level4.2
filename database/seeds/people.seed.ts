import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import { plainToInstance } from 'class-transformer';
import { Person } from '../../src/entity/people/entities/person.entity';

export class PeopleSeed implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const name = 'people';
    await RelationBuilder.fetchData(name);

    await connection.manager.save(
      RelationBuilder.data[name].map((entity) => {
        return plainToInstance(Person, RelationBuilder.deleteRelations(entity));
      }),
    );
  }
}

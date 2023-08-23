import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import { plainToInstance } from 'class-transformer';
import { Film } from '../../src/entity/films/entities/film.entity';

export class FilmsSeed implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const name = 'films';
    await RelationBuilder.fetchData(name);

    await connection.manager.save(
      RelationBuilder.data[name].map((entity) => {
        return plainToInstance(Film, RelationBuilder.deleteRelations(entity));
      }),
    );
  }
}

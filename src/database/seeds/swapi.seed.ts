import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import axios from 'axios';
export class SwapiSeed implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    const names = [
      'people',
      'films',
      'planets',
      'species',
      'starships',
      'vehicles',
    ];

    await Promise.all(
      names.map(async (name) => {
        const entity = RelationBuilder.returnEntity(name);
        for (let i = 1; ; i++) {
          const url = `https://swapi.dev/api/${name}/?format=json&page=${i}`;
          const res: { count: number; next: string | null; results: [] } =
            await axios.get(url).then((response) => response.data);
          RelationBuilder.data[name].push(...res.results);
          if (res.next === null) break;
        }
      }),
    );
  }
}

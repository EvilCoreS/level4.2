import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import axios from 'axios';
import { plainToClass, plainToInstance } from 'class-transformer';
import dataSource from '../db.datasource';
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
        for (let i = 1; ; i++) {
          const url = `https://swapi.dev/api/${name}/?format=json&page=${i}`;
          const res: { count: number; next: string | null; results: [] } =
            await axios.get(url).then((response) => response.data);
          res.results.map((data: any) => {
            data['id'] = RelationBuilder.getIdFromUrl(data['url']);
          });
          RelationBuilder.data[name].push(...res.results);
          if (res.next === null) break;
        }
      }),
    );

    await Promise.all(
      names.map(async (name) => {
        const entity = RelationBuilder.returnEntity(name);
        const arr = [];
        await RelationBuilder.data[name].map((data) => {
          const dataToSave = plainToInstance(
            entity,
            RelationBuilder.deleteRelations(data),
          );
          arr.push(dataToSave);
        });
        await connection.manager.save(arr);
      }),
    );

    const testArr = [];
    await Promise.all(
      names.map(async (name) => {
        const entity = RelationBuilder.returnEntity(name);
        RelationBuilder.data[name].map((data) => {
          const dataToSave = plainToInstance(
            entity,
            RelationBuilder.addRelations(data, name),
          );
          testArr.push(dataToSave);
        });
      }),
    );
    await connection.manager.save(testArr);
  }
}

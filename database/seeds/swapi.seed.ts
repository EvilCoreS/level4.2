import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';

export interface swapiResponse {
  count: number;
  next: string | null;
  results: [];
}

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

    const maxNameI = names.length - 1;

    const start = Date.now();

    const getAllData = async (nameI = 0, i = 1, result = []) => {
      const name = names[nameI];
      const url = `https://swapi.dev/api/${name}/?format=json&page=${i}`;
      if (RelationBuilder.total[name] < 0) {
        await setTotalNum(names);
      }
      const maxPages = Math.ceil(RelationBuilder.total[name] / 10);

      result.push(axios.get(url));

      if (maxPages > i) await getAllData(nameI, i + 1, result);
      else if (nameI < maxNameI) await getAllData(nameI + 1, 1, result);
      else {
        await Promise.all(result).then((data) => {
          data.map((res) => {
            RelationBuilder.data[
              RelationBuilder.getNameEntity(res.data.results[0].url)
            ].push(...res.data.results);
          });
        });
      }
    };

    const setTotalNum = async (names: string[], i = 0, result = []) => {
      const url = `https://swapi.dev/api/${names[i]}/?format=json&page=1`;
      result.push(axios.get(url));
      if (i < names.length - 1) await setTotalNum(names, i + 1, result);
      else {
        await Promise.all(result).then((data) => {
          data.map((res) => {
            RelationBuilder.total[
              RelationBuilder.getNameEntity(res.config.url)
            ] = res.data.count;
          });
        });
      }
    };

    await getAllData();
    await Promise.all(
      names.map((name) => {
        const entity = RelationBuilder.returnEntity(name);
        const arr = RelationBuilder.data[name].map((data) => {
          return plainToInstance(entity, RelationBuilder.deleteRelations(data));
        });
        return connection.manager.save(arr);
      }),
    );

    connection.manager.save(
      await Promise.all(
        names.map((name) => {
          const entity = RelationBuilder.returnEntity(name);
          return RelationBuilder.data[name].map((data) => {
            return plainToInstance(
              entity,
              RelationBuilder.addRelations(data, name),
            );
          });
        }),
      ),
    );

    console.log(Date.now() - start);
  }
}

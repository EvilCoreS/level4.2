import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RelationBuilder } from '../relationBuilder';

export class zrelationsSeed implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const testArr = [];
    Object.keys(RelationBuilder.data).map((key) => {
      testArr.push(
        ...RelationBuilder.data[key].map((entity) => {
          return RelationBuilder.addRelations(entity, key);
        }),
      );
    });
    await connection.manager.save(testArr);
    console.log(Date.now() - RelationBuilder.start);
  }
}

import { getEnvData } from '../src/common/config/config';
import * as path from 'path';

const { env, database } = getEnvData();

const seedConfig = {
  type: 'mysql',
  host: env === 'seed' ? 'localhost' : database.host,
  port: +database.port,
  username: database.user,
  password: database.pass,
  database: database.name,
  entities: ['src/**/*.entity.ts'],
  migrations: ['dist/database/migrations/*.js'],
  seeds: [path.relative(process.cwd(), `${__dirname}/seeds/*.seed.ts`)],
  factories: [
    path.relative(process.cwd(), `${__dirname}/factories/*.factory.ts`),
  ],
};

export default seedConfig;

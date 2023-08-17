import { DataSourceOptions } from 'typeorm';
import { getEnvData } from '../src/common/config/config';

const { env, database } = getEnvData();

const typeormConfig: DataSourceOptions = {
  type: 'mysql',
  host: env === 'migrate' ? 'localhost' : database.host,
  port: +database.port,
  username: database.user,
  password: database.pass,
  database: database.name,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

export default typeormConfig;

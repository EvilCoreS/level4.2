import { DataSourceOptions } from 'typeorm';
import { getEnvData } from '../src/common/config/config';

const { database } = getEnvData();

const typeormConfig: DataSourceOptions = {
  type: 'mysql',
  host: database.host,
  port: +database.port,
  username: database.user,
  password: database.pass,
  database: database.name,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

export default typeormConfig;

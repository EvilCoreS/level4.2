import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
export const typeormConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: isNaN(+process.env['DB_PORT']) ? 3306 : +process.env['DB_PORT'],
  username: process.env['DB_USER'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(typeormConfig);
export default dataSource;

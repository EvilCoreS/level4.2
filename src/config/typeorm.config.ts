import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: `./${process.env['NODE_ENV']}.env` });
export const dataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: +process.env['DB_PORT'] ? +process.env['DB_PORT'] : 3306,
  username: process.env['DB_USER'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/config/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceConfig);
export default dataSource;

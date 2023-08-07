import { DataSource } from 'typeorm';
import typeormConfig from './db.config';

const dataSource = new DataSource(typeormConfig);
export default dataSource;

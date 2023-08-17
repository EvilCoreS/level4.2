import { getEnvData } from '../src/common/config/config';

const { redis } = getEnvData();

const redisConfig = {
  host: redis.host,
  port: redis.port,
  isGlobal: true,
};

export default redisConfig;

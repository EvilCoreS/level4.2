import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

export function getEnvData() {
  const { env } = process;
  return {
    env: env['NODE_ENV'],
    port: env['SERVER_PORT_LOCAL'],
    database: {
      host: env['DB_HOST'],
      port: env['DB_PORT_LOCAL'],
      user: env['DB_USER'],
      name: env['DB_NAME'],
      pass: env['DB_PASS'],
    },
    redis: {
      host: env['REDIS_HOST'],
      port: env['REDIS_PORT_LOCAL'],
    },
    aws: {
      name: env['AWS_BUCKET_NAME'],
      region: env['AWS_BUCKET_REGION'],
      access_key: env['AWS_ACCESS_KEY'],
      secret_key: env['AWS_SECRET_KEY'],
    },
    aws_cognito: {
      user_pool_id: env['AWS_COGNITO_USER_POOL_ID'],
      client_id: env['AWS_COGNITO_CLIENT_ID'],
      identity_pool_id: env['AWS_COGNITO_IDENTITY_POOL_ID'],
      region: env['AWS_COGNITO_REGION'],
      authority: `https://cognito-idp.${env['AWS_COGNITO_REGION']}.amazonaws.com/${env['AWS_COGNITO_USER_POOL_ID']}/.well-known/jwks.json`,
    },
    fileSizeMax: env['MAX_FILE_SIZE'],
    jwt: {
      access_key: env['JWT_ACCESS_KEY'],
      access_exp: env['JWT_ACCESS_EXP'],
      refresh_key: env['JWT_REFRESH_KEY'],
      refresh_exp: env['JWT_REFRESH_EXP'],
    },
  };
}

import { Sequelize } from 'sequelize';
import 'dotenv/config';
import { getLogger } from './logger';
import { readFileSync } from 'fs';
const logger = getLogger('lib/tidb');

let sequelize: Sequelize | null = null;

export function initSequelize() {
  return new Sequelize({
    dialect: 'mysql',
    host: process.env.TIDB_HOST || 'localhost',
    port: Number(process.env.TIDB_PORT) || 4000,
    username: process.env.TIDB_USER || 'root',
    password: process.env.TIDB_PASSWORD || '',
    database: process.env.TIDB_DB_NAME || 'test',
    dialectOptions: {
      ssl:
        process.env?.TIDB_SSL_MODE === 'true'
          ? {
              minVersion: 'TLSv1.2',
              rejectUnauthorized: true,
              ca: process.env.TIDB_CA_PATH
                ? readFileSync(process.env.TIDB_CA_PATH)
                : undefined,
            }
          : null,
    },
  });
}

export async function getSequelize() {
  if (!sequelize) {
    sequelize = initSequelize();
    try {
      await sequelize.authenticate();
      logger.info('Connection has been established successfully.');
    } catch (error) {
      logger.error('Unable to connect to the database:');
      logger.error(error);
      throw error;
    }
  }
  return sequelize;
}

export async function closeSequelize() {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
  }
}

import { Sequelize } from 'sequelize';
import 'dotenv/config';

let sequelize: Sequelize | null = null;

export function connect() {
  return new Sequelize({
    dialect: 'mysql',
    host: process.env.TIDB_HOST || 'localhost',
    port: Number(process.env.TIDB_PORT) || 4000,
    username: process.env.TIDB_USER || 'root',
    password: process.env.TIDB_PASSWORD || 'root',
    database: process.env.TIDB_DB_NAME || 'test',
    dialectOptions: {
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    },
  });
}

export async function getSequelize() {
  if (!sequelize) {
    sequelize = connect();
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
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

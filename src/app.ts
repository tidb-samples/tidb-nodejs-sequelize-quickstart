import { Op } from 'sequelize';

import { getSequelize, closeSequelize } from './lib/tidb';
import { getPlayersModel } from './lib/model';
import { getLogger } from './lib/logger';

const logger = getLogger('app');

async function main() {
  // Get the sequelize instance
  logger.info('Getting sequelize instance...');
  const sequelize = await getSequelize();
  logger.info('Got sequelize instance.');

  // Get the players model
  logger.info('Getting players model...');
  const playersModel = getPlayersModel(sequelize);
  logger.info('Got players model.');

  // Sync the model
  logger.info('Syncing players model...');
  logger.info(
    'This creates the table, dropping it first if it already existed'
  );
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  await playersModel.sync({ force: true });
  logger.info('Synced players model.');

  // Initialize the model with some data
  logger.info('Initializing players model with some data...');
  await playersModel.bulkCreate([
    { id: 1, coins: 100, goods: 100 },
    { id: 2, coins: 200, goods: 200 },
    { id: 3, coins: 300, goods: 300 },
    { id: 4, coins: 400, goods: 400 },
    { id: 5, coins: 500, goods: 500 },
  ]);
  logger.info('Initialized players model with some data.');

  // CRUD - Create
  logger.info('Creating a new player...');
  const newPlayer = await playersModel.create({
    id: 6,
    coins: 600,
    goods: 600,
  });
  logger.info('Created a new player.');
  logger.info(newPlayer.toJSON());

  // CRUD - Read
  logger.info('Reading all players with coins > 300...');
  const allPlayersWithCoinsGreaterThan300 = await playersModel.findAll({
    where: {
      coins: {
        [Op.gt]: 300,
      },
    },
  });
  logger.info('Read all players with coins > 300.');
  logger.info(allPlayersWithCoinsGreaterThan300.map((p) => p.toJSON()));

  // CRUD - Update
  logger.info('Updating the new player...');
  await newPlayer.update({ coins: 700, goods: 700 });
  logger.info('Updated the new player.');
  logger.info(newPlayer.toJSON());

  // CRUD - Delete
  logger.info('Deleting the new player...');
  await newPlayer.destroy();
  const deletedNewPlayer = await playersModel.findByPk(6);
  logger.info('Deleted the new player.');
  logger.info(deletedNewPlayer?.toJSON());

  // Close the sequelize instance
  logger.info('Closing sequelize instance...');
  await closeSequelize();
  logger.info('Closed sequelize instance.');

  logger.info('Done.');
}

main().catch(logger.error);

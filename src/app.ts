import { Op } from 'sequelize';

import { getSequelize, closeSequelize } from './lib/tidb';
import { getPlayersModel } from './lib/model';

async function main() {
  // Get the sequelize instance
  console.log('Getting sequelize instance...');
  const sequelize = await getSequelize();
  console.log('Got sequelize instance.');

  // Get the players model
  console.log('Getting players model...');
  const playersModel = getPlayersModel(sequelize);
  console.log('Got players model.');

  // Sync the model
  console.log('Syncing players model...');
  console.log(
    'This creates the table, dropping it first if it already existed'
  );
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  await playersModel.sync({ force: true });
  console.log('Synced players model.');

  // Initialize the model with some data
  console.log('Initializing players model with some data...');
  await playersModel.bulkCreate([
    { id: 1, coins: 100, goods: 100 },
    { id: 2, coins: 200, goods: 200 },
    { id: 3, coins: 300, goods: 300 },
    { id: 4, coins: 400, goods: 400 },
    { id: 5, coins: 500, goods: 500 },
  ]);
  console.log('Initialized players model with some data.');

  // CRUD - Create
  console.log('Creating a new player...');
  const newPlayer = await playersModel.create({
    id: 6,
    coins: 600,
    goods: 600,
  });
  console.log('Created a new player.', newPlayer.toJSON());

  // CRUD - Read
  console.log('Reading all players with coins > 300...');
  const allPlayersWithCoinsGreaterThan300 = await playersModel.findAll({
    where: {
      coins: {
        [Op.gt]: 300,
      },
    },
  });
  console.log(
    'Read all players with coins > 300.',
    allPlayersWithCoinsGreaterThan300.map((p) => p.toJSON())
  );

  // CRUD - Update
  console.log('Updating the new player...');
  await newPlayer.update({ coins: 700, goods: 700 });
  console.log('Updated the new player.', newPlayer.toJSON());

  // CRUD - Delete
  console.log('Deleting the new player...');
  await newPlayer.destroy();
  const deletedNewPlayer = await playersModel.findByPk(6);
  console.log('Deleted the new player.', deletedNewPlayer?.toJSON());

  // Close the sequelize instance
  console.log('Closing sequelize instance...');
  await closeSequelize();
  console.log('Closed sequelize instance.');

  console.log('Done.');
}

main().catch(console.error);

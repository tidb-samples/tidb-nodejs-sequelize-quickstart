import { Sequelize, DataTypes, Model } from 'sequelize';

class Players extends Model {}

export function getPlayersModel(sequelize: Sequelize) {
  // CREATE TABLE players (
  //     `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'The unique ID of the player.',
  //     `coins` INT(11) COMMENT 'The number of coins that the player had.',
  //     `goods` INT(11) COMMENT 'The number of goods that the player had.',
  //     PRIMARY KEY (`id`)
  // );
  Players.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: 'The unique ID of the player.',
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'The number of coins that the player had.',
      },
      goods: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'The number of goods that the player had.',
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'players', // We need to choose the model name
    }
  );
  return Players;
}

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId'});
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'CASCADE',  hooks: true });
      Spot.belongsToMany(
        models.User,
        {
          through: models.Booking,
          foreignKey: 'spotId',
          otherKey: 'userId',

        }
      );
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      Spot.belongsToMany(
        models.User,
        {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId'
        }
      );
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50]
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
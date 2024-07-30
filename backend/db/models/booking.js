'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId'});
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId'});
    }
  }
  Booking.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notInPast(value) {
          if (new Date(value) <= new Date()) {
            throw new Error('startDate cannot be in the past');
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notBeforeStartDate(value) {
          if (value <= this.startDate) {
            throw new Error('endDate cannot be on or before startDate');
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
    scopes: {
      userBookings(userId) {
        return {
          where: {ownerId: userId}
        }
      }
    }
  });
  return Booking;
};
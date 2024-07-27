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
        // is: /^d{4}-d{2}-d{2}$/
        isDate: true,
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        // is: /^d{4}-d{2}-d{2}$/
        isDate: true
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
    scopes: {
      userBookings(userId) {
        return {
          where: {userId}
        }
      }
    }
  });
  return Booking;
};
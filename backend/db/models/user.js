'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Spot);
      User.hasMany(models.Booking);
      User.belongsToMany(
        models.Spot,
          { through: models.Booking,
            foreignKey: 'userId',
            otherKey: 'spotId'
          }
      );
      User.hasMany(models.Review);
      User.belongsToMany(
        models.Spot,
        {
          through: models.Review,
          foreignKey: 'userId',
          otherKey: 'spotId'
        }
      );
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type:DataTypes.STRING
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
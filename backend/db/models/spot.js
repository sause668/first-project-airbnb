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
      Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId'});
      Spot.hasMany(models.Booking, { foreignKey: 'spotId'});
      Spot.belongsToMany(
        models.User,
        {
          through: models.Booking,
          foreignKey: 'spotId',
          otherKey: 'userId',
        }
      );
      Spot.hasMany(models.Review, { foreignKey: 'spotId'});
      Spot.belongsToMany(
        models.User,
        {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId'
        }
      );
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId'});
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
        len: {
          args: [5, 100],
          msg: 'Address must be between 5 be 100 characters'
        },
        notEmpty: {
          args: [true],
          msg: 'Address is required'
        },
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 60],
          msg: 'City must be between 4 be 60 characters'
        },
        notEmpty: {
          args: [true],
          msg: 'City is required'
        },
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'State must be 2 to 50 characters'
        },
        notEmpty: {
          args: [true],
          msg: 'State is required'
        },
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Country must be between 4 be 60 characters'
        },
        notEmpty: {
          args: [true],
          msg: 'Country is required'
        },
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        range(value) {
          if (value < -90 || value > 90) {
            throw Error('Latitude must be within -90 and 90')
          }
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        range(value) {
          if (value < -180 || value > 180) {
            throw Error('Longitude must be within -180 and 180')
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: 'Name must be between 3 be 50 characters'
        },
        notEmpty: {
          args: [true],
          msg: 'Description is required'
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: {
        args: [0, 500],
        msg: 'Description can be no more than 500 characters'
      },
      validate: {
        notEmpty: {
          args: [true],
          msg: 'Description is required'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price per day must be a positive number'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    scopes: {
      ownerSpots(ownerId) {
        return {
          where: {ownerId}
        }
      }
    }
  });
  return Spot;
};
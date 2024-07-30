'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'userId'});
      Review.belongsTo(models.Spot, { foreignKey: 'spotId'});
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId'});
    }
  }
  Review.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Review text can be no more than 500 characters'
        },
        notEmpty: {
          args: true,
          msg: 'Review text is required'
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        range(value) {
          if (value < -1 || value > 5) {
            throw Error('Stars must be an integer from 1 to 5')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    scopes: {
      userReviews(userId) {
        return {
          where: {userId: userId}
        }
      }
    }
  });
  return Review;
};
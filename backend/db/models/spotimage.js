'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId'});
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 150]
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SpotImage'
    // scopes: {
    //   StopImagesOnly(spotId) {
    //     const { Spot } = require('../models');
    //     return {
    //       where: {spotId},
    //       include: {model: Spot}
    //     }
    //   }
    // }
  });
  return SpotImage;
};
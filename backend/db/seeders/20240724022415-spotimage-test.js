'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const testSpot = await Spot.findOne({where: {name: 'da spot'}});

    await testSpot.createSpotImage({
      url: '/dope/shit',
      preview: true
    });
  },

  async down (queryInterface, Sequelize) {
    const testSpot = await Spot.findOne({where: {name: 'da spot'}});
    
    const Op = Sequelize.Op;

    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [testSpot.id] }
    }, {});
  }
};

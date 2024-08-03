'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const starkQuarters = await Spot.findOne({where: {name: 'Stark Quarters'}});
    const crowShack = await Spot.findOne({where: {name: 'Crow Shack'}});
    const redKeep = await Spot.findOne({where: {name: 'Red Keep'}});
    const dragonRoom = await Spot.findOne({where: {name: 'Dragon Room'}});

    await starkQuarters.createSpotImage({
      url: '/images/god-wood.jpg',
      preview: true
    });
    await starkQuarters.createSpotImage({
      url: '/images/dinning-room.jpg',
      preview: false
    });
    await redKeep.createSpotImage({
      url: '/images/iron-throne.jpg',
      preview: true
    });
    await redKeep.createSpotImage({
      url: '/images/city-view.jpg',
      preview: false
    });
    await redKeep.createSpotImage({
      url: '/images/royal-chambers.jpg',
      preview: false
    });
    await dragonRoom.createSpotImage({
      url: '/images/dragon.jpg',
      preview: true
    });
    await dragonRoom.createSpotImage({
      url: '/images/war-room.jpg',
      preview: false
    });
    await crowShack.createSpotImage({
      url: '/images/wall.jpg',
      preview: true
    });
    
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {}, {});
  }
};

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
      url: '/spot-images/winterfell/overview.webp',
      preview: true
    });
    await starkQuarters.createSpotImage({
      url: '/spot-images/winterfell/hallway.jpg',
      preview: false
    });
    await starkQuarters.createSpotImage({
      url: '/spot-images/winterfell/godwood.jpg',
      preview: false
    });
    await starkQuarters.createSpotImage({
      url: '/spot-images/winterfell/courtyard.jpg',
      preview: false
    });
    await starkQuarters.createSpotImage({
      url: '/spot-images/winterfell/bedroom.jpg',
      preview: false
    });
    await redKeep.createSpotImage({
      url: '/spot-images/red-keep/overview.webp',
      preview: true
    });
    await redKeep.createSpotImage({
      url: '/spot-images/red-keep/overview2.jpg',
      preview: false
    });
    await redKeep.createSpotImage({
      url: '/spot-images/red-keep/kings-landing.webp',
      preview: false
    });
    await redKeep.createSpotImage({
      url: '/spot-images/red-keep/iron-throne.webp',
      preview: false
    });
    await redKeep.createSpotImage({
      url: '/spot-images/red-keep/bedroom.jpg',
      preview: false
    });
    await dragonRoom.createSpotImage({
      url: '/spot-images/dragonstone/overview.webp',
      preview: true
    });
    await dragonRoom.createSpotImage({
      url: '/spot-images/dragonstone/overview2.jpg',
      preview: false
    });
    await dragonRoom.createSpotImage({
      url: '/spot-images/dragonstone/dragons.jpg',
      preview: false
    });
    await dragonRoom.createSpotImage({
      url: '/spot-images/dragonstone/throne.webp',
      preview: false
    });
    await dragonRoom.createSpotImage({
      url: '/spot-images/dragonstone/dining.png',
      preview: false
    });
    await crowShack.createSpotImage({
      url: '/spot-images/castle-black/overview.png',
      preview: true
    });
    await crowShack.createSpotImage({
      url: '/spot-images/castle-black/overview2.webp',
      preview: false
    });
    await crowShack.createSpotImage({
      url: '/spot-images/castle-black/overview3.webp',
      preview: false
    });
    await crowShack.createSpotImage({
      url: '/spot-images/castle-black/wall.webp',
      preview: false
    });
    await crowShack.createSpotImage({
      url: '/spot-images/castle-black/dining.jpg',
      preview: false
    });
    
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {}, {});
  }
};

'use strict';
const { User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const john = await User.findOne({where: {username: 'kinginthenorth'}});
    const jamie = await User.findOne({where: {username: 'kingslayer'}});
    const daenerys = await User.findOne({where: {username: 'breakerofchains'}});
    

    await john.createSpot({
      address: "26 N King's Road",
      city: 'Winterfell',
      state: 'NL',
      country: 'Westeros',
      lat: 54.607314,
      lng: -2.179626,
      name: 'Stark Quarters',
      description: 'Winter is coming. Find warmth in the north.',
      price: 525
    });

    await john.createSpot({
      address: "12 N King's Road",
      city: 'Castle Black',
      state: 'NL',
      country: 'Westeros',
      lat: 56.687560,
      lng: -2.617918,
      name: 'Crow Shack',
      description: 'The sight of the great ice wall will blow you away.  Free tours to the top to get the best views',
      price: 50
    });

    await jamie.createSpot({
      address: '32 Main Street',
      city: "King's Landing",
      state: 'CL',
      country: 'Westeros',
      lat: 51.483250,
      lng: -0.327463,
      name: "Red Keep",
      description: "There's nothing like the city.  Best markets and the best nightlife",
      price: 1550
    });

    await daenerys.createSpot({
      address: '82 Dracarys Place',
      city: 'Dragonstone',
      state: 'WL',
      country: 'Westeros',
      lat: 51.808488,
      lng: 1.039471,
      name: 'Dragon Room',
      description: "Come the the ancient dragon thought to be lost to time.  Careful though.  They can get moody",
      price: 775
    });

    
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {}, {});
  }
};

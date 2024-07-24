'use strict';
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const testUser = await User.findOne({where: {username: 'FakeUser1'}});

    await testUser.createSpot({
      address: '56 4t dr',
      city: 'bobtown',
      country: 'US',
      name: 'da spot',
      description: 'dope ass spot',
      price: 40.50
    })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['da spot'] }
    }, {});
  }
};

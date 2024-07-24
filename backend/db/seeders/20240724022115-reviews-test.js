'use strict';

const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const testUser = await User.findOne({where: {username: 'FakeUser2'}});
    const testSpot = await Spot.findOne({where: {name: 'da spot'}});
    await testUser.createReview({
      spotId: testSpot.id,
      review: 'da spot was so dope',
      stars: 5
    })
  },

  async down (queryInterface, Sequelize) {
    const testSpot = await Spot.findOne({where: {name: 'da spot'}});
    
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [testSpot.id] }
    }, {});
  }
};

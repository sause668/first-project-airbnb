'use strict';

const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const testReview = await Review.findOne({
      where: {stars: 5},
      attributes: ['id']
    });
    
    await testReview.createReviewImage({
      url: '/hot/shit'
    });
  },

  async down (queryInterface, Sequelize) {
    const testReview = await Review.findOne({where: {stars: 5}});
    
    const Op = Sequelize.Op;

    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [testReview.id] }
    }, {});
  }
};

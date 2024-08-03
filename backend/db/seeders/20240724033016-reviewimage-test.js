'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const starkQuartersReview = await Review.findOne({
      where: {review: 'Not my taste.  Everything looks old.'},
      attributes: ['id']
    });
    const redKeepReview = await Review.findOne({
      where: {review: 'Fancy but not like home'},
      attributes: ['id']
    });
    const dragonRoomReview = await Review.findOne({
      where: {review: 'Love the setting and the company lol'},
      attributes: ['id']
    });
    const crowShackReview = await Review.findOne({
      where: {review: 'I did it.  I saw the wall.  Now I want to go home.'},
      attributes: ['id']
    });
    
    
    await starkQuartersReview.createReviewImage({
      url: '/images/crypt.jpg'
    });
    await redKeepReview.createReviewImage({
      url: '/images/iron-throne.jpg'
    });
    await dragonRoomReview.createReviewImage({
      url: '/images/deanerys.jpg'
    });
    await crowShackReview.createReviewImage({
      url: '/images/wall.jpg'
    });
    
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};

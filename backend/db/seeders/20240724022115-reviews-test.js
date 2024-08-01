'use strict';

const { User, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const john = await User.findOne({where: {username: 'kinginthenorth'}});
    const jamie = await User.findOne({where: {username: 'kingslayer'}});
    const sansa = await User.findOne({where: {username: 'queeninthenorth'}});
    const daenerys = await User.findOne({where: {username: 'breakerofchains'}});
    const tyrion = await User.findOne({where: {username: 'queenshand'}});

    const starkQuarters = await Spot.findOne({where: {name: 'Stark Quarters'}});
    const crowShack = await Spot.findOne({where: {name: 'Crow Shack'}});
    const redKeep = await Spot.findOne({where: {name: 'Red Keep'}});
    const dragonRoom = await Spot.findOne({where: {name: 'Dragon Room'}});

    await john.createReview({
      spotId: redKeep.id,
      review: 'Fancy but not like home',
      stars: 4
    });
    await john.createReview({
      spotId: dragonRoom.id,
      review: 'Love the setting and the company lol',
      stars: 5
    });
    await sansa.createReview({
      spotId: redKeep.id,
      review: "Love it. Would stay forever if it weren't for the torture",
      stars: 4
    });
    await sansa.createReview({
      spotId: starkQuarters.id,
      review: "Really did't appreciate this when I was young.  Great to be home:)",
      stars: 5
    });
    await daenerys.createReview({
      spotId: starkQuarters.id,
      review: "Too cold.  My dragons don't like it either.",
      stars: 3
    });
    await daenerys.createReview({
      spotId: redKeep.id,
      review: "Better than I dreamed.  I'll never leave.",
      stars: 5
    });
    await jamie.createReview({
      spotId: starkQuarters.id,
      review: 'Not my taste.  Everything looks old.',
      stars: 3
    });
    await jamie.createReview({
      spotId: dragonRoom.id,
      review: 'Lovely place.  Hope the dragons are friendly.',
      stars: 5
    });
    await tyrion.createReview({
      spotId: redKeep.id,
      review: 'Best wine.  Best brothels. What more could I ask for?',
      stars: 5
    });
    await tyrion.createReview({
      spotId: crowShack.id,
      review: 'I did it.  I saw the wall.  Now I want to go home.',
      stars: 1
    });
    await tyrion.createReview({
      spotId: dragonRoom.id,
      review: 'Love dragons so...nuff said.',
      stars: 5
    });
    
  },

  async down (queryInterface, Sequelize) {
    // const testSpot = await Spot.findOne({where: {name: 'da spot'}});

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // spotId: { [Op.in]: [testSpot.id] }
    }, {});
  }
};

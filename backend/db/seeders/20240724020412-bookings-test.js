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
    
    await john.createBooking({
      spotId: redKeep.id
    })
    await john.createBooking({
      spotId: dragonRoom.id
    })
    await sansa.createBooking({
      spotId: starkQuarters.id
    })
    await sansa.createBooking({
      spotId: redKeep.id
    })
    await daenerys.createBooking({
      spotId: starkQuarters.id
    })
    await daenerys.createBooking({
      spotId: redKeep.id
    })
    await jamie.createBooking({
      spotId: starkQuarters.id
    })
    await jamie.createBooking({
      spotId: dragonRoom.id
    })
    await tyrion.createBooking({
      spotId: redKeep.id
    })
    await tyrion.createBooking({
      spotId: crowShack.id
    })
    await tyrion.createBooking({
      spotId: dragonRoom.id
    })
    
  },

  async down (queryInterface, Sequelize) {
    // const testSpot = await Spot.findOne({where: {name: 'da spot'}});

    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // spotId: { [Op.in]: [testSpot.id] }
    }, {});
  }
};

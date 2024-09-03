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
      spotId: redKeep.id,
      startDate: '2025-08-18',
      endDate: '2025-08-21'
    })
    await john.createBooking({
      spotId: dragonRoom.id,
      startDate: '2024-09-05',
      endDate: '2024-09-10'
    })
    await sansa.createBooking({
      spotId: starkQuarters.id,
      startDate: '2024-10-04',
      endDate: '2024-10-16'
    })
    await sansa.createBooking({
      spotId: redKeep.id,
      startDate: '2024-11-15',
      endDate: '2024-11-21'
    })
    await daenerys.createBooking({
      spotId: starkQuarters.id,
      startDate: '2024-09-12',
      endDate: '2024-09-24'
    })
    await daenerys.createBooking({
      spotId: redKeep.id,
      startDate: '2024-10-01',
      endDate: '2024-10-08'
    })
    await jamie.createBooking({
      spotId: starkQuarters.id,
      startDate: '2024-09-14',
      endDate: '2024-09-20'
    })
    await jamie.createBooking({
      spotId: dragonRoom.id,
      startDate: '2025-08-26',
      endDate: '2025-08-29'
    })
    await tyrion.createBooking({
      spotId: redKeep.id,
      startDate: '2024-09-17',
      endDate: '2024-10-15'
    })
    await tyrion.createBooking({
      spotId: crowShack.id,
      startDate: '2025-08-14',
      endDate: '2025-08-15'
    })
    await tyrion.createBooking({
      spotId: dragonRoom.id,
      startDate: '2024-10-20',
      endDate: '2024-11-25'
    })
    
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};

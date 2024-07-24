const express = require('express');
const router = express.Router();
// const pagination = require('../utils/pagination');
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { Booking } = require('../../db/models');
const { Op } = require('sequelize');

// Return all the bookings that the current user has made.
router.get('/current', async (req, res, next) => {
    
});

// Update and return an existing booking.
router.put('/:bookingId', async (req, res, next) => {
    
});

// Delete an existing booking.
router.delete('/:bookingId', async (req, res, next) => {
    
});




module.exports = router;
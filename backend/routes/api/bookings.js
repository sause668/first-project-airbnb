const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
// const pagination = require('../utils/pagination');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { Booking, Spot } = require('../../db/models');
const { Op } = require('sequelize');

// Return all the bookings that the current user has made.
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req;

    const bookingsUser = await Booking.findAll({
        where: {userId: user.id},
        include: {
            model: Spot,
            attributes: {
                include: [[
                    sequelize.literal(`(
                        SELECT SpotImages.url
                        FROM SpotImages
                        JOIN Spots ON Spots.id = SpotImages.spotId
                        WHERE
                            SpotImages.spotId = Spots.id
                            AND
                            SpotImages.preview = true
                    )`),
                    'previewImage',
                ]],
                exclude: ['createdAt', 'updatedAt']
            }
        }
    });

    res.json(bookingsUser);
});

// Update and return an existing booking.
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const {bookingId} = req.params;
    const {startDate, endDate} = req.body;

    const bookingEdit = await Booking.findOne({where: {id: bookingId}});

    bookingEdit.set({startDate, endDate});

    await bookingEdit.save();

    res.json(bookingEdit);
});

// Delete an existing booking.
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const {bookingId} = req.params;

    const bookingDelete = await Booking.findOne({where: {id: bookingId}});

    await bookingDelete.destroy();

    res.json({message: "Successfully deleted"});
});




module.exports = router;
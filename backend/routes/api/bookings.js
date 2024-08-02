const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
const { Sequelize } = require('sequelize');

// Import model(s)
const { Booking, Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

// Return all the bookings that the current user has made.
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req;

    const bookingsUser = await Booking.findAll({
        where: {userId: user.id},
        include: [
            {
                model: Spot,
                subQuery: false,
                attributes: {
                    subQuery: false,
                    include: [
                        [
                            Sequelize.literal('Spot->SpotImages.url'),
                            'previewImage'
                        ]
                    ],
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: SpotImage,
                    attributes: [],
                    where: {
                        preview: true
                    }
                },
                // group: ['SpotImages.id']
            },
            // {
            //     model: SpotImage,
            //     attributes: [],
            //     where: {
            //         preview: true
            //     }
            // },
        ],
        // group: ['Spot'],
    });

    res.json({'Bookings': bookingsUser});
});

// Update and return an existing booking.
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {bookingId} = req.params;
    const {startDate, endDate} = req.body;

    const bookingEdit = await Booking.findOne({where: {id: bookingId}});
    console.log(bookingEdit)

    if (!bookingEdit) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (bookingEdit.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    if (bookingEdit.endDate < new Date()) {
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        return next(err);
    }

    const bookings = await Booking.findAll({
        where: {
            [Op.and]: [
                {
                    spotId: bookingEdit.spotId
                },
                {id: {
                    [Op.ne]: bookingEdit.id
                }
            }
            ]
        }
    });
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    let errorFlag = false;
    const errors = {};
        
    for (let booking of bookings) {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        if ((newStart <= bookingStart && newEnd >= bookingEnd)) {
            errors.startDate = 'Start date conflicts with an existing booking';
            errors.endDate = 'End date conflicts with an existing booking';
            errorFlag = true;
        } else {
            if (newStart >= bookingStart && newStart <= bookingEnd) {
                errors.startDate = 'Start date conflicts with an existing booking';
                errorFlag = true;
            }
            
            if (newEnd >= bookingStart && newEnd <= bookingEnd) {
                errors.endDate = 'End date conflicts with an existing booking';
                errorFlag = true;
            }
        }

        if (errorFlag) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403;
            err.errors = errors;
            return next(err);
        }
    }

    bookingEdit.set({startDate, endDate});

    await bookingEdit.save();

    res.json(bookingEdit);
});

// Delete an existing booking.
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {bookingId} = req.params;

    const bookingDelete = await Booking.findOne({
        where: {id: bookingId},
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    });

    if (!bookingDelete) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (bookingDelete.userId !== user.id || 
        bookingDelete['Spot'].ownerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    if (bookingDelete.startDate < new Date()) {
        const err = new Error("Bookings that have been started can't be deleted");
        err.status = 403;
        return next(err);
    }

    await bookingDelete.destroy();

    res.json({message: "Successfully deleted"});
});




module.exports = router;
const express = require('express');
const router = express.Router();
const pagination = require('../../utils/pagination');
const { requireAuth }  = require('../../utils/auth');
const { Sequelize } = require('sequelize');

// Import model(s)
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

// Returns all the spots
router.get('/', pagination, async (req, res, next) => {
    const {page, size} = req.query;
    const limit = res.locals.limit;
    const offset = res.locals.offset;

    console.log(Sequelize.col('SpotImages.url'));

    const spotsAll = await Spot.findAll({
        subQuery: false,
        attributes: {
            include: [
                [
                    Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                    'avgRating'
                ],
                [
                    Sequelize.col('SpotImages.url'),
                    'previewImage'
                ]
            ]
        },
        include: [
            {
                model: Review,
                required: false,
                attributes: []
            },
            {
                model: SpotImage,
                required: false,
                attributes: [],
                where: {
                    preview: true
                }
            },
        ],
        group: ['Spot.id', 'SpotImages.id'],
        limit,
        offset
    });
    
    res.json({
        'Spots': spotsAll,
        page: page || 1,
        size: size || 20
    });
});

// Returns all the spots owned by the current user.
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const where = {};

    where.ownerId = user.id;
    
    const spotsUser = await Spot.findAll({
        subQuery: false,
        attributes: {
            include: [
                [
                    Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                    'avgRating'
                ],
                [
                    Sequelize.col('SpotImages.url'),
                    'previewImage'
                ]
            ]
        },
        include: [
            {
                model: Review,
                required: false,
                attributes: []
            },
            {
                model: SpotImage,
                required: false,
                attributes: [],
                where: {
                    preview: true
                }
            },
        ],
        group: ['Spot.id', 'SpotImages.id'],
        where
    });

    res.json({'Spots': spotsUser});
});

// Returns the details of a spot specified by its id.
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;
    const where = {};

    where.id = parseInt(spotId);
    
    const spot = await Spot.findOne({
        subQuery: false,
        attributes: {
            include: [
                [
                    Sequelize.fn('COUNT', Sequelize.col('Reviews.stars')),
                    'numReviews'
                ],
                [
                    Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                    'avgRating'
                ]
            ]
        },
        include: [
            {
                model: User,
                required: false,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
            },
            {
                model: SpotImage,
                required: false,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: Review,
                required: false,
                attributes: []
            }
        ],
        group: ['Spot.id', 'Owner.id', 'SpotImages.id'],
        where
    });

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    res.json(spot);
});

// Return all the bookings for a spot specified by id.
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {spotId} = req.params;

    const spot = await Spot.findOne({where: {id: spotId}});

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
    
    const bookingsSpot = (spot.ownerId === user.id) ? 
        await Booking.findAll({
            where: {spotId},
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        }):
        await Booking.findAll({
            where: {spotId},
            attributes: ['spotId', 'startDate', 'endDate']
        });


    res.json(bookingsSpot);
});

// Returns all the reviews that belong to a spot specified by id.
router.get('/:spotId/reviews', async (req, res, next) => {
    const {spotId} = req.params;

    if (!await Spot.findByPk(spotId)) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const reviewsSpot = await Review.findAll({
        where: {spotId},
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                required: false,
                attributes: ['id', 'url']
            }
        ]
    });

    res.json({'Reviews': reviewsSpot});
});




// Creates and returns a new spot.
router.post('/', requireAuth, async (req, res, next) => {
    
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    const spotNew = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });
    
    res.status(201);
    res.json(spotNew);
});

// Create and return a new booking from a spot specified by id.
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {spotId} = req.params;
    const {startDate, endDate} = req.body;

    const spot = await Spot.findOne({
        where: {id: spotId},
        attributes: ['id', 'ownerId'],
        include: {
            model: Booking,
            attributes: ['startDate', 'endDate']
        }
    });

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId === user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    let errorFlag = false;
    const errors = {};
        
    for (let booking of spot['Bookings']) {
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
            const err = new Error('Sorry, this spot is already booked for the specified dates');
            err.status = 403;
            err.errors = errors;
            return next(err);
        }
    }

    const bookingNew = await Booking.create({
        spotId,
        userId: user.id,
        startDate,
        endDate
    });

    res.status(201);
    res.json(bookingNew);
});

// Create and return a new review for a spot specified by id.
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {spotId} = req.params;
    const {review, stars} = req.body;

    const spot = await Spot.findOne({where: {id: spotId}});

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const userReview = await Review.findOne({
        where: {
            spotId,
            userId: user.id
        }
    });

    if (userReview) {
        const err = new Error("User already has a review for this spot");
        err.status = 500;
        return next(err);
    }
    
    const reviewNew = await spot.createReview({
        userId: user.id,
        spotId,
        review,
        stars
    });

    res.status(201);
    res.json(reviewNew);
});

// Create and return a new image for a spot specified by id.
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const {user} = req;
    const { spotId } = req.params;
    const { url, preview} = req.body;

    const spot = await Spot.findOne({where: {id: spotId}});

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const spotImageNew = await spot.createSpotImage({
        url,
        preview
    });

    const safeImage = {
        id: spotImageNew.id,
        url: spotImageNew.url,
        preview: spotImageNew.preview
    }

    res.status(201);
    res.json(safeImage);
});


// Updates and returns an existing spot.
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    const spotEdit = await Spot.findOne({where: {id: spotId}});

    if (!spotEdit) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
    
    if (spotEdit.ownerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    spotEdit.set({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    await spotEdit.save();

    res.json(spotEdit);
});

// Deletes an existing spot.
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const { spotId } = req.params;

    const spotDelete = await Spot.findByPk(spotId);

    if (!spotDelete) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (spotDelete.ownerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    
    await spotDelete.destroy();

    res.json({message: "Successfully deleted"});
});


module.exports = router;
const express = require('express');
const router = express.Router();
const pagination = require('../../utils/pagination');
const { requireAuth }  = require('../../utils/auth');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { Op } = require('sequelize');

// Returns all the spots
router.get('/', pagination, async (req, res, next) => {
    const limit = res.locals.limit;
    const offset = res.locals.offset;

    const spotsAll = await Spot.findAll({
        subQuery: false,
        attributes: {
            include: [
                // Set Average Rating
                [
                    Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                    'avgRating'
                ],
                //Set preview Image
                [
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
                ],
            ]
        },
        // Required for avgRating
        include: {
            model: Review,
            required: false,
            attributes: []
        },
        group: ['Spot.id'],
        // For future queries
        // where
        // order: [['name', 'ASC']],
        limit,
        offset
    });

    
    res.json(spotsAll);
});

// Returns all the spots owned by the current user.
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const where = {};

    //Set restraint to current user
    where.ownerId = user.id;
    
    const spotsUser = await Spot.findAll({
        subQuery: false,
        attributes: {
            include: [
                // Set avgRating
                [
                    Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                    'avgRating'
                ],
                // Set previewImage
                [
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
                ],
            ]
        },
        // Required for avgRating
        include: {
            model: Review,
            required: false,
            attributes: []
        },
        group: ['Spot.id'],
        where
        // For future queries
        // order: [['name', 'ASC']],
        // limit,
        // offset
    });

    res.json(spotsUser);
});

// Returns the details of a spot specified by its id.
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;
    const where = {};

    //Set restraint to specified ID
    where.id = parseInt(spotId);
    
    const spot = await Spot.findAll({
        subQuery: false,
        attributes: {
            include: [
                // Set numReviews
                [
                    Sequelize.fn('COUNT', Sequelize.col('Reviews.stars')),
                    'numReviews'
                ],
                // Set avgRating
                [
                    Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                    'avgRating'
                ]
            ]
        },
        include: [
            // Required for numReviews and avgRating
            {
                model: Review,
                required: false,
                attributes: []
            },
            // Adds SpotImages
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            // Adds Owner
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
        group: ['Spot.id'],
        where
        // For future queries
        // order: [['name', 'ASC']],
        // limit,
        // offset
    });

    res.json(spot);
});

// Return all the bookings for a spot specified by id.
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {spotId} = req.params;

    const spotUserOwned = await Spot.findOne({
        where: {
            id: spotId,
            ownerId: user.id
        },
        attributes: ['id']
    })

    const bookingsSpot = (spotUserOwned) ? 
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

    // Query reviews based on spot
    const reviewsSpot = await Review.findAll({
        where: {spotId},

        // Include user and review images
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    res.json(reviewsSpot);
});




// Creates and returns a new spot.
router.post('/', requireAuth, async (req, res, next) => {
    const { user } = req;

    // Deconstruct variables form body
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    // Create new spot using userId and body variables
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

    res.json(spotNew);
});

// Create and return a new booking from a spot specified by id.
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {spotId} = req.params;
    const {startDate, endDate} = req.body;

    const bookingNew = await Booking.create({
        spotId,
        userId: user.id,
        startDate,
        endDate
    });

    res.json(bookingNew);
});

// Create and return a new review for a spot specified by id.
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {spotId} = req.params;
    const {review, stars} = req.body;

    //Query spot based on spotId
    const spot = await Spot.findOne({where: {id: spotId}});

    //Create new review
    const reviewNew = await spot.createReview({
        userId: user.id,
        spotId,
        review,
        stars
    });

    res.json(reviewNew);
});

// Create and return a new image for a spot specified by id.
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { url, preview} = req.body;

    const spot = await Spot.findOne({where: {id: spotId}});

    const spotImageNew = await spot.createSpotImage({
        url,
        preview
    });

    const safeImage = {
        id: spotImageNew.id,
        url: spotImageNew.url,
        preview: spotImageNew.preview
    }

    res.json(safeImage);
});


// Updates and returns an existing spot.
router.put('/:spotId', requireAuth, async (req, res, next) => {
    // Deconstruct variables from body and params
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    // Query, edit, and save specified spot
    const spotEdit = await Spot.findOne({where: {id: spotId}});

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
    // Deconstruct spotId from params
    const { spotId } = req.params;

    // Query and delete specified spot
    const spotDelete = await Spot.findOne({where: {id: spotId}});
    
    await spotDelete.destroy();

    res.json({message: "Successfully deleted"});
});


module.exports = router;
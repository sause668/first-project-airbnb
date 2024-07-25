const express = require('express');
const router = express.Router();
const pagination = require('../../utils/pagination');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { Spot, Review, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

// Returns all the spots
router.get('/', async (req, res, next) => {
    const spotsAll = await Spot.findAll({
        subQuery: false,
        attributes: {
            include: [
                [
                    Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                    'avgRating'
                ],
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
        include: {
            model: Review,
            required: false,
            attributes: []
        },
        group: ['Spot.id'],
        // where
        // order: [['name', 'ASC']],
        // limit,
        // offset
    });

    
    res.json(spotsAll);
});

// Returns all the spots owned by the current user.
router.get('/current', async (req, res, next) => {
    
});

// Returns the details of a spot specified by its id.
router.get('/:spotId', async (req, res, next) => {
    
});

// Return all the bookings for a spot specified by id.
router.get('/:spotId/bookings', async (req, res, next) => {
    
});

// Returns all the reviews that belong to a spot specified by id.
router.get('/:spotId/reviews', async (req, res, next) => {
    
});




// Creates and returns a new spot.
router.post('/', async (req, res, next) => {
    
});

// Create and return a new booking from a spot specified by id.
router.post('/:spotId/bookings', async (req, res, next) => {
    
});

// Create and return a new review for a spot specified by id.
router.post('/:spotId/reviews', async (req, res, next) => {
    
});

// Create and return a new image for a spot specified by id.
router.post('/:spotId/images', async (req, res, next) => {
    
});


// Updates and returns an existing spot.
router.put('/:spotId', async (req, res, next) => {
    
});

// Deletes an existing spot.
router.delete('/:spotId', async (req, res, next) => {
    
});


module.exports = router;
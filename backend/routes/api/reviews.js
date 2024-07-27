const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
// const pagination = require('../utils/pagination');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { Review, Spot, ReviewImage, User } = require('../../db/models');
const { Op } = require('sequelize');

// Returns all the reviews written by the current user.
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    // Query reviews by userId
    const reviewsUser = await Review.findAll({
        where: {userId: user.id},
        // Include User, Spot and ReviewImages associated with Review
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
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
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    res.json(reviewsUser);
});

// Create and return a new image for a review specified by id.
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const {reviewId} = req.params;
    const {url} = req.body;

    // Query review based on reviewId
    const review = await Review.findOne({where: {id: reviewId}});

    // Add new review image
    const reviewImageNew = await review.createReviewImage({
        reviewId,
        url
    });
    
    const safeReviewImage = {
        id: reviewImageNew.id,
        url: reviewImageNew.url
    }

    res.json(safeReviewImage);
});

// Update and return an existing review.
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const {reviewId} = req.params;
    const {review, stars} = req.body;

    const reviewEdit = await Review.findOne({where: {id: reviewId}});

    reviewEdit.set({
        review,
        stars
    });

    await reviewEdit.save();

    res.json(reviewEdit);
});

// Delete an existing review.
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const {reviewId} = req.params;

    const reviewDelete = await Review.findOne({where: {id: reviewId}});

    await reviewDelete.destroy();

    res.json({message: 'Successfully deleted'});
});




module.exports = router;
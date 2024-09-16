const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
const { Sequelize } = require('sequelize');

// Import model(s)
const { Review, Spot, ReviewImage, User, SpotImage } = require('../../db/models');

// Returns all the reviews written by the current user.
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const reviewsUser = await Review.findAll({
        where: {userId: user.id},
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                subQuery: false,
                attributes: {
                    include: [
                        [
                            Sequelize.literal('"Spot->SpotImages"."url"'),
                            'previewImage'
                        ]
                    ],
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: SpotImage,
                    required: false,
                    attributes: [],
                    where: {
                        preview: true
                    }
                },
            },
            {
                model: ReviewImage,
                required: false,
                attributes: ['id', 'url']
            }
        ]
    });

    res.json({'Reviews': reviewsUser});
});

// Create and return a new image for a review specified by id.
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {reviewId} = req.params;
    const {url} = req.body;

    const review = await Review.findOne({
        where: {id: reviewId},
        include: ReviewImage,
    });

    if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (review.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    
    if (review['ReviewImages'].length >= 10) {
        const err = new Error("Maximum number of images for this resource was reached");
        err.status = 403;
        return next(err);
    }

    const reviewImageNew = await review.createReviewImage({
        reviewId,
        url
    });
    
    const safeReviewImage = {
        id: reviewImageNew.id,
        url: reviewImageNew.url
    }

    res.status(201);
    res.json(safeReviewImage);
});

// Update and return an existing review.
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {reviewId} = req.params;
    const {review, stars} = req.body;

    const reviewEdit = await Review.findOne({where: {id: reviewId}});

    if (!reviewEdit) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (reviewEdit.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    reviewEdit.set({
        review,
        stars
    });

    await reviewEdit.save();

    res.json(reviewEdit);
});

// Delete an existing review.
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {reviewId} = req.params;

    const reviewDelete = await Review.findByPk(reviewId);

    console.log(reviewDelete, user)

    if (!reviewDelete) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (reviewDelete.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    await reviewDelete.destroy();

    res.json({message: 'Successfully deleted'});
});




module.exports = router;
const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');

// Import model(s)
const { ReviewImage, Review } = require('../../db/models');

// Delete an existing image for a Review.
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {imageId} = req.params;

    const reviewImageDelete = await ReviewImage.findByPk(imageId);

    if (!reviewImageDelete) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return next(err);
    }

    const review = await reviewImageDelete.getReview();

    if (review.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    await reviewImageDelete.destroy();

    res.json({message: "Successfully deleted"});
});


module.exports = router;

// store.dispatch(spotActions.createSpot({
//     "address": "123 Should Exist Street",
//     "city": "San Frangoodtogo",
//     "state": "California",
//     "country": "United States of Valid Data",
//     "lat": 37.7645358,
//     "lng": -122.4730327,
//     "name": "The Good Spot",
//     "description": "Place where valid data can stay",
//     "price": 123
// }))
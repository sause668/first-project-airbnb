const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');

// Import model(s)
const { ReviewImage } = require('../../db/models');

// Delete an existing image for a Review.
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {imageId} = req.params;

    const reviewImageDelete = await ReviewImage.findOne({where: {id: imageId}});

    if (!reviewImageDelete) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (reviewImageDelete.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    await reviewImageDelete.destroy();

    res.json({message: "Successfully deleted"});
});


module.exports = router;
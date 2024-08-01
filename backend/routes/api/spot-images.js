const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');

// Import model(s)
const { SpotImage, Spot } = require('../../db/models');

// Delete an existing image for a Spot.
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const {imageId} = req.params;

    const spotImageDelete = await SpotImage.findOne({
        where: {id: imageId},
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    });

    if (!spotImageDelete) {
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (spotImageDelete['Spot'].ownerId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    await spotImageDelete.destroy();

    res.json({message: "Successfully deleted"});
});


module.exports = router;
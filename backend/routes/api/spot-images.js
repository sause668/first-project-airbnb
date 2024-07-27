const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
// const pagination = require('../utils/pagination');
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

// Delete an existing image for a Spot.
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {imageId} = req.params;

    const SpotImageDelete = await SpotImage.findOne({where: {id: imageId}});

    await SpotImageDelete.destroy();

    res.json({message: "Successfully deleted"});
});


module.exports = router;
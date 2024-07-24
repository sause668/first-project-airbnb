const express = require('express');
const router = express.Router();
// const pagination = require('../utils/pagination');
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');

// Delete an existing image for a Review.
router.delete('/:imageId', async (req, res, next) => {
    
});


module.exports = router;
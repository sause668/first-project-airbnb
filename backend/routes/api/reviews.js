const express = require('express');
const router = express.Router();
// const pagination = require('../utils/pagination');
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

// Import model(s)
const { Review } = require('../../db/models');
const { Op } = require('sequelize');

// Returns all the reviews written by the current user.
router.get('/current', async (req, res, next) => {
    
});

// Create and return a new image for a review specified by id.
router.post('/:reviewId/images', async (req, res, next) => {
    
});

// Update and return an existing review.
router.put('/:reviewId', async (req, res, next) => {
    
});

// Delete an existing review.
router.delete('/:reviewId', async (req, res, next) => {
    
});




module.exports = router;
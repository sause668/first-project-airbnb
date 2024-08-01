const express = require('express');

const pagination = (req, res, next) => {
    let {page, size} = req.query;
    page = page || 1;
    size = size || 20;

    let limit;
    let offset;
    if (page == 0 && size == 0) {
        limit = 0;
        offset = 0;
    } else if (page >= 1 && size >= 1 && size <= 20) {
        limit = size;
        offset = (page - 1) * size;
    } else {
        const err = new Error('Requires valid page and size params');
        err.status = 400;
        return next(err);
    }

    res.locals.limit = limit;
    res.locals.offset = offset;

    next()
}

module.exports = pagination;
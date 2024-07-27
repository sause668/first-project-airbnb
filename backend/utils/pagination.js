const express = require('express');

const pagination = (req, res, next) => {
    let errorResult = { errors: [], count: 0, pageCount: 0 };

    // Use query params for page & size
    let {page, size} = req.query;
    page = page ? page:1;
    size = size ? size:20;

    // Calculate limit and offset
    // Special case to return all students (page=0, size=0)
    let limit;
    let offset;
    if (page == 0 && size == 0) {
        limit = 0;
        offset = 0;
    } else if (page >= 1 && size >= 1 && size <= 200) {
        limit = size;
        offset = (page - 1) * size;
    } else {
        errorResult.errors.push({ message: 'Requires valid page and size params' });
    }

    res.locals.limit = limit;
    res.locals.offset = offset;

    if (errorResult.errors.length) {
        res.status = 400;
        res.json(errorResult);
    }

    next()
}

module.exports = pagination;
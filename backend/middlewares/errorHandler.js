const createError = require('http-errors');
const http = require('http');

const errorHandler404 = (req, res, next) => next(createError(404, 'Route not found'));

function errorHandler(err, req, res, next) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        status,
        statusText: http.STATUS_CODES[status],
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development'
            ? err
            : undefined
    });
}

module.exports = { errorHandler404, errorHandler };
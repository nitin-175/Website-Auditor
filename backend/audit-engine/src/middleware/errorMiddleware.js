const logger = require("../utils/logger");

function errorMiddleware(err, req, res, next) {
    logger.error(
        `${req.method} ${req.originalUrl} - ${err.message}`,
        err.stack
    );

    let statusCode = err.statusCode || 500;

    /*
     * Never expose internal error details as a 500 response.
     */
    if (statusCode < 400 || statusCode > 599) {
        statusCode = 500;
    }

    const response = {
        success: false,
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message
    };

    res.status(statusCode).json(response);
}

module.exports = errorMiddleware;
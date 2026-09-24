import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    console.error('5. errorHandler', error);
    if (res.headersSent) return;
    res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        requestId: req.requestId,
    });
};

export default errorHandler;

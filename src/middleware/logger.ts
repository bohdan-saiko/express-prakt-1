import type { RequestHandler } from 'express';

const logger: RequestHandler = (req, res, next) => {
    console.log('2. logger');
    res.on('finish', () => {
        const elapsedMs = Date.now() - req.requestStartedAt;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedMs}ms requestId=${req.requestId}`);
    });
    next();
};

export default logger;

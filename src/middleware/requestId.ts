import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const requestId: RequestHandler = (req, res, next) => {
    console.log('1. requestId');
    req.requestId = randomUUID();
    req.requestStartedAt = Date.now();
    res.setHeader('X-Request-Id', req.requestId);
    next();
};

export default requestId;

import type { RequestHandler } from 'express';

const notFound: RequestHandler = (req, res) => {
    console.log('4. notFound');
    res.status(404).json({
        statusCode: 404,
        message: 'Route not found',
        requestId: req.requestId,
    });
};

export default notFound;

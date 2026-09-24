import express from 'express';
import eventsRouter from './routes/events.router.js';
import requestId from './middleware/requestId.js';
import logger from './middleware/logger.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import type { Request, Response } from 'express';

const app = express();

// Request context and logging must be available to every route and error response.
app.use(requestId);
app.use(logger);
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'campushub-api', timestamp: Date.now() });
});

app.use('/api/events', eventsRouter);

// Keep these last: unmatched requests fall through, and errors are forwarded here.
app.use(notFound);
app.use(errorHandler);

export default app;

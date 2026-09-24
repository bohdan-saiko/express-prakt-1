import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { readEvents, writeEvents } from '../utils/fileEventStore.js';

const router = Router();

// Shows when a request has entered this router.
router.use((_req: Request, _res: Response, next: NextFunction) => {
    console.log('3. router');
    next();
});

router.get('/error/test', (_req: Request, _res: Response, next: NextFunction) => {
    next(new Error('Test error'));
});

router.get('/', async (_req: Request, res: Response) => {
    res.status(200).json(await readEvents());
});

router.get('/:id', async (req: Request, res: Response) => {
    const event = (await readEvents()).find((item) => item.id === req.params.id);
    if (!event) {
        res.status(404).json({ statusCode: 404, message: 'Event not found', requestId: req.requestId });
        return;
    }
    res.status(200).json(event);
});

router.post('/', async (req: Request, res: Response) => {
    const { title, date } = req.body as { title?: unknown; date?: unknown };
    if (typeof title !== 'string' || !title.trim() || typeof date !== 'string' || !date.trim()) {
        res.status(400).json({ statusCode: 400, message: 'Fields title and date are required', requestId: req.requestId });
        return;
    }

    const events = await readEvents();
    const newEvent = { id: randomUUID(), title: title.trim(), date: date.trim() };
    events.push(newEvent);
    await writeEvents(events);
    res.status(201).json(newEvent);
});

router.patch('/:id', async (req: Request, res: Response) => {
    const events = await readEvents();
    const event = events.find((item) => item.id === req.params.id);
    if (!event) {
        res.status(404).json({ statusCode: 404, message: 'Event not found', requestId: req.requestId });
        return;
    }

    const { title, date } = req.body as { title?: unknown; date?: unknown };
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
        res.status(400).json({ statusCode: 400, message: 'title must be a non-empty string', requestId: req.requestId });
        return;
    }
    if (date !== undefined && (typeof date !== 'string' || !date.trim())) {
        res.status(400).json({ statusCode: 400, message: 'date must be a non-empty string', requestId: req.requestId });
        return;
    }
    if (title !== undefined) event.title = title.trim();
    if (date !== undefined) event.date = date.trim();
    await writeEvents(events);
    res.status(200).json(event);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const events = await readEvents();
    const index = events.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ statusCode: 404, message: 'Event not found', requestId: req.requestId });
        return;
    }
    const [deleted] = events.splice(index, 1);
    await writeEvents(events);
    res.status(200).json(deleted);
});

export default router;

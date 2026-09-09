import express from 'express';
import { readEvents, writeEvents } from './utils/fileEventStore.js';
import { randomUUID } from 'crypto';

import type { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    const timestamp = Date.now();
    res.status(200).json({ status: "ok", service: "campushub-api", timestamp });
});

app.get('/api/events', async (req: Request, res: Response) => {
    try {
        const events = await readEvents();
        res.status(200).json(events);
    } catch (err) {
        console.error("Помилка читання подій з файлу:", err);
        res.status(500).json({ message: "Не вдалося прочитати або зберегти події" });
    }
});
app.post('/api/events', async (req: Request, res: Response) => {
    try {
        const { title, date } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: "Поля title та date є обов'язковими" });
        }

        const events = await readEvents();

        const newEvent = {
            id: String(events.length + 1),
            title,
            date
        };

        events.push(newEvent);
        await writeEvents(events);

        res.status(201).json(newEvent);
    } catch (err) {
        console.error("Помилка збереження події у файл:", err);
        res.status(500).json({ message: "Не вдалося прочитати або зберегти події" });
    }
});

export default app;
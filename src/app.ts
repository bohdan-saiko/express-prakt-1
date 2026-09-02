import express from 'express';

import type { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    const timestamp = Date.now();
    res.status(200).json({ status: "ok", service: "campushub-api", timestamp });
});

export default app;
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../data/events.json');

export interface Event {
    id: string;
    title: string;
    date: string;
}

export async function readEvents(): Promise<Event[]> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const data = await fs.readFile(filePath, 'utf-8');
    
    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data) as Event[];
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as { code: string }).code === 'ENOENT') {
        return [];
      }
    }
    throw error;
  }
}

export async function writeEvents(events: Event[]): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(filePath, JSON.stringify(events, null, 2), 'utf-8');
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import { getContainer } from './cosmos.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const mem = [];

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/usecases', async (req, res) => {
  const item = { id: randomUUID(), createdAt: new Date().toISOString(), ...req.body };
  const container = getContainer();
  if (container) {
    await container.items.create(item);
  } else {
    mem.push(item);
  }
  res.status(201).json(item);
});

app.get('/api/usecases', async (_req, res) => {
  const container = getContainer();
  if (container) {
    const { resources } = await container.items.query('SELECT * FROM c ORDER BY c.createdAt DESC').fetchAll();
    return res.json(resources);
  }
  res.json(mem);
});

app.listen(process.env.PORT || 3000, () => console.log('API running on 3000'));

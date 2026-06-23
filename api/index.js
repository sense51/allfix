import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

app.all('/api/*', (req, res) => {
  res.json({ status: 'ok', path: req.path, method: req.method });
});

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', db: 'no-db' });
});

export default app;

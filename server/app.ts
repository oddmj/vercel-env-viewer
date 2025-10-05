import express from 'express';
import { Command } from 'commander';
import handler from './handler.js';
import path from 'path';

const program = new Command();

program
  .name('vercel-env-viewer')
  .version('0.0.1')
  .option('-p, --port <number>', 'port number to run the server on', '3345')
  .parse();

const options = program.opts();

const app = express();
const port = parseInt(options.port || '3345', 10);

app.use(express.static(path.join(import.meta.dirname, 'public')));

app.get('/api/envs', handler);

app.listen(port, () => {
  console.log(`vercel-env-viewer is running on http://localhost:${port}`);
});

// api.ts at root level
import app from './index';
import { createServer } from 'http';

export default function handler(req: any, res: any) {
  const server = createServer(app);
  server.emit('request', req, res);
}

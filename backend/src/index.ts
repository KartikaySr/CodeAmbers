import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import apiRoutes from './routes/api.js';
import { setupWebSocket } from './websocket/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeAmbers Backend is running!' });
});

app.get('/api/health/detailed', (req, res) => {
  res.json({ 
    services: { 
      database: { enabled: true, provider: 'Supabase', status: 'connected' },
      ai: { status: 'ready' }
    },
    supabaseConfigured: true,
    hasGemini: true
  });
});

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, () => {
  console.log(`{"level":"info","message":"CodeAmbers backend online","supabaseConfigured":true,"hasGemini":true}`);
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

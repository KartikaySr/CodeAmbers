import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const port = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeAmbers Backend is running!' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

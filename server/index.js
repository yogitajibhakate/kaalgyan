import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', routes);

// Base Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'kaalgyan-api' });
});

app.listen(PORT, () => {
  console.log(`[KaalGyan Server] Running on http://localhost:${PORT}`);
});
export default app;

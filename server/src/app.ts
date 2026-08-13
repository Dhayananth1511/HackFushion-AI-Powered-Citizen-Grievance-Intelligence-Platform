import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { complaintRouter } from './routes/complaints';
import { incidentRouter } from './routes/incidents';
import { aiRouter } from './routes/ai';
import { dashboardRouter } from './routes/dashboard';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'CivicAI API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/complaints', complaintRouter);
app.use('/api/incidents', incidentRouter);
app.use('/api/ai', aiRouter);
app.use('/api/dashboard', dashboardRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🏛️  CivicAI Server running on http://localhost:${PORT}`);
  console.log(`📋 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/health\n`);
});

export default app;

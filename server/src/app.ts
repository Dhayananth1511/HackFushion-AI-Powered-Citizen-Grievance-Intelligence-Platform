import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { complaintRouter } from './routes/complaints';
import { incidentRouter } from './routes/incidents';
import { aiRouter } from './routes/ai';
import { dashboardRouter } from './routes/dashboard';

import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
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

// Serve static client assets in production / combined deployment
const clientDistPath = path.join(process.cwd(), 'client', 'dist');
const altClientDistPath = path.join(__dirname, '../../client/dist');
const distFolder = fs.existsSync(clientDistPath) ? clientDistPath : fs.existsSync(altClientDistPath) ? altClientDistPath : null;

if (distFolder) {
  app.use(express.static(distFolder));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/health')) {
      return res.sendFile(path.join(distFolder, 'index.html'));
    }
    res.status(404).json({ success: false, message: 'Route not found' });
  });
} else {
  // 404 handler for API mode only
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

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

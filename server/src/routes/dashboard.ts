import express from 'express';
import { getOfficerStats, getCitizenStats } from '../services/dataService';

export const dashboardRouter = express.Router();

dashboardRouter.get('/officer', (_req, res) => {
  res.json({ success: true, data: getOfficerStats() });
});

dashboardRouter.get('/citizen/:id', (req, res) => {
  res.json({ success: true, data: getCitizenStats(req.params.id) });
});

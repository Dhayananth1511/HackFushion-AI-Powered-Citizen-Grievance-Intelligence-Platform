import express from 'express';
import { runAIOrchestrator } from '../services/ai/orchestrator';
import { getAllIncidents } from '../services/dataService';

export const aiRouter = express.Router();

// POST — analyze complaint text with AI orchestrator
aiRouter.post('/analyze', (req, res) => {
  try {
    const { text, ward, citizenId } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required' });

    const incidents = getAllIncidents();
    const result = runAIOrchestrator(text, ward, incidents, []);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

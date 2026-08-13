import express from 'express';
import * as svc from '../services/dataService';

export const complaintRouter = express.Router();

// GET all complaints
complaintRouter.get('/', (_req, res) => {
  res.json({ success: true, data: svc.getAllComplaints() });
});

// GET complaint by ID
complaintRouter.get('/:id', (req, res) => {
  const complaint = svc.getComplaintById(req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
  res.json({ success: true, data: complaint });
});

// POST — submit new complaint (triggers AI orchestrator)
complaintRouter.post('/', (req, res) => {
  try {
    const { text, ward, citizenName, citizenId, hasImage, hasLocation } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Complaint text is required' });

    const result = svc.submitComplaint({ text, ward, citizenName, citizenId, hasImage, hasLocation });
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

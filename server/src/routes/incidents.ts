import express from 'express';
import * as svc from '../services/dataService';

export const incidentRouter = express.Router();

// GET all incidents
incidentRouter.get('/', (_req, res) => {
  res.json({ success: true, data: svc.getAllIncidents() });
});

// GET incident by ID
incidentRouter.get('/:id', (req, res) => {
  const incident = svc.getIncidentById(req.params.id);
  if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
  res.json({ success: true, data: incident });
});

// POST — officer accepts incident
incidentRouter.post('/:id/accept', (req, res) => {
  const result = svc.acceptIncident(req.params.id);
  if (!result) return res.status(404).json({ success: false, message: 'Incident not found' });
  res.json({ success: true, data: result, message: 'Incident accepted' });
});

// POST — update status (in_progress, resolved, etc.)
incidentRouter.post('/:id/status', (req, res) => {
  const { status, note } = req.body;
  if (!status) return res.status(400).json({ success: false, message: 'Status is required' });
  const result = svc.updateIncidentStatus(req.params.id, status, note);
  if (!result) return res.status(404).json({ success: false, message: 'Incident not found' });
  res.json({ success: true, data: result, message: `Status updated to ${status}` });
});

// POST — mark as resolved
incidentRouter.post('/:id/resolve', (req, res) => {
  const result = svc.updateIncidentStatus(req.params.id, 'resolved', 'Officer marked as resolved');
  if (!result) return res.status(404).json({ success: false, message: 'Incident not found' });
  res.json({ success: true, data: result, message: 'Incident marked as resolved. Citizen verification pending.' });
});

// POST — citizen verification (YES or NO)
incidentRouter.post('/:id/verify', (req, res) => {
  const { confirmed } = req.body;
  const result = svc.verifyResolution(req.params.id, confirmed === true);
  if (!result) return res.status(404).json({ success: false, message: 'Incident not found' });
  const message = confirmed
    ? 'Incident closed. Thank you for confirming!'
    : 'Incident reopened. Officer has been alerted. Priority increased.';
  res.json({ success: true, data: result, message });
});

// POST — reopen incident
incidentRouter.post('/:id/reopen', (req, res) => {
  const result = svc.updateIncidentStatus(req.params.id, 'reopened', 'Citizen reported still unresolved');
  if (!result) return res.status(404).json({ success: false, message: 'Incident not found' });
  res.json({ success: true, data: result, message: 'Incident reopened and officer alerted.' });
});

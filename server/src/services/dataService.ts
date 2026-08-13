import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { runAIOrchestrator, AIAnalysisResult } from './ai/orchestrator';

const DATA_PATH = path.join(__dirname, 'data', 'demoData.json');

function readData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function generateId(prefix: string): string {
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${rand}`;
}

// ─── Complaint Service ───────────────────────────────────────────────────────

export function getAllComplaints() {
  return readData().complaints;
}

export function getComplaintById(id: string) {
  const data = readData();
  return data.complaints.find((c: any) => c.id === id) || null;
}

export function submitComplaint(body: {
  text: string;
  ward?: string;
  citizenName?: string;
  citizenId?: string;
  hasImage?: boolean;
  hasLocation?: boolean;
}): { complaint: any; analysis: AIAnalysisResult } {
  const data = readData();

  // Run AI orchestrator
  const existingCitizenComplaints: string[] = data.complaints
    .filter((c: any) => c.citizenId === (body.citizenId || 'NEW'))
    .map((c: any) => c.text);

  const analysis = runAIOrchestrator(body.text, body.ward, data.incidents, existingCitizenComplaints);

  // Create complaint record
  const complaintId = `CMP${String(data.complaints.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();

  const newComplaint: any = {
    id: complaintId,
    citizenId: body.citizenId || 'DEMO_CITIZEN',
    citizenName: body.citizenName || 'Demo Citizen',
    text: body.text,
    language: analysis.language,
    category: analysis.category,
    severity: analysis.severity,
    ward: analysis.ward,
    address: `${analysis.ward}, Chennai`,
    coordinates: [80.2709, 13.0828],
    hasImage: body.hasImage || false,
    hasLocation: body.hasLocation || false,
    isDuplicate: analysis.isDuplicate,
    incidentId: analysis.relatedIncident || null,
    status: analysis.relatedIncident ? 'linked' : 'new',
    aiAnalysis: analysis,
    createdAt: now
  };

  // If related incident found — link and update count
  if (analysis.relatedIncident) {
    const incident = data.incidents.find((i: any) => i.id === analysis.relatedIncident);
    if (incident) {
      incident.complaintIds.push(complaintId);
      incident.affectedCitizenCount += 1;
      incident.priorityScore = analysis.priority.score;
      incident.updatedAt = now;

      // Add timeline entry
      incident.timeline = incident.timeline || [];
    }
  } else {
    // Create new incident
    const newIncidentId = `INC-${Math.floor(Math.random() * 900) + 1100}`;
    const newIncident: any = {
      id: newIncidentId,
      title: analysis.issue,
      category: analysis.category,
      description: `New civic incident: ${analysis.issue} reported in ${analysis.ward}.`,
      ward: analysis.ward,
      address: `${analysis.ward}, Chennai`,
      coordinates: [80.2709, 13.0828],
      affectedRadius: 300,
      complaintIds: [complaintId],
      affectedCitizenCount: 1,
      priorityScore: analysis.priority.score,
      pressureScore: Math.round(analysis.priority.score * 0.9),
      confidenceScore: analysis.confidence,
      department: analysis.department.lead,
      supportingDepartment: analysis.department.supporting,
      assignedOfficer: null,
      status: 'detected',
      priorityLevel: analysis.priority.level,
      aiReasoning: analysis.department.reason,
      timeline: [
        { step: 'Complaint Received', status: 'done', time: now, description: 'First complaint registered' },
        { step: 'AI Analysis', status: 'done', time: now, description: 'AI orchestrator processed complaint' },
        { step: 'Incident Created', status: 'done', time: now, description: `${newIncidentId} created` },
        { step: 'Department Assigned', status: 'active', time: now, description: `Routing to ${analysis.department.lead}` },
        { step: 'Officer Accepted', status: 'pending', time: null, description: 'Awaiting officer acceptance' },
        { step: 'Work In Progress', status: 'pending', time: null, description: 'Pending officer action' },
        { step: 'Resolved', status: 'pending', time: null, description: 'Pending resolution' },
        { step: 'Citizen Verification', status: 'pending', time: null, description: 'Pending citizen confirmation' }
      ],
      createdAt: now,
      updatedAt: now
    };
    newComplaint.incidentId = newIncidentId;
    data.incidents.push(newIncident);
  }

  data.complaints.push(newComplaint);
  writeData(data);

  return { complaint: newComplaint, analysis };
}

// ─── Incident Service ────────────────────────────────────────────────────────

export function getAllIncidents() {
  return readData().incidents;
}

export function getIncidentById(id: string) {
  const data = readData();
  return data.incidents.find((i: any) => i.id === id) || null;
}

export function acceptIncident(id: string) {
  const data = readData();
  const incident = data.incidents.find((i: any) => i.id === id);
  if (!incident) return null;

  incident.status = 'accepted';
  const now = new Date().toISOString();

  // Update timeline
  const step = incident.timeline?.find((t: any) => t.step === 'Officer Accepted');
  if (step) { step.status = 'done'; step.time = now; step.description = 'Officer accepted the incident'; }

  incident.updatedAt = now;
  writeData(data);
  return incident;
}

export function updateIncidentStatus(id: string, status: string, note?: string) {
  const data = readData();
  const incident = data.incidents.find((i: any) => i.id === id);
  if (!incident) return null;

  const now = new Date().toISOString();
  incident.status = status;
  incident.updatedAt = now;

  // Map status to timeline step
  const stepMap: Record<string, string> = {
    'in_progress': 'Work In Progress',
    'resolved': 'Resolved',
    'closed': 'Citizen Verification',
    'reopened': 'Complaint Received'
  };

  const stepLabel = stepMap[status];
  if (stepLabel && incident.timeline) {
    const step = incident.timeline.find((t: any) => t.step === stepLabel || (status === 'in_progress' && t.step === 'Repair In Progress'));
    if (step) { step.status = 'done'; step.time = now; step.description = note || step.description; }
  }

  if (status === 'resolved') incident.resolvedAt = now;
  if (status === 'closed') incident.closedAt = now;
  if (status === 'reopened') {
    incident.reopenedAt = now;
    incident.priorityScore = Math.min(100, incident.priorityScore + 15);
    incident.escalationCount = (incident.escalationCount || 0) + 1;
    // Add reopen to timeline
    if (incident.timeline) {
      incident.timeline.push({
        step: 'Incident Reopened',
        status: 'done',
        time: now,
        description: 'Citizen reported issue still unresolved. Priority increased +15. Officer alerted.'
      });
    }
  }

  writeData(data);
  return incident;
}

export function verifyResolution(id: string, confirmed: boolean) {
  if (confirmed) {
    return updateIncidentStatus(id, 'monitoring', 'Citizen confirmed resolution');
  } else {
    return updateIncidentStatus(id, 'reopened', 'Citizen reported issue still unresolved');
  }
}

// ─── Dashboard Service ───────────────────────────────────────────────────────

export function getOfficerStats() {
  const data = readData();
  const incidents = data.incidents;
  return {
    activeIncidents: incidents.filter((i: any) => !['resolved', 'closed'].includes(i.status)).length,
    highPriority: incidents.filter((i: any) => i.priorityLevel === 'HIGH' || i.priorityLevel === 'CRITICAL').length,
    affectedCitizens: incidents.reduce((sum: number, i: any) => sum + i.affectedCitizenCount, 0),
    inProgress: incidents.filter((i: any) => i.status === 'in_progress').length,
    resolvedToday: incidents.filter((i: any) => i.status === 'resolved' || i.status === 'closed').length,
    reopened: incidents.filter((i: any) => i.status === 'reopened').length,
    totalComplaints: data.complaints.length,
    incidents
  };
}

export function getCitizenStats(citizenId: string) {
  const data = readData();
  const myComplaints = data.complaints.filter((c: any) => c.citizenId === citizenId);
  return {
    total: myComplaints.length,
    active: myComplaints.filter((c: any) => !['closed', 'resolved'].includes(c.status)).length,
    resolved: myComplaints.filter((c: any) => c.status === 'resolved' || c.status === 'closed').length,
    reopened: myComplaints.filter((c: any) => c.status === 'reopened').length,
    complaints: myComplaints
  };
}

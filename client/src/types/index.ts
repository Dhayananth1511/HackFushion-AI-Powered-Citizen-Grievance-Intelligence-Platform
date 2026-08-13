// ─── Shared Types ────────────────────────────────────────────────────────────

export type Language = 'Tamil' | 'English' | 'Tanglish';
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus =
  | 'detected' | 'assigned' | 'accepted' | 'in_progress'
  | 'resolved' | 'monitoring' | 'closed' | 'reopened' | 'escalated';

export interface TimelineStep {
  step: string;
  status: 'done' | 'active' | 'pending';
  time: string | null;
  description: string;
}

export interface PriorityBreakdown {
  label: string;
  score: number;
  max: number;
}

export interface AIAnalysis {
  language: Language;
  languageConfidence: number;
  category: string;
  issue: string;
  severity: string;
  timeReference: string;
  affectedPopulation: string;
  ward?: string;
  isDuplicate: boolean;
  relatedIncident?: string;
  relatedComplaintCount?: number;
  priority: {
    score: number;
    level: PriorityLevel;
    breakdown: PriorityBreakdown[];
    reasons: string[];
  };
  department: {
    lead: string;
    supporting?: string;
    reason: string;
    confidence: number;
  };
  confidence: number;
  steps: {
    agent: string;
    action: string;
    result: string;
    status: 'done' | 'processing' | 'pending';
  }[];
}

export interface Complaint {
  id: string;
  citizenId: string;
  citizenName: string;
  text: string;
  language: string;
  category: string;
  severity: string;
  ward: string;
  address: string;
  hasImage?: boolean;
  hasLocation?: boolean;
  isDuplicate: boolean;
  incidentId?: string;
  status: string;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  category: string;
  description: string;
  ward: string;
  address: string;
  affectedRadius?: number;
  complaintIds: string[];
  affectedCitizenCount: number;
  priorityScore: number;
  pressureScore: number;
  confidenceScore: number;
  semanticSimilarity?: number;
  spatialProximity?: number;
  temporalProximity?: number;
  department: string;
  supportingDepartment?: string;
  assignedOfficer?: string;
  status: IncidentStatus;
  priorityLevel: PriorityLevel;
  aiReasoning: string;
  timeline: TimelineStep[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  reopenedAt?: string;
  escalationCount?: number;
}

export interface SubmitComplaintPayload {
  text: string;
  ward?: string;
  citizenName?: string;
  citizenId?: string;
  hasImage?: boolean;
  hasLocation?: boolean;
}

export interface SubmitComplaintResponse {
  complaint: Complaint;
  analysis: AIAnalysis;
}

export interface OfficerStats {
  activeIncidents: number;
  highPriority: number;
  affectedCitizens: number;
  inProgress: number;
  resolvedToday: number;
  reopened: number;
  totalComplaints: number;
  incidents: Incident[];
}

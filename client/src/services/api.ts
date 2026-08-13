import axios from 'axios';
import type {
  Complaint, Incident, AIAnalysis, SubmitComplaintPayload,
  SubmitComplaintResponse, OfficerStats
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Complaints ───────────────────────────────────────────────────────────────
export const complaintsApi = {
  getAll: () => api.get<{ success: boolean; data: Complaint[] }>('/complaints').then(r => r.data.data),
  getById: (id: string) => api.get<{ success: boolean; data: Complaint }>(`/complaints/${id}`).then(r => r.data.data),
  submit: (payload: SubmitComplaintPayload) =>
    api.post<{ success: boolean; data: SubmitComplaintResponse }>('/complaints', payload).then(r => r.data.data),
};

// ─── Incidents ────────────────────────────────────────────────────────────────
export const incidentsApi = {
  getAll: () => api.get<{ success: boolean; data: Incident[] }>('/incidents').then(r => r.data.data),
  getById: (id: string) => api.get<{ success: boolean; data: Incident }>(`/incidents/${id}`).then(r => r.data.data),
  accept: (id: string) => api.post<{ success: boolean; data: Incident }>(`/incidents/${id}/accept`).then(r => r.data.data),
  updateStatus: (id: string, status: string, note?: string) =>
    api.post<{ success: boolean; data: Incident }>(`/incidents/${id}/status`, { status, note }).then(r => r.data.data),
  resolve: (id: string) => api.post<{ success: boolean; data: Incident }>(`/incidents/${id}/resolve`).then(r => r.data.data),
  verify: (id: string, confirmed: boolean) =>
    api.post<{ success: boolean; data: Incident; message: string }>(`/incidents/${id}/verify`, { confirmed }).then(r => r.data),
  reopen: (id: string) => api.post<{ success: boolean; data: Incident }>(`/incidents/${id}/reopen`).then(r => r.data.data),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiApi = {
  analyze: (text: string, ward?: string) =>
    api.post<{ success: boolean; data: AIAnalysis }>('/ai/analyze', { text, ward }).then(r => r.data.data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getOfficerStats: () => api.get<{ success: boolean; data: OfficerStats }>('/dashboard/officer').then(r => r.data.data),
  getCitizenStats: (citizenId: string) =>
    api.get<{ success: boolean; data: any }>(`/dashboard/citizen/${citizenId}`).then(r => r.data.data),
};

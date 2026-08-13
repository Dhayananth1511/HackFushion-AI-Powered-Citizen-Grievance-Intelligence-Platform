import { create } from 'zustand';
import type { Complaint, Incident, AIAnalysis } from '../types';

// ─── App / Role Store ─────────────────────────────────────────────────────────
type Role = 'citizen' | 'officer';

interface AppStore {
  role: Role;
  setRole: (role: Role) => void;
  killerDemoActive: boolean;
  killerDemoStep: number;
  startKillerDemo: () => void;
  nextDemoStep: () => void;
  stopKillerDemo: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  role: 'citizen',
  setRole: (role) => set({ role }),
  killerDemoActive: false,
  killerDemoStep: 0,
  startKillerDemo: () => set({ killerDemoActive: true, killerDemoStep: 0 }),
  nextDemoStep: () => set((s) => ({ killerDemoStep: s.killerDemoStep + 1 })),
  stopKillerDemo: () => set({ killerDemoActive: false, killerDemoStep: 0 }),
}));

// ─── Complaint Store ──────────────────────────────────────────────────────────
interface ComplaintStore {
  submittedComplaint: Complaint | null;
  aiAnalysis: AIAnalysis | null;
  currentText: string;
  selectedWard: string;
  hasImage: boolean;
  hasLocation: boolean;
  isSubmitting: boolean;
  isAnalyzing: boolean;
  aiCurrentStep: number;

  setComplaintText: (text: string) => void;
  setSelectedWard: (ward: string) => void;
  setHasImage: (v: boolean) => void;
  setHasLocation: (v: boolean) => void;
  setIsSubmitting: (v: boolean) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAiCurrentStep: (step: number) => void;
  setSubmittedComplaint: (c: Complaint, a: AIAnalysis) => void;
  reset: () => void;
}

export const useComplaintStore = create<ComplaintStore>((set) => ({
  submittedComplaint: null,
  aiAnalysis: null,
  currentText: '',
  selectedWard: '',
  hasImage: false,
  hasLocation: false,
  isSubmitting: false,
  isAnalyzing: false,
  aiCurrentStep: 0,

  setComplaintText: (text) => set({ currentText: text }),
  setSelectedWard: (ward) => set({ selectedWard: ward }),
  setHasImage: (v) => set({ hasImage: v }),
  setHasLocation: (v) => set({ hasLocation: v }),
  setIsSubmitting: (v) => set({ isSubmitting: v }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setAiCurrentStep: (step) => set({ aiCurrentStep: step }),
  setSubmittedComplaint: (c, a) => set({ submittedComplaint: c, aiAnalysis: a }),
  reset: () => set({
    submittedComplaint: null,
    aiAnalysis: null,
    currentText: '',
    selectedWard: '',
    hasImage: false,
    hasLocation: false,
    isSubmitting: false,
    isAnalyzing: false,
    aiCurrentStep: 0,
  }),
}));

// ─── Incident Store ───────────────────────────────────────────────────────────
interface IncidentStore {
  incidents: Incident[];
  selectedIncident: Incident | null;
  setIncidents: (incidents: Incident[]) => void;
  setSelectedIncident: (incident: Incident | null) => void;
  updateIncident: (updated: Incident) => void;
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: [],
  selectedIncident: null,
  setIncidents: (incidents) => set({ incidents }),
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  updateIncident: (updated) => set((state) => ({
    incidents: state.incidents.map(i => i.id === updated.id ? updated : i),
    selectedIncident: state.selectedIncident?.id === updated.id ? updated : state.selectedIncident,
  })),
}));

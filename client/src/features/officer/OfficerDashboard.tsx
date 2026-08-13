import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Users, BarChart3, MapPin, CheckCircle2,
  ArrowRight, Play, TrendingUp, Clock, Building2, FileText
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Button, Card, PriorityBadge, StatusBadge, StatCard } from '../../components/ui';
import { incidentsApi, dashboardApi } from '../../services/api';
import { useIncidentStore } from '../../store';
import type { Incident } from '../../types';

const DEMO_INCIDENTS: Incident[] = [
  {
    id: 'INC-1042', title: 'Water Supply Disruption', category: 'Water Supply',
    description: 'Complete water supply failure, burst pipeline.', ward: 'Ward 12', address: 'Anna Nagar, Ward 12',
    complaintIds: [], affectedCitizenCount: 48, priorityScore: 91, pressureScore: 85,
    confidenceScore: 96, department: 'Water Supply Department', assignedOfficer: 'Officer Ramesh Kumar',
    status: 'in_progress', priorityLevel: 'HIGH', aiReasoning: '',
    timeline: [], createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'INC-1038', title: 'Road Surface Damage', category: 'Road Damage',
    description: 'Severe pothole formation on main road.', ward: 'Ward 9', address: 'T Nagar, Ward 9',
    complaintIds: [], affectedCitizenCount: 31, priorityScore: 72, pressureScore: 65,
    confidenceScore: 88, department: 'Roads & Infrastructure', assignedOfficer: 'Officer Priya Selvam',
    status: 'assigned', priorityLevel: 'MEDIUM', aiReasoning: '',
    timeline: [], createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'INC-1032', title: 'Garbage Accumulation', category: 'Garbage',
    description: 'Large garbage pile — 5 days no collection.', ward: 'Ward 17', address: 'Adyar, Ward 17',
    complaintIds: [], affectedCitizenCount: 48, priorityScore: 78, pressureScore: 74,
    confidenceScore: 92, department: 'Sanitation Department', assignedOfficer: undefined,
    status: 'detected', priorityLevel: 'HIGH', aiReasoning: '',
    timeline: [], createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'INC-1029', title: 'Streetlight Failure', category: 'Streetlight',
    description: 'Multiple streetlights non-functional.', ward: 'Ward 5', address: 'Mylapore, Ward 5',
    complaintIds: [], affectedCitizenCount: 12, priorityScore: 45, pressureScore: 38,
    confidenceScore: 89, department: 'Electrical Department', assignedOfficer: 'Officer Kavitha M',
    status: 'resolved', priorityLevel: 'LOW', aiReasoning: '',
    timeline: [], createdAt: new Date(Date.now() - 96 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
];

export const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedIncident } = useIncidentStore();
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    incidentsApi.getAll().then(data => {
      if (data && data.length > 0) {
        setIncidents(data.sort((a, b) => b.priorityScore - a.priorityScore));
      }
    }).catch(err => console.error('Failed to load incidents', err));
  }, []);

  const stats = {
    active: incidents.filter(i => !['resolved', 'closed', 'monitoring'].includes(i.status)).length,
    high: incidents.filter(i => i.priorityLevel === 'HIGH').length,
    citizens: incidents.reduce((s, i) => s + i.affectedCitizenCount, 0),
    inProgress: incidents.filter(i => i.status === 'in_progress').length,
    resolved: incidents.filter(i => ['resolved', 'closed'].includes(i.status)).length,
    reopened: incidents.filter(i => i.status === 'reopened').length,
  };

  const handleAccept = async (incident: Incident) => {
    setUpdatingId(incident.id);
    try {
      await incidentsApi.accept(incident.id);
      setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, status: 'accepted' } : i));
    } catch {
      setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, status: 'accepted' } : i));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkInProgress = async (incident: Incident) => {
    setUpdatingId(incident.id);
    try {
      await incidentsApi.updateStatus(incident.id, 'in_progress', 'Officer started field work');
      setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, status: 'in_progress' } : i));
    } catch {
      setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, status: 'in_progress' } : i));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResolve = async (incident: Incident) => {
    setUpdatingId(incident.id);
    try {
      await incidentsApi.resolve(incident.id);
    } catch {}
    setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, status: 'resolved' } : i));
    setSelectedIncident({ ...incident, status: 'resolved' });
    setUpdatingId(null);
    setTimeout(() => navigate('/citizen/verify/INC-1042'), 800);
  };

  const getCategoryIcon = (cat: string) => {
    const map: Record<string, string> = {
      'Water Supply': '🚰', 'Road Damage': '🛣️', 'Garbage': '🗑️',
      'Streetlight': '💡', 'Drainage': '🌊', 'Traffic': '🚦'
    };
    return map[cat] || '🏛️';
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Officer Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage civic incidents · Track resolutions</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Active', value: stats.active, color: 'blue' },
            { label: 'High Priority', value: stats.high, color: 'red' },
            { label: 'Affected', value: stats.citizens, color: 'violet' },
            { label: 'In Progress', value: stats.inProgress, color: 'amber' },
            { label: 'Resolved', value: stats.resolved, color: 'green' },
            { label: 'Reopened', value: stats.reopened, color: 'orange' },
          ].map(({ label, value, color }) => (
            <Card key={label} className="p-3 text-center">
              <div className={`text-2xl font-black text-${color}-600 mb-0.5`}>{value}</div>
              <div className="text-xs text-slate-500 font-medium">{label}</div>
            </Card>
          ))}
        </div>

        {/* Incidents */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Active Incidents</h2>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {incidents.length} incidents
          </span>
        </div>

        <div className="space-y-4">
          {incidents.map((incident, idx) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card className={`overflow-hidden ${incident.priorityLevel === 'HIGH' && incident.status !== 'resolved' ? 'border-red-200 glow-red' : ''}`}>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Left */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xl">{getCategoryIcon(incident.category)}</span>
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {incident.id}
                        </span>
                        <PriorityBadge level={incident.priorityLevel} size="sm" />
                        <StatusBadge status={incident.status} />
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mb-1">{incident.title}</h3>
                      <p className="text-sm text-slate-500 mb-3">{incident.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {incident.ward}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {incident.affectedCitizenCount} citizens</span>
                        <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Priority {incident.priorityScore}/100</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {incident.department}</span>
                      </div>
                    </div>

                    {/* Right — Action buttons */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:w-36 flex-shrink-0">
                      {incident.status === 'in_progress' && incident.id === 'INC-1042' && (
                        <button
                          onClick={() => handleResolve(incident)}
                          disabled={updatingId === incident.id}
                          className="flex items-center justify-center gap-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors w-full"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {updatingId === incident.id ? 'Updating...' : 'Mark Resolved'}
                        </button>
                      )}
                      {(incident.status === 'detected' || incident.status === 'assigned') && (
                        <button
                          onClick={() => handleAccept(incident)}
                          disabled={updatingId === incident.id}
                          className="flex items-center justify-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors w-full"
                        >
                          <Play className="w-4 h-4" />
                          Accept
                        </button>
                      )}
                      {incident.status === 'accepted' && (
                        <button
                          onClick={() => handleMarkInProgress(incident)}
                          disabled={updatingId === incident.id}
                          className="flex items-center justify-center gap-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg transition-colors w-full"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Start Work
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectedIncident(incident); navigate(`/officer/incidents/${incident.id}`); }}
                        className="text-xs font-semibold border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 px-3 py-2 rounded-lg transition-colors w-full text-center"
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                </div>

                {/* Priority bar */}
                <div className="h-1 bg-slate-100">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      incident.priorityLevel === 'HIGH' ? 'bg-red-500' :
                      incident.priorityLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${incident.priorityScore}%` }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

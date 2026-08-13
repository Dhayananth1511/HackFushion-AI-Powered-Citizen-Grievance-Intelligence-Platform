import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Users, BarChart3, Building2,
  CheckCircle2, Clock, ChevronRight, Layers, TrendingUp
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Button, Card, PriorityBadge, StatusBadge } from '../../components/ui';
import { useComplaintStore } from '../../store';
import type { Incident } from '../../types';

const DEMO_INCIDENT: Incident = {
  id: 'INC-1042',
  title: 'Water Supply Disruption',
  category: 'Water Supply',
  description: 'Complete water supply failure affecting multiple streets in Ward 12. Primary cause: burst main pipeline near Anna Nagar junction.',
  ward: 'Ward 12',
  address: 'Anna Nagar, Ward 12',
  affectedRadius: 500,
  complaintIds: [],
  affectedCitizenCount: 48, // After new complaint
  priorityScore: 91,
  pressureScore: 85,
  confidenceScore: 96,
  semanticSimilarity: 94,
  spatialProximity: 96,
  temporalProximity: 91,
  department: 'Water Supply Department',
  supportingDepartment: 'Municipal Engineering',
  assignedOfficer: 'Officer Ramesh Kumar',
  status: 'in_progress',
  priorityLevel: 'HIGH',
  aiReasoning: '48 complaints from Ward 12 show high semantic similarity (94%) on water supply disruption. Spatial clustering confirms all complaints within 500m radius. Temporal spike in last 72 hours. Main pipeline burst likely cause.',
  timeline: [
    { step: 'Complaint Received', status: 'done', time: new Date(Date.now() - 3 * 3600000).toISOString(), description: 'First complaint registered' },
    { step: 'AI Analysis', status: 'done', time: new Date(Date.now() - 3 * 3600000 + 30000).toISOString(), description: 'AI orchestrator processed all complaints' },
    { step: 'Incident Created', status: 'done', time: new Date(Date.now() - 3 * 3600000 + 60000).toISOString(), description: 'INC-1042 created — 48 complaints clustered' },
    { step: 'Department Assigned', status: 'done', time: new Date(Date.now() - 2.5 * 3600000).toISOString(), description: 'Routed to Water Supply Department' },
    { step: 'Officer Accepted', status: 'done', time: new Date(Date.now() - 2 * 3600000).toISOString(), description: 'Officer Ramesh Kumar accepted incident' },
    { step: 'Field Investigation', status: 'done', time: new Date(Date.now() - 1.5 * 3600000).toISOString(), description: 'Team dispatched to Anna Nagar junction' },
    { step: 'Repair In Progress', status: 'active', time: new Date(Date.now() - 1 * 3600000).toISOString(), description: 'Pipeline repair work underway' },
    { step: 'Resolved', status: 'pending', time: null, description: 'Pending officer resolution' },
    { step: 'Citizen Verification', status: 'pending', time: null, description: 'Pending citizen confirmation' },
  ],
  createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
};

const formatTime = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const IncidentViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { aiAnalysis } = useComplaintStore();
  const [incident] = useState<Incident>(DEMO_INCIDENT);
  const isNewlyLinked = aiAnalysis?.relatedIncident === incident.id;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* New complaint linked banner */}
        {isNewlyLinked && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 mb-5 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-900">Your complaint has been linked to an existing civic incident</p>
              <p className="text-green-700 text-sm">Previous: 47 complaints → Your complaint: <strong>#48</strong> → Total: <strong>48 related complaints</strong></p>
            </div>
          </motion.div>
        )}

        {/* Incident Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-sm font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{incident.id}</span>
            <PriorityBadge level={incident.priorityLevel} />
            <StatusBadge status={incident.status} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">{incident.title}</h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="w-4 h-4" /> {incident.ward} · {incident.address}
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Related Complaints', value: incident.affectedCitizenCount, icon: Layers, color: 'blue' },
            { label: 'Affected Citizens', value: incident.affectedCitizenCount, icon: Users, color: 'violet' },
            { label: 'Priority Score', value: `${incident.priorityScore}/100`, icon: BarChart3, color: 'red' },
            { label: 'Pressure Score', value: `${incident.pressureScore}/100`, icon: TrendingUp, color: 'amber' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-4 text-center">
              <div className={`w-9 h-9 bg-${color}-50 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div className={`text-2xl font-black text-${color}-700 mb-0.5`}>{value}</div>
              <div className="text-xs text-slate-500 font-medium">{label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* AI Reasoning */}
          <Card className="p-5 lg:col-span-2">
            <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> AI Incident Intelligence
            </h2>
            <div className="space-y-3 mb-4">
              {[
                { label: 'Semantic Similarity', value: incident.semanticSimilarity || 94 },
                { label: 'Spatial Proximity', value: incident.spatialProximity || 96 },
                { label: 'Temporal Proximity', value: incident.temporalProximity || 91 },
                { label: 'Incident Confidence', value: incident.confidenceScore },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">{label}</span>
                    <span className="text-blue-700">{value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 leading-relaxed italic">
              "{incident.aiReasoning}"
            </p>
          </Card>

          {/* Department info */}
          <Card className="p-5">
            <h2 className="font-bold text-slate-900 mb-4">Department</h2>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-blue-600 mb-1">LEAD DEPARTMENT</p>
                <p className="font-bold text-blue-900 text-sm">{incident.department}</p>
              </div>
              {incident.supportingDepartment && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1">SUPPORT</p>
                  <p className="font-semibold text-slate-700 text-sm">{incident.supportingDepartment}</p>
                </div>
              )}
              {incident.assignedOfficer && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">ASSIGNED OFFICER</p>
                  <p className="text-sm font-semibold text-slate-700">{incident.assignedOfficer}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="p-5 mb-6">
          <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Progress Timeline
          </h2>

          <div className="space-y-0">
            {incident.timeline.map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Line */}
                {i < incident.timeline.length - 1 && (
                  <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                    step.status === 'done' ? 'bg-green-200' :
                    step.status === 'active' ? 'bg-blue-200' : 'bg-slate-100'
                  }`} />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-0.5 border-2 ${
                  step.status === 'done' ? 'bg-green-50 border-green-200' :
                  step.status === 'active' ? 'bg-blue-50 border-blue-400 pulse-dot' : 'bg-slate-50 border-slate-200'
                }`}>
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : step.status === 'active' ? (
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  ) : (
                    <div className="w-3 h-3 bg-slate-200 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm ${
                      step.status === 'done' ? 'text-slate-900' :
                      step.status === 'active' ? 'text-blue-700' : 'text-slate-400'
                    }`}>
                      {step.step}
                    </span>
                    {step.status === 'active' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Active</span>
                    )}
                    {step.status === 'pending' && (
                      <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-medium">Pending</span>
                    )}
                  </div>
                  {step.time && (
                    <p className="text-xs text-slate-400 mt-0.5">{formatTime(step.time)}</p>
                  )}
                  <p className={`text-xs mt-0.5 ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/citizen/priority')}
            size="lg"
            icon={<BarChart3 className="w-5 h-5" />}
            className="flex-1 justify-center"
          >
            View AI Priority Score
          </Button>
          <Button
            onClick={() => navigate('/citizen/track/INC-1042')}
            variant="outline"
            size="lg"
            icon={<ChevronRight className="w-5 h-5" />}
            className="justify-center"
          >
            Track Live
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

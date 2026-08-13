import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Clock, AlertTriangle, Plus, MapPin, ChevronRight, RefreshCw } from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Card, Button, StatCard, StatusBadge, PriorityBadge, SectionHeader } from '../../components/ui';
import { useComplaintStore } from '../../store';
import type { Complaint } from '../../types';

// Demo pre-existing complaints for this citizen
const DEMO_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP001',
    citizenId: 'DEMO_CITIZEN',
    citizenName: 'Priya Ramesh',
    text: 'Enga street la 3 days ah water varala. Romba kashtama irukku.',
    language: 'Tanglish',
    category: 'Water Supply',
    severity: 'High',
    ward: 'Ward 12',
    address: 'Anna Nagar, Ward 12',
    isDuplicate: false,
    incidentId: 'INC-1042',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { reset } = useComplaintStore();
  const [complaints] = useState<Complaint[]>(DEMO_COMPLAINTS);

  const stats = {
    total: complaints.length,
    active: complaints.filter(c => !['closed', 'resolved', 'monitoring'].includes(c.status)).length,
    resolved: complaints.filter(c => ['closed', 'monitoring', 'resolved'].includes(c.status)).length,
    reopened: complaints.filter(c => c.status === 'reopened').length,
  };

  const handleReport = () => {
    reset();
    navigate('/citizen/report');
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m ago`;
    return `${m}m ago`;
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Welcome, Priya 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Report civic issues · Track your complaints · Verify resolutions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="My Complaints" value={stats.total} icon={<FileText className="w-5 h-5" />} color="blue" />
          <StatCard label="Active" value={stats.active} icon={<Clock className="w-5 h-5" />} color="amber" />
          <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
          <StatCard label="Reopened" value={stats.reopened} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        </div>

        {/* Report new complaint CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 mb-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-lg font-bold mb-1">Report a Civic Problem</h2>
            <p className="text-blue-100 text-sm">Describe in Tamil, English, or Tanglish. AI does the rest.</p>
          </div>
          <Button
            onClick={handleReport}
            variant="secondary"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            className="bg-white text-blue-700 hover:bg-blue-50 flex-shrink-0"
          >
            Report Problem
          </Button>
        </motion.div>

        {/* My Complaints */}
        <SectionHeader
          title="My Complaints"
          subtitle={`${complaints.length} total complaints`}
          action={
            <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
              Refresh
            </Button>
          }
        />

        <div className="space-y-4">
          {complaints.map((complaint, i) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover onClick={() => navigate(`/citizen/track/${complaint.incidentId || complaint.id}`)} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    {/* ID + Category */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {complaint.id}
                      </span>
                      {complaint.incidentId && (
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {complaint.incidentId}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-1">{complaint.category}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-3">{complaint.text}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge level="HIGH" size="sm" />
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" /> {complaint.ward}
                      </span>
                      <span className="text-xs text-slate-400">{formatTime(complaint.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-slate-600">Department</p>
                      <p className="text-sm font-bold text-slate-900">Water Board</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ChevronRight className="w-4 h-4" />}
                      onClick={(e) => { e.stopPropagation(); navigate(`/citizen/track/${complaint.incidentId || complaint.id}`); }}
                    >
                      Track
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

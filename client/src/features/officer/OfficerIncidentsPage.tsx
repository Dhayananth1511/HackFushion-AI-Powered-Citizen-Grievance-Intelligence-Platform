import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, Play, TrendingUp, Search,
  MapPin, Users, BarChart3, Building2, RefreshCw, Eye
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Card, Button, PriorityBadge, StatusBadge, StatCard } from '../../components/ui';
import { incidentsApi } from '../../services/api';
import { useIncidentStore } from '../../store';
import type { Incident } from '../../types';

const DEMO_INCIDENTS: Incident[] = [
  {
    id: 'INC-1042', title: 'Water Supply Disruption', category: 'Water Supply',
    description: 'Complete water supply failure, burst pipeline in Ward 12 affecting over 45 households.', ward: 'Ward 12', address: 'Anna Nagar 4th Main, Ward 12',
    complaintIds: ['CMP001', 'CMP002'], affectedCitizenCount: 48, priorityScore: 91, pressureScore: 85,
    confidenceScore: 96, department: 'Water Supply Department', assignedOfficer: 'Officer Ramesh Kumar',
    status: 'in_progress', priorityLevel: 'HIGH', aiReasoning: 'High density burst water pipeline complaints received within 2 hours.',
    timeline: [], createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'INC-1038', title: 'Road Surface Damage & Pothole', category: 'Road Damage',
    description: 'Severe pothole formation on main traffic corridor causing vehicle damage.', ward: 'Ward 9', address: 'T Nagar 12th Cross, Ward 9',
    complaintIds: ['CMP004'], affectedCitizenCount: 31, priorityScore: 72, pressureScore: 65,
    confidenceScore: 88, department: 'Roads & Infrastructure', assignedOfficer: 'Officer Priya Selvam',
    status: 'assigned', priorityLevel: 'MEDIUM', aiReasoning: 'Multiple reports of hazardous road depression.',
    timeline: [], createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'INC-1032', title: 'Garbage Accumulation Spill', category: 'Garbage',
    description: 'Large uncollected waste accumulation blocking pedestrian access for 5 days.', ward: 'Ward 17', address: 'Adyar LB Road, Ward 17',
    complaintIds: ['CMP009'], affectedCitizenCount: 48, priorityScore: 78, pressureScore: 74,
    confidenceScore: 92, department: 'Sanitation Department', assignedOfficer: undefined,
    status: 'detected', priorityLevel: 'HIGH', aiReasoning: 'Public health hazard threshold exceeded.',
    timeline: [], createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'INC-1029', title: 'Streetlight Substation Blackout', category: 'Streetlight',
    description: 'Multiple streetlights non-functional along 2nd Street.', ward: 'Ward 5', address: 'Mylapore South, Ward 5',
    complaintIds: ['CMP012'], affectedCitizenCount: 12, priorityScore: 45, pressureScore: 38,
    confidenceScore: 89, department: 'Electrical Department', assignedOfficer: 'Officer Kavitha M',
    status: 'resolved', priorityLevel: 'LOW', aiReasoning: 'Minor electrical breaker reset needed.',
    timeline: [], createdAt: new Date(Date.now() - 96 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'INC-1015', title: 'Drainage Overflow & Waterlogging', category: 'Drainage',
    description: 'Blockage in primary storm drain causing overflow on residential road.', ward: 'Ward 21', address: 'Velachery Main Rd, Ward 21',
    complaintIds: [], affectedCitizenCount: 65, priorityScore: 86, pressureScore: 82,
    confidenceScore: 94, department: 'Public Works & Drainage', assignedOfficer: 'Officer Suresh K',
    status: 'reopened', priorityLevel: 'HIGH', aiReasoning: 'Reopened by citizens following heavy rain surge.',
    timeline: [], createdAt: new Date(Date.now() - 120 * 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
];

export const OfficerIncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedIncident } = useIncidentStore();
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'citizens' | 'newest'>('priority');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentsApi.getAll();
      if (data && data.length > 0) {
        setIncidents(data);
      }
    } catch (err) {
      console.error('Failed to fetch incidents', err);
    } finally {
      setLoading(false);
    }
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

  const handleStartWork = async (incident: Incident) => {
    setUpdatingId(incident.id);
    try {
      await incidentsApi.updateStatus(incident.id, 'in_progress', 'Officer dispatched to location');
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

  // Filter & Sort Logic
  const filteredIncidents = incidents
    .filter(inc => {
      const matchesSearch =
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !['resolved', 'closed'].includes(inc.status)) ||
        inc.status === statusFilter;

      const matchesPriority = priorityFilter === 'all' || inc.priorityLevel === priorityFilter;
      const matchesDept = departmentFilter === 'all' || inc.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesDept;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
      if (sortBy === 'citizens') return b.affectedCitizenCount - a.affectedCitizenCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const departments = Array.from(new Set(incidents.map(i => i.department)));

  const stats = {
    total: incidents.length,
    active: incidents.filter(i => !['resolved', 'closed'].includes(i.status)).length,
    high: incidents.filter(i => i.priorityLevel === 'HIGH').length,
    citizens: incidents.reduce((acc, i) => acc + i.affectedCitizenCount, 0),
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Incident Management</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Review, assign, dispatch, and track high-priority civic incidents
            </p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            {filteredIncidents.length} Incidents Displayed
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Incidents" value={stats.total} icon={<AlertTriangle className="w-5 h-5" />} color="blue" />
          <StatCard label="Active Work" value={stats.active} icon={<TrendingUp className="w-5 h-5" />} color="amber" />
          <StatCard label="High Priority" value={stats.high} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
          <StatCard label="Impacted Citizens" value={stats.citizens} icon={<Users className="w-5 h-5" />} color="violet" />
        </div>

        {/* Search & Multi-Filters */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, title, description, address, or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="detected">Detected</option>
                <option value="assigned">Assigned</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="reopened">Reopened</option>
              </select>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="priority">Sort: Priority Score</option>
                <option value="citizens">Sort: Affected Citizens</option>
                <option value="newest">Sort: Newest First</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                onClick={fetchIncidents}
              />
            </div>
          </div>
        </Card>

        {/* Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No matching incidents</h3>
              <p className="text-sm text-slate-500 mt-1">Adjust search parameters or clear filters.</p>
            </Card>
          ) : (
            filteredIncidents.map((incident, idx) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`overflow-hidden ${incident.priorityLevel === 'HIGH' && incident.status !== 'resolved' ? 'border-red-200 shadow-sm' : ''}`}>
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl">{getCategoryIcon(incident.category)}</span>
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {incident.id}
                          </span>
                          <PriorityBadge level={incident.priorityLevel} size="sm" />
                          <StatusBadge status={incident.status} />
                          {incident.assignedOfficer && (
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              Assigned: {incident.assignedOfficer}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-lg">{incident.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{incident.description}</p>

                        {/* AI Reasoning box */}
                        {incident.aiReasoning && (
                          <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-2.5 text-xs text-indigo-900 flex items-start gap-2">
                            <span className="font-bold text-indigo-700">AI Insight:</span>
                            <span>{incident.aiReasoning}</span>
                          </div>
                        )}

                        {/* Meta tags */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-600" /> {incident.address || incident.ward}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-600" /> {incident.affectedCitizenCount} affected</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700"><BarChart3 className="w-3.5 h-3.5 text-amber-600" /> Score {incident.priorityScore}/100</span>
                          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-600" /> {incident.department}</span>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex flex-row lg:flex-col gap-2 lg:w-40 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {incident.status === 'in_progress' && incident.id === 'INC-1042' && (
                          <button
                            onClick={() => handleResolve(incident)}
                            disabled={updatingId === incident.id}
                            className="flex items-center justify-center gap-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors w-full shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {updatingId === incident.id ? 'Updating...' : 'Mark Resolved'}
                          </button>
                        )}
                        {(incident.status === 'detected' || incident.status === 'assigned') && (
                          <button
                            onClick={() => handleAccept(incident)}
                            disabled={updatingId === incident.id}
                            className="flex items-center justify-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors w-full shadow-sm"
                          >
                            <Play className="w-4 h-4" />
                            Accept Assignment
                          </button>
                        )}
                        {incident.status === 'accepted' && (
                          <button
                            onClick={() => handleStartWork(incident)}
                            disabled={updatingId === incident.id}
                            className="flex items-center justify-center gap-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg transition-colors w-full shadow-sm"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Dispatch Team
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedIncident(incident); navigate(`/officer/incidents/${incident.id}`); }}
                          className="flex items-center justify-center gap-1 text-xs font-semibold border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50/50 px-3 py-2 rounded-lg transition-all w-full text-center"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Priority indicator bar */}
                  <div className="h-1 bg-slate-100">
                    <div
                      className={`h-full transition-all duration-700 ${
                        incident.priorityLevel === 'HIGH' ? 'bg-red-500' :
                        incident.priorityLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${incident.priorityScore}%` }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

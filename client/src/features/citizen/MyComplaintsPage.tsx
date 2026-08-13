import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Search, Filter, RefreshCw, ChevronRight, MapPin,
  Clock, CheckCircle2, Plus, Sparkles
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Card, Button, StatusBadge, PriorityBadge, SectionHeader, StatCard } from '../../components/ui';
import { complaintsApi } from '../../services/api';
import { useComplaintStore } from '../../store';
import type { Complaint } from '../../types';

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
    address: '4th Main Road, Anna Nagar, Ward 12',
    isDuplicate: false,
    incidentId: 'INC-1042',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'CMP004',
    citizenId: 'DEMO_CITIZEN',
    citizenName: 'Priya Ramesh',
    text: 'Periya pothole road middle la irukku. Night lights ku teriyala, danger ah irukku.',
    language: 'Tanglish',
    category: 'Road Damage',
    severity: 'Medium',
    ward: 'Ward 9',
    address: '12th Cross Street, T Nagar, Ward 9',
    isDuplicate: false,
    incidentId: 'INC-1038',
    status: 'assigned',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'CMP009',
    citizenId: 'DEMO_CITIZEN',
    citizenName: 'Priya Ramesh',
    text: 'Garbage collection has not happened for 4 days near our apartment gate.',
    language: 'English',
    category: 'Garbage',
    severity: 'High',
    ward: 'Ward 17',
    address: 'LB Road, Adyar, Ward 17',
    isDuplicate: false,
    incidentId: 'INC-1032',
    status: 'detected',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'CMP012',
    citizenId: 'DEMO_CITIZEN',
    citizenName: 'Priya Ramesh',
    text: 'Streetlight pole #42 flickering and off. Dark at night.',
    language: 'English',
    category: 'Streetlight',
    severity: 'Low',
    ward: 'Ward 5',
    address: 'North Mada St, Mylapore, Ward 5',
    isDuplicate: false,
    incidentId: 'INC-1029',
    status: 'resolved',
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
  },
];

export const MyComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const { reset } = useComplaintStore();
  const [complaints, setComplaints] = useState<Complaint[]>(DEMO_COMPLAINTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintsApi.getAll();
      if (data && data.length > 0) {
        setComplaints(data);
      }
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportNew = () => {
    reset();
    navigate('/citizen/report');
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ward.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !['resolved', 'closed'].includes(c.status)) ||
      c.status === statusFilter;

    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(complaints.map(c => c.category)));

  const stats = {
    total: complaints.length,
    active: complaints.filter(c => !['resolved', 'closed'].includes(c.status)).length,
    resolved: complaints.filter(c => ['resolved', 'closed'].includes(c.status)).length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d} day${d > 1 ? 's' : ''} ago`;
    if (h > 0) return `${h}h ago`;
    return 'Just now';
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              View and track all civic grievances submitted by you
            </p>
          </div>
          <Button
            onClick={handleReportNew}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            className="self-start sm:self-auto"
          >
            Report New Problem
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Submitted" value={stats.total} icon={<FileText className="w-5 h-5" />} color="blue" />
          <StatCard label="Active Grievances" value={stats.active} icon={<Clock className="w-5 h-5" />} color="amber" />
          <StatCard label="In Progress" value={stats.inProgress} icon={<Sparkles className="w-5 h-5" />} color="violet" />
          <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, keyword, address, or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="detected">Detected</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <Button
                variant="ghost"
                size="sm"
                icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                onClick={loadComplaints}
              />
            </div>
          </div>
        </Card>

        {/* Complaint List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No complaints found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your search criteria or report a new problem.
              </p>
            </Card>
          ) : (
            filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="p-5 overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {/* Top badging */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                          {complaint.id}
                        </span>
                        {complaint.incidentId && (
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                            Parent Incident: {complaint.incidentId}
                          </span>
                        )}
                        <StatusBadge status={complaint.status} />
                        <PriorityBadge level={complaint.severity === 'High' ? 'HIGH' : complaint.severity === 'Medium' ? 'MEDIUM' : 'LOW'} size="sm" />
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          Lang: {complaint.language}
                        </span>
                      </div>

                      {/* Title & snippet */}
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{complaint.category}</h3>
                        <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{complaint.text}</p>
                      </div>

                      {/* Location & Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          {complaint.address || complaint.ward}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Submitted {formatTime(complaint.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 flex-shrink-0">
                      {complaint.status === 'resolved' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white border-none"
                          onClick={() => navigate(`/citizen/verify/${complaint.incidentId || complaint.id}`)}
                        >
                          Verify Resolution
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<ChevronRight className="w-4 h-4" />}
                          onClick={() => navigate(`/citizen/track/${complaint.incidentId || complaint.id}`)}
                        >
                          Track Status
                        </Button>
                      )}
                    </div>
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

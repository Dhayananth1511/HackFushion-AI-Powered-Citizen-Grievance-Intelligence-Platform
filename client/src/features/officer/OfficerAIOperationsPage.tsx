import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Sparkles, Activity, Layers, AlertCircle, RefreshCw,
  CheckCircle2, Zap, BarChart3, TrendingUp, Users, ShieldAlert,
  ArrowUpRight, Clock
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Card, Button, StatCard } from '../../components/ui';

interface AILogFeedItem {
  id: string;
  timestamp: string;
  type: 'grouping' | 'anomaly' | 'sla_warning' | 'nlp_intent';
  title: string;
  detail: string;
  ward: string;
  confidence: number;
}

const DEMO_AI_LOGS: AILogFeedItem[] = [
  {
    id: 'LOG-8801',
    timestamp: '2 mins ago',
    type: 'grouping',
    title: 'Cluster Aggregation Engine Triggered',
    detail: 'Grouped 14 complaints in Ward 12 (Tanglish + English) into INC-1042 (Water Supply Disruption).',
    ward: 'Ward 12',
    confidence: 96,
  },
  {
    id: 'LOG-8799',
    timestamp: '15 mins ago',
    type: 'anomaly',
    title: 'Ward Spatial Anomaly Spike Detected',
    detail: 'Complaint frequency in Ward 21 exceeded normal baseline by 340% within 45 minutes.',
    ward: 'Ward 21',
    confidence: 94,
  },
  {
    id: 'LOG-8794',
    timestamp: '1 hour ago',
    type: 'sla_warning',
    title: 'Predictive SLA Breach Alert',
    detail: 'INC-1032 in Ward 17 predicted to breach 48h resolution SLA in 6 hours due to sanitation backlog.',
    ward: 'Ward 17',
    confidence: 91,
  },
  {
    id: 'LOG-8788',
    timestamp: '2 hours ago',
    type: 'nlp_intent',
    title: 'Tanglish NLP Intent & Severity Extraction',
    detail: 'Extracted high urgency sentiment ("Romba kashtama irukku") and classified as Critical Infrastructure.',
    ward: 'Ward 9',
    confidence: 98,
  },
];

export const OfficerAIOperationsPage: React.FC = () => {
  const [logs, setLogs] = useState<AILogFeedItem[]>(DEMO_AI_LOGS);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleRunScan = () => {
    setScanning(true);
    setScanMessage(null);
    setTimeout(() => {
      setScanning(false);
      setScanMessage('AI Deduplication scan complete. 0 new duplicates found across 6 wards.');
      const newLog: AILogFeedItem = {
        id: `LOG-${Math.floor(8800 + Math.random() * 100)}`,
        timestamp: 'Just now',
        type: 'grouping',
        title: 'Manual AI Scan Execution Complete',
        detail: 'Scanned 142 recent complaints across all wards. Knowledge graph synced.',
        ward: 'All Wards',
        confidence: 99,
      };
      setLogs(prev => [newLog, ...prev]);
    }, 1500);
  };

  const getLogBadge = (type: AILogFeedItem['type']) => {
    switch (type) {
      case 'grouping':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">Grouping Engine</span>;
      case 'anomaly':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[11px] font-bold">Spatial Anomaly</span>;
      case 'sla_warning':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">SLA Risk</span>;
      case 'nlp_intent':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-bold">NLP Tanglish</span>;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-indigo-600" />
              AI Operations & Intelligence Engine
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Real-time clustering algorithms, Tanglish NLP, anomaly detection, and workload balancing
            </p>
          </div>

          <Button
            onClick={handleRunScan}
            disabled={scanning}
            variant="primary"
            icon={<RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />}
            className="bg-indigo-600 hover:bg-indigo-700 self-start sm:self-auto"
          >
            {scanning ? 'Running AI Scan...' : 'Re-Run AI Deduplication Scan'}
          </Button>
        </div>

        {scanMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            {scanMessage}
          </motion.div>
        )}

        {/* Core AI Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Clustering Accuracy" value="96.4%" icon={<Sparkles className="w-5 h-5" />} color="violet" />
          <StatCard label="Duplicates Merged" value="142" icon={<Layers className="w-5 h-5" />} color="blue" />
          <StatCard label="Tanglish NLP Score" value="98.1%" icon={<Zap className="w-5 h-5" />} color="amber" />
          <StatCard label="Active Anomalies" value="1" icon={<AlertCircle className="w-5 h-5" />} color="red" />
        </div>

        {/* Middle Section: AI Live Signal Stream + Department Workload */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Log Feed */}
          <Card className="lg:col-span-2 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Live AI Signals & Decision Log
                </h3>
                <p className="text-xs text-slate-500">Autonomous grouping, sentiment analysis, and anomaly triggers</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {logs.length} Signals
              </span>
            </div>

            <div className="space-y-3">
              {logs.map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getLogBadge(log.type)}
                      <span className="font-mono text-xs font-semibold text-slate-500">{log.id}</span>
                      <span className="text-xs text-slate-400">· {log.ward}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex-shrink-0">{log.timestamp}</span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm">{log.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{log.detail}</p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2">
                    <span>AI Confidence: <strong className="text-indigo-600">{log.confidence}%</strong></span>
                    <span className="text-slate-400">Validated by AI Model v2.4</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Department Workload & Escalation Matrix */}
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Department Load Balance
              </h3>
              <p className="text-xs text-slate-500 mb-4">AI predicted resolution capacity</p>

              <div className="space-y-4">
                {[
                  { name: 'Water Board', load: 85, color: 'bg-red-500', status: 'High Load' },
                  { name: 'Sanitation Dept', load: 65, color: 'bg-amber-500', status: 'Moderate' },
                  { name: 'Roads & Infra', load: 45, color: 'bg-blue-500', status: 'Optimal' },
                  { name: 'Electricity Dept', load: 25, color: 'bg-green-500', status: 'Optimal' },
                ].map(dept => (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{dept.name}</span>
                      <span className="text-slate-500">{dept.load}% ({dept.status})</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${dept.color}`} style={{ width: `${dept.load}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm">Tanglish NLP Intelligence</h4>
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed mb-3">
                CivicAI NLP automatically parses mixed Tanglish & Tamil vernacular to assign accurate department routing without requiring manual translation.
              </p>
              <div className="bg-indigo-950/80 p-3 rounded-lg border border-indigo-800/50 text-xs font-mono text-indigo-300">
                "water varala" ➔ Water Supply (Severity: High)
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

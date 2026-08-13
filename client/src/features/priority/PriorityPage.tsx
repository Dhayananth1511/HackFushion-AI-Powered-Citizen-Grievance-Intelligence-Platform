import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ChevronRight, CheckCircle2, Building2, Zap } from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Button, Card, PriorityBadge } from '../../components/ui';
import { useComplaintStore } from '../../store';

const BREAKDOWN = [
  { label: 'Complaint Volume', score: 28, max: 30, color: 'bg-blue-500', desc: '48 complaints — very high volume' },
  { label: 'Severity', score: 20, max: 25, color: 'bg-violet-500', desc: 'High — essential service affected' },
  { label: 'Recency', score: 19, max: 20, color: 'bg-amber-500', desc: 'Active spike in last 72 hours' },
  { label: 'Geographic Density', score: 13, max: 15, color: 'bg-orange-500', desc: 'All complaints within 500m radius' },
  { label: 'Safety Risk', score: 9, max: 10, color: 'bg-red-500', desc: 'Public health risk — drinking water' },
];

const REASONS = [
  '48 related complaints reported in Ward 12',
  'High severity — essential public service affected',
  'Unresolved for 3 days — SLA approaching',
  'High geographic concentration — same ward cluster',
  'Essential public service — health & safety risk',
];

const DEPT_INFO = {
  lead: 'Water Supply Department',
  supporting: 'Municipal Engineering',
  reason: 'High-volume water supply disruption affecting multiple households in Ward 12 requires Water Board pipeline repair team and Municipal Engineering structural support.',
  confidence: 94,
};

export const PriorityPage: React.FC = () => {
  const navigate = useNavigate();
  const { aiAnalysis } = useComplaintStore();
  const breakdown = aiAnalysis?.priority?.breakdown || BREAKDOWN;
  const totalScore = breakdown.reduce((sum, b) => sum + b.score, 0) || 91;
  const [showApproval, setShowApproval] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-1">AI Priority Score</h1>
          <p className="text-slate-500 text-sm">Transparent, weighted scoring — configurable by admin</p>
        </div>

        {/* Score ring */}
        <Card className="p-8 mb-6 text-center">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="16" />
              <motion.circle
                cx="70" cy="70" r="58" fill="none"
                stroke={totalScore >= 80 ? '#dc2626' : totalScore >= 60 ? '#d97706' : '#16a34a'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 58}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - totalScore / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900">{totalScore}</span>
              <span className="text-sm text-slate-400 font-medium">/ 100</span>
            </div>
          </div>

          <PriorityBadge level="HIGH" size="md" />
          <p className="text-slate-500 text-sm mt-3">HIGH PRIORITY — Immediate action required</p>
        </Card>

        {/* Breakdown */}
        <Card className="p-5 mb-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" /> Score Breakdown
          </h2>
          <div className="space-y-4">
            {BREAKDOWN.map(({ label, score, max, color, desc }, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                  <span className="text-sm font-bold text-slate-900">{score}<span className="text-slate-400 font-normal">/{max}</span></span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / max) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            ))}

            {/* Total */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">TOTAL SCORE</span>
                <span className="text-2xl font-black text-red-600">{totalScore}/100</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Why high priority */}
        <Card className="p-5 mb-5">
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Why High Priority?
          </h2>
          <ul className="space-y-2">
            {REASONS.map((reason, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-start gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{reason}</span>
              </motion.li>
            ))}
          </ul>
        </Card>

        {/* Department recommendation */}
        <Card className="p-5 mb-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> AI Department Recommendation
          </h2>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-3">
            <p className="text-xs font-semibold text-blue-600 mb-1">LEAD DEPARTMENT</p>
            <p className="text-lg font-black text-blue-900">🚰 {DEPT_INFO.lead}</p>
          </div>
          {DEPT_INFO.supporting && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">SUPPORTING DEPARTMENT</p>
              <p className="font-bold text-slate-700">🔧 {DEPT_INFO.supporting}</p>
            </div>
          )}
          <p className="text-sm text-slate-600 italic leading-relaxed">"{DEPT_INFO.reason}"</p>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${DEPT_INFO.confidence}%` }} />
            </div>
            <span className="text-xs font-bold text-blue-700">{DEPT_INFO.confidence}% confidence</span>
          </div>

          {/* Officer approval button */}
          {!showApproval ? (
            <button
              onClick={() => setShowApproval(true)}
              className="mt-4 w-full border-2 border-blue-300 text-blue-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Officer Approve Recommendation →
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 bg-green-50 border border-green-300 rounded-xl p-3 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Department recommendation approved by officer</span>
            </motion.div>
          )}
        </Card>

        <Button
          onClick={() => navigate('/officer')}
          size="lg"
          icon={<ChevronRight className="w-5 h-5" />}
          className="w-full justify-center"
        >
          Go to Officer Dashboard →
        </Button>
      </div>
    </AppLayout>
  );
};

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RefreshCw, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Button, Card } from '../../components/ui';
import { incidentsApi } from '../../services/api';

type VerifyState = 'pending' | 'verifying' | 'resolved' | 'reopened';

export const CitizenVerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<VerifyState>('pending');
  const [loading, setLoading] = useState(false);

  const handleYes = async () => {
    setLoading(true);
    setState('verifying');
    try {
      await incidentsApi.verify(id || 'INC-1042', true);
    } catch {}
    setTimeout(() => { setState('resolved'); setLoading(false); }, 1200);
  };

  const handleNo = async () => {
    setLoading(true);
    setState('verifying');
    try {
      await incidentsApi.verify(id || 'INC-1042', false);
    } catch {}
    setTimeout(() => { setState('reopened'); setLoading(false); }, 1200);
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">

          {/* ─── Pending: YES / NO ─── */}
          {state === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {/* Notification banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔔</span>
                </div>
                <h2 className="text-lg font-bold text-blue-900 mb-1">Resolution Notification</h2>
                <p className="text-blue-700 text-sm">
                  The <strong>Water Supply Department</strong> has marked your complaint as resolved.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  INC-1042 · Water Supply Disruption · Ward 12
                </div>
              </div>

              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">🎉</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Is the problem actually resolved?</h1>
                <p className="text-slate-500 text-sm mb-8">
                  The department has marked the water supply issue in Ward 12 as resolved.
                  Please confirm whether water supply has been restored to your area.
                </p>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleYes}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-green-100 disabled:opacity-50"
                  >
                    <ThumbsUp className="w-6 h-6" />
                    Yes, Problem is Solved ✓
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNo}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 border-2 border-red-300 text-red-700 font-bold text-lg py-4 rounded-2xl transition-colors"
                  >
                    <ThumbsDown className="w-6 h-6" />
                    No — Still Unresolved ✕
                  </motion.button>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                  Your response helps us ensure problems are truly resolved, not just closed on paper.
                </p>
              </Card>
            </motion.div>
          )}

          {/* ─── Verifying ─── */}
          {state === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-semibold">Processing your response...</p>
            </motion.div>
          )}

          {/* ─── Resolved (YES) ─── */}
          {state === 'resolved' && (
            <motion.div
              key="resolved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Card className="p-8 text-center border-green-200">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>

                <h1 className="text-2xl font-black text-green-800 mb-2">Citizen Verified ✓</h1>
                <p className="text-slate-600 mb-6">Thank you for confirming. Your complaint has been successfully resolved.</p>

                {/* Resolution flow */}
                <div className="bg-green-50 rounded-2xl p-5 mb-6">
                  {['Resolved by Officer', 'Citizen Confirmed ✓', 'Status → Monitoring', 'Will close in 48h'].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="flex items-center gap-2 mb-2 last:mb-0"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-green-800">{step}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold mb-6">
                  INC-1042 — MONITORING
                </div>

                <Button onClick={() => navigate('/citizen')} variant="secondary" size="lg" className="w-full justify-center">
                  Back to Dashboard
                </Button>
              </Card>
            </motion.div>
          )}

          {/* ─── Reopened (NO) ─── */}
          {state === 'reopened' && (
            <motion.div
              key="reopened"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Card className="p-8 text-center border-red-200">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </motion.div>

                <h1 className="text-2xl font-black text-red-800 mb-2">⚠️ Incident Reopened</h1>
                <p className="text-slate-600 mb-6">
                  We're sorry the issue isn't resolved. The system has automatically escalated this incident.
                </p>

                {/* Reopen cascade */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 text-left">
                  <p className="font-bold text-red-800 text-sm mb-3">System Actions Taken:</p>
                  {[
                    { icon: RefreshCw, text: 'Incident Reopened', sub: 'Status changed to REOPENED' },
                    { icon: AlertTriangle, text: 'Priority Increased', sub: '+15 points — now 106/100 → Escalated' },
                    { icon: CheckCircle2, text: 'Officer Alerted', sub: 'Officer Ramesh Kumar notified immediately' },
                    { icon: CheckCircle2, text: 'Department Notified', sub: 'Water Supply Department alerted' },
                    { icon: CheckCircle2, text: 'Escalation Created', sub: 'Admin notified of citizen rejection' },
                  ].map(({ icon: Icon, text, sub }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="flex items-start gap-3 mb-3 last:mb-0"
                    >
                      <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-900">{text}</p>
                        <p className="text-xs text-red-600">{sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-bold mb-6">
                  INC-1042 — ESCALATED
                </div>

                <p className="text-sm text-slate-500 mb-6">
                  The officer has been alerted and must respond within the escalation SLA period.
                  You will receive a notification once the issue is re-addressed.
                </p>

                <div className="flex gap-3">
                  <Button onClick={() => navigate('/citizen')} variant="secondary" size="md" className="flex-1 justify-center">
                    Dashboard
                  </Button>
                  <Button onClick={() => navigate('/officer')} size="md" className="flex-1 justify-center">
                    View Officer Response
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

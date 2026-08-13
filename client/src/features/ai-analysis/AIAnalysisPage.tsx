import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Brain, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Button, Card } from '../../components/ui';
import { useComplaintStore } from '../../store';
import type { AIAnalysis } from '../../types';

// Mock AI analysis for demo when API is unavailable
const MOCK_ANALYSIS: AIAnalysis = {
  language: 'Tanglish',
  languageConfidence: 94,
  category: 'Water Supply',
  issue: 'No Water Supply',
  severity: 'High',
  timeReference: 'Since 3 days',
  affectedPopulation: 'Multiple Households',
  ward: 'Ward 12',
  isDuplicate: false,
  relatedIncident: 'INC-1042',
  relatedComplaintCount: 47,
  priority: {
    score: 91,
    level: 'HIGH',
    breakdown: [
      { label: 'Complaint Volume', score: 28, max: 30 },
      { label: 'Severity', score: 20, max: 25 },
      { label: 'Recency', score: 19, max: 20 },
      { label: 'Geographic Density', score: 13, max: 15 },
      { label: 'Safety Risk', score: 9, max: 10 },
    ],
    reasons: [
      '47 related complaints reported',
      'High severity — essential service affected',
      'Unresolved for since 3 days',
      'High geographic concentration — same ward cluster',
      'Essential public service — health & safety risk',
    ],
  },
  department: {
    lead: 'Water Supply Department',
    supporting: 'Municipal Engineering',
    reason: 'Water supply disruption requires Water Board pipeline team and Municipal Engineering support for infrastructure repair.',
    confidence: 94,
  },
  confidence: 94,
  steps: [
    { agent: 'Language Agent', action: 'Detecting language', result: 'Tanglish detected (94% confidence)', status: 'done' },
    { agent: 'Complaint Agent', action: 'Understanding complaint', result: 'No Water Supply — High severity', status: 'done' },
    { agent: 'Complaint Agent', action: 'Extracting category', result: 'Water Supply', status: 'done' },
    { agent: 'Complaint Agent', action: 'Extracting severity', result: 'High', status: 'done' },
    { agent: 'Complaint Agent', action: 'Extracting location', result: 'Ward 12', status: 'done' },
    { agent: 'Evidence Agent', action: 'Processing evidence', result: 'Image/location processed', status: 'done' },
    { agent: 'Duplicate Agent', action: 'Checking for duplicates', result: 'No duplicate found', status: 'done' },
    { agent: 'Incident Agent', action: 'Searching related complaints', result: '47 related complaints found in INC-1042', status: 'done' },
    { agent: 'Priority Agent', action: 'Calculating priority', result: 'Score: 91/100 — HIGH', status: 'done' },
    { agent: 'Routing Agent', action: 'Finding responsible department', result: 'Water Supply Department', status: 'done' },
  ],
};

const STEP_DELAY = 700; // ms between each step appearing

export const AIAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { aiAnalysis, currentText } = useComplaintStore();
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [phase, setPhase] = useState<'analyzing' | 'incident' | 'done'>('analyzing');
  const analysis = aiAnalysis || MOCK_ANALYSIS;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const steps = analysis.steps;
    let current = 0;

    intervalRef.current = setInterval(() => {
      current++;
      setVisibleSteps(current);
      if (current >= steps.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setPhase('incident'), 400);
        setTimeout(() => {
          setShowResults(true);
          setPhase('done');
        }, 1800);
      }
    }, STEP_DELAY);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: phase === 'analyzing' ? 360 : 0 }}
            transition={{ duration: 2, repeat: phase === 'analyzing' ? Infinity : 0, ease: 'linear' }}
            className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-black text-slate-900">AI Orchestrator</h1>
          <p className="text-slate-500 text-sm mt-1">
            {phase === 'analyzing' && 'Analysing your complaint...'}
            {phase === 'incident' && 'Civic incident detected!'}
            {phase === 'done' && 'Analysis complete'}
          </p>
        </div>

        {/* Complaint preview */}
        {currentText && (
          <Card className="p-4 mb-5 bg-slate-50 border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Your Complaint</p>
            <p className="text-sm text-slate-700 italic">"{currentText}"</p>
          </Card>
        )}

        {/* AI Step-by-step terminal */}
        <Card className="mb-5 overflow-hidden">
          <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-slate-400 text-xs font-mono ml-2">AI Orchestrator — Processing</span>
          </div>

          <div className="bg-slate-950 p-4 space-y-2 min-h-[280px]">
            {analysis.steps.map((step, i) => (
              <AnimatePresence key={i}>
                {i < visibleSteps && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-3 ai-terminal step-in"
                  >
                    {i < visibleSteps - 1 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0 animate-spin" />
                    )}
                    <div className="min-w-0">
                      <span className="text-slate-400 text-xs">[{step.agent}] </span>
                      <span className="text-green-300 text-xs font-medium">{step.action}</span>
                      {i < visibleSteps - 1 && (
                        <div className="text-slate-300 text-xs mt-0.5 truncate">→ {step.result}</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}

            {/* Processing indicator */}
            {visibleSteps < analysis.steps.length && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-slate-500 text-xs font-mono">Analyzing...</span>
              </div>
            )}
          </div>
        </Card>

        {/* Incident detection banner */}
        <AnimatePresence>
          {phase !== 'analyzing' && analysis.relatedIncident && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="mb-5"
            >
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 text-lg">🔍 Related Complaints Found!</h3>
                    <p className="text-amber-700 text-sm mt-1">
                      <span className="font-black text-2xl text-amber-800">{analysis.relatedComplaintCount}</span>
                      {' '}complaints from nearby locations reporting the same problem.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                        Creating civic incident...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow reduction visual */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-amber-700">{analysis.relatedComplaintCount}</div>
                    <div className="text-xs text-amber-600 font-medium">Complaints</div>
                  </div>
                  <div className="text-amber-500 font-bold text-xl">→</div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-amber-900">1</div>
                    <div className="text-xs text-amber-600 font-medium">Civic Incident</div>
                  </div>
                  <div className="bg-amber-200 rounded-xl px-4 py-2 text-center">
                    <div className="font-mono font-bold text-amber-900 text-sm">{analysis.relatedIncident}</div>
                    <div className="text-xs text-amber-700">Incident ID</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="mb-5">
                <div className="bg-blue-700 text-white px-5 py-4 rounded-t-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-blue-200" />
                    <h2 className="font-bold text-lg">AI Analysis Results</h2>
                  </div>
                  <p className="text-blue-200 text-xs">Confidence: {analysis.confidence}%</p>
                </div>

                <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    { label: 'Language', value: analysis.language },
                    { label: 'Category', value: analysis.category },
                    { label: 'Issue', value: analysis.issue },
                    { label: 'Severity', value: analysis.severity },
                    { label: 'Time', value: analysis.timeReference },
                    { label: 'Affected', value: analysis.affectedPopulation },
                    { label: 'Location', value: analysis.ward || 'Ward 12' },
                    { label: 'Confidence', value: `${analysis.confidence}%` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Button
                onClick={() => navigate('/citizen/incident')}
                size="lg"
                icon={<ChevronRight className="w-5 h-5" />}
                className="w-full justify-center"
              >
                View Civic Incident →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

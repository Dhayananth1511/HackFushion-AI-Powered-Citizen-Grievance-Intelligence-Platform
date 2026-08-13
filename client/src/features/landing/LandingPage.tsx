import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, MessageSquare, Brain, AlertTriangle, BarChart3, Route, Wrench, CheckCircle2,
  Globe, Camera, Zap, MapPin, RefreshCw, Play, ArrowRight, Users, Shield
} from 'lucide-react';
import { useAppStore } from '../../store';

const workflow = [
  { icon: MessageSquare, label: 'Citizen Complaint', color: 'bg-blue-500' },
  { icon: Brain, label: 'AI Understanding', color: 'bg-violet-500' },
  { icon: AlertTriangle, label: 'Incident Detection', color: 'bg-orange-500' },
  { icon: BarChart3, label: 'Priority & Risk', color: 'bg-red-500' },
  { icon: Route, label: 'Department Routing', color: 'bg-amber-500' },
  { icon: Wrench, label: 'Action & Progress', color: 'bg-teal-500' },
  { icon: CheckCircle2, label: 'Resolution', color: 'bg-green-500' },
  { icon: Shield, label: 'Citizen Verification', color: 'bg-blue-600' },
];

const features = [
  { icon: Globe, title: 'Multilingual AI', desc: 'Tamil · English · Tanglish', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Camera, title: 'Multimodal Input', desc: 'Text · Voice · Image · Location', color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: Brain, title: 'Incident Intelligence', desc: 'Duplicate Detection · Semantic Clustering', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: MapPin, title: 'Live Tracking', desc: 'Real-time Status · Full Timeline', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: RefreshCw, title: 'Closed Loop', desc: 'Citizen Verification · Auto-Reopen', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: BarChart3, title: 'AI Priority Score', desc: 'Transparent Weighted Scoring', color: 'text-red-600', bg: 'bg-red-50' },
];

const stats = [
  { label: 'Complaints Reduced', value: '88%', sub: 'via incident clustering' },
  { label: 'Avg Resolution Time', value: '4.2h', sub: 'vs 72h traditional' },
  { label: 'Citizen Satisfaction', value: '94%', sub: 'verified resolutions' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useAppStore();

  const goToCitizen = () => { setRole('citizen'); navigate('/citizen'); };
  const goToOfficer = () => { setRole('officer'); navigate('/officer'); };
  const goToReport = () => { setRole('citizen'); navigate('/citizen/report'); };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Top Nav ─── */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900">CivicAI</span>
              <span className="text-slate-400 text-xs ml-2 hidden sm:inline">Grievance Intelligence Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={goToOfficer} className="text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              Officer Login
            </button>
            <button onClick={goToReport} className="flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-800 transition-colors shadow-sm">
              Report a Problem <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-6">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3 h-3" /> HackFushion 2026 · AI-Powered Civic Tech
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          >
            AI-Powered Citizen<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              Grievance Intelligence
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          >
            Report naturally. Track transparently. Resolve intelligently.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
          >
            <button
              onClick={goToReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-xl hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" /> Report a Problem
            </button>
            <button
              onClick={goToCitizen}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Shield className="w-5 h-5" /> Track My Complaint
            </button>
            <button
              onClick={goToOfficer}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Users className="w-5 h-5" /> Officer Dashboard
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-blue-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black mb-1">{s.value}</div>
              <div className="text-blue-200 text-sm font-semibold">{s.label}</div>
              <div className="text-blue-300 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">One complaint triggers an intelligent cascade — from natural language understanding to verified resolution.</p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-16" />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {workflow.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-sm relative z-10`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 leading-tight">{label}</span>
                  {i < workflow.length - 1 && (
                    <ArrowRight className="lg:hidden w-4 h-4 text-slate-300 mx-auto" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Platform Capabilities</h2>
            <p className="text-slate-500">Every feature working together to close the loop between complaint and resolution.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
              >
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Innovation CTA ─── */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Traditional vs Our Platform</h2>
          <div className="grid grid-cols-2 gap-6 mb-10 text-left">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-slate-400 text-sm mb-4 uppercase tracking-wider">Traditional System</h3>
              {['Complaint', 'Ticket', 'Department'].map((s, i) => (
                <div key={i} className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <span className="text-slate-300 text-sm">{s}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
              <h3 className="font-bold text-blue-300 text-sm mb-4 uppercase tracking-wider">Our Platform</h3>
              {['Citizen Signal', 'AI Understanding', 'Incident Intelligence', 'Priority & Risk', 'Coordination', 'Live Progress', 'Resolution', 'Citizen Verification'].map((s, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <span className="text-blue-100 text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-300 text-lg italic mb-8 leading-relaxed">
            "We don't just register complaints. We understand the civic incident behind them,
            coordinate the response, keep citizens informed, and verify that the problem is actually resolved."
          </p>

          <button
            onClick={goToReport}
            className="flex items-center gap-3 mx-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-blue-900/40 text-lg"
          >
            <Play className="w-5 h-5" /> Try the Demo Now
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white text-sm">CivicAI</span>
        </div>
        <p className="text-xs">AI-Powered Citizen Grievance Intelligence Platform · HackFushion 2026</p>
      </footer>
    </div>
  );
};

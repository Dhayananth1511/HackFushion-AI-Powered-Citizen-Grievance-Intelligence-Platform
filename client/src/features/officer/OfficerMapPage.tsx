import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Layers, Eye,
  Building2, Navigation, X, ShieldAlert
} from 'lucide-react';
import { AppLayout } from '../../components/layout';
import { Card, Button, PriorityBadge, StatusBadge } from '../../components/ui';

interface WardSpatialData {
  ward: string;
  name: string;
  healthScore: number;
  activeCount: number;
  affectedPopulation: number;
  topIssue: string;
  coordinates: { x: number; y: number }; // percentage position on map canvas
}

const WARDS: WardSpatialData[] = [
  { ward: 'Ward 12', name: 'Anna Nagar', healthScore: 42, activeCount: 5, affectedPopulation: 340, topIssue: 'Water Supply', coordinates: { x: 35, y: 30 } },
  { ward: 'Ward 9', name: 'T Nagar', healthScore: 68, activeCount: 3, affectedPopulation: 180, topIssue: 'Road Damage', coordinates: { x: 62, y: 45 } },
  { ward: 'Ward 17', name: 'Adyar', healthScore: 55, activeCount: 4, affectedPopulation: 220, topIssue: 'Garbage', coordinates: { x: 75, y: 72 } },
  { ward: 'Ward 5', name: 'Mylapore', healthScore: 88, activeCount: 1, affectedPopulation: 45, topIssue: 'Streetlight', coordinates: { x: 70, y: 55 } },
  { ward: 'Ward 21', name: 'Velachery', healthScore: 35, activeCount: 6, affectedPopulation: 510, topIssue: 'Drainage', coordinates: { x: 48, y: 78 } },
  { ward: 'Ward 1', name: 'George Town', healthScore: 74, activeCount: 2, affectedPopulation: 90, topIssue: 'Traffic', coordinates: { x: 50, y: 18 } },
];

const MAP_PINS = [
  { id: 'INC-1042', title: 'Water Supply Disruption', category: 'Water Supply', ward: 'Ward 12', priorityLevel: 'HIGH', priorityScore: 91, status: 'in_progress', affected: 48, x: 36, y: 32 },
  { id: 'INC-1038', title: 'Road Surface Damage', category: 'Road Damage', ward: 'Ward 9', priorityLevel: 'MEDIUM', priorityScore: 72, status: 'assigned', affected: 31, x: 60, y: 43 },
  { id: 'INC-1032', title: 'Garbage Accumulation', category: 'Garbage', ward: 'Ward 17', priorityLevel: 'HIGH', priorityScore: 78, status: 'detected', affected: 48, x: 76, y: 70 },
  { id: 'INC-1029', title: 'Streetlight Failure', category: 'Streetlight', ward: 'Ward 5', priorityLevel: 'LOW', priorityScore: 45, status: 'resolved', affected: 12, x: 68, y: 53 },
  { id: 'INC-1015', title: 'Drainage Overflow Surge', category: 'Drainage', ward: 'Ward 21', priorityLevel: 'HIGH', priorityScore: 86, status: 'reopened', affected: 65, x: 50, y: 80 },
];

export const OfficerMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState<WardSpatialData>(WARDS[0]);
  const [selectedPin, setSelectedPin] = useState<typeof MAP_PINS[0] | null>(MAP_PINS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [heatmapMode, setHeatmapMode] = useState<boolean>(false);

  const filteredPins = MAP_PINS.filter(pin => categoryFilter === 'all' || pin.category === categoryFilter);

  const getPinColor = (level: string, status: string) => {
    if (status === 'resolved') return 'bg-green-500 border-green-200 text-white';
    if (level === 'HIGH') return 'bg-red-600 border-red-200 text-white animate-bounce';
    if (level === 'MEDIUM') return 'bg-amber-500 border-amber-200 text-white';
    return 'bg-blue-500 border-blue-200 text-white';
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">GIS Ward & Spatial Intelligence Map</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Live spatial overview of complaints, ward health indices, and high-density grievance zones
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setHeatmapMode(!heatmapMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                heatmapMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              {heatmapMode ? 'Heatmap Overlay Active' : 'Show Priority Heatmap'}
            </button>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Issue Types</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Garbage">Garbage</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Drainage">Drainage</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Map canvas + Ward sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map canvas container */}
          <Card className="lg:col-span-2 relative min-h-[500px] overflow-hidden p-0 bg-slate-900 border-slate-800 flex flex-col">
            {/* Map Header Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2 text-white flex items-center gap-3">
              <Navigation className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs font-bold leading-none">Greater Chennai Municipal Spatial View</p>
                <p className="text-[10px] text-slate-400 leading-none mt-1">Real-time telemetry overlay</p>
              </div>
            </div>

            {/* Interactive Simulated Map Background */}
            <div className="relative flex-1 w-full h-[520px] bg-slate-950 overflow-hidden select-none">
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

              {/* Heatmap Overlay Layer */}
              {heatmapMode && (
                <div className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-500">
                  <div className="absolute top-[25%] left-[30%] w-48 h-48 bg-red-500 rounded-full blur-3xl" />
                  <div className="absolute top-[65%] left-[45%] w-60 h-60 bg-amber-500 rounded-full blur-3xl" />
                  <div className="absolute top-[65%] left-[70%] w-40 h-40 bg-red-600 rounded-full blur-3xl" />
                </div>
              )}

              {/* Ward Boundaries (SVG representation) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
                <polygon points="100,80 320,60 380,240 180,260" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" />
                <polygon points="320,60 620,80 680,300 380,240" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
                <polygon points="380,240 680,300 620,480 300,440" fill="#ef4444" stroke="#f87171" strokeWidth="2" />
                <polygon points="180,260 380,240 300,440 120,400" fill="#8b5cf6" stroke="#c084fc" strokeWidth="2" />
              </svg>

              {/* Ward Labels */}
              {WARDS.map((w) => (
                <div
                  key={w.ward}
                  onClick={() => setSelectedWard(w)}
                  style={{ left: `${w.coordinates.x}%`, top: `${w.coordinates.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    selectedWard.ward === w.ward ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold shadow-lg flex items-center gap-1.5 ${
                    selectedWard.ward === w.ward
                      ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-500/30'
                      : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}>
                    <Building2 className="w-3 h-3 text-blue-400" />
                    <span>{w.ward} ({w.name})</span>
                  </div>
                </div>
              ))}

              {/* Spatial Incident Pins */}
              {filteredPins.map((pin) => {
                const isSelected = selectedPin?.id === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => { setSelectedPin(pin); setSelectedWard(WARDS.find(w => w.ward === pin.ward) || WARDS[0]); }}
                    style={{ left: `${pin.x}%`, top: `${pin.y + 6}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`relative p-2 rounded-full shadow-2xl border-2 ${getPinColor(pin.priorityLevel, pin.status)}`}>
                      <MapPin className="w-5 h-5" />
                      {pin.priorityLevel === 'HIGH' && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Pin Footer Drawer inside map */}
            <AnimatePresence>
              {selectedPin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-slate-800/95 backdrop-blur-md border-t border-slate-700 p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-300 bg-slate-700 px-2 py-0.5 rounded">
                          {selectedPin.id}
                        </span>
                        <PriorityBadge level={selectedPin.priorityLevel as any} size="sm" />
                        <StatusBadge status={selectedPin.status} />
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1">{selectedPin.title} ({selectedPin.ward})</h4>
                      <p className="text-xs text-slate-400">{selectedPin.affected} citizens affected · Category: {selectedPin.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Eye className="w-4 h-4" />}
                      onClick={() => navigate(`/officer/incidents/${selectedPin.id}`)}
                    >
                      View Incident
                    </Button>
                    <button
                      onClick={() => setSelectedPin(null)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Ward Details & Metrics Sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedWard.ward} Overview</h3>
                  <p className="text-xs text-slate-500">{selectedWard.name} Zone</p>
                </div>
                <div className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  selectedWard.healthScore >= 70 ? 'bg-green-50 text-green-700 border border-green-200' :
                  selectedWard.healthScore >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  Health Index: {selectedWard.healthScore}/100
                </div>
              </div>

              {/* Ward Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Open Incidents</span>
                  <span className="text-xl font-bold text-slate-900">{selectedWard.activeCount}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Affected Citizens</span>
                  <span className="text-xl font-bold text-blue-600">{selectedWard.affectedPopulation}</span>
                </div>
              </div>

              {/* Primary issue */}
              <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl mb-4">
                <p className="text-xs font-semibold text-blue-900">Primary Ward Issue:</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{selectedWard.topIssue}</p>
              </div>

              {/* Wards list selector */}
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Ward Zone</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {WARDS.map(w => (
                  <button
                    key={w.ward}
                    onClick={() => setSelectedWard(w)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedWard.ward === w.ward
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{w.ward} - {w.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      w.healthScore < 50 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {w.activeCount} open
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, User, Shield, ChevronDown, Bell, LayoutDashboard, FileText, AlertTriangle, Map, Cpu, ClipboardList } from 'lucide-react';
import { useAppStore } from '../../store';
import { Button } from '../ui';

// ─── Navbar ────────────────────────────────────────────────────────────────────
export const Navbar: React.FC = () => {
  const { role, setRole } = useAppStore();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole: 'citizen' | 'officer') => {
    setRole(newRole);
    navigate(newRole === 'citizen' ? '/citizen' : '/officer');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base leading-none">CivicAI</span>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Grievance Intelligence</p>
            </div>
          </Link>

          {/* Role Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => handleRoleSwitch('citizen')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'citizen'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              Citizen
            </button>
            <button
              onClick={() => handleRoleSwitch('officer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'officer'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              Officer
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-700" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">
                  {role === 'citizen' ? 'Priya Ramesh' : 'Officer Ramesh'}
                </p>
                <p className="text-xs text-slate-500 leading-none mt-0.5 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Citizen Sidebar ──────────────────────────────────────────────────────────
const citizenNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/citizen' },
  { label: 'Report Problem', icon: FileText, path: '/citizen/report' },
  { label: 'My Complaints', icon: ClipboardList, path: '/citizen/complaints' },
];

const officerNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/officer' },
  { label: 'Incidents', icon: AlertTriangle, path: '/officer/incidents' },
  { label: 'Map View', icon: Map, path: '/officer/map' },
  { label: 'AI Operations', icon: Cpu, path: '/officer/ai' },
];

export const Sidebar: React.FC = () => {
  const { role } = useAppStore();
  const location = useLocation();
  const nav = role === 'citizen' ? citizenNav : officerNav;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex-shrink-0 hidden lg:block">
      <nav className="p-4 space-y-1">
        {nav.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path || (path !== '/citizen' && path !== '/officer' && location.pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

// ─── App Layout ───────────────────────────────────────────────────────────────
export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 p-6 min-w-0">{children}</main>
    </div>
  </div>
);

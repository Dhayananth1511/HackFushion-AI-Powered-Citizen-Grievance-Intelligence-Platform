import React from 'react';
import type { PriorityLevel, IncidentStatus } from '../../types';

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
    outline: 'border-2 border-blue-700 text-blue-700 hover:bg-blue-50 focus:ring-blue-400',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" color="white" /> : icon}
      {children}
    </button>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({
  size = 'md', color = 'blue-600'
}) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-current border-t-transparent text-${color}`} />
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover, onClick }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm ${hover ? 'hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// ─── Priority Badge ───────────────────────────────────────────────────────────
export const PriorityBadge: React.FC<{ level: PriorityLevel; size?: 'sm' | 'md' }> = ({
  level, size = 'md'
}) => {
  const colors = {
    HIGH: 'bg-red-100 text-red-700 border-red-200',
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    LOW: 'bg-green-100 text-green-700 border-green-200',
  };
  const dots = {
    HIGH: 'bg-red-500',
    CRITICAL: 'bg-red-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-green-500',
  };
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${colors[level] || colors.LOW} ${sz}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level] || dots.LOW} ${level === 'HIGH' || level === 'CRITICAL' ? 'pulse-dot' : ''}`} />
      {level}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; cls: string }> = {
    detected: { label: 'Detected', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    assigned: { label: 'Assigned', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    accepted: { label: 'Accepted', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    in_progress: { label: 'In Progress', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-700 border-green-200' },
    monitoring: { label: 'Monitoring', cls: 'bg-teal-100 text-teal-700 border-teal-200' },
    closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    reopened: { label: 'Reopened', cls: 'bg-red-100 text-red-700 border-red-200' },
    escalated: { label: 'Escalated', cls: 'bg-orange-100 text-orange-700 border-orange-200' },
    linked: { label: 'Linked', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    new: { label: 'New', cls: 'bg-green-100 text-green-700 border-green-200' },
  };
  const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
}> = ({ label, value, icon, color = 'blue', trend }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <p className={`text-3xl font-bold text-${color}-700`}>{value}</p>
        {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
      </div>
      <div className={`w-11 h-11 bg-${color}-50 rounded-xl flex items-center justify-center text-${color}-600`}>
        {icon}
      </div>
    </div>
  </Card>
);

// ─── Section Header ───────────────────────────────────────────────────────────
export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title, subtitle, action
}) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description?: string }> = ({
  icon, title, description
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-4xl mb-4 text-slate-300">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
    {description && <p className="text-sm text-slate-500 mt-1 max-w-xs">{description}</p>}
  </div>
);

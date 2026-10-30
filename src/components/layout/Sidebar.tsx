import React from 'react';
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  FileSearch,
  ShieldCheck,
  GitBranch,
  AlertTriangle,
  Cpu,
  Bell,
  Building,
  Users,
  BarChart3,
  ScrollText,
  UserCog,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useApp } from '../../context/AppContext.tsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { currentUser } = useAuth();
  const { applications, notifications } = useApp();

  const pendingCount = applications.filter(a =>
    a.status === 'Submitted' || a.status === 'Under Scrutiny' || a.status === 'Correction Required'
  ).length;

  const unreadAlerts = notifications.filter(n => !n.read).length;
  const highRiskCount = applications.filter(a => a.riskCategory === 'Critical' || a.riskCategory === 'High').length;

  const role = currentUser?.role || 'SUPER_ADMIN';

  // Navigation Items with RBAC visibility rules
  const navItems = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: LayoutDashboard,
      badge: null,
      visible: true
    },
    {
      id: 'applications',
      label: 'Applications Directory',
      icon: FileText,
      badge: pendingCount > 0 ? String(pendingCount) : null,
      badgeColor: 'bg-blue-100 text-blue-700',
      visible: true
    },
    {
      id: 'new-application',
      label: 'New AICTE Application',
      icon: FilePlus2,
      badge: 'Submit',
      badgeColor: 'bg-emerald-100 text-emerald-700 font-bold',
      visible: role === 'INSTITUTION_ADMIN' || role === 'SUPER_ADMIN'
    },
    {
      id: 'document-intelligence',
      label: 'AI OCR & Intelligence',
      icon: FileSearch,
      badge: 'Gemini',
      badgeColor: 'bg-sky-100 text-sky-700 font-semibold',
      visible: true
    },
    {
      id: 'compliance',
      label: 'Compliance Engine',
      icon: ShieldCheck,
      badge: null,
      visible: (role as string) !== 'INSTITUTION_ADMIN' || (role as string) === 'SUPER_ADMIN'
    },
    {
      id: 'workflow',
      label: 'Workflow Orchestration',
      icon: GitBranch,
      badge: null,
      visible: true
    },
    {
      id: 'risk',
      label: 'Explainable Risk Engine',
      icon: AlertTriangle,
      badge: highRiskCount > 0 ? `${highRiskCount} Risk` : null,
      badgeColor: 'bg-red-100 text-red-700 font-bold',
      visible: true
    },
    {
      id: 'simulation',
      label: 'Digital Twin Simulator',
      icon: Cpu,
      badge: 'Discrete Sim',
      badgeColor: 'bg-purple-100 text-purple-700 font-semibold',
      visible: role === 'SENIOR_OFFICER' || role === 'SUPER_ADMIN' || role === 'COMPLIANCE_ADMIN'
    },
    {
      id: 'alerts',
      label: 'Alerts & Notifications',
      icon: Bell,
      badge: unreadAlerts > 0 ? String(unreadAlerts) : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold',
      visible: true
    },
    {
      id: 'institutions',
      label: 'Institutions Directory',
      icon: Building,
      badge: '15 Active',
      badgeColor: 'bg-slate-100 text-slate-600',
      visible: true
    },
    {
      id: 'officers',
      label: 'Officer Workload',
      icon: Users,
      badge: null,
      visible: role === 'SENIOR_OFFICER' || role === 'SUPER_ADMIN' || role === 'SCRUTINY_OFFICER'
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      badge: 'PDF / CSV',
      badgeColor: 'bg-slate-100 text-slate-700',
      visible: true
    },
    {
      id: 'audit',
      label: 'Audit Trail & Security',
      icon: ScrollText,
      badge: 'Immutable',
      badgeColor: 'bg-emerald-50 text-emerald-800',
      visible: role === 'SUPER_ADMIN' || role === 'SENIOR_OFFICER' || role === 'COMPLIANCE_ADMIN'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: UserCog,
      badge: null,
      visible: role === 'SUPER_ADMIN'
    },
    {
      id: 'settings',
      label: 'System Settings & SLA',
      icon: Settings,
      badge: null,
      visible: role === 'SUPER_ADMIN' || role === 'COMPLIANCE_ADMIN'
    }
  ];

  return (
    <aside className="w-64 bg-[#17365D] text-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-76px)] shadow-md border-r border-[#112743]">
      {/* Role Indicator Banner */}
      <div className="p-3.5 m-3 rounded-lg bg-white/5 border border-white/10 text-xs">
        <p className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">
          Active Clearance Portal
        </p>
        <p className="font-semibold text-white mt-0.5 truncate">
          {currentUser?.name || 'Authorized Official'}
        </p>
        <div className="flex items-center space-x-1.5 mt-1.5 text-[10px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Access Level: <strong className="text-white">{role.replace('_', ' ')}</strong></span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems
          .filter(item => item.visible)
          .map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1769AA] text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
                      item.badgeColor || 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-sky-300" />
          <span>APH 2026-27 Compliant</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
      </div>
    </aside>
  );
};

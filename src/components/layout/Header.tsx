import React, { useState } from 'react';
import {
  Bell,
  Search,
  User as UserIcon,
  Shield,
  RotateCcw,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types/index.ts';

export const Header: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const { currentUser, switchUserRole, logout, allUsers } = useAuth();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    resetDemoData,
    showToast
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', badge: 'bg-purple-100 text-purple-800' },
    SENIOR_OFFICER: { label: 'Senior Officer', badge: 'bg-indigo-100 text-indigo-800' },
    SCRUTINY_OFFICER: { label: 'Scrutiny Officer', badge: 'bg-blue-100 text-blue-800' },
    COMPLIANCE_ADMIN: { label: 'Compliance Admin', badge: 'bg-amber-100 text-amber-800' },
    INSTITUTION_ADMIN: { label: 'Institution Admin', badge: 'bg-emerald-100 text-emerald-800' },
  };

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    setShowRoleMenu(false);
    showToast(`Switched active view to ${roleLabels[role]?.label || role}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* SIH 2026 Top Official Bar */}
      <div className="bg-[#17365D] text-white text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-[#0f243e]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-white/10 px-2 py-0.5 rounded text-[10px] font-semibold text-amber-300 tracking-wider">
            <span>SIH 2026</span>
            <span className="text-white/40">|</span>
            <span>PROBLEM ID: SIH 26262</span>
          </div>
          <span className="hidden md:inline text-slate-300">
            Smart Automation | Team: <strong className="text-white font-semibold">555_DIAMOND</strong>
          </span>
          <span className="hidden lg:inline text-slate-400">
            • AICTE Approval Workflow Automation & Compliance Management
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => {
              if (window.confirm('Reset the demonstration database to initial seed records?')) {
                resetDemoData();
              }
            }}
            className="flex items-center space-x-1 text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 px-2 py-0.5 rounded transition-colors text-[11px]"
            title="Reset database to fresh seed applications"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>
          <div className="h-3 w-px bg-white/20 hidden sm:block"></div>
          <span className="text-emerald-300 flex items-center gap-1 font-medium text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Firestore API Online
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#17365D] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[#1769AA] transition-colors">
              <Shield className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#17365D]">
                  REGENTRA <span className="text-[#1769AA]">AI</span>
                </span>
                <span className="text-[10px] bg-[#EAF3FB] text-[#1769AA] font-bold px-1.5 py-0.2 rounded border border-[#1769AA]/20">
                  APH 2026-27
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block leading-none">
                AICTE Approval Workflow & Compliance Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications (e.g. REG-2026-00001, institute, course)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#1769AA] focus:bg-white text-[#202B3C] placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Tools: Role Switcher, Notifications, User */}
        <div className="flex items-center space-x-2.5">
          {/* Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
                setShowUserMenu(false);
              }}
              className="flex items-center space-x-2 bg-[#EAF3FB] hover:bg-[#d9ecfa] border border-[#1769AA]/30 text-[#17365D] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1769AA]" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-[#1769AA] font-bold">
                {currentUser ? roleLabels[currentUser.role]?.label : 'Select Role'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Switch Demo Persona (RBAC)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Test role-protected views and workflows
                  </p>
                </div>
                <div className="py-1">
                  {allUsers.slice(0, 5).map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleRoleSelect(u.role)}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentUser?.role === u.role ? 'bg-sky-50/70 font-semibold' : ''
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.designation || u.department}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${roleLabels[u.role]?.badge}`}>
                        {roleLabels[u.role]?.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-[#17365D] hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC3545] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 py-2">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-800">Alerts & Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-1.5 py-0.2 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-[#1769AA] hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications available
                    </div>
                  ) : (
                    notifications.slice(0, 6).map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.applicationId && onNavigate) {
                            onNavigate('applications');
                          }
                          setShowNotifMenu(false);
                        }}
                        className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.read ? 'bg-sky-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800 leading-tight">
                            {n.title}
                          </p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              n.priority === 'Critical'
                                ? 'bg-red-100 text-red-700'
                                : n.priority === 'High'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {n.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1.5">
                          {new Date(n.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      if (onNavigate) onNavigate('alerts');
                    }}
                    className="text-xs text-[#1769AA] font-semibold hover:underline"
                  >
                    View All Notifications & Reminders →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowRoleMenu(false);
                setShowNotifMenu(false);
              }}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden lg:block leading-tight">
                <p className="text-xs font-semibold text-[#17365D] max-w-[130px] truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {currentUser ? roleLabels[currentUser.role]?.label : 'User'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-xs text-slate-800">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-[#EAF3FB] text-[#1769AA] px-2 py-0.5 rounded">
                    {currentUser?.department || roleLabels[currentUser?.role || 'SUPER_ADMIN']?.label}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onNavigate) onNavigate('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Account Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onNavigate) onNavigate('settings');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>System Settings & SLA</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      if (onNavigate) onNavigate('landing');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

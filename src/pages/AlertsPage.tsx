import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Eye,
  CheckCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { NotificationType } from '../types/index.ts';

export const AlertsPage: React.FC<{
  onSelectApplication: (id: string) => void;
}> = ({ onSelectApplication }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  const filtered = notifications.filter(n => {
    if (priorityFilter !== 'ALL' && n.priority !== priorityFilter) return false;
    if (statusFilter === 'UNREAD' && n.read) return false;
    if (statusFilter === 'READ' && !n.read) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 10
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Predictive SLA Breach & Statutory Alerts</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Alert & Notification Intelligence Centre
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated notifications for missing documents, approaching statutory deadlines, and risk escalations
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="bg-[#1769AA] hover:bg-[#13578c] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-700">Filter By Status:</span>
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {(['ALL', 'UNREAD', 'READ'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? 'bg-white text-[#17365D] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s === 'ALL' ? 'All Alerts' : s === 'UNREAD' ? `Unread (${unreadCount})` : 'Read'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500">Filter Priority:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200 text-xs">
            No notifications found matching selected filters.
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                !notif.read
                  ? 'bg-white border-[#1769AA]/40 shadow-xs ring-1 ring-[#1769AA]/20'
                  : 'bg-white/80 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    notif.priority === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : notif.priority === 'High'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-sky-100 text-[#1769AA]'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-[#17365D]">{notif.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                        notif.priority === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : notif.priority === 'High'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {notif.priority} Priority
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                    )}
                  </div>

                  <p className="text-slate-700 text-xs mt-1 leading-relaxed">{notif.message}</p>

                  <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-400">
                    {notif.institutionName && (
                      <span>Institution: <strong>{notif.institutionName}</strong></span>
                    )}
                    <span>•</span>
                    <span>{new Date(notif.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                {!notif.read && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded bg-slate-100"
                  >
                    Mark Read
                  </button>
                )}
                {notif.applicationId && (
                  <button
                    onClick={() => onSelectApplication(notif.applicationId!)}
                    className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <span>View Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

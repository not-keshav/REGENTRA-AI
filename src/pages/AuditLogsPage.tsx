import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Lock,
  Shield,
  Clock,
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const AuditLogsPage: React.FC<{
  onSelectApplication: (id: string) => void;
}> = ({ onSelectApplication }) => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filtered = auditLogs.filter(log => {
    if (roleFilter !== 'ALL' && log.userRole !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        (log.applicationId && log.applicationId.toLowerCase().includes(q)) ||
        (log.remarks && log.remarks.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 13
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Statutory Compliance Assurance</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Immutable Audit Trail & Regulatory Governance Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident chronological record of all institutional submissions, officer verifications, deficiency issuances, and final statutory decisions
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Cryptographically Sealed Log Storage</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action (e.g. APPLICATION_APPROVED), user name, application ID, or remarks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500">Filter By Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="SENIOR_OFFICER">Senior Officer</option>
            <option value="SCRUTINY_OFFICER">Scrutiny Officer</option>
            <option value="COMPLIANCE_ADMIN">Compliance Admin</option>
            <option value="INSTITUTION_ADMIN">Institution Admin</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#17365D] text-white font-semibold">
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Official / Actor</th>
                <th className="py-3 px-4">Authority Role</th>
                <th className="py-3 px-4">Statutory Action</th>
                <th className="py-3 px-4">Target Application</th>
                <th className="py-3 px-4">Operational Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {log.userName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {log.userRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#17365D]">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4">
                      {log.applicationId ? (
                        <button
                          onClick={() => onSelectApplication(log.applicationId!)}
                          className="font-bold text-[#1769AA] hover:underline"
                        >
                          {log.applicationId}
                        </button>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                      {log.remarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

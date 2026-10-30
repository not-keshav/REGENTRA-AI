import React from 'react';
import { UserCog, Shield, Mail, Building2, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const UserManagementPage: React.FC = () => {
  const { allUsers, currentUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Super Admin Control
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Platform Users & Access Control Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active scrutiny officers, regional directors, compliance administrators, and institutional representatives
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#17365D] text-white font-semibold">
                <th className="py-3 px-4">Officer / Official Name</th>
                <th className="py-3 px-4">Authority Role</th>
                <th className="py-3 px-4">Designation & Department</th>
                <th className="py-3 px-4">Official Email</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-[#1769AA] border border-sky-200">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <p className="font-semibold">{user.designation || 'Statutory Official'}</p>
                    <p className="text-[10px] text-slate-400">{user.department || 'AICTE Directorate'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                      Active Clearance
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

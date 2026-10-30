import React from 'react';
import { User, Shield, Mail, Building2, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-[#17365D] text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
            {currentUser?.name.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#17365D]">{currentUser?.name}</h1>
            <p className="text-xs font-semibold text-[#1769AA] mt-0.5">{currentUser?.designation || 'Statutory Official'}</p>
            <p className="text-xs text-slate-500">{currentUser?.department || 'AICTE HQ Approvals Bureau'}</p>
          </div>
        </div>

        <div className="py-5 space-y-3.5 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Official Clearance Level</span>
            <span className="font-bold text-[#17365D] bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
              {currentUser?.role.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Government Email ID</span>
            <span className="font-mono font-bold text-slate-800">{currentUser?.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Session Verification Status</span>
            <span className="text-emerald-700 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cryptographically Authenticated</span>
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 font-medium">Statutory Authority Act</span>
            <span className="text-slate-700 font-semibold">AICTE Act 1987 / APH 2026-27</span>
          </div>
        </div>
      </div>
    </div>
  );
};

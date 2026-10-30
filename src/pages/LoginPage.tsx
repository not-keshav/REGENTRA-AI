import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';

export const LoginPage: React.FC<{ onSuccess: () => void; onBackToHome: () => void }> = ({
  onSuccess,
  onBackToHome
}) => {
  const { login, allUsers } = useAuth();
  const [email, setEmail] = useState('superadmin@regentra.aicte.gov.in');
  const [password, setPassword] = useState('GovTech@2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const ok = await login(email);
    setLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError('Invalid credentials or unregistered government officer email.');
    }
  };

  const handleQuickDemoSelect = async (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    setLoading(true);
    const ok = await login(demoEmail, role);
    setLoading(false);
    if (ok) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2.5 cursor-pointer mb-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-[#1769AA] transition-colors">
            <Shield className="w-6 h-6 text-sky-300" />
          </div>
          <div className="text-left">
            <span className="text-xl font-extrabold tracking-tight text-[#17365D]">
              REGENTRA <span className="text-[#1769AA]">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium">SIH 2026 • AICTE Approval Automation</p>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-[#17365D]">
          Sign in to Institutional Clearance Portal
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Enter credentials or choose a pre-configured role persona below
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-8 border border-slate-200">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Official Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="officer@aicte.gov.in"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Access Password / Token
              </label>
              <div className="mt-1 relative rounded-md shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-[#17365D] hover:bg-[#102742] focus:outline-none transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Quick Demo Environment Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
              <UserCheck className="w-4 h-4 text-[#1769AA]" />
              <span>Select Pre-configured Demo Persona:</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              One-click access with simulated permissions and realistic institutional records:
            </p>

            <div className="space-y-2">
              {[
                {
                  role: 'SUPER_ADMIN' as UserRole,
                  email: 'superadmin@regentra.aicte.gov.in',
                  name: 'Dr. R. K. Shrivastava',
                  title: 'Super Admin (AICTE HQ)',
                  color: 'border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-900'
                },
                {
                  role: 'SENIOR_OFFICER' as UserRole,
                  email: 'snr.anand@regentra.aicte.gov.in',
                  name: 'Prof. Anand V. Vardhan',
                  title: 'Senior Officer (Regional Approvals)',
                  color: 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900'
                },
                {
                  role: 'SCRUTINY_OFFICER' as UserRole,
                  email: 'so.priya@regentra.aicte.gov.in',
                  name: 'Priya Narayanan',
                  title: 'Scrutiny Officer (Zone A)',
                  color: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-900'
                },
                {
                  role: 'COMPLIANCE_ADMIN' as UserRole,
                  email: 'compliance.verma@regentra.aicte.gov.in',
                  name: 'Sunil Kumar Verma',
                  title: 'Compliance Admin (Regulatory Cell)',
                  color: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900'
                },
                {
                  role: 'INSTITUTION_ADMIN' as UserRole,
                  email: 'principal@aryabhatta-tech.edu.in',
                  name: 'Dr. S. K. Bhattacharya',
                  title: 'Institution Admin (Aryabhatta Inst)',
                  color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900'
                }
              ].map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickDemoSelect(acc.email, acc.role)}
                  className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-colors ${acc.color}`}
                >
                  <div>
                    <p className="font-bold">{acc.name}</p>
                    <p className="text-[10px] opacity-80">{acc.title}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white shadow-2xs">
                    Switch →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

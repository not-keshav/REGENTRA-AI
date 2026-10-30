import React from 'react';
import {
  Shield,
  ArrowRight,
  FileCheck2,
  Cpu,
  AlertTriangle,
  Scale,
  GitBranch,
  Building2,
  CheckCircle2,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const LandingPage: React.FC<{ onGetStarted: () => void; onLogin: () => void }> = ({
  onGetStarted,
  onLogin,
}) => {
  const { switchUserRole } = useAuth();

  const handleQuickDemo = (role: any) => {
    switchUserRole(role);
    onGetStarted();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#202B3C] flex flex-col">
      {/* Top SIH Hackathon Official Banner */}
      <div className="bg-[#17365D] text-white py-2 px-4 text-xs font-medium border-b border-[#0f243e]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider">
              SMART INDIA HACKATHON 2026
            </span>
            <span className="text-sky-200">Problem Statement ID: <strong>SIH 26262</strong></span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">Team: <strong>555_DIAMOND</strong></span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">Theme: Smart Automation</span>
          </div>
          <div className="text-[11px] text-slate-300 flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>APH 2026-27 Compliant Automation Prototype</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center font-bold shadow-sm">
              <Shield className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-[#17365D]">
                  REGENTRA <span className="text-[#1769AA]">AI</span>
                </span>
                <span className="text-[10px] bg-[#EAF3FB] text-[#1769AA] font-bold px-2 py-0.5 rounded border border-[#1769AA]/20">
                  AICTE APPROVALS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Integrated Approval Automation & Compliance Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-xs font-semibold text-[#17365D] hover:text-[#1769AA] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-[#1769AA] hover:bg-[#14568c] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-20 bg-linear-to-b from-[#EAF3FB]/60 to-transparent border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs text-[#17365D] font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>Next-Gen Regulatory Governance Platform</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#1769AA]">SIH 2026 Software Edition</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17365D] tracking-tight leading-tight">
              Transforming Institutional Approvals Through Intelligent Automation.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              An integrated AI-powered platform for multimodal document intelligence, regulatory compliance auditing, approval workflow orchestration, and predictive delay management.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onGetStarted}
                className="bg-[#17365D] hover:bg-[#102742] text-white text-sm font-bold px-6 py-3 rounded-lg shadow-md transition-all flex items-center space-x-2"
              >
                <span>Access Live Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onLogin}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold px-5 py-3 rounded-lg shadow-2xs transition-colors"
              >
                Select Role / Demo Persona
              </button>
            </div>

            {/* Quick Demo Role Cards */}
            <div className="mt-10 pt-8 border-t border-slate-200/60">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Test Instant Interactive Personas:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-4xl mx-auto">
                <button
                  onClick={() => handleQuickDemo('INSTITUTION_ADMIN')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all text-left group"
                >
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Institution</p>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 mt-0.5">
                    Dr. S. K. Bhattacharya
                  </p>
                  <p className="text-[10px] text-slate-500">Submit & Track</p>
                </button>

                <button
                  onClick={() => handleQuickDemo('SCRUTINY_OFFICER')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-left group"
                >
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Scrutiny Officer</p>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 mt-0.5">
                    Priya Narayanan
                  </p>
                  <p className="text-[10px] text-slate-500">Examine & Deficiencies</p>
                </button>

                <button
                  onClick={() => handleQuickDemo('SENIOR_OFFICER')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left group"
                >
                  <p className="text-[10px] font-bold text-indigo-600 uppercase">Senior Officer</p>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 mt-0.5">
                    Prof. Anand Vardhan
                  </p>
                  <p className="text-[10px] text-slate-500">Authorize & SAC</p>
                </button>

                <button
                  onClick={() => handleQuickDemo('COMPLIANCE_ADMIN')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left group"
                >
                  <p className="text-[10px] font-bold text-amber-600 uppercase">Compliance Admin</p>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700 mt-0.5">
                    Sunil K. Verma
                  </p>
                  <p className="text-[10px] text-slate-500">Rules & Standards</p>
                </button>

                <button
                  onClick={() => handleQuickDemo('SUPER_ADMIN')}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-xs transition-all text-left group col-span-2 sm:col-span-1"
                >
                  <p className="text-[10px] font-bold text-purple-600 uppercase">Super Admin</p>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700 mt-0.5">
                    Dr. R. K. Shrivastava
                  </p>
                  <p className="text-[10px] text-slate-500">Full System Control</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Pillars Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17365D] tracking-tight">
              Engineered for Institutional Governance & Regulatory Transparency
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Transforming months of manual paper scrutiny into streamlined, accountable, and explainable decision workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F5F7FA] p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#1769AA] flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17365D]">AI Multimodal Document OCR</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Gemini 3.8 Flash extracts text, detects unreadable or expired certificates (e.g. Fire Safety NOC), cross-verifies acreage against municipal deeds, and highlights missing mandatory fields.
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17365D]">Rule-Based Compliance Engine</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Configurable regulatory checks against AICTE Approval Process Handbook (APH 2026-27). Instant verification of contiguous land, Faculty-Student Ratios (1:20 UG), and corpus funds.
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17365D]">Explainable Delay Risk Engine</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Calculates transparent 0–100 risk scores based on pending days, deadline proximity, officer workload, and deficiency loops. Every score comes with explicit contributing factors.
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17365D]">Digital Twin Queue Simulation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Discrete-event queue simulation modeling processing bottlenecks, officer capacity scaling, priority scheduling, and scenario comparisons for executive workload optimization.
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#17365D] flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17365D]">7-Stage Approval Orchestration</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Automated stage progression from Submission through Pre-Scrutiny, Scrutiny Committee, Deficiency Loops, Expert Committee (EVC), Senior Review to Final Approval.
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17365D]">Immutable Statutory Audit Trail</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Every action, officer document override with mandatory reason, deficiency note, and statutory approval is logged with actor identity, timestamp, and before/after difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Timeline Demonstration */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#17365D]">
              Streamlined 7-Stage AICTE Approval Lifecycle
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              End-to-end digital governance ensuring human officers remain the ultimate statutory authority.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 relative">
              {[
                { step: '1', title: 'Submitted', role: 'Institution', desc: '4-step digital application & attachments' },
                { step: '2', title: 'Pre-Scrutiny', role: 'AI + Officer', desc: 'OCR parsing & checklist verification' },
                { step: '3', title: 'Scrutiny', role: 'Officer Panel', desc: 'Detailed regulatory clause audit' },
                { step: '4', title: 'Deficiency', role: 'Institution', desc: 'Clarifications & document resubmission' },
                { step: '5', title: 'EVC Visit', role: 'Expert Panel', desc: 'Physical / virtual lab verification' },
                { step: '6', title: 'SAC Review', role: 'Senior Officer', desc: 'Executive committee concurrence' },
                { step: '7', title: 'Final Order', role: 'Statutory Body', desc: 'Approval Order or Rejection' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="w-8 h-8 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-xs">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-xs text-[#17365D]">{item.title}</h4>
                  <span className="text-[10px] bg-[#EAF3FB] text-[#1769AA] font-semibold px-1.5 py-0.5 rounded mt-1">
                    {item.role}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#17365D] text-slate-300 py-8 px-4 border-t border-[#0f243e] text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm">REGENTRA AI — SIH 2026 Project (Problem Statement SIH 26262)</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Team: 555_DIAMOND • Smart Automation Software Category.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 text-center md:text-right">
            <p>Regulatory Disclaimer: Demonstration prototype for Smart India Hackathon evaluation.</p>
            <p>All institutional names, IDs and data are simulated for research and development purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

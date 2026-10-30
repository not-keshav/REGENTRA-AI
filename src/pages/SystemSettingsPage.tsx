import React, { useState } from 'react';
import {
  Settings,
  RotateCcw,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export const SystemSettingsPage: React.FC = () => {
  const { systemSettings, resetDemoData, showToast } = useApp();
  const { currentUser } = useAuth();

  const [handbookVersion, setHandbookVersion] = useState<string>(
    systemSettings?.handbookVersion || 'AICTE Approval Process Handbook (APH) 2026-27'
  );
  const [activeAcademicYear, setActiveAcademicYear] = useState<string>(
    systemSettings?.activeAcademicYear || '2026-2027'
  );
  const [riskThresholdLow, setRiskThresholdLow] = useState<number>(
    systemSettings?.riskThresholdLow || 30
  );
  const [riskThresholdMedium, setRiskThresholdMedium] = useState<number>(
    systemSettings?.riskThresholdMedium || 60
  );
  const [riskThresholdHigh, setRiskThresholdHigh] = useState<number>(
    systemSettings?.riskThresholdHigh || 80
  );
  const [emailAlerts, setEmailAlerts] = useState<boolean>(false);
  const [aiScrutiny, setAiScrutiny] = useState<boolean>(true);

  const handleSave = () => {
    showToast('Platform regulatory settings and SLA thresholds updated.');
  };

  const handleReset = async () => {
    if (window.confirm('Reset all databases, institutions, applications, and logs back to initial demonstration baseline?')) {
      await resetDemoData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 14
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Platform Governance & Regulatory Baselines</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            System Settings & Approval Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage APH handbook version, risk thresholds, automated AI pre-scrutiny toggles, and demonstration datasets
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </div>

      {/* Regulatory Handbook Baseline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-[#17365D] flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#1769AA]" />
          <span>Statutory Approval Process Handbook (APH) Baseline</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Active Academic Year Cycle</label>
            <input
              type="text"
              value={activeAcademicYear}
              onChange={e => setActiveAcademicYear(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-[#17365D]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">APH Handbook Regulatory Baseline</label>
            <input
              type="text"
              value={handbookVersion}
              onChange={e => setHandbookVersion(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5"
            />
          </div>
        </div>
      </div>

      {/* Delay Risk Thresholds */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-[#17365D] flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#1769AA]" />
          <span>Explainable Delay Risk Score Thresholds (0 - 100)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-emerald-800 block mb-1">Low Risk Cap: {riskThresholdLow}</span>
            <input
              type="range"
              min={15}
              max={40}
              value={riskThresholdLow}
              onChange={e => setRiskThresholdLow(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <p className="text-[10px] text-slate-500 mt-1">Scores 0 to {riskThresholdLow} are marked Low Risk</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="font-bold text-amber-800 block mb-1">Medium Risk Cap: {riskThresholdMedium}</span>
            <input
              type="range"
              min={41}
              max={70}
              value={riskThresholdMedium}
              onChange={e => setRiskThresholdMedium(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <p className="text-[10px] text-slate-500 mt-1">Scores {riskThresholdLow + 1} to {riskThresholdMedium} are Medium</p>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
            <span className="font-bold text-red-800 block mb-1">High Risk Cap: {riskThresholdHigh}</span>
            <input
              type="range"
              min={71}
              max={95}
              value={riskThresholdHigh}
              onChange={e => setRiskThresholdHigh(Number(e.target.value))}
              className="w-full accent-red-600"
            />
            <p className="text-[10px] text-slate-500 mt-1">Scores above {riskThresholdHigh} trigger Critical escalation</p>
          </div>
        </div>
      </div>

      {/* Automated Governance Toggles */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-[#17365D]">Automated AI Pre-Scrutiny & Escalation Toggles</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F7FA] border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">Gemini Automated OCR Pre-Scrutiny</p>
              <p className="text-[10px] text-slate-500">
                Automatically parse uploaded documents on submission and highlight missing mandatory fields
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiScrutiny}
                onChange={e => setAiScrutiny(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16A36A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F7FA] border border-slate-200">
            <div>
              <p className="font-bold text-slate-800">Statutory SMS / Email Dispatch</p>
              <p className="text-[10px] text-slate-500">
                In-app alerts are active by default. External SMTP relay optional when production credentials attached
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16A36A]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Reset Demonstration Data Card */}
      <div className="bg-red-50/60 p-6 rounded-2xl border border-red-200 space-y-3 text-xs">
        <div className="flex items-center space-x-2 text-red-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>Reset Demonstration Database</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Restore the application to the official baseline seed records (15 realistic Indian technical institutions, 30 diverse applications across all 7 workflow stages, 5 scrutiny officers, compliance rules, and sample documents).
        </p>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demonstration Records</span>
        </button>
      </div>
    </div>
  );
};

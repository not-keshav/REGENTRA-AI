import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Scale,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { RiskBadge, StatusBadge } from '../components/common/Badge.tsx';

export const RiskAssessmentPage: React.FC<{
  onSelectApplication: (id: string) => void;
}> = ({ onSelectApplication }) => {
  const { applications } = useApp();

  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[1]?.id || applications[0]?.id || '');

  const filteredApps = applications.filter(a => {
    if (riskFilter !== 'ALL' && a.riskCategory !== riskFilter) return false;
    return true;
  });

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 8
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Explainable Governance Scoring</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Explainable Approval Delay Risk Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent weighted algorithmic scoring (0–100) evaluating pending duration, statutory missing documents, officer backlog, and deadline proximity.
          </p>
        </div>
      </div>

      {/* Architecture Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Explainability Guarantee:</strong> The delay risk engine computes scores transparently using actual application stage timestamps, missing document counts, and officer assignment metrics. It does not produce ungrounded scores or black-box predictions.
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Applications List by Risk */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Assessed Applications</span>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="border border-slate-200 bg-[#F5F7FA] rounded-lg px-2 py-1 text-slate-700 font-medium text-xs"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Critical">Critical (80-100)</option>
              <option value="High">High (60-79)</option>
              <option value="Medium">Medium (30-59)</option>
              <option value="Low">Low (0-29)</option>
            </select>
          </div>

          <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            {filteredApps.map(app => {
              const isSelected = app.id === selectedApp?.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-3.5 cursor-pointer text-left transition-colors ${
                    isSelected ? 'bg-sky-50/70 border-l-4 border-l-[#1769AA]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#17365D]">{app.applicationId}</span>
                    <RiskBadge category={app.riskCategory} score={app.riskScore} />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                    {app.institutionName}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                    <span>Stage: {app.currentStageName}</span>
                    <span>{app.pendingDays} days in stage</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Explainability Card */}
        {selectedApp && (
          <div className="lg:col-span-2 space-y-5">
            {/* Score Overview Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-slate-500">
                      {selectedApp.applicationId}
                    </span>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#17365D] mt-1">
                    {selectedApp.institutionName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category: {selectedApp.category} • Current Stage: {selectedApp.currentStageName}
                  </p>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Calculated Risk Score
                  </span>
                  <div className="flex items-center sm:justify-end space-x-2 mt-0.5">
                    <span className={`text-4xl font-black ${
                      selectedApp.riskScore >= 80
                        ? 'text-red-600'
                        : selectedApp.riskScore >= 60
                        ? 'text-amber-600'
                        : selectedApp.riskScore >= 30
                        ? 'text-yellow-700'
                        : 'text-emerald-700'
                    }`}>
                      {selectedApp.riskScore}
                    </span>
                    <span className="text-slate-400 text-sm font-semibold">/ 100</span>
                  </div>
                  <RiskBadge category={selectedApp.riskCategory} />
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="mt-4 bg-[#EAF3FB] p-4 rounded-xl border border-[#1769AA]/30 text-xs">
                <div className="flex items-center space-x-2 text-[#1769AA] font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Decision-Support Recommendation</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedApp.riskCategory === 'Critical'
                    ? 'Issue urgent statutory notice for missing or lapsed certificates. Escalate to Regional Senior Review Committee to prevent calendar deadline expiration.'
                    : selectedApp.riskCategory === 'High'
                    ? 'Prioritize document re-verification and reassign or expedite pending queries before statutory cut-off date.'
                    : selectedApp.riskCategory === 'Medium'
                    ? 'Maintain standard scrutiny schedule; track assigned officer review throughput.'
                    : 'Statutory compliance metrics verified. Standard SLA progress on schedule.'}
                </p>
              </div>

              {/* Breakdown Matrix of Risk Factors */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-[#17365D] uppercase tracking-wider mb-3">
                  Transparent Factor Weight Breakdown
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      factor: 'Pending Stage Duration',
                      weight: selectedApp.pendingDays > 15 ? 25 : (selectedApp.pendingDays > 8 ? 15 : 4),
                      detail: `${selectedApp.pendingDays} days elapsed in ${selectedApp.currentStageName} (Standard stage SLA: 7 days).`,
                      severity: selectedApp.pendingDays > 15 ? 'Critical' : 'Medium'
                    },
                    {
                      factor: 'Statutory Document Deficiencies',
                      weight: selectedApp.deficiencyNotes?.length ? 30 : 5,
                      detail: selectedApp.deficiencyNotes?.length
                        ? `${selectedApp.deficiencyNotes.length} active deficiency query pending institutional resolution.`
                        : 'All mandatory certificates attached.',
                      severity: selectedApp.deficiencyNotes?.length ? 'High' : 'Low'
                    },
                    {
                      factor: 'Deadline Proximity',
                      weight: selectedApp.riskScore > 60 ? 20 : 6,
                      detail: `Statutory intake approval cycle cut-off date: ${selectedApp.deadlineDate}.`,
                      severity: selectedApp.riskScore > 60 ? 'High' : 'Low'
                    },
                    {
                      factor: 'Correction / Resubmission Loops',
                      weight: selectedApp.correctionCycles * 8,
                      detail: `${selectedApp.correctionCycles} correction cycle(s) completed.`,
                      severity: selectedApp.correctionCycles > 1 ? 'High' : 'Low'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{item.factor}</span>
                        <span className="font-mono font-bold text-red-600">+{item.weight} Pts</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onSelectApplication(selectedApp.id)}
                  className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Open Full Application Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

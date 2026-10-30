import React, { useState } from 'react';
import {
  GitBranch,
  Clock,
  Layers,
  ArrowRight,
  Shield,
  CheckCircle2,
  Settings,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { INITIAL_WORKFLOW_STAGES } from '../../data/seedData.ts';

export const WorkflowManagementPage: React.FC = () => {
  const [stages, setStages] = useState(INITIAL_WORKFLOW_STAGES);
  const { showToast } = useApp();

  const handleUpdateSla = (id: string, newSla: number) => {
    setStages(prev =>
      prev.map(s => (s.id === id ? { ...s, slaDays: newSla } : s))
    );
    showToast('Workflow stage SLA threshold updated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 7
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Approval Workflow Orchestration</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Approval Workflow Stages & SLA Thresholds
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurable 7-stage approval pipeline, automatic forwarding policies, and statutory SLA duration benchmarks
          </p>
        </div>
      </div>

      {/* Visual Workflow Canvas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[#17365D]">Sequential Stage Transition Pipeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-[11px]">
                    {stage.sequence}
                  </span>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                    SLA: {stage.slaDays}d
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 leading-snug">{stage.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{stage.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-600 font-medium">
                Assignee: <span className="font-bold text-[#17365D]">{stage.defaultAssigneeRole.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Configuration Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-800">
          Stage Configuration & Escalation Policies
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#17365D] text-white font-semibold">
                <th className="py-3 px-4">Seq</th>
                <th className="py-3 px-4">Stage Name</th>
                <th className="py-3 px-4">Default Authority Role</th>
                <th className="py-3 px-4">Target SLA (Days)</th>
                <th className="py-3 px-4">Auto-Forward On Zero Deficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stages.map(stage => (
                <tr key={stage.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{stage.sequence}</td>
                  <td className="py-3 px-4 font-bold text-[#17365D]">{stage.name}</td>
                  <td className="py-3 px-4 text-slate-600">{stage.defaultAssigneeRole}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={stage.slaDays}
                      onChange={e => handleUpdateSla(stage.id, Number(e.target.value))}
                      className="w-16 border border-slate-200 rounded px-2 py-1 font-bold text-[#1769AA]"
                    />
                    <span className="ml-1 text-slate-500">days</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      stage.autoForwardOnPass ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {stage.autoForwardOnPass ? 'Enabled (AI Cleared)' : 'Requires Human Sign-off'}
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

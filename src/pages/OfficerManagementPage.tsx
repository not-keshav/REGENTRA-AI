import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Mail,
  Shield,
  BarChart3,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Modal } from '../components/common/Modal.tsx';
import { OfficerAssignment } from '../types/index.ts';

export const OfficerManagementPage: React.FC<{
  onSelectApplication: (id: string) => void;
}> = ({ onSelectApplication }) => {
  const { officers, applications, reassignOfficer, showToast } = useApp();
  const { currentUser } = useAuth();

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [targetOfficerId, setTargetOfficerId] = useState<string>(officers[0]?.officerId || '');
  const [reassignReason, setReassignReason] = useState<string>('');

  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !targetOfficerId || !reassignReason.trim()) {
      showToast('Please select application, target officer, and provide a mandatory reason.');
      return;
    }

    await reassignOfficer(selectedAppId, targetOfficerId, reassignReason);
    setShowReassignModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 11
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Scrutiny Cell Team Resource Allocation</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Officer Workload & Capacity Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time scrutiny capacity monitoring, caseload distribution, and statutory case rebalancing
          </p>
        </div>

        <button
          onClick={() => {
            setReassignReason('');
            setShowReassignModal(true);
          }}
          className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Reassign Application Workload</span>
        </button>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {officers.map(officer => {
          const loadPercentage = Math.round((officer.pendingCount / officer.maxCapacity) * 100);
          const isOverloaded = loadPercentage >= 70;

          return (
            <div
              key={officer.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#17365D]">
                      {officer.officerName}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                      {officer.department}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isOverloaded
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {isOverloaded ? 'Heavy Load' : 'Optimal'}
                  </span>
                </div>

                {/* Caseload Stats */}
                <div className="grid grid-cols-3 gap-2 my-4 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                    <span className="text-slate-400 block text-[10px]">Pending</span>
                    <span className="text-base font-extrabold text-[#1769AA]">{officer.pendingCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-slate-400 block text-[10px]">Cleared</span>
                    <span className="text-base font-extrabold text-emerald-700">{officer.completedCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Avg Days</span>
                    <span className="text-base font-extrabold text-slate-700">{officer.avgProcessingDays}d</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                    <span>Workload Utilization</span>
                    <span className="font-bold">{officer.pendingCount} / {officer.maxCapacity} Cases ({loadPercentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverloaded ? 'bg-amber-500' : 'bg-[#1769AA]'
                      }`}
                      style={{ width: `${Math.min(100, loadPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center space-x-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{officer.email}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reassign Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title="Reassign Application Scrutiny Case"
        subtitle="Workforce load balancing & delay avoidance"
      >
        <form onSubmit={handleReassignSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Application</label>
            <select
              value={selectedAppId}
              onChange={e => setSelectedAppId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 font-medium"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.applicationId} - {app.institutionName} ({app.status}, Currently: {app.assignedOfficerName || 'Unassigned'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Select New Scrutiny Officer</label>
            <select
              value={targetOfficerId}
              onChange={e => setTargetOfficerId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 font-medium"
            >
              {officers.map(o => (
                <option key={o.officerId} value={o.officerId}>
                  {o.officerName} ({o.pendingCount} active cases pending / max {o.maxCapacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mandatory Regulatory Reason for Reassignment *
            </label>
            <textarea
              rows={3}
              required
              value={reassignReason}
              onChange={e => setReassignReason(e.target.value)}
              placeholder="e.g. Scrutiny cell workload rebalancing to meet calendar SLA deadline."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowReassignModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#17365D] hover:bg-[#102742] text-white font-bold px-4 py-1.5 rounded-lg"
            >
              Confirm Reassignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

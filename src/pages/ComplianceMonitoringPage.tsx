import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Scale,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { SeverityBadge } from '../components/common/Badge.tsx';
import { Modal } from '../components/common/Modal.tsx';
import { ComplianceRule, ComplianceSeverity } from '../types/index.ts';

export const ComplianceMonitoringPage: React.FC<{
  onSelectApplication: (id: string) => void;
}> = ({ onSelectApplication }) => {
  const { complianceRules, applications, refreshData, showToast } = useApp();
  const { currentUser } = useAuth();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [showAddRuleModal, setShowAddRuleModal] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<ComplianceRule | null>(null);

  // New Rule Form State
  const [ruleId, setRuleId] = useState<string>('');
  const [ruleName, setRuleName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [requiredCondition, setRequiredCondition] = useState<string>('');
  const [severity, setSeverity] = useState<ComplianceSeverity>('High');
  const [validationLogic, setValidationLogic] = useState<string>('');
  const [version, setVersion] = useState<string>('2026.1');

  const filteredRules = complianceRules.filter(r => {
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setRuleId(`CR-REG-${Math.floor(10 + Math.random() * 90)}`);
    setRuleName('');
    setDescription('');
    setRequiredCondition('');
    setSeverity('High');
    setValidationLogic('');
    setVersion('2026.1');
    setEditingRule(null);
    setShowAddRuleModal(true);
  };

  const handleOpenEdit = (rule: ComplianceRule) => {
    setEditingRule(rule);
    setRuleId(rule.ruleId);
    setRuleName(rule.name);
    setDescription(rule.description);
    setRequiredCondition(rule.requiredCondition);
    setSeverity(rule.severity);
    setValidationLogic(rule.validationLogicDescription);
    setVersion(rule.version);
    setShowAddRuleModal(true);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    try {
      if (editingRule) {
        await fetch(`/api/compliance/rules/${editingRule.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: ruleName,
            description,
            requiredCondition,
            severity,
            validationLogicDescription: validationLogic,
            version,
            actorId: currentUser?.id,
            actorName: currentUser?.name
          })
        });
        showToast(`Rule ${editingRule.ruleId} successfully updated.`);
      } else {
        await fetch('/api/compliance/rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ruleId,
            name: ruleName,
            description,
            applicableCategory: 'All Categories',
            requiredCondition,
            severity,
            validationLogicDescription: validationLogic,
            version,
            actorId: currentUser?.id,
            actorName: currentUser?.name
          })
        });
        showToast(`New compliance rule ${ruleId} successfully created.`);
      }
      setShowAddRuleModal(false);
      refreshData();
    } catch (err) {
      console.error('Error saving rule:', err);
    }
  };

  const handleToggleActive = async (rule: ComplianceRule) => {
    try {
      await fetch(`/api/compliance/rules/${rule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active: !rule.active,
          actorId: currentUser?.id,
          actorName: currentUser?.name
        })
      });
      showToast(`Rule ${rule.ruleId} ${!rule.active ? 'activated' : 'deactivated'}.`);
      refreshData();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 6
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Approval Process Handbook (APH 2026-27)</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Rule-Based Regulatory Compliance Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurable regulatory criteria, cadre ratio benchmarks, statutory land norms, and automated compliance auditing
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Regulatory Rule</span>
        </button>
      </div>

      {/* Advisory Banner */}
      <div className="bg-[#EAF3FB] border border-[#1769AA]/30 p-4 rounded-xl text-xs text-[#17365D] flex items-start space-x-3">
        <Info className="w-5 h-5 text-[#1769AA] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>APH Baseline Verification:</strong> All demonstration compliance rules below conform to AICTE Approval Process Handbook guidelines (such as minimum 2.5/7.5 acre contiguous land norms, 1:20 UG engineering FSR, and mandatory unexpired Fire Safety NOC). Rules are fully configurable and versioned.
        </div>
      </div>

      {/* Filter and Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-800">Active Regulatory Rules ({complianceRules.length})</h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Filter Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#17365D] text-white font-semibold">
                <th className="py-3 px-4">Rule Code</th>
                <th className="py-3 px-4">Rule Title & Clause</th>
                <th className="py-3 px-4">Required Statutory Condition</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRules.map(rule => (
                <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#17365D]">
                    {rule.ruleId}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-slate-800">{rule.name}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{rule.description}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm text-slate-600">
                    {rule.requiredCondition}
                  </td>
                  <td className="py-3.5 px-4">
                    <SeverityBadge severity={rule.severity} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    v{rule.version}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(rule)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        rule.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {rule.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(rule)}
                      className="text-xs font-semibold text-[#1769AA] hover:text-[#102742] bg-[#EAF3FB] px-2.5 py-1 rounded"
                    >
                      Edit Rule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Rule Modal */}
      <Modal
        isOpen={showAddRuleModal}
        onClose={() => setShowAddRuleModal(false)}
        title={editingRule ? `Edit Rule: ${editingRule.ruleId}` : 'Create Compliance Rule'}
        subtitle="AICTE Approval Process Handbook (APH) Standards"
      >
        <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Rule ID / Clause Code</label>
              <input
                type="text"
                required
                value={ruleId}
                onChange={e => setRuleId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as ComplianceSeverity)}
                className="w-full border border-slate-300 rounded-lg p-2 font-bold"
              >
                <option value="Critical">Critical (Immediate Rejection Risk)</option>
                <option value="High">High (Mandatory Requirement)</option>
                <option value="Medium">Medium (Conditional Compliance)</option>
                <option value="Low">Low (Informational Observation)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Rule Title</label>
            <input
              type="text"
              required
              value={ruleName}
              onChange={e => setRuleName(e.target.value)}
              placeholder="e.g. Mandatory Contiguous Land Norm"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Regulatory Clause Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain the background regulatory clause"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Statutory Condition</label>
            <textarea
              rows={2}
              required
              value={requiredCondition}
              onChange={e => setRequiredCondition(e.target.value)}
              placeholder="Exact threshold (e.g. >= 2.5 acres urban, 1:20 UG engineering FSR)"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddRuleModal(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#17365D] hover:bg-[#102742] text-white font-bold px-4 py-1.5 rounded-lg shadow-sm"
            >
              Save Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

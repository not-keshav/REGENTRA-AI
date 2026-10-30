import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  FileCheck2,
  XCircle,
  RotateCcw,
  Send,
  Eye,
  ShieldCheck,
  Scale,
  Sparkles,
  Building2,
  Calendar,
  Lock,
  MessageSquare,
  AlertCircle,
  FileSearch
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge, RiskBadge, SeverityBadge } from '../components/common/Badge.tsx';
import { Modal } from '../components/common/Modal.tsx';
import {
  Application,
  DocumentRecord,
  WorkflowHistoryItem,
  RiskAssessment,
  ComplianceResult
} from '../types/index.ts';

export const ApplicationDetailsPage: React.FC<{
  applicationId: string;
  onBack: () => void;
}> = ({ applicationId, onBack }) => {
  const {
    forwardApplication,
    raiseDeficiency,
    resubmitApplication,
    makeDecision,
    verifyDocumentOverride,
    showToast
  } = useApp();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState<{
    application: Application;
    documents: DocumentRecord[];
    workflowHistory: WorkflowHistoryItem[];
    riskAssessment?: RiskAssessment;
    complianceResult?: ComplianceResult;
    institution?: any;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'documents' | 'compliance' | 'risk' | 'history'>('documents');

  // Modals
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedDocForOverride, setSelectedDocForOverride] = useState<DocumentRecord | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<string>('Valid');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overrideRemarks, setOverrideRemarks] = useState<string>('');

  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [deficiencyText, setDeficiencyText] = useState<string>('');

  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [resubmitRemarks, setResubmitRemarks] = useState<string>('');

  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionType, setDecisionType] = useState<'Approved' | 'Rejected' | 'Returned'>('Approved');
  const [decisionRemarks, setDecisionRemarks] = useState<string>('');

  const [showForwardModal, setShowForwardModal] = useState(false);
  const [nextStage, setNextStage] = useState<{ id: string; name: string }>({
    id: 'SCRUTINY',
    name: 'Application Scrutiny Committee'
  });
  const [forwardRemarks, setForwardRemarks] = useState<string>('');

  // Fetch application complete bundle
  const loadData = async () => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`);
      const data = await res.json();
      if (data.success) {
        setAppData(data);
      }
    } catch (err) {
      console.error('Failed to load application details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [applicationId]);

  if (loading || !appData) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading statutory application records...
      </div>
    );
  }

  const { application, documents, workflowHistory, riskAssessment, complianceResult, institution } = appData;
  const role = currentUser?.role || 'SUPER_ADMIN';

  // Stages in sequence
  const allStages = [
    { id: 'SUBMITTED', name: 'Submitted' },
    { id: 'PRE_SCRUTINY', name: 'Pre-Scrutiny' },
    { id: 'SCRUTINY', name: 'Scrutiny Committee' },
    { id: 'DEFICIENCY', name: 'Deficiency' },
    { id: 'EVC', name: 'Expert Verification (EVC)' },
    { id: 'SENIOR_REVIEW', name: 'Senior Review' },
    { id: 'FINAL_DECISION', name: 'Final Decision' },
  ];

  const currentStageIndex = allStages.findIndex(s => s.id === application.currentStageId);

  // Handlers
  const handleOverrideSubmit = async () => {
    if (!selectedDocForOverride || !overrideReason.trim()) {
      showToast('A mandatory reason is required for officer document override.');
      return;
    }
    await verifyDocumentOverride(
      selectedDocForOverride.id,
      overrideStatus,
      overrideReason,
      overrideRemarks
    );
    setShowOverrideModal(false);
    loadData();
  };

  const handleDeficiencySubmit = async () => {
    if (!deficiencyText.trim()) return;
    await raiseDeficiency(application.id, [deficiencyText]);
    setShowDeficiencyModal(false);
    loadData();
  };

  const handleResubmit = async () => {
    if (!resubmitRemarks.trim()) return;
    await resubmitApplication(application.id, resubmitRemarks);
    setShowResubmitModal(false);
    loadData();
  };

  const handleDecisionSubmit = async () => {
    if (!decisionRemarks.trim()) {
      showToast('Mandatory statutory remarks are required.');
      return;
    }
    await makeDecision(application.id, decisionType, decisionRemarks);
    setShowDecisionModal(false);
    loadData();
  };

  const handleForwardSubmit = async () => {
    await forwardApplication(application.id, nextStage.id, nextStage.name, forwardRemarks);
    setShowForwardModal(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-[#17365D] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Applications</span>
        </button>

        {/* Action Controls based on Role */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Institution Resubmit */}
          {(role === 'INSTITUTION_ADMIN' || role === 'SUPER_ADMIN') &&
            (application.status === 'Deficiency Identified' || application.status === 'Correction Required') && (
              <button
                onClick={() => setShowResubmitModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Corrections</span>
              </button>
            )}

          {/* Scrutiny Officer Actions */}
          {(role === 'SCRUTINY_OFFICER' || role === 'SUPER_ADMIN') && application.status !== 'Approved' && application.status !== 'Rejected' && (
            <>
              <button
                onClick={() => setShowDeficiencyModal(true)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                Raise Deficiency
              </button>
              <button
                onClick={() => {
                  setNextStage({ id: 'SCRUTINY', name: 'Application Scrutiny Committee' });
                  setShowForwardModal(true);
                }}
                className="bg-[#1769AA] hover:bg-[#13578c] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs flex items-center space-x-1.5"
              >
                <span>Advance Stage</span>
                <Send className="w-3 h-3" />
              </button>
            </>
          )}

          {/* Senior Officer Statutory Decision */}
          {(role === 'SENIOR_OFFICER' || role === 'SUPER_ADMIN') && application.status !== 'Approved' && (
            <button
              onClick={() => setShowDecisionModal(true)}
              className="bg-[#17365D] hover:bg-[#0f243e] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Issue Statutory Decision</span>
            </button>
          )}
        </div>
      </div>

      {/* Application Overview Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-black text-[#17365D] tracking-tight">
                {application.applicationId}
              </span>
              <StatusBadge status={application.status} size="md" />
              <RiskBadge category={application.riskCategory} score={application.riskScore} />
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                AY {application.academicYear}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 mt-2">
              {application.institutionName}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-500">
              <span>Category: <strong className="text-slate-800">{application.category}</strong></span>
              <span>•</span>
              <span>Proposed Intake: <strong className="text-slate-800">{application.intakeCapacity} Seats</strong></span>
              <span>•</span>
              <span>Assigned Officer: <strong className="text-[#1769AA]">{application.assignedOfficerName || 'Pending'}</strong></span>
              <span>•</span>
              <span>Deadline: <strong className="text-red-700">{application.deadlineDate}</strong></span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200 flex items-center space-x-4 shrink-0 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Pending In Stage</span>
              <span className="font-extrabold text-sm text-[#17365D]">
                {application.pendingDays} Days
              </span>
            </div>
            <div className="h-7 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-500 block text-[10px]">Correction Cycles</span>
              <span className="font-extrabold text-sm text-slate-800">
                {application.correctionCycles} Loop(s)
              </span>
            </div>
            <div className="h-7 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-500 block text-[10px]">Documents Attached</span>
              <span className="font-extrabold text-sm text-emerald-700">
                {documents.length} Files
              </span>
            </div>
          </div>
        </div>

        {/* Visual Workflow Stage Progression */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Approval Workflow Timeline
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {allStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex || application.status === 'Approved';
              const isCurrent = stage.id === application.currentStageId && application.status !== 'Approved';

              return (
                <div
                  key={stage.id}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'border-[#1769AA] bg-[#EAF3FB] font-bold text-[#17365D] shadow-2xs'
                      : isPast
                      ? 'border-emerald-300 bg-emerald-50/60 text-emerald-800'
                      : 'border-slate-200 bg-slate-50/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 text-xs">
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Clock className="w-3.5 h-3.5 text-[#1769AA] animate-spin" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                    )}
                    <span className="font-semibold truncate">{stage.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-px text-xs font-bold">
        {[
          { id: 'documents', label: `Document Scrutiny (${documents.length})`, icon: FileSearch },
          { id: 'compliance', label: 'Compliance Audit Report', icon: Scale },
          { id: 'risk', label: 'Explainable Delay Risk', icon: AlertTriangle },
          { id: 'history', label: `Workflow Trail (${workflowHistory.length})`, icon: Clock },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2.5 px-4 rounded-t-xl transition-colors border-t border-l border-r ${
                isActive
                  ? 'bg-white border-slate-200 text-[#1769AA] shadow-2xs'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Document Scrutiny Panel */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 text-[#17365D] text-xs p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#1769AA] shrink-0" />
              <span>
                Gemini OCR automatically extracts certificate text, validates issuing authority, checks expiration, and cross-compares against institutional database records.
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#1769AA] bg-white px-2 py-1 rounded shadow-2xs shrink-0">
              Zero-Hallucination Guard
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-sm text-[#17365D]">{doc.name}</h3>
                      <StatusBadge status={doc.status} />
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {doc.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Uploaded: {new Date(doc.uploadDate).toLocaleDateString()} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • {doc.fileName}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-2 hidden sm:block">
                      <span className="text-[10px] text-slate-400 block">AI Confidence</span>
                      <span className="text-xs font-bold text-emerald-700">{doc.confidenceScore}%</span>
                    </div>
                    {(role === 'SCRUTINY_OFFICER' || role === 'SUPER_ADMIN') && (
                      <button
                        onClick={() => {
                          setSelectedDocForOverride(doc);
                          setOverrideStatus(doc.status);
                          setOverrideReason('');
                          setShowOverrideModal(true);
                        }}
                        className="bg-[#EAF3FB] hover:bg-[#d5e9f8] text-[#1769AA] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#1769AA]/30"
                      >
                        Officer Verification Override
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Executive Summary & Findings */}
                <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
                    <p className="font-bold text-[#17365D] mb-1 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#1769AA]" />
                      <span>AI Scrutiny Summary</span>
                    </p>
                    <p className="text-slate-700 leading-relaxed">{doc.aiSummary}</p>

                    {doc.extractedMetadata && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-1 text-[11px]">
                        {Object.entries(doc.extractedMetadata).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-semibold text-slate-700">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
                    <p className="font-bold text-[#17365D] mb-1">OCR Extracted Text Preview</p>
                    <pre className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 max-h-28 overflow-y-auto whitespace-pre-wrap">
                      {doc.ocrExtractedText}
                    </pre>

                    {/* Deficiencies or missing fields */}
                    {doc.missingFields.length > 0 && (
                      <div className="mt-2 text-red-600 text-[11px] font-semibold">
                        Missing: {doc.missingFields.join(', ')}
                      </div>
                    )}
                    {doc.mismatchWarnings.length > 0 && (
                      <div className="mt-1 text-amber-600 text-[11px]">
                        Warnings: {doc.mismatchWarnings.join('; ')}
                      </div>
                    )}
                  </div>
                </div>

                {doc.officerVerified && (
                  <div className="mt-3 bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-[11px] border border-emerald-200 flex items-center justify-between">
                    <span>
                      ✓ Human Officer Verified on {doc.officerVerificationDate ? new Date(doc.officerVerificationDate).toLocaleDateString() : 'recent'}. Remarks: {doc.officerRemarks || doc.officerOverrideReason || 'Document formally accepted.'}
                    </span>
                    <span className="font-bold text-emerald-700">Official Clearance</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Compliance Report */}
      {activeTab === 'compliance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#17365D]">Regulatory Compliance Audit Report</h2>
              <p className="text-xs text-slate-500">Evaluated against AICTE Approval Process Handbook (APH 2026-27)</p>
            </div>
            {complianceResult && (
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-slate-600">Compliance Index:</span>
                <span className="text-lg font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  {complianceResult.compliancePercentage}%
                </span>
              </div>
            )}
          </div>

          {complianceResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Passed Checks</span>
                  <span className="text-lg font-bold text-emerald-700">{complianceResult.passedChecks}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-slate-500 block text-[10px]">Warnings</span>
                  <span className="text-lg font-bold text-amber-700">{complianceResult.warningsCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <span className="text-slate-500 block text-[10px]">Failed Checks</span>
                  <span className="text-lg font-bold text-red-700">{complianceResult.failedChecks}</span>
                </div>
              </div>

              {complianceResult.violations.length > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Identified Statutory Deficiencies</h4>
                  <div className="space-y-2">
                    {complianceResult.violations.map((v, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-800">{v.ruleName} ({v.ruleId})</span>
                          <SeverityBadge severity={v.severity} />
                        </div>
                        <p className="text-slate-700 mt-1">{v.detail}</p>
                        <p className="text-slate-500 text-[11px] mt-1.5 font-medium">
                          <strong>Recommended Action:</strong> {v.recommendedAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                  ✓ Zero statutory deficiencies. Institution complies with all evaluated land, building, and faculty ratios.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Explainable Risk Assessment */}
      {activeTab === 'risk' && riskAssessment && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#17365D]">Predictive Delay Risk Assessment</h2>
              <p className="text-xs text-slate-500">Transparent mathematical factor weights & AI decision support</p>
            </div>
            <RiskBadge category={riskAssessment.category} score={riskAssessment.score} />
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-[#EAF3FB] p-4 rounded-xl border border-[#1769AA]/30 text-xs">
            <p className="font-bold text-[#17365D] flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#1769AA]" />
              <span>Recommended Statutory Action</span>
            </p>
            <p className="text-slate-800 mt-1 leading-relaxed font-medium">
              {riskAssessment.recommendation}
            </p>
          </div>

          {/* Contributing Factors Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-[#17365D] mb-3">Transparent Contributing Risk Factors</h4>
            <div className="space-y-3">
              {riskAssessment.factors.map((f, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{f.factor}</span>
                    <span className="font-mono font-bold text-red-600">+{f.impactScore} Pts</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">{f.observation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Workflow History */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#17365D] border-b border-slate-100 pb-3">
            Immutable Stage Audit Trail
          </h2>
          <div className="space-y-3">
            {workflowHistory.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-[#F5F7FA] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17365D]">{item.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-600">
                  <span>Actor: <strong>{item.actorName}</strong> ({item.actorRole.replace('_', ' ')})</span>
                  <span>•</span>
                  <span>{item.fromStage} → {item.toStage}</span>
                </div>
                {item.remarks && (
                  <p className="text-slate-700 text-[11px] mt-1.5 bg-white p-2 rounded border border-slate-200/80">
                    Remarks: {item.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Document Override */}
      <Modal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        title="Officer Document Verification & Override"
        subtitle={selectedDocForOverride?.name}
      >
        <div className="space-y-4 text-xs">
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
            ⚠️ Final legal and regulatory authority rests with authorized officers. Document overrides require a recorded justification logged in the immutable statutory audit trail.
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Verification Status</label>
            <select
              value={overrideStatus}
              onChange={e => setOverrideStatus(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="Valid">Valid (Mark Approved)</option>
              <option value="Invalid">Invalid (Mark Non-compliant)</option>
              <option value="Needs Manual Review">Needs Additional Verification</option>
              <option value="Incomplete">Incomplete / Illegible</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mandatory Regulatory Reason for Override *
            </label>
            <textarea
              rows={2}
              required
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              placeholder="e.g. Verified with state fire department registration portal docket #KSFES-2026."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Internal Committee Remarks (Optional)</label>
            <input
              type="text"
              value={overrideRemarks}
              onChange={e => setOverrideRemarks(e.target.value)}
              placeholder="Internal notes for Senior Review"
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowOverrideModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleOverrideSubmit}
              className="bg-[#17365D] hover:bg-[#102742] text-white font-bold px-4 py-1.5 rounded-lg"
            >
              Confirm Override & Log Audit
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: Raise Deficiency */}
      <Modal
        isOpen={showDeficiencyModal}
        onClose={() => setShowDeficiencyModal(false)}
        title="Issue Deficiency Notice"
        subtitle={`Application: ${application.applicationId}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Specify the missing regulatory requirements or clarification queries. The application will be moved to the <strong>Deficiency Identification & Resubmission</strong> stage.
          </p>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Deficiency Notes & Queries *</label>
            <textarea
              rows={4}
              required
              value={deficiencyText}
              onChange={e => setDeficiencyText(e.target.value)}
              placeholder="Enter exact deficiency clauses (e.g. Faculty-Student Ratio below 1:20 norm; Fire safety certificate expired on 15-Jan-2026)."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowDeficiencyModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDeficiencySubmit}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-lg"
            >
              Issue Notice
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Resubmit Corrections */}
      <Modal
        isOpen={showResubmitModal}
        onClose={() => setShowResubmitModal(false)}
        title="Resubmit Corrected Application"
        subtitle={`Application: ${application.applicationId}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Enter institutional clarification remarks regarding how raised deficiencies were rectified.
          </p>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Clarification Remarks *</label>
            <textarea
              rows={3}
              value={resubmitRemarks}
              onChange={e => setResubmitRemarks(e.target.value)}
              placeholder="e.g. Uploaded revised valid Fire Safety NOC and updated CSE faculty joining orders."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowResubmitModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleResubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg"
            >
              Transmit Resubmission
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 4: Forward Stage */}
      <Modal
        isOpen={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        title="Advance Workflow Stage"
        subtitle={`Application: ${application.applicationId}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Next Stage</label>
            <select
              value={nextStage.id}
              onChange={e => {
                const s = allStages.find(st => st.id === e.target.value);
                if (s) setNextStage(s);
              }}
              className="w-full border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="SCRUTINY">Application Scrutiny Committee</option>
              <option value="EVC">Expert Verification Committee (EVC)</option>
              <option value="SENIOR_REVIEW">Senior Officer & SAC Review</option>
              <option value="FINAL_DECISION">Final Statutory Decision</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Forwarding Remarks</label>
            <input
              type="text"
              value={forwardRemarks}
              onChange={e => setForwardRemarks(e.target.value)}
              placeholder="e.g. Scrutiny cleared. Forwarded for physical laboratory verification."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowForwardModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleForwardSubmit}
              className="bg-[#1769AA] hover:bg-[#13578c] text-white font-bold px-4 py-1.5 rounded-lg"
            >
              Advance Stage
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 5: Senior Officer Statutory Decision */}
      <Modal
        isOpen={showDecisionModal}
        onClose={() => setShowDecisionModal(false)}
        title="Execute Statutory Approval Decision"
        subtitle={`Authorized Officer: ${currentUser?.name}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Statutory Decision</label>
            <select
              value={decisionType}
              onChange={e => setDecisionType(e.target.value as any)}
              className="w-full border border-slate-300 rounded-lg p-2 font-bold"
            >
              <option value="Approved">Grant Statutory Approval (Issue Approval Order)</option>
              <option value="Rejected">Reject Application (Issue Rejection Order)</option>
              <option value="Returned">Return for Resubmission (Issue Return Order)</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Official Statutory Order Remarks *
            </label>
            <textarea
              rows={3}
              required
              value={decisionRemarks}
              onChange={e => setDecisionRemarks(e.target.value)}
              placeholder="Enter comprehensive findings for statutory order dispatch."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowDecisionModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDecisionSubmit}
              className={`text-white font-bold px-4 py-1.5 rounded-lg shadow-sm ${
                decisionType === 'Approved'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : decisionType === 'Rejected'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              Confirm Statutory {decisionType}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

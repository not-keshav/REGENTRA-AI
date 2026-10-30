import React, { useState } from 'react';
import {
  FileSearch,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Filter,
  Eye,
  RefreshCw,
  Search,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge } from '../components/common/Badge.tsx';
import { Modal } from '../components/common/Modal.tsx';
import { DocumentCategory, DocumentRecord, DocumentStatus } from '../types/index.ts';

export const DocumentIntelligencePage: React.FC<{
  onSelectApplication: (id: string) => void;
}> = ({ onSelectApplication }) => {
  const { documents, uploadAndAnalyzeDocument, verifyDocumentOverride, showToast } = useApp();
  const { currentUser } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchDocQuery, setSearchDocQuery] = useState<string>('');

  // Sandbox Live OCR Tester State
  const [testDocCategory, setTestDocCategory] = useState<DocumentCategory>('Fire Safety Certificate');
  const [testFileName, setTestFileName] = useState<string>('Fire_Safety_NOC_Test.pdf');
  const [testRawText, setTestRawText] = useState<string>(
    `GOVERNMENT OF KARNATAKA - FIRE & EMERGENCY SERVICES\nCLEARANCE CERTIFICATE / NO OBJECTION CERTIFICATE\nCertificate Number: KSFES/BNG/SZ/2026/8940\nDate of Issue: 12-January-2026 | Valid Till: 11-January-2027\nInspected Blocks: Academic Wing A, Block B, Chemical Laboratory Complex.\nCertified safe as per National Building Code (Part IV).`
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedDoc, setAnalyzedDoc] = useState<DocumentRecord | null>(null);

  // Override Modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<DocumentStatus>('Valid');
  const [overrideReason, setOverrideReason] = useState<string>('');

  // Sample Presets for quick evaluation
  const handlePresetSelect = (preset: 'fire_valid' | 'fire_expired' | 'land_deed' | 'faculty_shortfall') => {
    if (preset === 'fire_valid') {
      setTestDocCategory('Fire Safety Certificate');
      setTestFileName('Fire_Safety_Valid_Clearance.pdf');
      setTestRawText(
        `DIRECTORATE OF FIRE SERVICES - NO OBJECTION CERTIFICATE\nCertificate No: FS/2026/9021\nValid Until: 31-December-2027\nTo: Aryabhatta Institute of Technology, Electronic City Bengaluru.\nAll fire hydrants, riser lines, and 200,000L static reservoir verified in operational readiness.`
      );
    } else if (preset === 'fire_expired') {
      setTestDocCategory('Fire Safety Certificate');
      setTestFileName('Fire_Safety_Expired_Receipt.pdf');
      setTestRawText(
        `OFFICE OF MUNICIPAL FIRE OFFICER BHOPAL (M.P.)\nPROVISIONAL FIRE NOC DOCKET\nRegistration: F-NOC/BPL/2023/118\nISSUED: 16-JAN-2023\nEXPIRY DATE: 15-JAN-2026 (EXPIRED)\nSTATUS: Previous clearance has lapsed. Awaiting physical inspection by Chief Fire Officer.`
      );
    } else if (preset === 'land_deed') {
      setTestDocCategory('Land Documents');
      setTestFileName('Registered_Land_Title_Deed.pdf');
      setTestRawText(
        `SUB-REGISTRAR OFFICE - TITLE CONVEYANCE DEED\nBook 1, Volume 88, Pages 120-138\nLessee: Kalinga Educational Trust\nArea Extent: 10 Acres and 20 Decimals (10.20 Acres) Contiguous Plot 104 Mouza Patia.\nPurpose: Higher Technical Institution Campus.`
      );
    } else if (preset === 'faculty_shortfall') {
      setTestDocCategory('Faculty Details');
      setTestFileName('Faculty_Roll_Shortfall.pdf');
      setTestRawText(
        `ANNUAL FACULTY ROLL STATEMENT 2026-27\nDepartment: Computer Science & Engineering\nApproved Intake: 240 UG Seats\nFaculty in Position: 24 (Professor: 1, Assoc Prof: 3, Asst Prof: 20)\nCalculated FSR: 1:24.0 (Deficient against mandatory 1:20 norm).`
      );
    }
  };

  const handleRunLiveTest = async () => {
    setAnalyzing(true);
    setAnalyzedDoc(null);
    try {
      const doc = await uploadAndAnalyzeDocument({
        applicationId: 'app-002',
        category: testDocCategory,
        name: testFileName,
        fileName: testFileName,
        rawText: testRawText,
        fileSize: 1500000,
        fileType: 'application/pdf'
      });
      setAnalyzedDoc(doc);
    } catch (err) {
      console.error('Error analyzing test document:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Filtered documents list
  const filteredDocs = documents.filter(doc => {
    if (categoryFilter !== 'ALL' && doc.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && doc.status !== statusFilter) return false;
    if (searchDocQuery) {
      const q = searchDocQuery.toLowerCase();
      const match =
        doc.name.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.aiSummary.toLowerCase().includes(q) ||
        doc.ocrExtractedText.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOverrideSubmit = async () => {
    if (!selectedDoc || !overrideReason.trim()) {
      showToast('A mandatory reason is required for officer document override.');
      return;
    }
    await verifyDocumentOverride(selectedDoc.id, overrideStatus, overrideReason);
    setShowOverrideModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 5
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Gemini 3.8 Flash Multimodal OCR</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            AI Document Intelligence & OCR Scrutiny Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated text extraction, date expiration detection, missing fields discovery, and statutory cross-verification
          </p>
        </div>
      </div>

      {/* Interactive OCR & Document Intelligence Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-[#17365D] text-white p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <h2 className="text-sm font-bold tracking-tight">Interactive Multimodal OCR Test Sandbox</h2>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-300 text-[11px] mr-1 hidden sm:inline">Load Sample:</span>
            <button
              onClick={() => handlePresetSelect('fire_valid')}
              className="bg-white/10 hover:bg-white/20 text-sky-200 px-2 py-0.5 rounded text-[11px]"
            >
              Valid Fire NOC
            </button>
            <button
              onClick={() => handlePresetSelect('fire_expired')}
              className="bg-white/10 hover:bg-white/20 text-red-300 px-2 py-0.5 rounded text-[11px]"
            >
              Expired Fire NOC
            </button>
            <button
              onClick={() => handlePresetSelect('land_deed')}
              className="bg-white/10 hover:bg-white/20 text-emerald-300 px-2 py-0.5 rounded text-[11px]"
            >
              Contiguous Land Deed
            </button>
            <button
              onClick={() => handlePresetSelect('faculty_shortfall')}
              className="bg-white/10 hover:bg-white/20 text-amber-300 px-2 py-0.5 rounded text-[11px]"
            >
              FSR Shortfall
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          {/* Input Panel */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={testDocCategory}
                  onChange={e => setTestDocCategory(e.target.value as DocumentCategory)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-medium"
                >
                  <option value="Fire Safety Certificate">Fire Safety Certificate</option>
                  <option value="Land Documents">Land Documents</option>
                  <option value="Building Documents">Building Documents</option>
                  <option value="Faculty Details">Faculty Details</option>
                  <option value="Infrastructure Certificates">Infrastructure Certificates</option>
                  <option value="Financial Documents">Financial Documents</option>
                  <option value="Undertakings">Undertakings</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document File Name</label>
                <input
                  type="text"
                  value={testFileName}
                  onChange={e => setTestFileName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                OCR Input Text / Certificate Content
              </label>
              <textarea
                rows={6}
                value={testRawText}
                onChange={e => setTestRawText(e.target.value)}
                className="w-full font-mono text-[11px] border border-slate-300 rounded-lg p-2.5 bg-slate-50"
              />
            </div>

            <button
              onClick={handleRunLiveTest}
              disabled={analyzing}
              className="bg-[#1769AA] hover:bg-[#13578c] text-white font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing with Gemini Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Gemini Document Scrutiny Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Output Panel */}
          <div className="bg-[#F5F7FA] p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <span className="font-bold text-[#17365D]">AI Scrutiny Analysis Output</span>
                {analyzedDoc ? (
                  <StatusBadge status={analyzedDoc.status} />
                ) : (
                  <span className="text-[10px] text-slate-400">Ready for evaluation</span>
                )}
              </div>

              {analyzedDoc ? (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-[#17365D] mb-1">AI Executive Summary</p>
                    <p className="text-slate-700 leading-relaxed">{analyzedDoc.aiSummary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Confidence Score</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        {analyzedDoc.confidenceScore}%
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Identified Status</span>
                      <span className="text-base font-extrabold text-[#17365D]">
                        {analyzedDoc.status}
                      </span>
                    </div>
                  </div>

                  {analyzedDoc.missingFields.length > 0 && (
                    <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-red-800 text-[11px]">
                      <strong>Missing Fields Detected:</strong> {analyzedDoc.missingFields.join(', ')}
                    </div>
                  )}

                  {analyzedDoc.mismatchWarnings.length > 0 && (
                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-800 text-[11px]">
                      <strong>Regulatory Mismatches:</strong> {analyzedDoc.mismatchWarnings.join('; ')}
                    </div>
                  )}

                  {analyzedDoc.extractedMetadata && (
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                      <span className="font-bold text-slate-700 block mb-1">Extracted Metadata</span>
                      <div className="grid grid-cols-2 gap-1 text-slate-600">
                        {Object.entries(analyzedDoc.extractedMetadata).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span> {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  Select a preset or edit OCR text on the left, then click <strong>Execute Gemini Document Scrutiny Analysis</strong> to see real-time AI classification and deficiency detection.
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-4 border-t border-slate-200 pt-2">
              Note: Pursuant to statutory governance principles, AI determinations remain advisory decision support for human scrutiny officers.
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Repository Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <h3 className="font-bold text-sm text-[#17365D]">Institutional Documents Repository</h3>
            <p className="text-slate-500">Live verification status of all uploaded institutional attachments</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search document name or text..."
                value={searchDocQuery}
                onChange={e => setSearchDocQuery(e.target.value)}
                className="bg-[#F5F7FA] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="Fire Safety Certificate">Fire Safety Certificate</option>
              <option value="Land Documents">Land Documents</option>
              <option value="Building Documents">Building Documents</option>
              <option value="Faculty Details">Faculty Details</option>
              <option value="Infrastructure Certificates">Infrastructure Certificates</option>
              <option value="Financial Documents">Financial Documents</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Valid">Valid</option>
              <option value="Invalid">Invalid</option>
              <option value="Needs Manual Review">Needs Manual Review</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#17365D] text-white font-semibold">
                <th className="py-3 px-4">Document Title & File</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">AI Verification Summary</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Officer Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">{doc.fileName} • App: {doc.applicationId}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {doc.category}
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <p className="text-slate-700 line-clamp-2">{doc.aiSummary}</p>
                    {doc.missingFields.length > 0 && (
                      <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                        Deficiency: {doc.missingFields.join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {doc.confidenceScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setOverrideStatus(doc.status);
                        setOverrideReason('');
                        setShowOverrideModal(true);
                      }}
                      className="text-xs font-bold text-[#1769AA] hover:text-[#102742] bg-[#EAF3FB] hover:bg-[#d5e9f8] px-2.5 py-1 rounded transition-colors"
                    >
                      Override
                    </button>
                    {doc.applicationId && (
                      <button
                        onClick={() => onSelectApplication(doc.applicationId)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded transition-colors"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Modal */}
      <Modal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        title="Officer Document Verification Override"
        subtitle={selectedDoc?.name}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">New Statutory Status</label>
            <select
              value={overrideStatus}
              onChange={e => setOverrideStatus(e.target.value as any)}
              className="w-full border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="Valid">Valid (Statutory Conformity)</option>
              <option value="Invalid">Invalid (Statutory Violation)</option>
              <option value="Needs Manual Review">Needs Additional Inquiry</option>
              <option value="Incomplete">Incomplete / Deficient</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mandatory Regulatory Reason for Override *
            </label>
            <textarea
              rows={3}
              required
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              placeholder="e.g. Verified with state fire department registration portal docket #KSFES-2026."
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowOverrideModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleOverrideSubmit}
              className="bg-[#17365D] hover:bg-[#102742] text-white font-bold px-4 py-1.5 rounded-lg"
            >
              Save Override & Log Audit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

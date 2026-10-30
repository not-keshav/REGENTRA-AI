import React, { useState } from 'react';
import {
  FilePlus2,
  CheckCircle2,
  Building2,
  FileText,
  UploadCloud,
  FileCheck2,
  Trash2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ApplicationCategory, CourseIntake, DocumentCategory } from '../types/index.ts';

export const NewApplicationPage: React.FC<{
  onApplicationCreated: (id: string) => void;
  onCancel: () => void;
}> = ({ onApplicationCreated, onCancel }) => {
  const { institutions, submitApplication, showToast } = useApp();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State: Step 1 (Institution)
  const defaultInst = institutions[0] || null;
  const [selectedInstId, setSelectedInstId] = useState<string>(defaultInst?.id || 'inst-001');
  const [institutionName, setInstitutionName] = useState<string>(defaultInst?.name || 'Aryabhatta Institute of Technology');
  const [institutionAicteId, setInstitutionAicteId] = useState<string>(defaultInst?.institutionId || 'AICTE-1-440918231');
  const [state, setState] = useState<string>(defaultInst?.state || 'Karnataka');
  const [district, setDistrict] = useState<string>(defaultInst?.district || 'Bengaluru Urban');
  const [contactPerson, setContactPerson] = useState<string>(defaultInst?.contactPerson || 'Dr. S. K. Bhattacharya');
  const [email, setEmail] = useState<string>(defaultInst?.email || 'principal@aryabhatta-tech.edu.in');
  const [phone, setPhone] = useState<string>(defaultInst?.phone || '+91 80 2852 9100');
  const [institutionCategory, setInstitutionCategory] = useState<string>('Engineering & Technology');

  // Form State: Step 2 (Application Details)
  const [category, setCategory] = useState<ApplicationCategory>('Increase in Intake');
  const [academicYear, setAcademicYear] = useState<string>('2026-2027');
  const [existingApprovalNumber, setExistingApprovalNumber] = useState<string>('AICTE/CR/2025/1-440918231');
  const [description, setDescription] = useState<string>(
    'Application for intake enhancement in Emerging Computer Science streams & Introduction of Cyber Security curriculum.'
  );
  const [courses, setCourses] = useState<CourseIntake[]>([
    {
      courseName: 'Computer Science & Engineering',
      degreeLevel: 'UG',
      durationYears: 4,
      proposedIntake: 240,
      existingIntake: 180
    },
    {
      courseName: 'Artificial Intelligence & Machine Learning',
      degreeLevel: 'UG',
      durationYears: 4,
      proposedIntake: 120,
      existingIntake: 60
    }
  ]);

  // Form State: Step 3 (Documents)
  interface UploadedDocItem {
    category: DocumentCategory;
    name: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileDataUrl?: string;
  }
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocItem[]>([
    {
      category: 'Fire Safety Certificate',
      name: 'Fire Safety NOC 2026-27',
      fileName: 'Fire_Safety_NOC_2026.pdf',
      fileSize: 1450200,
      fileType: 'application/pdf'
    },
    {
      category: 'Land Documents',
      name: 'Registered Contiguous Title Deed',
      fileName: 'Land_Title_Deed_Registered.pdf',
      fileSize: 3204900,
      fileType: 'application/pdf'
    },
    {
      category: 'Faculty Details',
      name: 'Approved Faculty Cadre Ratios Statement',
      fileName: 'Faculty_Cadre_Statement.pdf',
      fileSize: 1890400,
      fileType: 'application/pdf'
    }
  ]);

  const [currentUploadCategory, setCurrentUploadCategory] = useState<DocumentCategory>('Building Documents');

  // Form State: Step 4 (Declaration)
  const [declarationAccepted, setDeclarationAccepted] = useState<boolean>(false);

  // Institution Selection Change
  const handleInstitutionChange = (id: string) => {
    setSelectedInstId(id);
    const inst = institutions.find(i => i.id === id);
    if (inst) {
      setInstitutionName(inst.name);
      setInstitutionAicteId(inst.institutionId);
      setState(inst.state);
      setDistrict(inst.district);
      setContactPerson(inst.contactPerson);
      setEmail(inst.email);
      setPhone(inst.phone);
      setInstitutionCategory(inst.type);
    }
  };

  // Add course row
  const addCourse = () => {
    setCourses([
      ...courses,
      {
        courseName: 'New Course Program',
        degreeLevel: 'UG',
        durationYears: 4,
        proposedIntake: 60,
        existingIntake: 0
      }
    ]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  // File Upload Handler (with base64 conversion)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedDocs(prev => [
          ...prev,
          {
            category: currentUploadCategory,
            name: `${currentUploadCategory} - ${file.name}`,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || 'application/pdf',
            fileDataUrl: base64
          }
        ]);
        showToast(`Uploaded ${file.name} under ${currentUploadCategory}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalIntake = courses.reduce((acc, c) => acc + (Number(c.proposedIntake) || 0), 0);

  // Submit Final Application
  const handleSubmit = async () => {
    if (!declarationAccepted) {
      showToast('You must accept the statutory undertaking before submitting.');
      return;
    }

    setSubmitting(true);
    const payload = {
      institutionId: selectedInstId,
      institutionName,
      institutionAicteId,
      state,
      district,
      contactPerson,
      email,
      phone,
      category,
      academicYear,
      existingApprovalNumber,
      description,
      courses,
      intakeCapacity: totalIntake,
      documents: uploadedDocs,
      declarationAccepted: true,
      deadlineDate: '2026-04-15'
    };

    const createdApp = await submitApplication(payload);
    setSubmitting(false);

    if (createdApp) {
      onApplicationCreated(createdApp.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#1769AA] uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Statutory Approval Submission Portal</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D] mt-1">
          New Institutional Approval Application (AY 2026-27)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Step-by-step submission with automatic pre-scrutiny compliance validation
        </p>

        {/* 4 Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { num: 1, label: 'Institution Details' },
            { num: 2, label: 'Program & Intake' },
            { num: 3, label: 'Document Attachments' },
            { num: 4, label: 'Review & Undertaking' }
          ].map(s => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                step === s.num
                  ? 'border-[#1769AA] bg-[#EAF3FB] text-[#17365D] font-bold'
                  : step > s.num
                  ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800 cursor-pointer'
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-1.5 text-xs">
                {step > s.num ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      step === s.num ? 'bg-[#1769AA] text-white' : 'bg-slate-300 text-white'
                    }`}
                  >
                    {s.num}
                  </span>
                )}
                <span className="hidden sm:inline font-semibold">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Institution Details */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#17365D]">Step 1: Technical Institution Profile</h2>
            <p className="text-xs text-slate-500">Select an existing registered institution or verify campus address details</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Sponsoring Institution
              </label>
              <select
                value={selectedInstId}
                onChange={e => handleInstitutionChange(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-[#1769AA] font-medium"
              >
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.institutionId}) - {inst.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={e => setInstitutionName(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-[#1769AA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Permanent AICTE Application ID
              </label>
              <input
                type="text"
                value={institutionAicteId}
                onChange={e => setInstitutionAicteId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono focus:border-[#1769AA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-[#1769AA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District / Metro Zone
              </label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-[#1769AA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Head of Institute / Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-[#1769AA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-[#1769AA]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-1.5"
            >
              <span>Next: Application Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Application Details & Courses */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#17365D]">Step 2: Program Specifications & Intake</h2>
            <p className="text-xs text-slate-500">Define approval category, academic session and proposed course intake figures</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approval Application Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ApplicationCategory)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-[#1769AA] font-medium"
              >
                <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                <option value="Increase in Intake">Increase in Intake</option>
                <option value="Introduction of New Courses">Introduction of New Courses</option>
                <option value="New Technical Institution">New Technical Institution</option>
                <option value="Change in Name / Site">Change in Name / Site</option>
                <option value="Closure of Course / Institute">Closure of Course / Institute</option>
                <option value="NRI / OCI / FN Quota">NRI / OCI / FN Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year Cycle
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-medium focus:border-[#1769AA]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Existing AICTE Approval Order / File Reference
              </label>
              <input
                type="text"
                value={existingApprovalNumber}
                onChange={e => setExistingApprovalNumber(e.target.value)}
                placeholder="AICTE/RO/2025/1-xxxxxxxxx"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-[#1769AA]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Brief Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:border-[#1769AA]"
              />
            </div>
          </div>

          {/* Courses Table */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#17365D]">Course Intake Breakdown</span>
              <button
                type="button"
                onClick={addCourse}
                className="text-xs text-[#1769AA] font-bold hover:underline"
              >
                + Add Course Row
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#F5F7FA] text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Course / Discipline</th>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3">Years</th>
                    <th className="py-2.5 px-3">Existing</th>
                    <th className="py-2.5 px-3">Proposed</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((c, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={c.courseName}
                          onChange={e => {
                            const updated = [...courses];
                            updated[idx].courseName = e.target.value;
                            setCourses(updated);
                          }}
                          className="w-full border border-slate-200 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={c.degreeLevel}
                          onChange={e => {
                            const updated = [...courses];
                            updated[idx].degreeLevel = e.target.value as any;
                            setCourses(updated);
                          }}
                          className="border border-slate-200 rounded px-2 py-1 text-xs"
                        >
                          <option value="UG">UG</option>
                          <option value="PG">PG</option>
                          <option value="Diploma">Diploma</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={c.durationYears}
                          onChange={e => {
                            const updated = [...courses];
                            updated[idx].durationYears = Number(e.target.value);
                            setCourses(updated);
                          }}
                          className="w-16 border border-slate-200 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={c.existingIntake || 0}
                          onChange={e => {
                            const updated = [...courses];
                            updated[idx].existingIntake = Number(e.target.value);
                            setCourses(updated);
                          }}
                          className="w-20 border border-slate-200 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={c.proposedIntake}
                          onChange={e => {
                            const updated = [...courses];
                            updated[idx].proposedIntake = Number(e.target.value);
                            setCourses(updated);
                          }}
                          className="w-20 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-[#17365D]"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeCourse(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-2 text-xs font-bold text-slate-700">
              Total Proposed Intake Capacity: <span className="ml-2 text-[#1769AA]">{totalIntake} seats</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-slate-600 hover:text-slate-800 font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-1.5"
            >
              <span>Next: Attach Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Document Uploads */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#17365D]">Step 3: Upload Regulatory Certificates</h2>
            <p className="text-xs text-slate-500">Attach mandatory certificates in PDF, JPG or PNG (up to 50MB per file)</p>
          </div>

          {/* Upload Tool Box */}
          <div className="p-4 rounded-xl border border-dashed border-[#1769AA]/40 bg-[#EAF3FB]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-[#17365D]">
                  Target Document Category
                </label>
                <select
                  value={currentUploadCategory}
                  onChange={e => setCurrentUploadCategory(e.target.value as DocumentCategory)}
                  className="mt-1 text-xs border border-slate-300 rounded-lg p-2 bg-white font-medium"
                >
                  <option value="Application Form">Application Form (Part 1 & 2)</option>
                  <option value="Fire Safety Certificate">Fire Safety Certificate (Mandatory NOC)</option>
                  <option value="Land Documents">Land Documents (Registered Deed)</option>
                  <option value="Building Documents">Building Documents (Occupancy & Plan)</option>
                  <option value="Faculty Details">Faculty Details (Roll Statement & FSR)</option>
                  <option value="Infrastructure Certificates">Infrastructure Certificates</option>
                  <option value="Financial Documents">Financial Documents & Corpus FDR</option>
                  <option value="Undertakings">Undertakings & Anti-Ragging</option>
                  <option value="Other Supporting Documents">Other Supporting Documents</option>
                </select>
              </div>

              <div>
                <label className="cursor-pointer bg-[#1769AA] hover:bg-[#13578c] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm flex items-center space-x-2 transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose File to Upload</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Files are automatically processed by Gemini multimodal OCR upon submission to verify validity dates and detect discrepancies.
            </p>
          </div>

          {/* Uploaded Documents List */}
          <div>
            <h4 className="text-xs font-bold text-[#17365D] mb-2">Attached Documents ({uploadedDocs.length})</h4>
            <div className="space-y-2">
              {uploadedDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1769AA] flex items-center justify-center font-bold">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {doc.category} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • {doc.fileName}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedDocs(uploadedDocs.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-slate-600 hover:text-slate-800 font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-1.5"
            >
              <span>Next: Final Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review and Submit */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#17365D]">Step 4: Review Application & Statutory Undertaking</h2>
            <p className="text-xs text-slate-500">Verify all particulars before formal submission to AICTE Scrutiny Cell</p>
          </div>

          {/* Summary Box */}
          <div className="bg-[#F5F7FA] p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500">Institution:</span>
                <p className="font-bold text-slate-800">{institutionName}</p>
              </div>
              <div>
                <span className="text-slate-500">AICTE ID:</span>
                <p className="font-bold text-slate-800 font-mono">{institutionAicteId}</p>
              </div>
              <div>
                <span className="text-slate-500">Category:</span>
                <p className="font-bold text-[#1769AA]">{category}</p>
              </div>
              <div>
                <span className="text-slate-500">Academic Year:</span>
                <p className="font-bold text-slate-800">{academicYear}</p>
              </div>
              <div>
                <span className="text-slate-500">Total Proposed Intake:</span>
                <p className="font-bold text-emerald-700">{totalIntake} seats</p>
              </div>
              <div>
                <span className="text-slate-500">Attached Documents:</span>
                <p className="font-bold text-slate-800">{uploadedDocs.length} certificates</p>
              </div>
            </div>
          </div>

          {/* Undertaking Checkbox */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-start space-x-2.5">
              <input
                type="checkbox"
                id="undertaking-check"
                checked={declarationAccepted}
                onChange={e => setDeclarationAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#1769AA] border-slate-300 focus:ring-[#1769AA]"
              />
              <label htmlFor="undertaking-check" className="text-xs text-slate-800 leading-relaxed cursor-pointer font-medium">
                I hereby declare on behalf of the sponsoring Society/Trust that all statements, facts, land documents, building approvals, and faculty credentials furnished in this application are true and correct. I understand that any false declaration will invite action under Section 10 of the AICTE Act.
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-slate-600 hover:text-slate-800 font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={submitting || !declarationAccepted}
              onClick={handleSubmit}
              className="bg-[#16A36A] hover:bg-[#128054] text-white text-xs font-bold px-6 py-3 rounded-lg shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{submitting ? 'Transmitting to AICTE Scrutiny Cell...' : 'Submit Application & Run AI Pre-Scrutiny'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  FileText,
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle2,
  AlertTriangle,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useApp } from '../context/AppContext.tsx';

export const AnalyticsReportsPage: React.FC = () => {
  const { applications, institutions, officers, complianceRules, showToast } = useApp();

  const [reportType, setReportType] = useState<string>('overall');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('2026-2027');

  // Metrics
  const total = applications.length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const underReview = applications.filter(a => a.status === 'Under Scrutiny' || a.status === 'Senior Review').length;
  const highRisk = applications.filter(a => a.riskCategory === 'Critical' || a.riskCategory === 'High').length;

  // Category Distribution
  const categoryData = [
    { name: 'EoA', count: applications.filter(a => a.category.includes('Extension')).length },
    { name: 'Increase Intake', count: applications.filter(a => a.category.includes('Increase')).length },
    { name: 'New Courses', count: applications.filter(a => a.category.includes('New Courses')).length },
    { name: 'New Institute', count: applications.filter(a => a.category.includes('New Technical')).length },
    { name: 'NRI / OCI', count: applications.filter(a => a.category.includes('NRI')).length },
    { name: 'Closure', count: applications.filter(a => a.category.includes('Closure')).length },
  ];

  // Officer Performance
  const officerPerformance = officers.map(o => ({
    name: o.officerName.split(' ')[0],
    cleared: o.completedCount,
    pending: o.pendingCount,
    avgDays: o.avgProcessingDays
  }));

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Application ID', 'Institution', 'Category', 'Intake', 'Stage', 'Status', 'Risk Score', 'Assigned Officer'];
    const rows = applications.map(a => [
      a.applicationId,
      `"${a.institutionName}"`,
      `"${a.category}"`,
      a.intakeCapacity,
      `"${a.currentStageName}"`,
      a.status,
      a.riskScore,
      `"${a.assignedOfficerName || 'Unassigned'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `REGENTRA_AICTE_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Analytics CSV report exported successfully.');
  };

  // PDF Export using jsPDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica');

      // Title & Header
      doc.setFillColor(23, 54, 93); // #17365D
      doc.rect(0, 0, 210, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text('REGENTRA AI - Statutory Approval & Compliance Audit Report', 14, 12);
      doc.setFontSize(9);
      doc.text('Smart India Hackathon 2026 | Problem ID: SIH 26262 | Team: 555_DIAMOND', 14, 18);

      // Metadata
      doc.setTextColor(32, 43, 60);
      doc.setFontSize(10);
      doc.text(`Generated On: ${new Date().toLocaleDateString('en-IN')}`, 14, 32);
      doc.text(`Academic Session: ${academicYearFilter}`, 14, 38);
      doc.text(`Total Applications Evaluated: ${total} records`, 14, 44);

      // Key Metrics Table
      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Total Count', 'Percentage']],
        body: [
          ['Total Applications in Cycle', String(total), '100%'],
          ['Approved Applications', String(approved), `${Math.round((approved / (total || 1)) * 100)}%`],
          ['Under Review / Scrutiny', String(underReview), `${Math.round((underReview / (total || 1)) * 100)}%`],
          ['High / Critical Delay Risk', String(highRisk), `${Math.round((highRisk / (total || 1)) * 100)}%`],
          ['Rejected / Returned', String(rejected), `${Math.round((rejected / (total || 1)) * 100)}%`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [23, 54, 93] }
      });

      // Applications List
      const tableRows = applications.slice(0, 15).map(a => [
        a.applicationId,
        a.institutionName,
        a.category,
        a.currentStageName,
        a.status,
        `${a.riskScore}/100`
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Application ID', 'Institution', 'Category', 'Current Stage', 'Status', 'Risk']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [23, 105, 170] },
        styles: { fontSize: 8 }
      });

      doc.save(`REGENTRA_AICTE_Executive_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      showToast('Executive PDF Audit Report generated and downloaded.');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Error generating PDF report');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 12
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Statutory Reporting & Intelligence</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Analytics, Performance Audits & Exportable Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional clearance velocity, department scrutiny performance, and automated statutory PDF / CSV exports
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-sky-300" />
            <span>Generate Official PDF Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Total Applications</span>
          <p className="text-2xl font-black text-[#17365D] mt-1">{total}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">AY 2026-27 Submissions</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Statutory Approvals</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{approved}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{Math.round((approved / (total || 1)) * 100)}% Clearance rate</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Active in Scrutiny</span>
          <p className="text-2xl font-black text-[#1769AA] mt-1">{underReview}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Pre-scrutiny & EVC</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold block">Flagged Delay Risk</span>
          <p className="text-2xl font-black text-red-600 mt-1">{highRisk}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Critical attention needed</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-[#17365D] mb-1">
            Applications by Approval Category
          </h3>
          <p className="text-xs text-slate-500 mb-4">Distribution across technical education disciplines</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" name="Applications" fill="#17365D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Officer Clearance Velocity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-[#17365D] mb-1">
            Scrutiny Officer Clearance Velocity
          </h3>
          <p className="text-xs text-slate-500 mb-4">Completed cases vs average days to clear</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={officerPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="cleared" name="Cases Cleared" fill="#16A36A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgDays" name="Avg Processing Days" fill="#1769AA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

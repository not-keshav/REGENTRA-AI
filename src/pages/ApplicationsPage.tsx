import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FilePlus2,
  Eye,
  Download,
  ArrowUpDown,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge, RiskBadge } from '../components/common/Badge.tsx';
import { Application, ApplicationCategory, ApplicationStatus } from '../types/index.ts';

export const ApplicationsPage: React.FC<{
  onSelectApplication: (id: string) => void;
  onNewApplication: () => void;
}> = ({ onSelectApplication, onNewApplication }) => {
  const { applications, searchQuery, setSearchQuery } = useApp();
  const { currentUser } = useAuth();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof Application>('submittedAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filter and sort
  const filteredApps = useMemo(() => {
    return applications
      .filter(app => {
        if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
        if (categoryFilter !== 'ALL' && app.category !== categoryFilter) return false;
        if (riskFilter !== 'ALL' && app.riskCategory !== riskFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const match =
            app.applicationId.toLowerCase().includes(q) ||
            app.institutionName.toLowerCase().includes(q) ||
            app.description.toLowerCase().includes(q) ||
            (app.assignedOfficerName && app.assignedOfficerName.toLowerCase().includes(q));
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === undefined || valB === undefined) return 0;
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [applications, statusFilter, categoryFilter, riskFilter, searchQuery, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredApps.length / pageSize) || 1;
  const paginatedApps = filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof Application) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Application ID', 'Institution', 'Category', 'Intake', 'Stage', 'Status', 'Risk Score', 'Assigned Officer', 'Submitted At'];
    const rows = filteredApps.map(a => [
      a.applicationId,
      `"${a.institutionName}"`,
      `"${a.category}"`,
      a.intakeCapacity,
      `"${a.currentStageName}"`,
      a.status,
      a.riskScore,
      `"${a.assignedOfficerName || 'Unassigned'}"`,
      a.submittedAt.split('T')[0]
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `REGENTRA_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#17365D]">Applications Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time statutory tracking across all technical institutions in AICTE database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onNewApplication}
            className="flex items-center space-x-1.5 bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-colors"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Submit Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search application ID, institution name, course..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FA] border border-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#1769AA] focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#1769AA]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Document Pre-Scrutiny">Document Pre-Scrutiny</option>
            <option value="Under Scrutiny">Under Scrutiny</option>
            <option value="Deficiency Identified">Deficiency Identified</option>
            <option value="Pending EVC">Pending EVC</option>
            <option value="Senior Review">Senior Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#1769AA]"
          >
            <option value="ALL">All Categories</option>
            <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
            <option value="Increase in Intake">Increase in Intake</option>
            <option value="New Technical Institution">New Technical Institution</option>
            <option value="Introduction of New Courses">Introduction of New Courses</option>
            <option value="Closure of Course / Institute">Closure of Course / Institute</option>
            <option value="NRI / OCI / FN Quota">NRI / OCI / FN Quota</option>
          </select>

          <select
            value={riskFilter}
            onChange={e => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#1769AA]"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Low">Low Risk (0-29)</option>
            <option value="Medium">Medium Risk (30-59)</option>
            <option value="High">High Risk (60-79)</option>
            <option value="Critical">Critical Risk (80-100)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#17365D] text-white font-semibold">
                <th
                  onClick={() => handleSort('applicationId')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Application ID</span>
                    <ArrowUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('institutionName')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Institution</span>
                    <ArrowUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Intake</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4">Assigned Officer</th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Risk Level</span>
                    <ArrowUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No applications found matching the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedApps.map(app => (
                  <tr
                    key={app.id}
                    className="hover:bg-sky-50/40 transition-colors cursor-pointer"
                    onClick={() => onSelectApplication(app.id)}
                  >
                    <td className="py-3.5 px-4 font-extrabold text-[#17365D]">
                      {app.applicationId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{app.institutionName}</p>
                      <p className="text-[10px] text-slate-400">AY: {app.academicYear}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[160px] truncate">
                      {app.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {app.intakeCapacity} seats
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {app.currentStageName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {app.assignedOfficerName || <span className="text-slate-400">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge category={app.riskCategory} score={app.riskScore} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectApplication(app.id)}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#1769AA] hover:text-[#102742] bg-[#EAF3FB] hover:bg-[#d5e9f8] px-2.5 py-1.5 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredApps.length)} of {filteredApps.length} applications
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

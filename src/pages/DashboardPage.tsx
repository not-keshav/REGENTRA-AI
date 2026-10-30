import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Building2,
  Calendar,
  ArrowUpRight,
  Filter,
  Eye,
  AlertCircle,
  FileSearch,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge, RiskBadge } from '../components/common/Badge.tsx';
import { ApplicationCategory, ApplicationStatus, RiskCategory } from '../types/index.ts';

export const DashboardPage: React.FC<{
  onSelectApplication: (id: string) => void;
  onNavigate: (page: string) => void;
}> = ({ onSelectApplication, onNavigate }) => {
  const { applications, institutions, officers, notifications, auditLogs } = useApp();
  const { currentUser } = useAuth();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter(a => {
      if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
      if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
      if (selectedRisk !== 'ALL' && a.riskCategory !== selectedRisk) return false;
      return true;
    });
  }, [applications, selectedCategory, selectedStatus, selectedRisk]);

  // Statistics
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
  const underReviewApps = applications.filter(a =>
    a.status === 'Under Scrutiny' || a.status === 'Document Pre-Scrutiny' || a.status === 'Senior Review' || a.status === 'Pending EVC'
  ).length;
  const deficiencyApps = applications.filter(a =>
    a.status === 'Deficiency Identified' || a.status === 'Correction Required'
  ).length;
  const highRiskApps = applications.filter(a => a.riskCategory === 'Critical' || a.riskCategory === 'High');

  // Status Distribution Data for Pie Chart
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    const colors: Record<string, string> = {
      Approved: '#16A36A',
      'Under Scrutiny': '#1769AA',
      'Document Pre-Scrutiny': '#38BDF8',
      'Deficiency Identified': '#F59E0B',
      'Correction Required': '#F97316',
      'Senior Review': '#6366F1',
      'Pending EVC': '#8B5CF6',
      Submitted: '#0284C7',
      Rejected: '#DC3545',
      Returned: '#94A3B8',
    };
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#64748B'
    }));
  }, [applications]);

  // Monthly Submissions Trend Data
  const monthlyTrendData = [
    { month: 'Oct 2025', submitted: 4, approved: 3, deficiencies: 1 },
    { month: 'Nov 2025', submitted: 8, approved: 6, deficiencies: 2 },
    { month: 'Dec 2025', submitted: 14, approved: 10, deficiencies: 4 },
    { month: 'Jan 2026', submitted: 22, approved: 16, deficiencies: 5 },
    { month: 'Feb 2026', submitted: 30, approved: 7, deficiencies: 6 },
    { month: 'Mar 2026 (Est)', submitted: 18, approved: 15, deficiencies: 3 },
  ];

  // Officer Workload Chart Data
  const officerWorkloadData = useMemo(() => {
    return officers.map(o => ({
      name: o.officerName.split(' ')[0],
      pending: o.pendingCount,
      completed: o.completedCount,
      capacity: o.maxCapacity
    }));
  }, [officers]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Institutional Clearance Dashboard
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">AY 2026-27 Cycle</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17365D] mt-1.5 tracking-tight">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time scrutiny monitoring, compliance verification, and predictive delay governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('simulation')}
            className="flex items-center space-x-1.5 bg-[#EAF3FB] hover:bg-[#d9ecfa] text-[#17365D] border border-[#1769AA]/30 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1769AA]" />
            <span>Digital Twin Simulator</span>
          </button>
          <button
            onClick={() => onNavigate('new-application')}
            className="flex items-center space-x-1.5 bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-colors"
          >
            <span>+ New Application</span>
          </button>
        </div>
      </div>

      {/* 6 Top Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Applications</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#1769AA]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#17365D] mt-2">{totalApps}</p>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center">
            <span className="text-emerald-600 font-semibold mr-1">30 seeded</span> in DB
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Approved</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{approvedApps}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {Math.round((approvedApps / (totalApps || 1)) * 100)}% approval rate
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Under Review</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-sky-700 mt-2">{underReviewApps}</p>
          <p className="text-[10px] text-slate-400 mt-1">Active scrutiny pipeline</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Deficiencies</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-2">{deficiencyApps}</p>
          <p className="text-[10px] text-slate-400 mt-1">Clarifications pending</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rejected / Returned</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-700 mt-2">{rejectedApps + 1}</p>
          <p className="text-[10px] text-slate-400 mt-1">Statutory non-compliance</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">High Delay Risk</span>
            <div className="p-1.5 rounded-lg bg-red-50 text-red-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-red-700 mt-2">{highRiskApps.length}</p>
          <p className="text-[10px] text-red-600 font-semibold mt-1">Requires intervention</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#17365D]">
                Approval vs Submission Trajectory (AY 2026-27)
              </h3>
              <p className="text-xs text-slate-500">
                Monthly workflow intake velocity compared with clearance rate
              </p>
            </div>
            <span className="text-[10px] font-semibold bg-[#EAF3FB] text-[#1769AA] px-2.5 py-1 rounded-md">
              AI Projected
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1769AA" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1769AA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A36A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16A36A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#CBD5E1',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="submitted"
                  name="Applications Submitted"
                  stroke="#1769AA"
                  fillOpacity={1}
                  fill="url(#colorSubmitted)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Statutory Approvals Granted"
                  stroke="#16A36A"
                  fillOpacity={1}
                  fill="url(#colorApproved)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#17365D]">Status Distribution</h3>
            <p className="text-xs text-slate-500">Live breakdown across all 30 active applications</p>
          </div>

          <div className="h-52 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-3 border-t border-slate-100 text-[11px]">
            {statusDistribution.slice(0, 4).map((s, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                <span className="text-slate-600 truncate">{s.name}:</span>
                <strong className="text-slate-800">{s.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Officer Workload & High-Risk Alert Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Officer Workload Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#17365D]">Scrutiny Officer Workload & Capacity</h3>
              <p className="text-xs text-slate-500">Current pending cases vs maximum allocated capacity</p>
            </div>
            <button
              onClick={() => onNavigate('officers')}
              className="text-xs font-semibold text-[#1769AA] hover:underline"
            >
              Reassign Workload →
            </button>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={officerWorkloadData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#CBD5E1',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="pending" name="Active Cases" fill="#1769AA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Cleared Cases" fill="#16A36A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High-Risk Application Warnings (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#17365D]">High-Risk Alerts</h3>
                <p className="text-[11px] text-slate-500">Predicted delay bottlenecks</p>
              </div>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              {highRiskApps.length} Critical
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-72 flex-1 pr-1">
            {highRiskApps.slice(0, 4).map(app => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app.id)}
                className="p-3 rounded-xl border border-red-200/80 bg-red-50/30 hover:bg-red-50/70 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#17365D]">{app.applicationId}</span>
                  <RiskBadge category={app.riskCategory} score={app.riskScore} />
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                  {app.institutionName}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                  <span>Stage: <strong>{app.currentStageName}</strong></span>
                  <span className="text-red-700 font-bold">{app.pendingDays} days pending</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('risk')}
            className="mt-3 w-full text-center text-xs text-[#1769AA] font-bold hover:underline py-1"
          >
            Open Explainable Risk Engine →
          </button>
        </div>
      </div>

      {/* Filterable Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-[#17365D]">Application Worklist</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredApps.length} of {applications.length} institutional approval records
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-[#1769AA]"
            >
              <option value="ALL">All Categories</option>
              <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              <option value="Increase in Intake">Increase in Intake</option>
              <option value="New Technical Institution">New Technical Institution</option>
              <option value="Introduction of New Courses">Introduction of New Courses</option>
              <option value="Closure of Course / Institute">Closure of Course / Institute</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-[#1769AA]"
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
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="text-xs border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-[#1769AA]"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.slice(0, 8).map(app => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#17365D]">
                    {app.applicationId}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{app.institutionName}</p>
                    <p className="text-[10px] text-slate-400">AY: {app.academicYear}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="truncate max-w-[150px] inline-block">{app.category}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {app.currentStageName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {app.assignedOfficerName || 'Pending Assignment'}
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge category={app.riskCategory} score={app.riskScore} />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectApplication(app.id)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#1769AA] hover:text-[#102742] bg-[#EAF3FB] hover:bg-[#d5e9f8] px-2.5 py-1 rounded transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={() => onNavigate('applications')}
            className="text-xs text-[#1769AA] font-bold hover:underline"
          >
            View All {applications.length} Applications in Full Directory →
          </button>
        </div>
      </div>
    </div>
  );
};

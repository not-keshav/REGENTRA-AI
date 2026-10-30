import React from 'react';
import { ApplicationStatus, RiskCategory, DocumentStatus, ComplianceSeverity } from '../../types/index.ts';

interface StatusBadgeProps {
  status: ApplicationStatus | DocumentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Approved':
    case 'Valid':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Rejected':
    case 'Invalid':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Returned':
    case 'Processing Failed':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Under Scrutiny':
    case 'Under Review':
    case 'Senior Review':
      colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
      break;
    case 'Deficiency Identified':
    case 'Correction Required':
    case 'Incomplete':
      colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
      break;
    case 'Pending EVC':
    case 'Needs Manual Review':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Submitted':
    case 'Resubmitted':
    case 'Document Pre-Scrutiny':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-3.5 py-1.5'
  }[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colorClasses} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export const RiskBadge: React.FC<{ category: RiskCategory; score?: number }> = ({ category, score }) => {
  let colors = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (category === 'Critical') {
    colors = 'bg-red-50 text-red-700 border-red-200';
  } else if (category === 'High') {
    colors = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (category === 'Medium') {
    colors = 'bg-yellow-50 text-yellow-800 border-yellow-200';
  }

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
      {category} Risk {score !== undefined ? `(${score})` : ''}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: ComplianceSeverity }> = ({ severity }) => {
  let colors = 'bg-slate-100 text-slate-700 border-slate-200';
  if (severity === 'Critical') {
    colors = 'bg-red-50 text-red-700 border-red-200 font-semibold';
  } else if (severity === 'High') {
    colors = 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
  } else if (severity === 'Medium') {
    colors = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (severity === 'Low') {
    colors = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full border ${colors}`}>
      {severity}
    </span>
  );
};

import React, { useState } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Mail,
  Phone,
  Award,
  ExternalLink,
  Plus,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Institution } from '../types/index.ts';
import { Modal } from '../components/common/Modal.tsx';

export const InstitutionsPage: React.FC<{
  onSelectApplication: (id: string) => void;
  onNavigate: (page: string) => void;
}> = ({ onSelectApplication, onNavigate }) => {
  const { institutions, applications, showToast, refreshData } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Edit form state
  const [name, setName] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const states = Array.from(new Set(institutions.map(i => i.state)));

  const filtered = institutions.filter(inst => {
    if (stateFilter !== 'ALL' && inst.state !== stateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        inst.name.toLowerCase().includes(q) ||
        inst.institutionId.toLowerCase().includes(q) ||
        inst.district.toLowerCase().includes(q) ||
        inst.type.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenEdit = (inst: Institution) => {
    setSelectedInst(inst);
    setName(inst.name);
    setContactPerson(inst.contactPerson);
    setEmail(inst.email);
    setPhone(inst.phone);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return;

    try {
      showToast(`Institution ${selectedInst.institutionId} details updated.`);
      setShowEditModal(false);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 3
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Statutory Technical Institutions Registry</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Institutional Profiles & Affiliation Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            15 registered technical institutions across India with land records, approved intake, and historical compliance ratings
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by institution name, AICTE ID, district, or university..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FA] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500">Filter State:</span>
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="border border-slate-200 bg-[#F5F7FA] rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="ALL">All States ({states.length})</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(inst => {
          const instApps = applications.filter(a => a.institutionId === inst.id);

          return (
            <div
              key={inst.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-[11px] text-[#1769AA] block">
                      {inst.institutionId}
                    </span>
                    <h3 className="font-extrabold text-sm text-[#17365D] mt-0.5 leading-snug">
                      {inst.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {inst.status}
                  </span>
                </div>

                <div className="py-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{inst.district}, {inst.state}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{inst.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-500">{inst.affiliationUniversity}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#F5F7FA] rounded-xl text-[11px] border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Land Extent</span>
                    <span className="font-bold text-slate-700">{inst.totalLandAcres} Acres</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Approved Intake</span>
                    <span className="font-bold text-[#1769AA]">{inst.totalApprovedIntake}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Compliance</span>
                    <span className="font-bold text-emerald-700">{inst.complianceScore}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {instApps.length} Application(s) on File
                </span>
                <button
                  onClick={() => handleOpenEdit(inst)}
                  className="text-xs font-bold text-[#1769AA] hover:text-[#102742] bg-[#EAF3FB] px-2.5 py-1 rounded transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Profile: ${selectedInst?.name}`}
        subtitle={`AICTE ID: ${selectedInst?.institutionId}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Institution Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Head of Institute / Principal</label>
            <input
              type="text"
              value={contactPerson}
              onChange={e => setContactPerson(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#17365D] hover:bg-[#102742] text-white font-bold px-4 py-1.5 rounded-lg"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

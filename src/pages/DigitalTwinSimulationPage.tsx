import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  Users,
  Clock,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle
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
  LineChart,
  Line
} from 'recharts';
import { useApp } from '../context/AppContext.tsx';
import { SimulationParameters, SimulationResults } from '../types/index.ts';

export const DigitalTwinSimulationPage: React.FC = () => {
  const { showToast } = useApp();

  // Simulation Controls
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState<number>(30);
  const [scrutinyOfficersCount, setScrutinyOfficersCount] = useState<number>(5);
  const [avgDocumentVerificationHours, setAvgDocumentVerificationHours] = useState<number>(6);
  const [dailyApplicationInflow, setDailyApplicationInflow] = useState<number>(3);
  const [avgCorrectionCycles, setAvgCorrectionCycles] = useState<number>(1.2);
  const [availableWorkingDays, setAvailableWorkingDays] = useState<number>(20);
  const [priorityProcessingEnabled, setPriorityProcessingEnabled] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SimulationResults | null>(null);

  const executeSimulation = async () => {
    setLoading(true);
    try {
      const params: SimulationParameters = {
        pendingApplicationsCount,
        scrutinyOfficersCount,
        avgDocumentVerificationHours,
        dailyApplicationInflow,
        avgCorrectionCycles,
        availableWorkingDays,
        priorityProcessingEnabled
      };

      const res = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parameters: params,
          scenarioName: `Executive Run: ${scrutinyOfficersCount} Officers, ${availableWorkingDays} Days`
        })
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.simulationResults);
        showToast('Digital Twin discrete-event simulation completed successfully.');
      }
    } catch (err) {
      console.error('Simulation error:', err);
      showToast('Error running simulation');
    } finally {
      setLoading(false);
    }
  };

  // Run on first load
  useEffect(() => {
    executeSimulation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
              Module 9
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Discrete-Event Queue Modeling</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#17365D] mt-1">
            Digital Twin Approval Workflow Simulation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Model alternative workforce scaling, SLA thresholds, and priority processing to identify statutory bottlenecks.
          </p>
        </div>

        <button
          onClick={executeSimulation}
          disabled={loading}
          className="bg-[#17365D] hover:bg-[#102742] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current text-sky-300" />
          <span>{loading ? 'Simulating Event Queues...' : 'RUN SIMULATION'}</span>
        </button>
      </div>

      {/* Simulation Controls Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-[#17365D] flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#1769AA]" />
            <span>Interactive Workflow Parameter Controls</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Adjust sliders to simulate queue dynamics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Pending Applications */}
          <div className="space-y-1.5 bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Initial Backlog:</span>
              <span className="text-[#1769AA] font-mono">{pendingApplicationsCount} Cases</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={pendingApplicationsCount}
              onChange={e => setPendingApplicationsCount(Number(e.target.value))}
              className="w-full accent-[#1769AA]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10 Apps</span>
              <span>100 Apps</span>
            </div>
          </div>

          {/* Scrutiny Officers Count */}
          <div className="space-y-1.5 bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Scrutiny Officers:</span>
              <span className="text-emerald-700 font-mono">{scrutinyOfficersCount} Officers</span>
            </div>
            <input
              type="range"
              min={2}
              max={15}
              step={1}
              value={scrutinyOfficersCount}
              onChange={e => setScrutinyOfficersCount(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2 Officers</span>
              <span>15 Officers</span>
            </div>
          </div>

          {/* Average Verification Hours */}
          <div className="space-y-1.5 bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Avg Verification Time:</span>
              <span className="text-amber-700 font-mono">{avgDocumentVerificationHours} Hours / Case</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={avgDocumentVerificationHours}
              onChange={e => setAvgDocumentVerificationHours(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2 hrs (Fast-Track)</span>
              <span>12 hrs (Manual)</span>
            </div>
          </div>

          {/* Daily Inflow */}
          <div className="space-y-1.5 bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Daily Application Inflow:</span>
              <span className="text-slate-800 font-mono">{dailyApplicationInflow} Apps / Day</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={dailyApplicationInflow}
              onChange={e => setDailyApplicationInflow(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 / day</span>
              <span>10 / day</span>
            </div>
          </div>

          {/* Working Days Horizon */}
          <div className="space-y-1.5 bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Simulation Working Horizon:</span>
              <span className="text-purple-700 font-mono">{availableWorkingDays} Working Days</span>
            </div>
            <input
              type="range"
              min={5}
              max={45}
              step={5}
              value={availableWorkingDays}
              onChange={e => setAvailableWorkingDays(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 Days</span>
              <span>45 Days</span>
            </div>
          </div>

          {/* Priority Policy Toggle */}
          <div className="flex items-center justify-between bg-[#F5F7FA] p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <p className="font-bold text-slate-800">Priority High-Risk Fast-Track</p>
              <p className="text-[10px] text-slate-500">
                Prioritize cases with impending deadlines
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={priorityProcessingEnabled}
                onChange={e => setPriorityProcessingEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16A36A]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Simulated Outcomes Display */}
      {results && (
        <div className="space-y-6">
          {/* Statutory Disclaimer Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center space-x-2 text-xs text-amber-900">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              <strong>Simulated Estimation Notice:</strong> The outputs below represent deterministic discrete-event mathematical estimates for capacity planning and do not constitute guaranteed statutory outcomes.
            </span>
          </div>

          {/* 4 Outcome Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold block">Expected Backlog</span>
              <p className="text-2xl font-black text-[#17365D] mt-1">
                {results.expectedBacklogAtEnd} Cases
              </p>
              <p className="text-[10px] text-slate-400 mt-1">At end of {availableWorkingDays} days</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold block">Avg Waiting Time</span>
              <p className="text-2xl font-black text-[#1769AA] mt-1">
                {results.avgWaitTimePerApplicationDays} Days
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Per institutional application</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold block">Officer Utilization</span>
              <p className="text-2xl font-black text-purple-700 mt-1">
                {results.officerUtilizationRate}%
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Capacity consumption rate</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold block">Est. Time to Clear</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {results.estimatedTotalProcessingDays} Days
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Full pipeline clearance</p>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-[#EAF3FB] p-5 rounded-2xl border border-[#1769AA]/30 text-xs">
            <div className="flex items-center space-x-2 text-[#1769AA] font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Digital Twin Executive Workload Recommendation</span>
            </div>
            <p className="text-slate-800 text-xs leading-relaxed font-medium">
              {results.aiBottleneckRecommendation}
            </p>
          </div>

          {/* Scenario Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comparative Backlog Bar Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-[#17365D] mb-1">
                Scenario Comparison: Backlog vs Waiting Time
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Evaluating workforce scaling and AI pre-scrutiny interventions
              </p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.scenarioComparison}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#64748B' }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="backlog" name="Remaining Backlog" fill="#17365D" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avgDays" name="Avg Wait Days" fill="#1769AA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stage-wise Bottleneck Queue Sizes */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-[#17365D] mb-1">
                Stage-wise Congestion & Delay Impact (Hours)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Identification of approval queue starvation points
              </p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.stageWiseBottlenecks} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis
                      dataKey="stageName"
                      type="category"
                      width={130}
                      tick={{ fontSize: 10, fill: '#334155' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="avgQueueSize" name="Avg Queue Size" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

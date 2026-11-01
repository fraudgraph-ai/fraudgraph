import React, { useState } from 'react';
import {
  FolderSearch,
  CheckCircle2,
  Clock,
  Circle,
  Play,
  FileText,
  UserCheck,
  Plus,
  Share2,
  MoreHorizontal,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  X,
  FileCheck,
  RotateCw,
} from 'lucide-react';
import { casesList, initialGraphNodes, initialGraphEdges } from '../../data/mockData';
import { InteractiveFinancialGraph } from '../../components/graph/InteractiveFinancialGraph';
import { TransactionTimelineBarChart } from '../../components/charts/TransactionTimelineBarChart';
import { AssignAnalystModal } from '../../components/ui/AssignAnalystModal';
import { AddEvidenceModal } from '../../components/ui/AddEvidenceModal';
import { RequestReviewModal } from '../../components/ui/RequestReviewModal';
import { ReportDossierModal } from '../../components/ui/ReportDossierModal';
import { useToast } from '../../components/ui/Toast';
import { Case, EvidenceItem, NavigationModule } from '../../types';

interface InvestigationWorkspaceProps {
  currentCaseId?: string;
  onNavigate: (module: NavigationModule) => void;
  onViewEvidence: (evidenceId: string) => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  currentCaseId = 'FG-8421',
  onNavigate,
  onViewEvidence,
}) => {
  const { toast } = useToast();
  const initialCase = casesList.find((c) => c.id === currentCaseId) || casesList[0];

  const [caseData, setCaseData] = useState<Case>(initialCase);
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'timeline' | 'evidence' | 'agents' | 'findings'>('graph');
  const [stages, setStages] = useState(caseData.stages);
  const [isRunningHypothesis, setIsRunningHypothesis] = useState(false);
  const [showSummaryNotice, setShowSummaryNotice] = useState(true);

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleRunHypothesis = () => {
    setIsRunningHypothesis(true);
    toast({
      type: 'info',
      title: 'Hypothesis Pipeline Triggered',
      description: 'D24 Hypothesis Generator & D25 Counter-Hypothesis testing competing theories...',
    });

    setTimeout(() => {
      setIsRunningHypothesis(false);
      setStages((prev) =>
        prev.map((s) => {
          if (s.name === 'Graph Analysis') return { ...s, status: 'completed' as const };
          if (s.name === 'Hypothesis Testing') return { ...s, status: 'completed' as const };
          if (s.name === 'Evidence Verification') return { ...s, status: 'in_progress' as const };
          return s;
        })
      );
      toast({
        type: 'success',
        title: 'Hypothesis Testing Complete',
        description: 'Mule Account Layering Network confirmed (Likelihood: 88%). Legitimate payroll refuted.',
      });
    }, 1400);
  };

  const handleAssignAnalyst = (analyst: string, priority: string, note: string) => {
    setCaseData((prev) => ({
      ...prev,
      leadAnalyst: analyst,
      priority: priority as any,
    }));
    toast({
      type: 'success',
      title: 'Lead Investigator Assigned',
      description: `Case ${caseData.id} reassigned to ${analyst} with ${priority} priority.`,
    });
  };

  const handleAddEvidence = (item: EvidenceItem) => {
    setCaseData((prev) => ({
      ...prev,
      evidenceIds: [...prev.evidenceIds, item.id],
      findings: [
        ...prev.findings,
        {
          id: `f-${Date.now()}`,
          claim: item.claimsSupported[0] || item.title,
          evidenceIds: [item.id],
          confidence: item.confidence,
          riskSignal: 'Ad-Hoc Evidence Grounding',
        },
      ],
    }));
    toast({
      type: 'success',
      title: 'Evidence Artifact Deposited',
      description: `Artifact ${item.id} signed and verified against cryptographic vault.`,
    });
  };

  const handleReviewConfirm = (disposition: string, justification: string) => {
    setCaseData((prev) => ({
      ...prev,
      status: 'review',
    }));
    setStages((prev) =>
      prev.map((s) => ({ ...s, status: 'completed' as const }))
    );
    toast({
      type: 'success',
      title: 'Analyst Disposition Recorded',
      description: `Case disposition submitted: "${disposition}". Audit record committed.`,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      {/* Top Breadcrumb & Case Actions Header */}
      <div className="h-16 px-6 border-b border-white/[0.08] bg-[#0a0f1b] flex items-center justify-between gap-4 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Investigation</span>
            <span>/</span>
            <span className="font-mono text-cyan-300 font-semibold">{caseData.id}</span>
          </div>
          <div className="flex items-center gap-2.5 mt-0.5">
            <h1 className="text-base font-bold text-white tracking-tight">
              {caseData.title}
            </h1>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              High Risk
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {caseData.status === 'review' ? 'In Review' : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAssignModalOpen(true)}
            title="Assign Analyst"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1627] hover:bg-[#131e35] border border-white/[0.08] text-xs font-medium text-slate-200 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Assign</span>
          </button>
          <button
            onClick={() => setIsAddEvidenceModalOpen(true)}
            title="Add Evidence Artifact"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1627] hover:bg-[#131e35] border border-white/[0.08] text-xs font-medium text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span>Add Evidence</span>
          </button>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ type: 'info', title: 'Case Link Copied', description: 'Direct workspace URL copied to clipboard.' });
            }}
            title="Share Case"
            className="p-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-slate-400 hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case Navigation Tabs */}
      <div className="h-10 px-6 border-b border-white/[0.06] bg-[#0c1222] flex items-center gap-6 shrink-0 text-xs">
        {(['overview', 'graph', 'timeline', 'evidence', 'agents', 'findings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-full flex items-center capitalize font-medium border-b-2 transition-all ${
              activeTab === tab
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3-Column Multi-Pane Investigation Layout */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left Column: Case Overview & Investigation Stages (3 cols) */}
        <div className="col-span-12 lg:col-span-3 border-r border-white/[0.08] bg-[#0a0f1b] p-4 overflow-y-auto space-y-5">
          {/* Case Overview Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300">Case Overview</h3>
            <div className="rounded-xl bg-[#0e1627] border border-white/[0.06] divide-y divide-white/[0.04] text-xs">
              <div className="flex justify-between p-2.5">
                <span className="text-slate-400">Case ID</span>
                <span className="font-mono font-semibold text-cyan-300">{caseData.id}</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-slate-400">Created</span>
                <span className="text-slate-300">{caseData.createdAt}</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-slate-400">Priority</span>
                <span className="font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded text-[11px]">
                  {caseData.priority}
                </span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-slate-400">Lead Analyst</span>
                <span className="text-slate-200 font-medium">{caseData.leadAnalyst}</span>
              </div>
              <div className="flex justify-between p-2.5">
                <span className="text-slate-400">Status</span>
                <span className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded text-[11px] font-medium">
                  {caseData.status === 'review' ? 'In Review' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>

          {/* Investigation Stages Stepper Tracker */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300">Investigation Stages</h3>
            <div className="p-3.5 rounded-xl bg-[#0e1627] border border-white/[0.06] space-y-3">
              {stages.map((stage, idx) => (
                <div key={stage.id} className="flex items-start gap-3 relative">
                  {/* Connecting Line */}
                  {idx < stages.length - 1 && (
                    <div
                      className={`absolute left-2.5 top-5 w-0.5 h-6 ${
                        stage.status === 'completed' ? 'bg-emerald-500/50' : 'bg-slate-700'
                      }`}
                    />
                  )}

                  {/* Icon Indicator */}
                  <div className="relative z-10 pt-0.5">
                    {stage.status === 'completed' && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-[#0e1627]" />
                      </div>
                    )}
                    {stage.status === 'in_progress' && (
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-300 flex items-center justify-center animate-pulse ring-2 ring-cyan-400">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      </div>
                    )}
                    {stage.status === 'pending' && (
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                        <Circle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Stage Label */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs block leading-tight ${
                        stage.status === 'in_progress'
                          ? 'text-cyan-300 font-semibold'
                          : stage.status === 'completed'
                          ? 'text-slate-200 font-medium'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.name}
                    </span>
                    {stage.completedBy && (
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        by {stage.completedBy}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Interactive Subgraph + Transaction Timeline (6 cols) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col h-full bg-[#080d19] overflow-hidden p-3 space-y-3">
          {/* Subgraph Container */}
          <div className="flex-1 min-h-[360px] rounded-xl overflow-hidden relative border border-white/[0.08]">
            <InteractiveFinancialGraph
              nodes={initialGraphNodes.slice(0, 7)}
              edges={initialGraphEdges.slice(0, 8)}
              selectedNodeId="node-center"
              onSelectNode={() => {}}
            />
          </div>

          {/* Transaction Timeline Bar Chart */}
          <div className="shrink-0">
            <TransactionTimelineBarChart />
          </div>
        </div>

        {/* Right Column: AI Investigation Summary, Findings, Actions (3 cols) */}
        <div className="col-span-12 lg:col-span-3 border-l border-white/[0.08] bg-[#0a0f1b] p-4 overflow-y-auto space-y-4">
          {/* AI Investigation Summary Notice Card */}
          {showSummaryNotice && (
            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-blue-500/30 shadow-lg relative">
              <button
                onClick={() => setShowSummaryNotice(false)}
                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Investigation Summary</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {caseData.summary}
              </p>
            </div>
          )}

          {/* Key Findings Card */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-300">Key Findings</h3>
            <div className="p-3 rounded-xl bg-[#0e1627] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>{caseData.involvedAccountsCount} interconnected accounts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>{caseData.suspiciousTransfersCount} suspicious transfers</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Total amount: {caseData.totalVolume}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Layering pattern detected</span>
              </div>
            </div>
          </div>

          {/* Hypotheses Testing Section */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-300">Generated Hypotheses</h3>
            <div className="space-y-2">
              {caseData.hypotheses.map((hyp) => (
                <div
                  key={hyp.id}
                  className={`p-3 rounded-xl border text-xs ${
                    hyp.status === 'supported'
                      ? 'bg-red-950/20 border-red-500/30 text-red-200'
                      : 'bg-slate-900/40 border-white/[0.06] text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-100">{hyp.title}</span>
                    <span className="font-mono text-[10px] font-bold">
                      {Math.round(hyp.likelihood * 100)}% prob
                    </span>
                  </div>
                  <p className="text-[11px] leading-tight text-slate-400">{hyp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Actions */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-semibold text-slate-300">Next Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleRunHypothesis}
                disabled={isRunningHypothesis}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-white ${isRunningHypothesis ? 'animate-spin' : ''}`} />
                <span>{isRunningHypothesis ? 'Evaluating Hypotheses...' : 'Run Hypothesis Test'}</span>
              </button>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0e1627] hover:bg-[#141f36] border border-white/[0.08] text-slate-300 text-xs font-medium transition-colors"
              >
                <span>Request Human Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignAnalystModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        caseId={caseData.id}
        currentAnalyst={caseData.leadAnalyst}
        onConfirm={handleAssignAnalyst}
      />

      <AddEvidenceModal
        isOpen={isAddEvidenceModalOpen}
        onClose={() => setIsAddEvidenceModalOpen(false)}
        caseId={caseData.id}
        onAddEvidence={handleAddEvidence}
      />

      <RequestReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        caseId={caseData.id}
        onConfirm={handleReviewConfirm}
      />

      <ReportDossierModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        caseData={caseData}
      />
    </div>
  );
};

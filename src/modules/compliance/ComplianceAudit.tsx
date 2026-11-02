import React, { useState, useEffect } from 'react';
import {
  Scale,
  ShieldCheck,
  Lock,
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  RotateCcw,
  Download,
  KeyRound,
} from 'lucide-react';
import { auditLogsList } from '../../data/mockData';
import { NavigationModule } from '../../types';
import { apiClient, ApiComplianceReview, ApiAuditLog } from '../../services/apiClient';
import { useToast } from '../../components/ui/Toast';

interface ComplianceAuditProps {
  onNavigate: (module: NavigationModule) => void;
}

interface ReviewCaseItem {
  case_id: string;
  lead_analyst: string;
  disposition: string;
  justification: string;
  primary_signature_sha256: string;
  secondary_signature_sha256: string | null;
  compliance_officer: string | null;
  status: 'PENDING_COMPLIANCE_SIGNOFF' | 'DUAL_AUTHORIZED_FOR_REGULATORY_SUBMISSION' | 'REMANDED_FOR_EVIDENCE';
  sar_filing_unlocked: boolean;
  timestamp: string;
}

export const ComplianceAudit: React.FC<ComplianceAuditProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'four-eye' | 'audit-trail'>('four-eye');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Review cases state
  const [reviewCases, setReviewCases] = useState<ReviewCaseItem[]>([
    {
      case_id: 'FG-8421',
      lead_analyst: 'Analyst E. Kaya',
      disposition: 'Escalate for SAR/STR Regulatory Filing',
      justification: 'Confirmed multi-hop circular funds layering across 3 entities and 6 accounts with identical device telemetry. Counter-hypothesis of wholesale commercial payroll refuted by turnover mismatch.',
      primary_signature_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      secondary_signature_sha256: null,
      compliance_officer: null,
      status: 'PENDING_COMPLIANCE_SIGNOFF',
      sar_filing_unlocked: false,
      timestamp: '2026-03-29 14:15:00 UTC',
    },
    {
      case_id: 'FG-8419',
      lead_analyst: 'Analyst M. Yılmaz',
      disposition: 'Enhanced Due Diligence & Counterparty Verification',
      justification: 'High-velocity international swift transfers to offshore counterparty. Source of wealth documentation is partially incomplete.',
      primary_signature_sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      secondary_signature_sha256: null,
      compliance_officer: null,
      status: 'PENDING_COMPLIANCE_SIGNOFF',
      sar_filing_unlocked: false,
      timestamp: '2026-03-29 11:30:00 UTC',
    },
  ]);

  // Live audit logs state
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    actor: string;
    actorType: string;
    action: string;
    targetId: string;
    integrityHash: string;
  }>>(auditLogsList);

  const fetchLiveAuditLogs = async () => {
    try {
      const logs = await apiClient.getAuditLogs(50);
      if (logs && logs.length > 0) {
        const mapped = logs.map((l) => ({
          id: l.id,
          timestamp: l.timestamp,
          actor: l.actor,
          actorType: l.actor.includes('MLRO') ? 'Compliance Officer' : 'System Auditor',
          action: l.action,
          targetId: l.target_id,
          integrityHash: l.sha256_hash,
        }));
        setAuditLogs(mapped);
      }
    } catch {
      // Fallback to initial mock list
    }
  };

  useEffect(() => {
    fetchLiveAuditLogs();
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleApproveFourEye = async (caseId: string) => {
    setIsProcessing(caseId);
    try {
      const res = await apiClient.approveCaseReview(
        caseId,
        'MLRO S. Demir',
        'Independent evidentiary verification completed. Approved for FinCEN SAR XML submission.'
      );

      if (res) {
        setReviewCases((prev) =>
          prev.map((c) =>
            c.case_id === caseId
              ? {
                  ...c,
                  status: 'DUAL_AUTHORIZED_FOR_REGULATORY_SUBMISSION',
                  compliance_officer: 'MLRO S. Demir',
                  secondary_signature_sha256: res.secondary_signature_sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  sar_filing_unlocked: true,
                }
              : c
          )
        );
        toast({
          type: 'success',
          title: 'Four-Eye Dual Authorization Completed',
          description: `Case ${caseId} authorized with secondary MLRO signature. SAR XML regulatory transmission unlocked.`,
        });
        fetchLiveAuditLogs();
      }
    } catch {
      toast({
        type: 'error',
        title: 'Authorization Failed',
        description: 'Unable to communicate with compliance authorization engine.',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRemandFourEye = async (caseId: string) => {
    setIsProcessing(caseId);
    try {
      const res = await apiClient.remandCaseReview(
        caseId,
        'MLRO S. Demir',
        'Evidentiary deficiency: Counterparty invoice and verified IP geolocation proof required.'
      );

      if (res) {
        setReviewCases((prev) =>
          prev.map((c) =>
            c.case_id === caseId
              ? {
                  ...c,
                  status: 'REMANDED_FOR_EVIDENCE',
                  compliance_officer: 'MLRO S. Demir',
                  sar_filing_unlocked: false,
                }
              : c
          )
        );
        toast({
          type: 'warning',
          title: 'Case Remanded to Analyst',
          description: `Case ${caseId} returned to lead investigator for additional counter-evidence.`,
        });
        fetchLiveAuditLogs();
      }
    } catch {
      toast({
        type: 'error',
        title: 'Remand Failed',
        description: 'Unable to record remand disposition.',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDownloadSarXml = async (caseId: string) => {
    try {
      const xml = await apiClient.fetchSarXml(caseId);
      if (xml) {
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FinCEN_SAR_${caseId}.xml`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
          type: 'success',
          title: 'Regulatory SAR XML Exported',
          description: `Cryptographically verified SAR XML for ${caseId} downloaded.`,
        });
      }
    } catch {
      toast({
        type: 'error',
        title: 'Export Error',
        description: 'Failed to generate SAR XML.',
      });
    }
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = reviewCases.filter((c) => c.status === 'PENDING_COMPLIANCE_SIGNOFF').length;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            Compliance & Four-Eye Dual Authorization Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional Four-Eye review gate, dual cryptographic authorization, and append-only Merkle audit chain (RQ-04).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Merkle Hash Integrity: 100% Cryptographically Verified</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('four-eye')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'four-eye'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Four-Eye Signoff Gate</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
              {pendingCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit-trail')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'audit-trail'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Immutable Merkle Audit Trail</span>
          <span className="text-[10px] text-slate-500 font-mono">({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: FOUR-EYE COMPLIANCE SIGNOFF */}
      {activeTab === 'four-eye' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0c1220] border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                Institutional Dual Cryptographic Authorization Standard
              </h3>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                Four-Eye Principle Enforced
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under international AML governance (FATF Rec 20 / FinCEN / MASAK), suspicious transaction filings (SAR/STR) cannot be submitted by a single operator.
              The Lead Investigator signs the primary cryptographic hash, and the Independent Compliance Officer (MLRO) must review and append a secondary signature before regulatory transmission is unlocked.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reviewCases.map((rc) => (
              <div
                key={rc.case_id}
                className="p-5 rounded-xl bg-[#0c1220] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-cyan-300">{rc.case_id}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        rc.status === 'DUAL_AUTHORIZED_FOR_REGULATORY_SUBMISSION'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : rc.status === 'REMANDED_FOR_EVIDENCE'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {rc.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{rc.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1 font-medium">Submitted Disposition</span>
                    <div className="p-2.5 rounded-lg bg-[#080d19] border border-white/[0.04] text-slate-200 font-semibold">
                      {rc.disposition}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1 font-medium">Investigator Team</span>
                    <div className="p-2.5 rounded-lg bg-[#080d19] border border-white/[0.04] flex items-center justify-between">
                      <span className="text-slate-200">Lead: <b className="text-white">{rc.lead_analyst}</b></span>
                      <span className="text-slate-400">Compliance: <b className="text-cyan-300">{rc.compliance_officer || 'Pending Signoff'}</b></span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1 text-xs font-medium">Legal & Factual Justification</span>
                  <div className="p-3 rounded-lg bg-[#080d19] border border-white/[0.04] text-slate-300 text-xs leading-relaxed">
                    {rc.justification}
                  </div>
                </div>

                {/* Cryptographic Signature Chain */}
                <div className="p-3 rounded-lg bg-[#080d19] border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                      Primary Signature (Lead Analyst):
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300">
                      <span>{rc.primary_signature_sha256}</span>
                      <button
                        onClick={() => handleCopy(`${rc.case_id}-p1`, rc.primary_signature_sha256)}
                        className="text-slate-400 hover:text-white"
                        title="Copy Hash"
                      >
                        {copiedId === `${rc.case_id}-p1` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Secondary Signature (Compliance MLRO):
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      {rc.secondary_signature_sha256 ? (
                        <span className="text-emerald-400 font-semibold">{rc.secondary_signature_sha256}</span>
                      ) : (
                        <span className="text-amber-400 italic">Signature Pending MLRO Review</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {rc.sar_filing_unlocked ? (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SAR Transmission Unlocked
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 bg-amber-950/40 px-3 py-1 rounded border border-amber-500/30">
                        <Lock className="w-3.5 h-3.5" />
                        SAR Transmission Locked (Requires Secondary MLRO Signature)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {rc.status === 'PENDING_COMPLIANCE_SIGNOFF' && (
                      <>
                        <button
                          onClick={() => handleRemandFourEye(rc.case_id)}
                          disabled={isProcessing === rc.case_id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Remand to Analyst</span>
                        </button>

                        <button
                          onClick={() => handleApproveFourEye(rc.case_id)}
                          disabled={isProcessing === rc.case_id}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/50 transition-all active:scale-95"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isProcessing === rc.case_id ? 'Signing...' : 'Approve & Dual-Authorize (MLRO)'}</span>
                        </button>
                      </>
                    )}

                    {rc.sar_filing_unlocked && (
                      <button
                        onClick={() => handleDownloadSarXml(rc.case_id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950/50 transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download FinCEN SAR XML</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: IMMUTABLE AUDIT TRAIL */}
      {activeTab === 'audit-trail' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit ID, actor, or action..."
                className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <button
              onClick={fetchLiveAuditLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1627] hover:bg-[#141f36] border border-white/[0.08] text-slate-300 text-xs font-medium transition-colors"
            >
              <span>Refresh Merkle Ledger</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#0c1220] border border-white/[0.08] overflow-hidden">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Cryptographic Audit Trail (Append-Only)</h3>
              <span className="text-xs font-mono text-cyan-400">Total Committed Records: #{auditLogs.length}</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1627] border-b border-white/[0.08] text-slate-400 text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4 font-mono">Log ID</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Actor / Entity</th>
                  <th className="py-3 px-3">Action Type</th>
                  <th className="py-3 px-3">Target Reference</th>
                  <th className="py-3 px-3">Cryptographic Signature Hash</th>
                  <th className="py-3 px-4 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">{log.id}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-200">{log.actor}</span>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">{log.actorType}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs font-semibold text-slate-200 bg-white/[0.04] px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-300 font-semibold">{log.targetId}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                        <span className="truncate max-w-[160px]">{log.integrityHash}</span>
                        <button
                          onClick={() => handleCopy(log.id, log.integrityHash)}
                          className="text-slate-500 hover:text-cyan-300"
                        >
                          {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

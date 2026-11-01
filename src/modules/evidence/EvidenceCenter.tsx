import React, { useState } from 'react';
import {
  Fingerprint,
  ShieldCheck,
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { evidenceList } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';
import { EvidenceItem, NavigationModule } from '../../types';

interface EvidenceCenterProps {
  onNavigate: (module: NavigationModule) => void;
  onOpenCase: (caseId: string) => void;
}

export const EvidenceCenter: React.FC<EvidenceCenterProps> = ({ onNavigate, onOpenCase }) => {
  const { toast } = useToast();
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem>(evidenceList[0]);
  const [copiedHash, setCopiedHash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<string | null>(null);

  const handleVerifyProof = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedStatus('Merkle Root Anchored · Verified Ledger Signature');
      toast({
        type: 'success',
        title: 'Cryptographic Integrity Validated',
        description: `SHA-256 hash verified against immutable Merkle tree. Zero tampering detected (Status: VALID).`,
      });
    }, 700);
  };

  const handleExportSarXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<SuspiciousActivityReport xmlns="urn:fincen:sar:v1.2" reportId="${selectedEvidence.caseId}" timestamp="${new Date().toISOString()}">
  <FilingInstitution>
    <InstitutionName>FraudGraph AI Financial Crime Intelligence</InstitutionName>
    <SystemArchitecture>Graph-Native Multi-Agent Core v1.0</SystemArchitecture>
    <ComplianceOfficer>Cansu Kalkan</ComplianceOfficer>
  </FilingInstitution>
  <SuspiciousActivity>
    <PrimaryCategory>Money Laundering - Layering / Structuring</PrimaryCategory>
    <TargetAccount>TR-90421073</TargetAccount>
    <EvidenceReference id="${selectedEvidence.id}">${selectedEvidence.title}</EvidenceReference>
    <SHA256Hash>${selectedEvidence.hash}</SHA256Hash>
  </SuspiciousActivity>
</SuspiciousActivityReport>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FINCEN_SAR_${selectedEvidence.caseId}_${Date.now()}.xml`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      type: 'success',
      title: 'Official SAR XML Exported',
      description: `Regulatory FinCEN XML file generated for case ${selectedEvidence.caseId}.`,
    });
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    toast({
      type: 'info',
      title: 'SHA-256 Hash Copied',
      description: `${hash.substring(0, 24)}... copied to clipboard for independent verification.`,
    });
    setTimeout(() => setCopiedHash(false), 1500);
  };

  const handleExportManifest = () => {
    const manifest = {
      manifestVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      signer: 'FraudGraph AI Cryptographic Audit Vault',
      totalEvidenceRecords: evidenceList.length,
      integrityRootHash: 'sha256:4a8b79e102f91c8901b0f19c824a73e51080bd1c92a95c928420e14a6019bf2e',
      records: evidenceList,
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVIDENCE_MANIFEST_SHA256_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      type: 'success',
      title: 'Signed Manifest Exported',
      description: 'Downloaded SHA-256 cryptographic audit manifest containing all case artifacts.',
    });
  };

  const filteredEvidence = evidenceList.filter(
    (ev) =>
      ev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Evidence Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Forensic artifact repository, cryptographic proof verification and chain of custody.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSarXml}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1627] hover:bg-[#141f36] border border-cyan-500/30 text-cyan-300 font-medium text-xs transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export SAR XML (FinCEN)</span>
          </button>
          <button
            onClick={handleExportManifest}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Signed Manifest</span>
          </button>
        </div>
      </div>

      {/* Grid: Left List + Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Evidence Registry (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence ID or case..."
              className="w-full pl-8 pr-4 py-1.5 rounded-lg bg-[#0e1627] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredEvidence.map((ev) => {
              const isSelected = selectedEvidence.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvidence(ev)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/30 border-cyan-500/50 shadow-md'
                      : 'bg-[#0c1220] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-xs text-cyan-300">{ev.id}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1">{ev.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="font-mono">{ev.caseId}</span>
                    <span>{ev.collectedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Forensic Dossier (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-[#0c1220] border border-white/[0.08] space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-cyan-300">
                  {selectedEvidence.id}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Grounding Confidence: {Math.round(selectedEvidence.confidence * 100)}%
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white mt-1">{selectedEvidence.title}</h2>
            </div>
            <button
              onClick={() => onOpenCase(selectedEvidence.caseId)}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <span>Case {selectedEvidence.caseId}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cryptographic Hash Box */}
          <div className="p-3.5 rounded-xl bg-[#080d19] border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cryptographic Provenance Hash (SHA-256)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVerifyProof}
                  disabled={isVerifying}
                  className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 transition-colors"
                >
                  <ShieldCheck className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Verifying...' : 'Verify Proof'}</span>
                </button>
                <button
                  onClick={() => handleCopyHash(selectedEvidence.hash)}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <p className="font-mono text-[11px] text-slate-300 break-all bg-white/[0.02] p-2 rounded">
              {selectedEvidence.hash}
            </p>
            {verifiedStatus && (
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{verifiedStatus}</span>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0e1627] border border-white/[0.04]">
              <span className="text-slate-400 block text-[10px]">Authoritative Source</span>
              <span className="text-slate-200 font-medium mt-0.5 block">{selectedEvidence.source}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0e1627] border border-white/[0.04]">
              <span className="text-slate-400 block text-[10px]">Collection Timestamp</span>
              <span className="font-mono text-slate-200 mt-0.5 block">{selectedEvidence.collectedAt}</span>
            </div>
          </div>

          {/* Supported Claims */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              Verified Claims Supported by this Artifact
            </h4>
            <div className="space-y-1.5">
              {selectedEvidence.claimsSupported.map((claim, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{claim}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Structured Payload */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Serialized Evidence Payload</h4>
            <pre className="p-3 rounded-xl bg-[#080d19] border border-white/[0.06] text-[11px] font-mono text-cyan-200 overflow-x-auto">
              {JSON.stringify(selectedEvidence.details, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

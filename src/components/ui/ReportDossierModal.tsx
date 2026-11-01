import React from 'react';
import { FileText, Download, X, CheckCircle2, Shield, Share2 } from 'lucide-react';
import { Case } from '../../types';

interface ReportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: Case;
}

export const ReportDossierModal: React.FC<ReportDossierModalProps> = ({
  isOpen,
  onClose,
  caseData,
}) => {
  if (!isOpen) return null;

  const downloadMarkdown = () => {
    const md = `# FRAUDGRAPH AI — CASE INVESTIGATION DOSSIER
Case ID: ${caseData.id}
Date Generated: ${new Date().toISOString()}
Target Account: ${caseData.targetAccount}
Risk Score: ${caseData.riskScore} (${caseData.riskLevel.toUpperCase()})
Lead Investigator: ${caseData.leadAnalyst}

## 1. Executive Summary
${caseData.summary}

## 2. Key Forensic Findings
${caseData.findings.map((f, i) => `${i + 1}. [Confidence: ${f.confidence}] ${f.claim} (Citations: ${f.evidenceIds.join(', ')})`).join('\n')}

## 3. Competing Hypotheses Analysis
${caseData.hypotheses.map((h) => `### ${h.title} [Status: ${h.status.toUpperCase()}, Likelihood: ${h.likelihood * 100}%]\n${h.description}`).join('\n\n')}

## 4. Cryptographic Proof Chain
All findings verified by D23 Evidence Verifier against SHA-256 Merkle chain.
Signed: F33 Case Report Composer
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CASE_DOSSIER_${caseData.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(caseData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CASE_DOSSIER_${caseData.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0c1220] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-[#0e172a] shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-tight">
              Forensic Case Dossier · {caseData.id} ({caseData.title})
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans text-slate-300">
          <div className="p-4 rounded-xl bg-[#080d19] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Document Status</span>
              <span className="text-sm font-bold text-white mt-0.5 block">Official Institutional Report</span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              100% Evidence Grounded
            </span>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs mb-1">Executive Summary</h4>
            <p className="text-slate-300 leading-relaxed bg-[#0e1627] p-3 rounded-lg border border-white/[0.04]">
              {caseData.summary}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs mb-1.5">Verified Claims & Citations</h4>
            <div className="space-y-1.5">
              {caseData.findings.map((f) => (
                <div key={f.id} className="p-2.5 rounded-lg bg-[#0e1627] border border-white/[0.04] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f.claim}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {f.evidenceIds.map((ev) => (
                      <span key={ev} className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-1 rounded">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-[#080d19] border-t border-white/[0.06] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            Signed by F33 Case Report Composer
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadJSON}
              className="px-3 py-1.5 rounded-lg bg-[#0e1627] hover:bg-[#152038] border border-white/[0.08] text-xs font-medium text-slate-200 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={downloadMarkdown}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Markdown Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

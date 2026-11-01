import React, { useState } from 'react';
import { Plus, X, Fingerprint, CheckCircle2 } from 'lucide-react';
import { EvidenceItem } from '../../types';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onAddEvidence: (item: EvidenceItem) => void;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onAddEvidence,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceItem['category']>('transaction_chain');
  const [source, setSource] = useState('Core Banking Telemetry API');
  const [claim, setClaim] = useState('');
  const [rawPayload, setRawPayload] = useState('{\n  "status": "flagged_velocity",\n  "hop_count": 3\n}');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `EV-${Math.floor(110 + Math.random() * 80)}`;
    const pseudoHash = `sha256:${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    let parsed = {};
    try {
      parsed = JSON.parse(rawPayload);
    } catch {
      parsed = { raw: rawPayload };
    }

    const item: EvidenceItem = {
      id: newId,
      caseId,
      title: title || 'Ad-Hoc Forensic Transaction Snapshot',
      category,
      source,
      collectedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      hash: pseudoHash,
      status: 'verified',
      confidence: 0.98,
      claimsSupported: [claim || 'Verified fund movement matching layering dispersion'],
      details: parsed,
    };

    onAddEvidence(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0d1424] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-[#0e172a]">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-tight">
              Deposit Forensic Artifact to Vault · {caseId}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Evidence Artifact Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 4-Hop Inbound Wire Chain from High-Risk Jurisdiction"
              className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Artifact Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="transaction_chain">Transaction Chain</option>
                <option value="subgraph_snapshot">Subgraph Snapshot</option>
                <option value="device_telemetry">Device Telemetry</option>
                <option value="model_inference">Model Inference</option>
                <option value="kyc_registry">KYC Registry</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Authoritative Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Claim Supported</label>
            <input
              type="text"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder="e.g. Transacting device matches IMEI fingerprint linked to account syndicate"
              className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">JSON Telemetry Payload</label>
            <textarea
              value={rawPayload}
              onChange={(e) => setRawPayload(e.target.value)}
              rows={3}
              className="w-full bg-[#080d19] font-mono text-[11px] border border-white/[0.08] rounded-lg p-2.5 text-cyan-200 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              Sign & Deposit Artifact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

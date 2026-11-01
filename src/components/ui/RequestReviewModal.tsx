import React, { useState } from 'react';
import { Scale, X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onConfirm: (disposition: string, justification: string) => void;
}

export const RequestReviewModal: React.FC<RequestReviewModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onConfirm,
}) => {
  const [disposition, setDisposition] = useState('Escalate for SAR/STR Regulatory Filing');
  const [justification, setJustification] = useState(
    'Strong evidence of structured money layering across 6 accounts with identical hardware signatures. Counter-hypothesis of commercial payroll refuted by turnover mismatch.'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0d1424] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-[#0e172a]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-tight">
              Human Analyst Disposition Review · {caseId}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Recommended Institutional Disposition</label>
            <select
              value={disposition}
              onChange={(e) => setDisposition(e.target.value)}
              className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="Escalate for SAR/STR Regulatory Filing">
                Escalate for SAR/STR Regulatory Filing (Confirmed Suspicion)
              </option>
              <option value="Enhanced Due Diligence (EDD) Verification">
                Enhanced Due Diligence (Request Counterparty Invoices)
              </option>
              <option value="Close as False Positive (Legitimate Wholesale Transfer)">
                Close as False Positive (Verified Commercial Legitimate)
              </option>
              <option value="Temporary Monitoring & Velocity Hold">
                Temporary Monitoring & Velocity Hold (30-day Watchlist)
              </option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">
              Analyst Legal & Factual Justification (Audit Recorded)
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Digital signature will be appended to Merkle hash chain upon confirmation.</span>
          </div>
        </div>

        <div className="px-5 py-3 bg-[#080d19] border-t border-white/[0.06] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(disposition, justification);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            Sign & Submit Disposition
          </button>
        </div>
      </div>
    </div>
  );
};

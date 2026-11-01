import React, { useState } from 'react';
import { UserCheck, X, Shield } from 'lucide-react';

interface AssignAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  currentAnalyst: string;
  onConfirm: (analyst: string, priority: string, note: string) => void;
}

export const AssignAnalystModal: React.FC<AssignAnalystModalProps> = ({
  isOpen,
  onClose,
  caseId,
  currentAnalyst,
  onConfirm,
}) => {
  const [analyst, setAnalyst] = useState(currentAnalyst);
  const [priority, setPriority] = useState('High');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0d1424] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-[#0e172a]">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-tight">
              Assign Lead Investigator · {caseId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Lead Financial Crime Investigator</label>
            <select
              value={analyst}
              onChange={(e) => setAnalyst(e.target.value)}
              className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
            >
              <option value="Emre Kaya">Emre Kaya (L3 Senior Analyst)</option>
              <option value="Mehmet Vural">Mehmet Vural (Risk Intelligence Lead)</option>
              <option value="Selin Demir">Selin Demir (Forensic Investigator)</option>
              <option value="Ayşe Koç">Ayşe Koç (AML Compliance Officer)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Triage Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
            >
              <option value="High">High (4-hour SLA)</option>
              <option value="Medium">Medium (24-hour SLA)</option>
              <option value="Low">Low (Routine Review)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Assignment Handover Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide specific instructions regarding fund tracing or counter-hypothesis checks..."
              rows={3}
              className="w-full bg-[#080d19] border border-white/[0.08] rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
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
              onConfirm(analyst, priority, note);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastProvider } from './components/ui/Toast';
import { CommandCenter } from './modules/command-center/CommandCenter';
import { GraphExplorer } from './modules/graph-explorer/GraphExplorer';
import { InvestigationWorkspace } from './modules/investigation/InvestigationWorkspace';
import { AgentOperations } from './modules/agents/AgentOperations';
import { AlertIntelligence } from './modules/alerts/AlertIntelligence';
import { TransactionIntelligence } from './modules/transactions/TransactionIntelligence';
import { EvidenceCenter } from './modules/evidence/EvidenceCenter';
import { RiskAnalytics } from './modules/risk-analytics/RiskAnalytics';
import { ModelIntelligence } from './modules/models/ModelIntelligence';
import { DatasetRegistry } from './modules/datasets/DatasetRegistry';
import { ComplianceAudit } from './modules/compliance/ComplianceAudit';
import { SystemAdmin } from './modules/admin/SystemAdmin';
import { NavigationModule } from './types';

export const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<NavigationModule>('command-center');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('FG-8421');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-center');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<string>('IBM AMLSim 500K');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('Last 30 Days');

  // Handle global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentModule('investigation');
  };

  const handleSelectEntity = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setCurrentModule('graph-explorer');
  };

  const handleViewEvidence = (evidenceId: string) => {
    setCurrentModule('evidence');
  };

  const handleTriggerAnalysis = () => {
    setCurrentModule('graph-explorer');
  };

  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans">
        {/* Persistent Enterprise Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Contextual Top Header */}
          <Header
            currentModule={currentModule}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            selectedDataset={selectedDataset}
            onSelectDataset={setSelectedDataset}
            selectedTimeRange={selectedTimeRange}
            onSelectTimeRange={setSelectedTimeRange}
            onTriggerAnalysis={handleTriggerAnalysis}
          />

          {/* Dynamic View Router */}
          <main className="flex-1 flex overflow-hidden bg-[#090d16]">
            {currentModule === 'command-center' && (
              <CommandCenter
                onNavigate={(mod) => setCurrentModule(mod)}
                onOpenCase={handleOpenCase}
              />
            )}

            {currentModule === 'graph-explorer' && (
              <GraphExplorer
                onNavigate={(mod) => setCurrentModule(mod)}
                onOpenCase={handleOpenCase}
                onViewEvidence={handleViewEvidence}
                initialSelectedNodeId={selectedNodeId}
              />
            )}

            {currentModule === 'investigation' && (
              <InvestigationWorkspace
                currentCaseId={selectedCaseId}
                onNavigate={(mod) => setCurrentModule(mod)}
                onViewEvidence={handleViewEvidence}
              />
            )}

            {currentModule === 'agents' && (
              <AgentOperations
                onNavigate={(mod) => setCurrentModule(mod)}
                onOpenCase={handleOpenCase}
              />
            )}

            {currentModule === 'alerts' && (
              <AlertIntelligence
                onNavigate={(mod) => setCurrentModule(mod)}
                onOpenCase={handleOpenCase}
              />
            )}

            {currentModule === 'transactions' && (
              <TransactionIntelligence
                onNavigate={(mod) => setCurrentModule(mod)}
                onOpenCase={handleOpenCase}
              />
            )}

            {currentModule === 'evidence' && (
              <EvidenceCenter
                onNavigate={(mod) => setCurrentModule(mod)}
                onOpenCase={handleOpenCase}
              />
            )}

            {currentModule === 'risk-analytics' && (
              <RiskAnalytics onNavigate={(mod) => setCurrentModule(mod)} />
            )}

            {currentModule === 'models' && (
              <ModelIntelligence onNavigate={(mod) => setCurrentModule(mod)} />
            )}

            {currentModule === 'datasets' && (
              <DatasetRegistry onNavigate={(mod) => setCurrentModule(mod)} />
            )}

            {currentModule === 'compliance' && (
              <ComplianceAudit onNavigate={(mod) => setCurrentModule(mod)} />
            )}

            {currentModule === 'system-admin' && (
              <SystemAdmin onNavigate={(mod) => setCurrentModule(mod)} />
            )}
          </main>
        </div>

        {/* Global Command Palette Modal */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={(mod) => setCurrentModule(mod)}
          onSelectEntity={handleSelectEntity}
        />
      </div>
    </ToastProvider>
  );
};

export default App;

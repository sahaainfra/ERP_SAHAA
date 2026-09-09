// ============================================================
// BUILDCORE ERP - APPLICATION SHELL
// ============================================================

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Dashboard } from '../dashboard/Dashboard';
import { SettingsPage } from '../settings/SettingsPage';
import { ProjectObjectPage } from '../projects/ProjectObjectPage';
import { AdminPage } from '../admin/AdminPage';
import { SecurityPage } from '../security/SecurityPage';
import { ApprovalCenter } from '../workflow/ApprovalCenter';
import { WorkflowDashboard } from '../workflow/WorkflowDashboard';
import { BIDashboard } from '../dashboard/BIDashboard';
import { PlanningDashboard } from '../planning/PlanningDashboard';
import { TenderDashboard } from '../tender/TenderDashboard';
import { RateDashboard } from '../rate/RateDashboard';
import { BOQDashboard } from '../boq/BOQDashboard';
import { ContractDashboard } from '../contract/ContractDashboard';
import { CommercialDashboard } from '../commercial/CommercialDashboard';
import { MaterialDashboard } from '../material/MaterialDashboard';
import { VendorDashboard } from '../vendor/VendorDashboard';
import { ProcurementDashboard } from '../procurement/ProcurementDashboard';
import { PODashboard } from '../po/PODashboard';
import { useAppStore, useDataStore } from '../../store';

// Module placeholder pages
function ModulePage({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center py-16">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">{description}</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Module available in upcoming parts</span>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          {['Database Schema', 'API Endpoints', 'UI Components'].map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{item}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Ready</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const moduleConfigs: Record<string, { title: string; description: string; icon: string }> = {
  projects: { title: 'Project Management', description: 'Manage projects, packages, sites, WBS, and work fronts. Track progress, milestones, and deliverables.', icon: '🏗️' },
  sites: { title: 'Site Operations', description: 'Manage site-level operations, daily progress reports, labour deployment, and equipment allocation.', icon: '🏗️' },
  procurement: { title: 'Procurement', description: 'End-to-end procurement: PR, RFQ, PO, GRN, vendor management, and material tracking.', icon: '🚚' },
  inventory: { title: 'Inventory & Store', description: 'Material receipt, issuance, stock management, store accounting, and consumption tracking.', icon: '📦' },
  plant: { title: 'Plant & Machinery', description: 'Equipment deployment, maintenance schedules, fuel tracking, and utilization reports.', icon: '🔧' },
  rmc: { title: 'RMC Plant Management', description: 'Batch management, mix design, delivery tracking, cube test results, and plant operations.', icon: '🏭' },
  labour: { title: 'Labour Management', description: 'Attendance, muster roll, wage processing, absentee tracking, and productivity analysis.', icon: '👷' },
  contracts: { title: 'Contracts & Work Orders', description: 'Contract management, work orders, variations, claims, and correspondence tracking.', icon: '📋' },
  billing: { title: 'Billing & RA Bills', description: 'Measurement books, RA bills, final bills, running account certificates, and bill certification.', icon: '💰' },
  finance: { title: 'Finance & Accounts', description: 'Journal vouchers, payments, receipts, ledger management, and financial reporting.', icon: '📊' },
  budget: { title: 'Budget & Cost Control', description: 'Budget preparation, cost codes, variance analysis, and project cost tracking.', icon: '📈' },
  quality: { title: 'Quality Assurance (QA/QC)', description: 'Inspection plans, test schedules, NCR management, and quality documentation.', icon: '✅' },
  safety: { title: 'Health, Safety & Environment', description: 'Safety observations, incident reporting, permits, toolbox talks, and compliance tracking.', icon: '🛡️' },
  legal: { title: 'Legal & Compliance', description: 'Legal case management, compliance tracking, statutory filings, and document management.', icon: '⚖️' },
  documents: { title: 'Document Management', description: 'Centralized document repository with versioning, approval workflows, and metadata management.', icon: '📁' },
  reports: { title: 'Reports & Analytics', description: 'Standard and custom reports, dashboards, MIS reports, and data export capabilities.', icon: '📊' },
  approvals: { title: 'Approval Center', description: 'Centralized approval management with workflow tracking, delegation, and SLA monitoring.', icon: '✓' },
  settings: { title: 'System Settings', description: 'Configure company, users, roles, permissions, workflows, numbering, and system preferences.', icon: '⚙️' },
};

export function AppShell() {
  const { sidebarCollapsed, sidebarMobileOpen, activeModule, breadcrumbs, setBreadcrumbs, setSidebarMobileOpen, toggleSidebar, refreshNotifications } = useAppStore();

  useEffect(() => {
    useDataStore.getState().initializeDemoData();
    refreshNotifications();
  }, []);

  useEffect(() => {
    if (activeModule === 'dashboard') {
      setBreadcrumbs([{ label: 'Dashboard' }]);
    } else {
      const config = moduleConfigs[activeModule];
      setBreadcrumbs([
        { label: 'Home', url: '/' },
        { label: config?.title || activeModule },
      ]);
    }
  }, [activeModule, setBreadcrumbs]);

  const handleModuleChange = (module: string) => {
    useAppStore.getState().setActiveModule(module);
  };

  const renderContent = () => {
    if (activeModule === 'dashboard') {
      return <Dashboard />;
    }
    if (activeModule === 'settings') {
      return <SettingsPage />;
    }
    if (activeModule === 'projects') {
      return <ProjectObjectPage />;
    }
    if (activeModule === 'admin') {
      return <AdminPage />;
    }
    if (activeModule === 'security') {
      return <SecurityPage />;
    }
    if (activeModule === 'approvals') {
      return <ApprovalCenter />;
    }
    if (activeModule === 'workflow') {
      return <WorkflowDashboard />;
    }
    if (activeModule === 'bi') {
      return <BIDashboard />;
    }
    if (activeModule === 'planning') {
      return <PlanningDashboard />;
    }
    if (activeModule === 'tender') {
      return <TenderDashboard />;
    }
    if (activeModule === 'rate') {
      return <RateDashboard />;
    }
    if (activeModule === 'boq') {
      return <BOQDashboard />;
    }
    if (activeModule === 'contracts') {
      return <ContractDashboard />;
    }
    if (activeModule === 'commercial') {
      return <CommercialDashboard />;
    }
    if (activeModule === 'materials') {
      return <MaterialDashboard />;
    }
    if (activeModule === 'vendors') {
      return <VendorDashboard />;
    }
    if (activeModule === 'procurement') {
      return <ProcurementDashboard />;
    }
    if (activeModule === 'purchase') {
      return <PODashboard />;
    }
    const config = moduleConfigs[activeModule];
    if (config) {
      return <ModulePage title={config.title} description={config.description} icon={config.icon} />;
    }
    return <Dashboard />;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarMobileOpen}
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        onToggle={toggleSidebar}
        onMobileClose={() => setSidebarMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setSidebarMobileOpen(true)}
          breadcrumbs={breadcrumbs}
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

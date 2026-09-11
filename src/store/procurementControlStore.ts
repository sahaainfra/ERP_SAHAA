// ============================================================
// BUILDCORE ERP - INTEGRATED PROCUREMENT & MATERIAL CONTROL STORE
// Part 20: Integrated Procurement and Material Control Center
// ============================================================

import { create } from 'zustand';
import type {
  ProcurementControlKPIs,
  MaterialControlKPIs,
  ProjectProcurementCoverage,
  ProcurementRisk,
  PurchaseCommitment,
  BudgetControl,
  MaterialCashForecast,
  IntegratedVendorPerformance,
  IntegratedProcurementSavings,
  PODeliveryPerformance,
  MaterialQualityPerformance,
  MaterialCostControl,
  Exception,
  ApprovalQueueItem,
  MaterialDrillDown,
  ProjectDrillDown,
  ProcurementCockpitKPIs,
  ProcurementSearchResult,
  ProcurementReport,
  CrossModuleAudit,
  ProcurementReportType,
  SearchResultType
} from '../types/procurementControl';
import { procurementControlService } from '../services/procurementControlService';

interface ProcurementControlState {
  // KPIs
  procurementControlKPIs: ProcurementControlKPIs | null;
  materialControlKPIs: MaterialControlKPIs | null;
  procurementCockpitKPIs: ProcurementCockpitKPIs | null;

  // Data
  projectCoverage: ProjectProcurementCoverage | null;
  purchaseCommitment: PurchaseCommitment | null;
  budgetControl: BudgetControl | null;
  cashForecast: MaterialCashForecast | null;
  vendorPerformance: IntegratedVendorPerformance[];
  procurementSavings: IntegratedProcurementSavings[];
  poDeliveryPerformance: PODeliveryPerformance[];
  materialQualityPerformance: MaterialQualityPerformance[];
  materialCostControl: MaterialCostControl[];
  exceptions: Exception[];
  approvalQueue: ApprovalQueueItem[];
  materialDrillDown: MaterialDrillDown | null;
  projectDrillDown: ProjectDrillDown | null;
  searchResults: ProcurementSearchResult[];
  reports: ProcurementReport[];
  auditTrail: CrossModuleAudit[];

  // UI State
  isLoading: boolean;
  error: string | null;
  selectedProjectId: string | null;
  selectedMaterialId: string | null;

  // Actions
  loadProcurementControlKPIs: (companyId: string) => Promise<void>;
  loadMaterialControlKPIs: (companyId: string) => Promise<void>;
  loadProcurementCockpitKPIs: (companyId: string) => Promise<void>;
  loadProjectCoverage: (projectId: string) => Promise<void>;
  loadPurchaseCommitment: (projectId: string) => Promise<void>;
  checkBudgetControl: (projectId: string, materialId: string, newPRValue: number) => Promise<void>;
  loadCashForecast: (projectId: string, period: string) => Promise<void>;
  loadVendorPerformance: (companyId: string) => Promise<void>;
  loadProcurementSavings: (projectId: string) => Promise<void>;
  loadPODeliveryPerformance: (companyId: string) => Promise<void>;
  loadMaterialQualityPerformance: (companyId: string) => Promise<void>;
  loadMaterialCostControl: (companyId: string) => Promise<void>;
  loadExceptions: (companyId: string) => Promise<void>;
  createException: (exception: Omit<Exception, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateException: (id: string, updates: Partial<Exception>) => Promise<void>;
  loadApprovalQueue: (companyId: string, userId: string) => Promise<void>;
  loadMaterialDrillDown: (materialId: string) => Promise<void>;
  loadProjectDrillDown: (projectId: string) => Promise<void>;
  search: (companyId: string, query: string, type?: SearchResultType) => Promise<void>;
  generateReport: (companyId: string, reportType: ProcurementReportType, filters: any[]) => Promise<void>;
  loadAuditTrail: (transactionId: string) => Promise<void>;
  exportToExcel: (reportId: string) => Promise<void>;
  exportToPDF: (reportId: string) => Promise<void>;
  setSelectedProject: (projectId: string | null) => void;
  setSelectedMaterial: (materialId: string | null) => void;
  clearError: () => void;
}

export const useProcurementControlStore = create<ProcurementControlState>((set, get) => ({
  // Initial state
  procurementControlKPIs: null,
  materialControlKPIs: null,
  procurementCockpitKPIs: null,
  projectCoverage: null,
  purchaseCommitment: null,
  budgetControl: null,
  cashForecast: null,
  vendorPerformance: [],
  procurementSavings: [],
  poDeliveryPerformance: [],
  materialQualityPerformance: [],
  materialCostControl: [],
  exceptions: [],
  approvalQueue: [],
  materialDrillDown: null,
  projectDrillDown: null,
  searchResults: [],
  reports: [],
  auditTrail: [],
  isLoading: false,
  error: null,
  selectedProjectId: null,
  selectedMaterialId: null,

  // Actions
  loadProcurementControlKPIs: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const kpis = procurementControlService.getProcurementControlKPIs(companyId);
      set({ procurementControlKPIs: kpis, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load procurement control KPIs', isLoading: false });
    }
  },

  loadMaterialControlKPIs: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const kpis = procurementControlService.getMaterialControlKPIs(companyId);
      set({ materialControlKPIs: kpis, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load material control KPIs', isLoading: false });
    }
  },

  loadProcurementCockpitKPIs: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const kpis = procurementControlService.getProcurementCockpitKPIs(companyId);
      set({ procurementCockpitKPIs: kpis, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load procurement cockpit KPIs', isLoading: false });
    }
  },

  loadProjectCoverage: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const coverage = procurementControlService.getProjectProcurementCoverage(projectId);
      set({ projectCoverage: coverage, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load project coverage', isLoading: false });
    }
  },

  loadPurchaseCommitment: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const commitment = procurementControlService.getPurchaseCommitment(projectId);
      set({ purchaseCommitment: commitment, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load purchase commitment', isLoading: false });
    }
  },

  checkBudgetControl: async (projectId: string, materialId: string, newPRValue: number) => {
    try {
      set({ isLoading: true, error: null });
      const control = procurementControlService.checkBudgetControl(projectId, materialId, newPRValue);
      set({ budgetControl: control, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to check budget control', isLoading: false });
    }
  },

  loadCashForecast: async (projectId: string, period: string) => {
    try {
      set({ isLoading: true, error: null });
      const forecast = procurementControlService.getMaterialCashForecast(projectId, period);
      set({ cashForecast: forecast, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load cash forecast', isLoading: false });
    }
  },

  loadVendorPerformance: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const performance = procurementControlService.getVendorPerformance(companyId);
      set({ vendorPerformance: performance, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load vendor performance', isLoading: false });
    }
  },

  loadProcurementSavings: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const savings = procurementControlService.getProcurementSavings(projectId);
      set({ procurementSavings: savings, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load procurement savings', isLoading: false });
    }
  },

  loadPODeliveryPerformance: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const performance = procurementControlService.getPODeliveryPerformance(companyId);
      set({ poDeliveryPerformance: performance, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load PO delivery performance', isLoading: false });
    }
  },

  loadMaterialQualityPerformance: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const performance = procurementControlService.getMaterialQualityPerformance(companyId);
      set({ materialQualityPerformance: performance, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load material quality performance', isLoading: false });
    }
  },

  loadMaterialCostControl: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const control = procurementControlService.getMaterialCostControl(companyId);
      set({ materialCostControl: control, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load material cost control', isLoading: false });
    }
  },

  loadExceptions: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const exceptions = procurementControlService.getExceptions(companyId);
      set({ exceptions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load exceptions', isLoading: false });
    }
  },

  createException: async (exception: Omit<Exception, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      await procurementControlService.createException(exception);
      await get().loadExceptions('COMPANY_001'); // Reload exceptions
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to create exception', isLoading: false });
    }
  },

  updateException: async (id: string, updates: Partial<Exception>) => {
    try {
      set({ isLoading: true, error: null });
      await procurementControlService.updateException(id, updates);
      await get().loadExceptions('COMPANY_001'); // Reload exceptions
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update exception', isLoading: false });
    }
  },

  loadApprovalQueue: async (companyId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const queue = procurementControlService.getApprovalQueue(companyId, userId);
      set({ approvalQueue: queue, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load approval queue', isLoading: false });
    }
  },

  loadMaterialDrillDown: async (materialId: string) => {
    try {
      set({ isLoading: true, error: null });
      const drillDown = procurementControlService.getMaterialDrillDown(materialId);
      set({ materialDrillDown: drillDown, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load material drill-down', isLoading: false });
    }
  },

  loadProjectDrillDown: async (projectId: string) => {
    try {
      set({ isLoading: true, error: null });
      const drillDown = procurementControlService.getProjectDrillDown(projectId);
      set({ projectDrillDown: drillDown, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load project drill-down', isLoading: false });
    }
  },

  search: async (companyId: string, query: string, type?: SearchResultType) => {
    try {
      set({ isLoading: true, error: null });
      const results = procurementControlService.search(companyId, query, type);
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to search', isLoading: false });
    }
  },

  generateReport: async (companyId: string, reportType: ProcurementReportType, filters: any[]) => {
    try {
      set({ isLoading: true, error: null });
      const report = procurementControlService.generateReport(companyId, reportType, filters);
      set((state) => ({ reports: [...state.reports, report], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to generate report', isLoading: false });
    }
  },

  loadAuditTrail: async (transactionId: string) => {
    try {
      set({ isLoading: true, error: null });
      const trail = procurementControlService.getAuditTrail(transactionId);
      set({ auditTrail: trail, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load audit trail', isLoading: false });
    }
  },

  exportToExcel: async (reportId: string) => {
    try {
      set({ isLoading: true, error: null });
      const blob = await procurementControlService.exportToExcel(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${reportId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to export to Excel', isLoading: false });
    }
  },

  exportToPDF: async (reportId: string) => {
    try {
      set({ isLoading: true, error: null });
      const blob = await procurementControlService.exportToPDF(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to export to PDF', isLoading: false });
    }
  },

  setSelectedProject: (projectId: string | null) => {
    set({ selectedProjectId: projectId });
  },

  setSelectedMaterial: (materialId: string | null) => {
    set({ selectedMaterialId: materialId });
  },

  clearError: () => {
    set({ error: null });
  }
}));

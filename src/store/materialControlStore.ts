// ============================================================
// BUILDCORE ERP - MATERIAL CONTROL & COST ANALYTICS STORE
// Part 19: Advanced Material Control and Cost-Analytics Engine
// ============================================================

import { create } from 'zustand';
import type {
  MaterialConsumption, TheoreticalConsumption, ConsumptionVariance,
  MaterialWastage, ConsumptionReconciliation, BOQReconciliation,
  ProjectMaterialCost, MaterialPriceVariance, PurchasePriceVariance,
  RateTrend, VendorPriceComparison, ProjectComparison, MaterialForecast,
  ProcurementPlan, StockHealth, MaterialAgeing, MaterialLoss, MaterialDamage,
  TransferAnalytics, ProjectMaterialDashboardKPIs, MaterialControlAlert,
  CostCodeLink, MaterialTrace
} from '../types/materialControl';
import { materialControlService } from '../services/materialControlService';

interface MaterialControlState {
  // Data
  consumptions: MaterialConsumption[];
  theoreticalConsumptions: TheoreticalConsumption[];
  variances: ConsumptionVariance[];
  wastages: MaterialWastage[];
  reconciliations: ConsumptionReconciliation[];
  boqReconciliations: BOQReconciliation[];
  projectCosts: ProjectMaterialCost[];
  priceVariances: MaterialPriceVariance[];
  purchaseVariances: PurchasePriceVariance[];
  forecasts: MaterialForecast[];
  procurementPlans: ProcurementPlan[];
  stockHealth: StockHealth[];
  materialAgeing: MaterialAgeing[];
  losses: MaterialLoss[];
  damages: MaterialDamage[];
  alerts: MaterialControlAlert[];
  costCodeLinks: CostCodeLink[];
  dashboardKPIs: ProjectMaterialDashboardKPIs | null;

  // Filters
  projectId: string | null;
  materialId: string | null;
  storeId: string | null;
  period: string | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjectFilter: (projectId: string | null) => void;
  setMaterialFilter: (materialId: string | null) => void;
  setStoreFilter: (storeId: string | null) => void;
  setPeriodFilter: (period: string | null) => void;

  // Consumption actions
  recordConsumption: (params: any) => Promise<void>;
  loadConsumptions: () => Promise<void>;

  // Theoretical consumption actions
  calculateTheoreticalConsumption: (params: any) => Promise<void>;

  // Variance actions
  loadVariances: () => Promise<void>;

  // Wastage actions
  recordWastage: (params: any) => Promise<void>;
  loadWastages: () => Promise<void>;

  // Reconciliation actions
  performMaterialReconciliation: (params: any) => Promise<void>;
  performBOQReconciliation: (params: any) => Promise<void>;
  loadReconciliations: () => Promise<void>;
  loadBOQReconciliations: () => Promise<void>;

  // Price variance actions
  calculateMaterialPriceVariance: (params: any) => Promise<void>;
  calculatePurchasePriceVariance: (params: any) => Promise<void>;

  // Forecast actions
  generateMaterialForecast: (params: any) => Promise<void>;
  loadForecasts: () => Promise<void>;

  // Procurement planning actions
  generateProcurementPlan: (params: any) => Promise<void>;
  loadProcurementPlans: () => Promise<void>;

  // Loss and damage actions
  recordMaterialLoss: (params: any) => Promise<void>;
  recordMaterialDamage: (params: any) => Promise<void>;
  loadLosses: () => Promise<void>;
  loadDamages: () => Promise<void>;

  // Alert actions
  acknowledgeAlert: (alertId: string, acknowledgedBy: string) => Promise<void>;
  loadAlerts: (companyId: string) => Promise<void>;

  // Cost code link
  linkCostCode: (params: any) => Promise<void>;

  // Dashboard
  loadDashboardKPIs: (companyId: string, projectId: string) => Promise<void>;

  // Trace
  getMaterialTrace: (materialId: string) => Promise<MaterialTrace>;

  // Clear
  clearFilters: () => void;
}

export const useMaterialControlStore = create<MaterialControlState>((set, get) => ({
  // Initial state
  consumptions: [],
  theoreticalConsumptions: [],
  variances: [],
  wastages: [],
  reconciliations: [],
  boqReconciliations: [],
  projectCosts: [],
  priceVariances: [],
  purchaseVariances: [],
  forecasts: [],
  procurementPlans: [],
  stockHealth: [],
  materialAgeing: [],
  losses: [],
  damages: [],
  alerts: [],
  costCodeLinks: [],
  dashboardKPIs: null,

  projectId: null,
  materialId: null,
  storeId: null,
  period: null,

  isLoading: false,
  error: null,

  // Filter actions
  setProjectFilter: (projectId) => set({ projectId }),
  setMaterialFilter: (materialId) => set({ materialId }),
  setStoreFilter: (storeId) => set({ storeId }),
  setPeriodFilter: (period) => set({ period }),

  clearFilters: () => set({
    projectId: null,
    materialId: null,
    storeId: null,
    period: null
  }),

  // Consumption actions
  recordConsumption: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.recordConsumption(
        params.companyId,
        params.projectId,
        params.materialId,
        params.issuedQuantity,
        params.returnedQuantity,
        params.theoreticalConsumption,
        params.consumptionDate,
        params.siteId,
        params.wbsId,
        params.activityId,
        params.boqItemId,
        params.issueId,
        params.costCodeId,
        params.createdBy
      );
      await get().loadConsumptions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to record consumption' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadConsumptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const consumptions = materialControlService.getConsumptions(projectId || undefined, materialId || undefined);
      set({ consumptions });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load consumptions' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Theoretical consumption actions
  calculateTheoreticalConsumption: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.calculateTheoreticalConsumption(
        params.companyId,
        params.projectId,
        params.boqItemId,
        params.materialId,
        params.executedQuantity,
        params.materialCoefficient,
        params.calculatedBy
      );
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to calculate theoretical consumption' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Variance actions
  loadVariances: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const variances = materialControlService.getVariances(projectId || undefined, materialId || undefined);
      set({ variances });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load variances' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Wastage actions
  recordWastage: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.recordWastage(
        params.companyId,
        params.projectId,
        params.materialId,
        params.period,
        params.theoreticalQuantity,
        params.allowedWastagePercent,
        params.actualWastageQuantity,
        params.uom,
        params.reason,
        params.createdBy
      );
      await get().loadWastages();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to record wastage' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadWastages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const wastages = materialControlService.getWastages(projectId || undefined, materialId || undefined);
      set({ wastages });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load wastages' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Reconciliation actions
  performMaterialReconciliation: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.performMaterialReconciliation(
        params.companyId,
        params.projectId,
        params.materialId,
        params.reconciliationDate,
        params.openingStock,
        params.receipts,
        params.transfersIn,
        params.issues,
        params.transfersOut,
        params.returns,
        params.adjustments,
        params.physicalStock,
        params.reconciledBy,
        params.remarks
      );
      await get().loadReconciliations();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to perform reconciliation' });
    } finally {
      set({ isLoading: false });
    }
  },

  performBOQReconciliation: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.performBOQReconciliation(
        params.companyId,
        params.projectId,
        params.boqItemId,
        params.materialId,
        params.boqQuantity,
        params.executedQuantity,
        params.expectedMaterial,
        params.actualMaterial,
        params.reconciliationDate,
        params.reconciledBy
      );
      await get().loadBOQReconciliations();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to perform BOQ reconciliation' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadReconciliations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const reconciliations = materialControlService.getReconciliations(projectId || undefined, materialId || undefined);
      set({ reconciliations });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load reconciliations' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadBOQReconciliations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const boqReconciliations = materialControlService.getBOQReconciliations(projectId || undefined, materialId || undefined);
      set({ boqReconciliations });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load BOQ reconciliations' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Price variance actions
  calculateMaterialPriceVariance: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.calculateMaterialPriceVariance(
        params.companyId,
        params.materialId,
        params.period,
        params.tenderRate,
        params.budgetRate,
        params.poRate,
        params.actualRate,
        params.uom
      );
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to calculate price variance' });
    } finally {
      set({ isLoading: false });
    }
  },

  calculatePurchasePriceVariance: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.calculatePurchasePriceVariance(
        params.companyId,
        params.projectId,
        params.materialId,
        params.poId,
        params.poNumber,
        params.poDate,
        params.approvedBudgetRate,
        params.actualPurchaseRate,
        params.quantity,
        params.uom
      );
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to calculate purchase price variance' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Forecast actions
  generateMaterialForecast: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.generateMaterialForecast(
        params.companyId,
        params.projectId,
        params.materialId,
        params.plannedActivities,
        params.remainingBOQ,
        params.productivity,
        params.historicalConsumption,
        params.currentStock,
        params.incomingQuantity,
        params.uom
      );
      await get().loadForecasts();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to generate forecast' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadForecasts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const forecasts = materialControlService.getForecasts(projectId || undefined, materialId || undefined);
      set({ forecasts });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load forecasts' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Procurement planning actions
  generateProcurementPlan: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.generateProcurementPlan(
        params.companyId,
        params.projectId,
        params.materialId,
        params.requiredForRemainingWork,
        params.availableStock,
        params.incomingApprovedQuantity,
        params.uom,
        params.createdBy
      );
      await get().loadProcurementPlans();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to generate procurement plan' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadProcurementPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const procurementPlans = materialControlService.getProcurementPlans(projectId || undefined, materialId || undefined);
      set({ procurementPlans });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load procurement plans' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Loss and damage actions
  recordMaterialLoss: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.recordMaterialLoss(
        params.companyId,
        params.projectId,
        params.siteId,
        params.activityId,
        params.materialId,
        params.lossDate,
        params.quantity,
        params.uom,
        params.reason,
        params.responsibleArea,
        params.estimatedValue,
        params.evidence,
        params.createdBy
      );
      await get().loadLosses();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to record material loss' });
    } finally {
      set({ isLoading: false });
    }
  },

  recordMaterialDamage: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.recordMaterialDamage(
        params.companyId,
        params.projectId,
        params.siteId,
        params.materialId,
        params.damageDate,
        params.damageType,
        params.quantity,
        params.uom,
        params.cause,
        params.estimatedValue,
        params.disposition,
        params.evidence,
        params.createdBy
      );
      await get().loadDamages();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to record material damage' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadLosses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const losses = materialControlService.getLosses(projectId || undefined, materialId || undefined);
      set({ losses });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load losses' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadDamages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projectId, materialId } = get();
      const damages = materialControlService.getDamages(projectId || undefined, materialId || undefined);
      set({ damages });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load damages' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Alert actions
  acknowledgeAlert: async (alertId, acknowledgedBy) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.acknowledgeAlert(alertId, acknowledgedBy);
      // Reload alerts
      const alerts = materialControlService.getAlerts(''); // Company ID would come from context
      set({ alerts });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to acknowledge alert' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadAlerts: async (companyId) => {
    set({ isLoading: true, error: null });
    try {
      const alerts = materialControlService.getAlerts(companyId);
      set({ alerts });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load alerts' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Cost code link
  linkCostCode: async (params) => {
    set({ isLoading: true, error: null });
    try {
      materialControlService.linkCostCode(
        params.issueId,
        params.issueNumber,
        params.materialId,
        params.wbsId,
        params.costCodeId,
        params.activityId,
        params.quantity,
        params.value,
        params.uom,
        params.linkedBy
      );
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to link cost code' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Dashboard
  loadDashboardKPIs: async (companyId, projectId) => {
    set({ isLoading: true, error: null });
    try {
      const kpis = materialControlService.getProjectMaterialDashboardKPIs(companyId, projectId);
      set({ dashboardKPIs: kpis });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load dashboard KPIs' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Trace
  getMaterialTrace: async (materialId) => {
    set({ isLoading: true, error: null });
    try {
      const trace = materialControlService.getMaterialTrace(materialId);
      return trace;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to get material trace' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

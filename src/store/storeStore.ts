// ============================================================
// BUILDCORE ERP - STORE & WAREHOUSE ZUSTAND STORE
// Part 17: Complete Store and Warehouse Management System
// ============================================================

import { create } from 'zustand';
import type {
  StoreMaster, BinMaster, StockLedgerEntry, MaterialIssue, MaterialReturn,
  StockTransfer, StockAdjustment, StockReservation, StockBalance,
  MinMaxStockConfig, ReorderAlert, DeadStockAnalysis, SlowMovingAnalysis,
  StockAgeingAnalysis, MaterialReconciliation, StoreDashboardKPIs,
  StockValuationConfig, WarehouseType, IssueStatus, ReturnStatus,
  TransferStatus, AdjustmentStatus, ReservationStatus
} from '../types/store';
import { storeService } from '../services/storeService';

interface StoreStoreState {
  // Data
  stores: StoreMaster[];
  bins: BinMaster[];
  stockBalances: StockBalance[];
  materialIssues: MaterialIssue[];
  materialReturns: MaterialReturn[];
  stockTransfers: StockTransfer[];
  stockAdjustments: StockAdjustment[];
  stockReservations: StockReservation[];
  minMaxConfigs: MinMaxStockConfig[];
  reorderAlerts: ReorderAlert[];
  deadStock: DeadStockAnalysis[];
  slowMoving: SlowMovingAnalysis[];
  stockAgeing: StockAgeingAnalysis[];
  reconciliations: MaterialReconciliation[];
  dashboardKPIs: StoreDashboardKPIs | null;
  
  // Filters
  selectedCompanyId: string | null;
  selectedStoreId: string | null;
  selectedProjectId: string | null;
  storeFilter: WarehouseType | null;
  issueStatusFilter: IssueStatus | null;
  
  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  
  // Store actions
  createStore: (data: Omit<StoreMaster, 'id' | 'createdAt' | 'updatedAt'>) => StoreMaster;
  getStore: (id: string) => StoreMaster | undefined;
  getStores: (companyId: string, filters?: { projectId?: string; warehouseType?: WarehouseType }) => StoreMaster[];
  updateStore: (id: string, data: Partial<StoreMaster>) => void;
  
  // Bin actions
  createBin: (data: Omit<BinMaster, 'id' | 'createdAt' | 'updatedAt'>) => BinMaster;
  getBin: (id: string) => BinMaster | undefined;
  getBins: (storeId: string) => BinMaster[];
  updateBin: (id: string, data: Partial<BinMaster>) => void;
  
  // Stock balance actions
  getStockBalance: (materialId: string, storeId: string, batchNumber?: string, binId?: string) => StockBalance | undefined;
  getAllStockBalances: (companyId: string) => StockBalance[];
  setValuationConfig: (materialId: string, companyId: string, valuationMethod: 'WEIGHTED_AVERAGE' | 'FIFO', userId: string) => void;
  
  // Material issue actions
  createMaterialIssue: (data: Omit<MaterialIssue, 'id' | 'createdAt' | 'updatedAt' | 'issueNumber'>) => MaterialIssue;
  getMaterialIssue: (id: string) => MaterialIssue | undefined;
  getMaterialIssues: (companyId: string, filters?: { storeId?: string; status?: IssueStatus }) => MaterialIssue[];
  approveMaterialIssue: (id: string, approverId: string, approverName: string) => void;
  issueMaterial: (id: string, storeKeeperId: string, storeKeeperName: string) => void;
  
  // Material return actions
  createMaterialReturn: (data: Omit<MaterialReturn, 'id' | 'createdAt' | 'updatedAt' | 'returnNumber'>) => MaterialReturn;
  getMaterialReturn: (id: string) => MaterialReturn | undefined;
  getMaterialReturns: (companyId: string, filters?: { storeId?: string; status?: ReturnStatus }) => MaterialReturn[];
  acceptMaterialReturn: (id: string, receivedById: string, receivedByName: string) => void;
  
  // Stock transfer actions
  createStockTransfer: (data: Omit<StockTransfer, 'id' | 'createdAt' | 'updatedAt' | 'transferNumber'>) => StockTransfer;
  getStockTransfer: (id: string) => StockTransfer | undefined;
  getStockTransfers: (companyId: string, filters?: { fromStoreId?: string; toStoreId?: string; status?: TransferStatus }) => StockTransfer[];
  dispatchTransfer: (id: string, dispatchedById: string, dispatchedByName: string) => void;
  receiveTransfer: (id: string, receivedById: string, receivedByName: string) => void;
  
  // Stock adjustment actions
  createStockAdjustment: (data: Omit<StockAdjustment, 'id' | 'createdAt' | 'updatedAt' | 'adjustmentNumber'>) => StockAdjustment;
  getStockAdjustment: (id: string) => StockAdjustment | undefined;
  getStockAdjustments: (companyId: string, filters?: { storeId?: string; status?: AdjustmentStatus }) => StockAdjustment[];
  approveStockAdjustment: (id: string, approvedById: string, approvedByName: string) => void;
  
  // Stock reservation actions
  createStockReservation: (data: Omit<StockReservation, 'id' | 'createdAt' | 'updatedAt' | 'reservationNumber'>) => StockReservation | null;
  getStockReservation: (id: string) => StockReservation | undefined;
  getStockReservations: (companyId: string, filters?: { projectId?: string; status?: ReservationStatus }) => StockReservation[];
  
  // Min/Max config actions
  setMinMaxStockConfig: (data: Omit<MinMaxStockConfig, 'id' | 'createdAt' | 'updatedAt'>) => MinMaxStockConfig;
  getMinMaxStockConfig: (materialId: string, storeId: string) => MinMaxStockConfig | undefined;
  
  // Analysis actions
  checkReorderAlerts: (companyId: string) => ReorderAlert[];
  analyzeDeadStock: (companyId: string, inactivityDays?: number) => DeadStockAnalysis[];
  analyzeSlowMoving: (companyId: string, periodMonths?: number) => SlowMovingAnalysis[];
  analyzeStockAgeing: (companyId: string) => StockAgeingAnalysis[];
  
  // Reconciliation actions
  createMaterialReconciliation: (data: Omit<MaterialReconciliation, 'id' | 'createdAt' | 'updatedAt'>) => MaterialReconciliation;
  getMaterialReconciliation: (id: string) => MaterialReconciliation | undefined;
  getMaterialReconciliations: (companyId: string, filters?: { projectId?: string; materialId?: string }) => MaterialReconciliation[];
  
  // Dashboard actions
  loadDashboardKPIs: (companyId: string) => void;
  
  // Filter actions
  setCompanyFilter: (companyId: string | null) => void;
  setStoreFilter: (storeId: string | null) => void;
  setProjectFilter: (projectId: string | null) => void;
  setWarehouseTypeFilter: (type: WarehouseType | null) => void;
  setIssueStatusFilter: (status: IssueStatus | null) => void;
}

export const useStoreStore = create<StoreStoreState>((set, get) => ({
  // Initial state
  stores: [],
  bins: [],
  stockBalances: [],
  materialIssues: [],
  materialReturns: [],
  stockTransfers: [],
  stockAdjustments: [],
  stockReservations: [],
  minMaxConfigs: [],
  reorderAlerts: [],
  deadStock: [],
  slowMoving: [],
  stockAgeing: [],
  reconciliations: [],
  dashboardKPIs: null,
  selectedCompanyId: null,
  selectedStoreId: null,
  selectedProjectId: null,
  storeFilter: null,
  issueStatusFilter: null,

  // Initialize
  initialize: (companyId: string) => {
    set({ selectedCompanyId: companyId });
    get().refresh(companyId);
  },

  // Refresh
  refresh: (companyId: string) => {
    set({
      stores: storeService.getStores(companyId, { warehouseType: get().storeFilter || undefined }),
      stockBalances: storeService.getAllStockBalances(companyId),
      materialIssues: storeService.getMaterialIssues(companyId, { storeId: get().selectedStoreId || undefined, status: get().issueStatusFilter || undefined }),
      materialReturns: storeService.getMaterialReturns(companyId, { storeId: get().selectedStoreId || undefined }),
      stockTransfers: storeService.getStockTransfers(companyId),
      stockAdjustments: storeService.getStockAdjustments(companyId, { storeId: get().selectedStoreId || undefined }),
      stockReservations: storeService.getStockReservations(companyId, { projectId: get().selectedProjectId || undefined }),
      reorderAlerts: storeService.checkReorderAlerts(companyId),
      deadStock: storeService.analyzeDeadStock(companyId),
      slowMoving: storeService.analyzeSlowMoving(companyId),
      stockAgeing: storeService.analyzeStockAgeing(companyId),
      reconciliations: storeService.getMaterialReconciliations(companyId, { projectId: get().selectedProjectId || undefined }),
    });
  },

  // Store actions
  createStore: (data) => {
    const store = storeService.createStore(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return store;
  },

  getStore: (id: string) => {
    return storeService.getStore(id);
  },

  getStores: (companyId: string, filters) => {
    return storeService.getStores(companyId, filters);
  },

  updateStore: (id: string, data: Partial<StoreMaster>) => {
    storeService.updateStore(id, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Bin actions
  createBin: (data) => {
    const bin = storeService.createBin(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return bin;
  },

  getBin: (id: string) => {
    return storeService.getBin(id);
  },

  getBins: (storeId: string) => {
    return storeService.getBins(storeId);
  },

  updateBin: (id: string, data: Partial<BinMaster>) => {
    storeService.updateBin(id, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Stock balance actions
  getStockBalance: (materialId: string, storeId: string, batchNumber?: string, binId?: string) => {
    return storeService.getStockBalance(materialId, storeId, batchNumber, binId);
  },

  getAllStockBalances: (companyId: string) => {
    return storeService.getAllStockBalances(companyId);
  },

  setValuationConfig: (materialId: string, companyId: string, valuationMethod: 'WEIGHTED_AVERAGE' | 'FIFO', userId: string) => {
    storeService.setValuationConfig(materialId, companyId, valuationMethod, userId);
    get().refresh(companyId);
  },

  // Material issue actions
  createMaterialIssue: (data) => {
    const issue = storeService.createMaterialIssue(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return issue;
  },

  getMaterialIssue: (id: string) => {
    return storeService.getMaterialIssue(id);
  },

  getMaterialIssues: (companyId: string, filters) => {
    return storeService.getMaterialIssues(companyId, filters);
  },

  approveMaterialIssue: (id: string, approverId: string, approverName: string) => {
    storeService.approveMaterialIssue(id, approverId, approverName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  issueMaterial: (id: string, storeKeeperId: string, storeKeeperName: string) => {
    storeService.issueMaterial(id, storeKeeperId, storeKeeperName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Material return actions
  createMaterialReturn: (data) => {
    const returnData = storeService.createMaterialReturn(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return returnData;
  },

  getMaterialReturn: (id: string) => {
    return storeService.getMaterialReturn(id);
  },

  getMaterialReturns: (companyId: string, filters) => {
    return storeService.getMaterialReturns(companyId, filters);
  },

  acceptMaterialReturn: (id: string, receivedById: string, receivedByName: string) => {
    storeService.acceptMaterialReturn(id, receivedById, receivedByName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Stock transfer actions
  createStockTransfer: (data) => {
    const transfer = storeService.createStockTransfer(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return transfer;
  },

  getStockTransfer: (id: string) => {
    return storeService.getStockTransfer(id);
  },

  getStockTransfers: (companyId: string, filters) => {
    return storeService.getStockTransfers(companyId, filters);
  },

  dispatchTransfer: (id: string, dispatchedById: string, dispatchedByName: string) => {
    storeService.dispatchTransfer(id, dispatchedById, dispatchedByName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  receiveTransfer: (id: string, receivedById: string, receivedByName: string) => {
    storeService.receiveTransfer(id, receivedById, receivedByName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Stock adjustment actions
  createStockAdjustment: (data) => {
    const adjustment = storeService.createStockAdjustment(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return adjustment;
  },

  getStockAdjustment: (id: string) => {
    return storeService.getStockAdjustment(id);
  },

  getStockAdjustments: (companyId: string, filters) => {
    return storeService.getStockAdjustments(companyId, filters);
  },

  approveStockAdjustment: (id: string, approvedById: string, approvedByName: string) => {
    storeService.approveStockAdjustment(id, approvedById, approvedByName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Stock reservation actions
  createStockReservation: (data) => {
    const reservation = storeService.createStockReservation(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return reservation;
  },

  getStockReservation: (id: string) => {
    return storeService.getStockReservation(id);
  },

  getStockReservations: (companyId: string, filters) => {
    return storeService.getStockReservations(companyId, filters);
  },

  // Min/Max config actions
  setMinMaxStockConfig: (data) => {
    const config = storeService.setMinMaxStockConfig(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return config;
  },

  getMinMaxStockConfig: (materialId: string, storeId: string) => {
    return storeService.getMinMaxStockConfig(materialId, storeId);
  },

  // Analysis actions
  checkReorderAlerts: (companyId: string) => {
    const alerts = storeService.checkReorderAlerts(companyId);
    set({ reorderAlerts: alerts });
    return alerts;
  },

  analyzeDeadStock: (companyId: string, inactivityDays?: number) => {
    const deadStock = storeService.analyzeDeadStock(companyId, inactivityDays);
    set({ deadStock });
    return deadStock;
  },

  analyzeSlowMoving: (companyId: string, periodMonths?: number) => {
    const slowMoving = storeService.analyzeSlowMoving(companyId, periodMonths);
    set({ slowMoving });
    return slowMoving;
  },

  analyzeStockAgeing: (companyId: string) => {
    const stockAgeing = storeService.analyzeStockAgeing(companyId);
    set({ stockAgeing });
    return stockAgeing;
  },

  // Reconciliation actions
  createMaterialReconciliation: (data) => {
    const reconciliation = storeService.createMaterialReconciliation(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return reconciliation;
  },

  getMaterialReconciliation: (id: string) => {
    return storeService.getMaterialReconciliation(id);
  },

  getMaterialReconciliations: (companyId: string, filters) => {
    return storeService.getMaterialReconciliations(companyId, filters);
  },

  // Dashboard actions
  loadDashboardKPIs: (companyId: string) => {
    const kpis = storeService.getStoreDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },

  // Filter actions
  setCompanyFilter: (companyId) => {
    set({ selectedCompanyId: companyId });
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setStoreFilter: (storeId) => {
    set({ selectedStoreId: storeId });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setProjectFilter: (projectId) => {
    set({ selectedProjectId: projectId });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setWarehouseTypeFilter: (type) => {
    set({ storeFilter: type });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setIssueStatusFilter: (status) => {
    set({ issueStatusFilter: status });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },
}));

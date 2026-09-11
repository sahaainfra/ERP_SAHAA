// ============================================================
// BUILDCORE ERP - PROCUREMENT STORE
// Part 15: Complete End-to-End Procurement Module
// ============================================================

import { create } from 'zustand';
import type {
  MaterialRequisition, PurchaseRequisition, RFQ, VendorQuotation,
  TechnicalEvaluation, CommercialEvaluation, ComparativeStatement,
  ProcurementNegotiation, ProcurementSavings, PurchaseOrder,
  ProcurementDashboardKPIs, ProcurementAlert, StockAvailability,
  MRStatus, PRStatus, RFQStatus, QuotationStatus, POStatus
} from '../types/procurement';
import { procurementService } from '../services/procurementService';

interface ProcurementState {
  // Data
  materialRequisitions: MaterialRequisition[];
  purchaseRequisitions: PurchaseRequisition[];
  rfqs: RFQ[];
  quotations: VendorQuotation[];
  technicalEvaluations: TechnicalEvaluation[];
  commercialEvaluations: CommercialEvaluation[];
  comparativeStatements: ComparativeStatement[];
  negotiations: ProcurementNegotiation[];
  savings: ProcurementSavings[];
  purchaseOrders: PurchaseOrder[];
  alerts: ProcurementAlert[];
  dashboardKPIs: ProcurementDashboardKPIs | null;
  
  // Filters
  selectedCompanyId: string | null;
  selectedProjectId: string | null;
  mrStatusFilter: MRStatus | null;
  prStatusFilter: PRStatus | null;
  rfqStatusFilter: RFQStatus | null;
  poStatusFilter: POStatus | null;
  
  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  
  // MR actions
  createMaterialRequisition: (data: any) => MaterialRequisition;
  getMaterialRequisition: (id: string) => MaterialRequisition | undefined;
  getMaterialRequisitions: (companyId: string, projectId?: string, status?: MRStatus) => MaterialRequisition[];
  updateMaterialRequisition: (id: string, updates: Partial<MaterialRequisition>) => void;
  checkStockAvailability: (materialId: string, requiredQuantity: number, projectId: string) => StockAvailability;
  
  // PR actions
  createPurchaseRequisition: (data: any) => PurchaseRequisition;
  getPurchaseRequisition: (id: string) => PurchaseRequisition | undefined;
  getPurchaseRequisitions: (companyId: string, projectId?: string, status?: PRStatus) => PurchaseRequisition[];
  updatePurchaseRequisition: (id: string, updates: Partial<PurchaseRequisition>) => void;
  validatePurchaseRequisition: (pr: PurchaseRequisition) => { isValid: boolean; errors: string[] };
  
  // RFQ actions
  createRFQ: (data: any) => RFQ;
  getRFQ: (id: string) => RFQ | undefined;
  getRFQs: (companyId: string, projectId?: string, status?: RFQStatus) => RFQ[];
  updateRFQ: (id: string, updates: Partial<RFQ>) => void;
  
  // Quotation actions
  createVendorQuotation: (data: any) => VendorQuotation;
  getVendorQuotation: (id: string) => VendorQuotation | undefined;
  getVendorQuotations: (rfqId: string, vendorId?: string) => VendorQuotation[];
  updateVendorQuotation: (id: string, updates: Partial<VendorQuotation>) => void;
  
  // Evaluation actions
  createTechnicalEvaluation: (data: any) => TechnicalEvaluation;
  getTechnicalEvaluation: (quotationId: string) => TechnicalEvaluation | undefined;
  createCommercialEvaluation: (data: any) => CommercialEvaluation;
  getCommercialEvaluation: (quotationId: string) => CommercialEvaluation | undefined;
  
  // Comparative actions
  generateComparativeStatement: (rfqId: string, preparedBy: string, preparedByName: string) => ComparativeStatement;
  getComparativeStatement: (id: string) => ComparativeStatement | undefined;
  getComparativeStatements: (rfqId: string) => ComparativeStatement[];
  
  // Negotiation actions
  createNegotiation: (data: any) => ProcurementNegotiation;
  getNegotiations: (quotationId: string) => ProcurementNegotiation[];
  
  // Savings actions
  calculateProcurementSavings: (prId: string, budgetEstimate: number, originalQuotation: number, finalNegotiated: number, calculatedBy: string) => ProcurementSavings;
  
  // PO actions
  createPurchaseOrder: (data: any) => PurchaseOrder;
  createPOFromQuotation: (quotationId: string, projectId: string, createdBy: string) => PurchaseOrder;
  getPurchaseOrder: (id: string) => PurchaseOrder | undefined;
  getPurchaseOrders: (companyId: string, projectId?: string, vendorId?: string, status?: POStatus) => PurchaseOrder[];
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  
  // Alert actions
  createAlert: (data: any) => ProcurementAlert;
  getAlerts: (isAcknowledged?: boolean) => ProcurementAlert[];
  acknowledgeAlert: (alertId: string, acknowledgedBy: string) => void;
  
  // Dashboard actions
  loadDashboardKPIs: (companyId: string) => void;
  
  // Filter actions
  setCompanyFilter: (companyId: string | null) => void;
  setProjectFilter: (projectId: string | null) => void;
  setMRStatusFilter: (status: MRStatus | null) => void;
  setPRStatusFilter: (status: PRStatus | null) => void;
  setRFQStatusFilter: (status: RFQStatus | null) => void;
  setPOStatusFilter: (status: POStatus | null) => void;
  
  // Utility
  getMRByNumber: (companyId: string, mrNumber: string) => MaterialRequisition | undefined;
  getPRByNumber: (companyId: string, prNumber: string) => PurchaseRequisition | undefined;
  getRFQByNumber: (companyId: string, rfqNumber: string) => RFQ | undefined;
  getPOByNumber: (companyId: string, poNumber: string) => PurchaseOrder | undefined;
}

export const useProcurementStore = create<ProcurementState>((set, get) => ({
  // Initial state
  materialRequisitions: [],
  purchaseRequisitions: [],
  rfqs: [],
  quotations: [],
  technicalEvaluations: [],
  commercialEvaluations: [],
  comparativeStatements: [],
  negotiations: [],
  savings: [],
  purchaseOrders: [],
  alerts: [],
  dashboardKPIs: null,
  selectedCompanyId: null,
  selectedProjectId: null,
  mrStatusFilter: null,
  prStatusFilter: null,
  rfqStatusFilter: null,
  poStatusFilter: null,

  // Initialize
  initialize: (companyId: string) => {
    set({ selectedCompanyId: companyId });
    get().refresh(companyId);
  },

  // Refresh
  refresh: (companyId: string) => {
    set({
      materialRequisitions: procurementService.getMaterialRequisitions(companyId, get().selectedProjectId || undefined, get().mrStatusFilter || undefined),
      purchaseRequisitions: procurementService.getPurchaseRequisitions(companyId, get().selectedProjectId || undefined, get().prStatusFilter || undefined),
      rfqs: procurementService.getRFQs(companyId, get().selectedProjectId || undefined, get().rfqStatusFilter || undefined),
      purchaseOrders: procurementService.getPurchaseOrders(companyId, get().selectedProjectId || undefined, undefined, get().poStatusFilter || undefined),
      alerts: procurementService.getAlerts(),
    });
  },

  // MR actions
  createMaterialRequisition: (data: any) => {
    const mr = procurementService.createMaterialRequisition(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return mr;
  },

  getMaterialRequisition: (id: string) => {
    return procurementService.getMaterialRequisition(id);
  },

  getMaterialRequisitions: (companyId: string, projectId?: string, status?: MRStatus) => {
    return procurementService.getMaterialRequisitions(companyId, projectId, status);
  },

  updateMaterialRequisition: (id: string, updates: Partial<MaterialRequisition>) => {
    procurementService.updateMaterialRequisition(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  checkStockAvailability: (materialId: string, requiredQuantity: number, projectId: string) => {
    return procurementService.checkStockAvailability(materialId, requiredQuantity, projectId);
  },

  // PR actions
  createPurchaseRequisition: (data: any) => {
    const pr = procurementService.createPurchaseRequisition(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return pr;
  },

  getPurchaseRequisition: (id: string) => {
    return procurementService.getPurchaseRequisition(id);
  },

  getPurchaseRequisitions: (companyId: string, projectId?: string, status?: PRStatus) => {
    return procurementService.getPurchaseRequisitions(companyId, projectId, status);
  },

  updatePurchaseRequisition: (id: string, updates: Partial<PurchaseRequisition>) => {
    procurementService.updatePurchaseRequisition(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  validatePurchaseRequisition: (pr: PurchaseRequisition) => {
    return procurementService.validatePurchaseRequisition(pr);
  },

  // RFQ actions
  createRFQ: (data: any) => {
    const rfq = procurementService.createRFQ(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return rfq;
  },

  getRFQ: (id: string) => {
    return procurementService.getRFQ(id);
  },

  getRFQs: (companyId: string, projectId?: string, status?: RFQStatus) => {
    return procurementService.getRFQs(companyId, projectId, status);
  },

  updateRFQ: (id: string, updates: Partial<RFQ>) => {
    procurementService.updateRFQ(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Quotation actions
  createVendorQuotation: (data: any) => {
    const quotation = procurementService.createVendorQuotation(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return quotation;
  },

  getVendorQuotation: (id: string) => {
    return procurementService.getVendorQuotation(id);
  },

  getVendorQuotations: (rfqId: string, vendorId?: string) => {
    return procurementService.getVendorQuotations(rfqId, vendorId);
  },

  updateVendorQuotation: (id: string, updates: Partial<VendorQuotation>) => {
    procurementService.updateVendorQuotation(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Evaluation actions
  createTechnicalEvaluation: (data: any) => {
    const evaluation = procurementService.createTechnicalEvaluation(data);
    return evaluation;
  },

  getTechnicalEvaluation: (quotationId: string) => {
    return procurementService.getTechnicalEvaluation(quotationId);
  },

  createCommercialEvaluation: (data: any) => {
    const evaluation = procurementService.createCommercialEvaluation(data);
    return evaluation;
  },

  getCommercialEvaluation: (quotationId: string) => {
    return procurementService.getCommercialEvaluation(quotationId);
  },

  // Comparative actions
  generateComparativeStatement: (rfqId: string, preparedBy: string, preparedByName: string) => {
    const statement = procurementService.generateComparativeStatement(rfqId, preparedBy, preparedByName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return statement;
  },

  getComparativeStatement: (id: string) => {
    return procurementService.getComparativeStatement(id);
  },

  getComparativeStatements: (rfqId: string) => {
    return procurementService.getComparativeStatements(rfqId);
  },

  // Negotiation actions
  createNegotiation: (data: any) => {
    const negotiation = procurementService.createNegotiation(data);
    return negotiation;
  },

  getNegotiations: (quotationId: string) => {
    return procurementService.getNegotiations(quotationId);
  },

  // Savings actions
  calculateProcurementSavings: (prId: string, budgetEstimate: number, originalQuotation: number, finalNegotiated: number, calculatedBy: string) => {
    const savings = procurementService.calculateProcurementSavings(prId, budgetEstimate, originalQuotation, finalNegotiated, calculatedBy);
    return savings;
  },

  // PO actions
  createPurchaseOrder: (data: any) => {
    const po = procurementService.createPurchaseOrder(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return po;
  },

  createPOFromQuotation: (quotationId: string, projectId: string, createdBy: string) => {
    const po = procurementService.createPOFromQuotation(quotationId, projectId, createdBy);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return po;
  },

  getPurchaseOrder: (id: string) => {
    return procurementService.getPurchaseOrder(id);
  },

  getPurchaseOrders: (companyId: string, projectId?: string, vendorId?: string, status?: POStatus) => {
    return procurementService.getPurchaseOrders(companyId, projectId, vendorId, status);
  },

  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => {
    procurementService.updatePurchaseOrder(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Alert actions
  createAlert: (data: any) => {
    const alert = procurementService.createAlert(data);
    set({ alerts: [...get().alerts, alert] });
    return alert;
  },

  getAlerts: (isAcknowledged?: boolean) => {
    return procurementService.getAlerts(isAcknowledged);
  },

  acknowledgeAlert: (alertId: string, acknowledgedBy: string) => {
    procurementService.acknowledgeAlert(alertId, acknowledgedBy);
    set({ alerts: procurementService.getAlerts() });
  },

  // Dashboard actions
  loadDashboardKPIs: (companyId: string) => {
    const kpis = procurementService.getProcurementDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },

  // Filter actions
  setCompanyFilter: (companyId) => {
    set({ selectedCompanyId: companyId });
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

  setMRStatusFilter: (status) => {
    set({ mrStatusFilter: status });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setPRStatusFilter: (status) => {
    set({ prStatusFilter: status });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setRFQStatusFilter: (status) => {
    set({ rfqStatusFilter: status });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setPOStatusFilter: (status) => {
    set({ poStatusFilter: status });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Utility
  getMRByNumber: (companyId: string, mrNumber: string) => {
    return procurementService.getMRByNumber(companyId, mrNumber);
  },

  getPRByNumber: (companyId: string, prNumber: string) => {
    return procurementService.getPRByNumber(companyId, prNumber);
  },

  getRFQByNumber: (companyId: string, rfqNumber: string) => {
    return procurementService.getRFQByNumber(companyId, rfqNumber);
  },

  getPOByNumber: (companyId: string, poNumber: string) => {
    return procurementService.getPOByNumber(companyId, poNumber);
  },
}));

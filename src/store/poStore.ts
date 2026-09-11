// ============================================================
// BUILDCORE ERP - PO STORE
// Part 16: Purchase Order State Management
// ============================================================

import { create } from 'zustand';
import type {
  PurchaseOrderMaster, GoodsReceiptNote, SupplierInvoice, ThreeWayMatch,
  PODashboardKPIs, PurchaseOrderStatus, GRNStatus, InvoiceStatus
} from '../types/po';
import { poService } from '../services/poService';

interface POState {
  purchaseOrders: PurchaseOrderMaster[];
  grns: GoodsReceiptNote[];
  invoices: SupplierInvoice[];
  threeWayMatches: ThreeWayMatch[];
  dashboardKPIs: PODashboardKPIs | null;
  selectedPOId: string | null;
  selectedCompanyId: string | null;
  selectedProjectId: string | null;
  poStatusFilter: PurchaseOrderStatus | null;

  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  
  createPurchaseOrder: (data: any) => PurchaseOrderMaster;
  getPurchaseOrder: (id: string) => PurchaseOrderMaster | undefined;
  getPurchaseOrders: (companyId: string, projectId?: string, vendorId?: string, status?: PurchaseOrderStatus) => PurchaseOrderMaster[];
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrderMaster>) => void;
  approvePurchaseOrder: (id: string, approvedBy: string) => void;
  
  createGRN: (data: any) => GoodsReceiptNote;
  getGRN: (id: string) => GoodsReceiptNote | undefined;
  getGRNs: (companyId: string, poId?: string, status?: GRNStatus) => GoodsReceiptNote[];
  
  createInvoice: (data: any) => SupplierInvoice;
  getInvoice: (id: string) => SupplierInvoice | undefined;
  getInvoices: (companyId: string, poId?: string, vendorId?: string, status?: InvoiceStatus) => SupplierInvoice[];
  
  performThreeWayMatch: (invoiceId: string, performedBy: string, performedByName: string) => ThreeWayMatch | null;
  getThreeWayMatch: (id: string) => ThreeWayMatch | undefined;
  
  loadDashboardKPIs: (companyId: string) => void;
  
  setCompanyFilter: (companyId: string | null) => void;
  setProjectFilter: (projectId: string | null) => void;
  setPOStatusFilter: (status: PurchaseOrderStatus | null) => void;
  selectPO: (poId: string | null) => void;
}

export const usePOStore = create<POState>((set, get) => ({
  purchaseOrders: [],
  grns: [],
  invoices: [],
  threeWayMatches: [],
  dashboardKPIs: null,
  selectedPOId: null,
  selectedCompanyId: null,
  selectedProjectId: null,
  poStatusFilter: null,

  initialize: (companyId: string) => {
    set({ selectedCompanyId: companyId });
    get().refresh(companyId);
  },

  refresh: (companyId: string) => {
    set({
      purchaseOrders: poService.getPurchaseOrders(companyId, get().selectedProjectId || undefined, undefined, get().poStatusFilter || undefined),
      grns: poService.getGRNs(companyId),
      invoices: poService.getInvoices(companyId),
    });
  },

  createPurchaseOrder: (data: any) => {
    const po = poService.createPurchaseOrder(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return po;
  },

  getPurchaseOrder: (id: string) => {
    return poService.getPurchaseOrder(id);
  },

  getPurchaseOrders: (companyId: string, projectId?: string, vendorId?: string, status?: PurchaseOrderStatus) => {
    return poService.getPurchaseOrders(companyId, projectId, vendorId, status);
  },

  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrderMaster>) => {
    poService.updatePurchaseOrder(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  approvePurchaseOrder: (id: string, approvedBy: string) => {
    poService.approvePurchaseOrder(id, approvedBy);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  createGRN: (data: any) => {
    const grn = poService.createGRN(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return grn;
  },

  getGRN: (id: string) => {
    return poService.getGRN(id);
  },

  getGRNs: (companyId: string, poId?: string, status?: GRNStatus) => {
    return poService.getGRNs(companyId, poId, status);
  },

  createInvoice: (data: any) => {
    const invoice = poService.createInvoice(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return invoice;
  },

  getInvoice: (id: string) => {
    return poService.getInvoice(id);
  },

  getInvoices: (companyId: string, poId?: string, vendorId?: string, status?: InvoiceStatus) => {
    return poService.getInvoices(companyId, poId, vendorId, status);
  },

  performThreeWayMatch: (invoiceId: string, performedBy: string, performedByName: string) => {
    const match = poService.performThreeWayMatch(invoiceId, performedBy, performedByName);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return match;
  },

  getThreeWayMatch: (id: string) => {
    return poService.getThreeWayMatch(id);
  },

  loadDashboardKPIs: (companyId: string) => {
    const kpis = poService.getPODashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },

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

  setPOStatusFilter: (status) => {
    set({ poStatusFilter: status });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  selectPO: (poId) => {
    set({ selectedPOId: poId });
  },
}));

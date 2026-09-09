// ============================================================
// BUILDCORE ERP - VENDOR STORE
// Part 14: Complete Vendor and Business-Partner Management System
// ============================================================

import { create } from 'zustand';
import type {
  VendorMaster, VendorCategory, VendorKYC, VendorDocument,
  VendorQualification, ApprovedVendorList, VendorMaterialMapping,
  QuotationHistory, VendorPerformance, VendorScorecard, VendorBankAccount,
  SubcontractorMaster, LabourContractor, VendorCommunication,
  VendorSearchResult, VendorDashboardKPIs, VendorNumberingConfig,
  VendorType, VendorStatus
} from '../types/vendor';
import { vendorService } from '../services/vendorService';

interface VendorState {
  // Data
  vendors: VendorMaster[];
  categories: VendorCategory[];
  selectedVendorId: string | null;
  selectedVendor: VendorMaster | null;
  dashboardKPIs: VendorDashboardKPIs | null;
  searchResults: VendorSearchResult[];
  
  // Filters
  selectedCompanyId: string | null;
  statusFilter: VendorStatus | null;
  typeFilter: VendorType | null;
  categoryFilter: string | null;
  searchQuery: string;
  
  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  
  // Vendor actions
  createVendor: (data: any) => VendorMaster;
  getVendor: (id: string) => VendorMaster | undefined;
  updateVendor: (id: string, updates: Partial<VendorMaster>) => void;
  blockVendor: (id: string, reason: string, blockedBy: string) => void;
  unblockVendor: (id: string) => void;
  approveVendor: (id: string) => void;
  
  // Selection
  selectVendor: (id: string) => void;
  clearSelection: () => void;
  
  // Filters
  setCompanyFilter: (companyId: string | null) => void;
  setStatusFilter: (status: VendorStatus | null) => void;
  setTypeFilter: (type: VendorType | null) => void;
  setCategoryFilter: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Category actions
  createCategory: (data: any) => VendorCategory;
  getCategories: (companyId: string, parentId?: string) => VendorCategory[];
  
  // KYC actions
  addKYC: (vendorId: string, data: any) => VendorKYC;
  verifyKYC: (vendorId: string, kycId: string, verifiedBy: string) => void;
  removeKYC: (vendorId: string, kycId: string) => void;
  
  // Document actions
  addDocument: (vendorId: string, data: any) => VendorDocument;
  removeDocument: (vendorId: string, documentId: string) => void;
  
  // Bank account actions
  addBankAccount: (vendorId: string, data: any) => VendorBankAccount;
  removeBankAccount: (vendorId: string, accountId: string) => void;
  verifyBankAccount: (vendorId: string, accountId: string, verifiedBy: string) => void;
  
  // Qualification actions
  setQualification: (vendorId: string, data: any) => VendorQualification;
  
  // Approved vendor list actions
  approveVendorForProject: (data: any) => ApprovedVendorList;
  getApprovedVendorsForProject: (projectId: string) => ApprovedVendorList[];
  
  // Material mapping actions
  addMaterialMapping: (vendorId: string, data: any) => VendorMaterialMapping;
  getMaterialMappings: (vendorId: string) => VendorMaterialMapping[];
  
  // Quotation actions
  addQuotation: (vendorId: string, data: any) => QuotationHistory;
  getQuotationHistory: (vendorId: string, materialId?: string) => QuotationHistory[];
  
  // Performance actions
  addPerformanceRecord: (vendorId: string, data: any) => VendorPerformance;
  getPerformanceRecords: (vendorId: string) => VendorPerformance[];
  
  // Subcontractor actions
  addSubcontractor: (data: any) => SubcontractorMaster;
  getSubcontractors: (vendorId: string) => SubcontractorMaster[];
  
  // Labour contractor actions
  addLabourContractor: (data: any) => LabourContractor;
  getLabourContractors: (vendorId: string) => LabourContractor[];
  
  // Communication actions
  addCommunication: (vendorId: string, data: any) => VendorCommunication;
  getCommunications: (vendorId: string, projectId?: string) => VendorCommunication[];
  
  // Search
  searchVendors: (companyId: string, query: string, limit?: number) => VendorSearchResult[];
  
  // Dashboard
  loadDashboardKPIs: (companyId: string) => void;
  
  // Utility
  getVendorByCode: (companyId: string, vendorCode: string) => VendorMaster | undefined;
  getVendorByGSTIN: (companyId: string, gstin: string) => VendorMaster | undefined;
  getVendorsByType: (companyId: string, vendorType: VendorType) => VendorMaster[];
  getVendorsByCategory: (companyId: string, category: string) => VendorMaster[];
  getVendorsForMaterial: (companyId: string, materialId: string) => VendorMaster[];
}

export const useVendorStore = create<VendorState>((set, get) => ({
  // Initial state
  vendors: [],
  categories: [],
  selectedVendorId: null,
  selectedVendor: null,
  dashboardKPIs: null,
  searchResults: [],
  selectedCompanyId: null,
  statusFilter: null,
  typeFilter: null,
  categoryFilter: null,
  searchQuery: '',

  // Initialize
  initialize: (companyId: string) => {
    set({ selectedCompanyId: companyId });
    get().refresh(companyId);
  },

  // Refresh
  refresh: (companyId: string) => {
    const filters: any = {};
    if (get().statusFilter) filters.status = get().statusFilter;
    if (get().typeFilter) filters.vendorType = get().typeFilter;
    if (get().categoryFilter) filters.vendorCategory = get().categoryFilter;
    if (get().searchQuery) filters.search = get().searchQuery;

    set({
      vendors: vendorService.getVendors(companyId, filters),
      categories: vendorService.getCategories(companyId),
    });

    const selectedId = get().selectedVendorId;
    if (selectedId) {
      const vendor = vendorService.getVendor(selectedId);
      set({ selectedVendor: vendor || null });
    }
  },

  // Vendor actions
  createVendor: (data: any) => {
    const vendor = vendorService.createVendor(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return vendor;
  },

  getVendor: (id: string) => {
    return vendorService.getVendor(id);
  },

  updateVendor: (id: string, updates: Partial<VendorMaster>) => {
    vendorService.updateVendor(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  blockVendor: (id: string, reason: string, blockedBy: string) => {
    vendorService.blockVendor(id, reason, blockedBy);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  unblockVendor: (id: string) => {
    vendorService.unblockVendor(id);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  approveVendor: (id: string) => {
    vendorService.approveVendor(id);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Selection
  selectVendor: (id: string) => {
    const vendor = vendorService.getVendor(id);
    set({
      selectedVendorId: id,
      selectedVendor: vendor || null,
    });
  },

  clearSelection: () => {
    set({
      selectedVendorId: null,
      selectedVendor: null,
    });
  },

  // Filters
  setCompanyFilter: (companyId) => {
    set({ selectedCompanyId: companyId });
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setTypeFilter: (type) => {
    set({ typeFilter: type });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setCategoryFilter: (category) => {
    set({ categoryFilter: category });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Category actions
  createCategory: (data: any) => {
    const category = vendorService.createCategory(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return category;
  },

  getCategories: (companyId: string, parentId?: string) => {
    return vendorService.getCategories(companyId, parentId);
  },

  // KYC actions
  addKYC: (vendorId: string, data: any) => {
    const kyc = vendorService.addKYC(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return kyc;
  },

  verifyKYC: (vendorId: string, kycId: string, verifiedBy: string) => {
    vendorService.verifyKYC(vendorId, kycId, verifiedBy);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  removeKYC: (vendorId: string, kycId: string) => {
    vendorService.removeKYC(vendorId, kycId);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Document actions
  addDocument: (vendorId: string, data: any) => {
    const doc = vendorService.addDocument(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return doc;
  },

  removeDocument: (vendorId: string, documentId: string) => {
    vendorService.removeDocument(vendorId, documentId);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Bank account actions
  addBankAccount: (vendorId: string, data: any) => {
    const account = vendorService.addBankAccount(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return account;
  },

  removeBankAccount: (vendorId: string, accountId: string) => {
    vendorService.removeBankAccount(vendorId, accountId);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  verifyBankAccount: (vendorId: string, accountId: string, verifiedBy: string) => {
    vendorService.verifyBankAccount(vendorId, accountId, verifiedBy);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Qualification actions
  setQualification: (vendorId: string, data: any) => {
    const qualification = vendorService.setQualification(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return qualification;
  },

  // Approved vendor list actions
  approveVendorForProject: (data: any) => {
    const approved = vendorService.approveVendorForProject(data);
    return approved;
  },

  getApprovedVendorsForProject: (projectId: string) => {
    return vendorService.getApprovedVendorsForProject(projectId);
  },

  // Material mapping actions
  addMaterialMapping: (vendorId: string, data: any) => {
    const mapping = vendorService.addMaterialMapping(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return mapping;
  },

  getMaterialMappings: (vendorId: string) => {
    return vendorService.getMaterialMappings(vendorId);
  },

  // Quotation actions
  addQuotation: (vendorId: string, data: any) => {
    const quotation = vendorService.addQuotation(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return quotation;
  },

  getQuotationHistory: (vendorId: string, materialId?: string) => {
    return vendorService.getQuotationHistory(vendorId, materialId);
  },

  // Performance actions
  addPerformanceRecord: (vendorId: string, data: any) => {
    const performance = vendorService.addPerformanceRecord(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return performance;
  },

  getPerformanceRecords: (vendorId: string) => {
    return vendorService.getPerformanceRecords(vendorId);
  },

  // Subcontractor actions
  addSubcontractor: (data: any) => {
    const subcontractor = vendorService.addSubcontractor(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return subcontractor;
  },

  getSubcontractors: (vendorId: string) => {
    return vendorService.getSubcontractors(vendorId);
  },

  // Labour contractor actions
  addLabourContractor: (data: any) => {
    const contractor = vendorService.addLabourContractor(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return contractor;
  },

  getLabourContractors: (vendorId: string) => {
    return vendorService.getLabourContractors(vendorId);
  },

  // Communication actions
  addCommunication: (vendorId: string, data: any) => {
    const communication = vendorService.addCommunication(vendorId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return communication;
  },

  getCommunications: (vendorId: string, projectId?: string) => {
    return vendorService.getCommunications(vendorId, projectId);
  },

  // Search
  searchVendors: (companyId: string, query: string, limit?: number) => {
    const results = vendorService.searchVendors(companyId, query, limit);
    set({ searchResults: results });
    return results;
  },

  // Dashboard
  loadDashboardKPIs: (companyId: string) => {
    const kpis = vendorService.getVendorDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },

  // Utility
  getVendorByCode: (companyId: string, vendorCode: string) => {
    return vendorService.getVendorByCode(companyId, vendorCode);
  },

  getVendorByGSTIN: (companyId: string, gstin: string) => {
    return vendorService.getVendorByGSTIN(companyId, gstin);
  },

  getVendorsByType: (companyId: string, vendorType: VendorType) => {
    return vendorService.getVendorsByType(companyId, vendorType);
  },

  getVendorsByCategory: (companyId: string, category: string) => {
    return vendorService.getVendorsByCategory(companyId, category);
  },

  getVendorsForMaterial: (companyId: string, materialId: string) => {
    return vendorService.getVendorsForMaterial(companyId, materialId);
  },
}));

// ============================================================
// BUILDCORE ERP - MATERIAL STORE
// Part 13: Central Material Master and Material Management Engine
// ============================================================

import { create } from 'zustand';
import type {
  MaterialMaster, MaterialClassification, MaterialGroup, MaterialDocument,
  MaterialImage, MaterialAlternative, ApprovedMaterialList, MaterialRateHistory,
  MaterialVendorLink, MaterialRateAlert, MaterialSearchResult, MaterialComparison,
  MaterialBulkImport, MaterialDashboardKPIs, MaterialNumberingConfig,
  MaterialType, MaterialStatus
} from '../types/material';
import { materialService } from '../services/materialService';

interface MaterialState {
  // Data
  materials: MaterialMaster[];
  classifications: MaterialClassification[];
  groups: MaterialGroup[];
  selectedMaterialId: string | null;
  selectedMaterial: MaterialMaster | null;
  dashboardKPIs: MaterialDashboardKPIs | null;
  rateAlerts: MaterialRateAlert[];
  searchResults: MaterialSearchResult[];
  
  // Filters
  selectedCompanyId: string | null;
  statusFilter: MaterialStatus | null;
  typeFilter: MaterialType | null;
  categoryFilter: string | null;
  searchQuery: string;
  
  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  
  // Material actions
  createMaterial: (data: any) => MaterialMaster;
  getMaterial: (id: string) => MaterialMaster | undefined;
  updateMaterial: (id: string, updates: Partial<MaterialMaster>) => void;
  blockMaterial: (id: string, reason: string) => void;
  approveMaterial: (id: string) => void;
  
  // Selection
  selectMaterial: (id: string) => void;
  clearSelection: () => void;
  
  // Filters
  setCompanyFilter: (companyId: string | null) => void;
  setStatusFilter: (status: MaterialStatus | null) => void;
  setTypeFilter: (type: MaterialType | null) => void;
  setCategoryFilter: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Classification & Group
  createClassification: (data: any) => MaterialClassification;
  getClassifications: (companyId: string, parentId?: string) => MaterialClassification[];
  createGroup: (data: any) => MaterialGroup;
  getGroups: (companyId: string, parentId?: string) => MaterialGroup[];
  
  // Documents & Images
  addDocument: (materialId: string, data: any) => MaterialDocument;
  removeDocument: (materialId: string, documentId: string) => void;
  addImage: (materialId: string, data: any) => MaterialImage;
  removeImage: (materialId: string, imageId: string) => void;
  
  // Alternatives
  addAlternative: (materialId: string, data: any) => MaterialAlternative;
  getAlternatives: (materialId: string) => MaterialAlternative[];
  
  // Approved Materials
  approveMaterialForProject: (data: any) => ApprovedMaterialList;
  getApprovedMaterialsForProject: (projectId: string) => ApprovedMaterialList[];
  
  // Rate History
  addRateHistory: (materialId: string, data: any) => MaterialRateHistory;
  getRateHistory: (materialId: string, rateType?: any) => MaterialRateHistory[];
  
  // Vendor Links
  linkVendor: (materialId: string, data: any) => MaterialVendorLink;
  getVendorLinks: (materialId: string) => MaterialVendorLink[];
  
  // Rate Alerts
  getRateAlerts: (materialId?: string, isAcknowledged?: boolean) => MaterialRateAlert[];
  acknowledgeRateAlert: (alertId: string, acknowledgedBy: string) => void;
  
  // Search
  searchMaterials: (companyId: string, query: string, limit?: number) => MaterialSearchResult[];
  
  // Comparison
  compareMaterials: (materialIds: string[]) => MaterialComparison;
  
  // Bulk Import
  importMaterials: (companyId: string, fileName: string, fileType: 'EXCEL' | 'CSV', materials: any[]) => MaterialBulkImport;
  
  // Dashboard
  loadDashboardKPIs: (companyId: string) => void;
  
  // Utility
  getMaterialByCode: (companyId: string, materialCode: string) => MaterialMaster | undefined;
  getMaterialsByCategory: (companyId: string, category: string) => MaterialMaster[];
  getMaterialsByGroup: (companyId: string, group: string) => MaterialMaster[];
}

export const useMaterialStore = create<MaterialState>((set, get) => ({
  // Initial state
  materials: [],
  classifications: [],
  groups: [],
  selectedMaterialId: null,
  selectedMaterial: null,
  dashboardKPIs: null,
  rateAlerts: [],
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
    if (get().typeFilter) filters.materialType = get().typeFilter;
    if (get().categoryFilter) filters.materialCategory = get().categoryFilter;
    if (get().searchQuery) filters.search = get().searchQuery;

    set({
      materials: materialService.getMaterials(companyId, filters),
      classifications: materialService.getClassifications(companyId),
      groups: materialService.getGroups(companyId),
      rateAlerts: materialService.getRateAlerts(),
    });

    const selectedId = get().selectedMaterialId;
    if (selectedId) {
      const material = materialService.getMaterial(selectedId);
      set({ selectedMaterial: material || null });
    }
  },

  // Material actions
  createMaterial: (data) => {
    const material = materialService.createMaterial(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return material;
  },

  getMaterial: (id) => {
    return materialService.getMaterial(id);
  },

  updateMaterial: (id, updates) => {
    materialService.updateMaterial(id, updates);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  blockMaterial: (id, reason) => {
    materialService.blockMaterial(id, reason);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  approveMaterial: (id) => {
    materialService.approveMaterial(id);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Selection
  selectMaterial: (id) => {
    const material = materialService.getMaterial(id);
    set({
      selectedMaterialId: id,
      selectedMaterial: material || null,
    });
  },

  clearSelection: () => {
    set({
      selectedMaterialId: null,
      selectedMaterial: null,
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

  // Classification & Group
  createClassification: (data) => {
    const classification = materialService.createClassification(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return classification;
  },

  getClassifications: (companyId, parentId) => {
    return materialService.getClassifications(companyId, parentId);
  },

  createGroup: (data) => {
    const group = materialService.createGroup(data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return group;
  },

  getGroups: (companyId, parentId) => {
    return materialService.getGroups(companyId, parentId);
  },

  // Documents & Images
  addDocument: (materialId, data) => {
    const doc = materialService.addDocument(materialId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return doc;
  },

  removeDocument: (materialId, documentId) => {
    materialService.removeDocument(materialId, documentId);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  addImage: (materialId, data) => {
    const image = materialService.addImage(materialId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return image;
  },

  removeImage: (materialId, imageId) => {
    materialService.removeImage(materialId, imageId);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Alternatives
  addAlternative: (materialId, data) => {
    const alt = materialService.addAlternative(materialId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return alt;
  },

  getAlternatives: (materialId) => {
    return materialService.getAlternatives(materialId);
  },

  // Approved Materials
  approveMaterialForProject: (data) => {
    const approved = materialService.approveMaterialForProject(data);
    return approved;
  },

  getApprovedMaterialsForProject: (projectId) => {
    return materialService.getApprovedMaterialsForProject(projectId);
  },

  // Rate History
  addRateHistory: (materialId, data) => {
    const rate = materialService.addRateHistory(materialId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return rate;
  },

  getRateHistory: (materialId, rateType) => {
    return materialService.getRateHistory(materialId, rateType);
  },

  // Vendor Links
  linkVendor: (materialId, data) => {
    const link = materialService.linkVendor(materialId, data);
    const companyId = get().selectedCompanyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return link;
  },

  getVendorLinks: (materialId) => {
    return materialService.getVendorLinks(materialId);
  },

  // Rate Alerts
  getRateAlerts: (materialId, isAcknowledged) => {
    return materialService.getRateAlerts(materialId, isAcknowledged);
  },

  acknowledgeRateAlert: (alertId, acknowledgedBy) => {
    materialService.acknowledgeRateAlert(alertId, acknowledgedBy);
    set({ rateAlerts: materialService.getRateAlerts() });
  },

  // Search
  searchMaterials: (companyId, query, limit) => {
    const results = materialService.searchMaterials(companyId, query, limit);
    set({ searchResults: results });
    return results;
  },

  // Comparison
  compareMaterials: (materialIds) => {
    return materialService.compareMaterials(materialIds);
  },

  // Bulk Import
  importMaterials: (companyId, fileName, fileType, materials) => {
    const result = materialService.importMaterials(companyId, fileName, fileType, materials);
    get().refresh(companyId);
    return result;
  },

  // Dashboard
  loadDashboardKPIs: (companyId) => {
    const kpis = materialService.getMaterialDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },

  // Utility
  getMaterialByCode: (companyId, materialCode) => {
    return materialService.getMaterialByCode(companyId, materialCode);
  },

  getMaterialsByCategory: (companyId, category) => {
    return materialService.getMaterialsByCategory(companyId, category);
  },

  getMaterialsByGroup: (companyId, group) => {
    return materialService.getMaterialsByGroup(companyId, group);
  },
}));

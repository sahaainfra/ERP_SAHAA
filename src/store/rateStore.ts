// ============================================================
// BUILDCORE ERP - RATE LIBRARY STORE
// Part 09: Professional Rate Library and Rate Analysis Engine
// ============================================================

import { create } from 'zustand';
import type { RateLibrary, RateItem, Resource, RateAnalysis, Estimate, EstimationDashboardKPIs } from '../types/rate';
import { rateService } from '../services/rateService';

interface RateState {
  rateLibraries: RateLibrary[];
  rateItems: RateItem[];
  resources: Resource[];
  rateAnalyses: RateAnalysis[];
  estimates: Estimate[];
  selectedLibraryId: string | null;
  selectedAnalysisId: string | null;
  dashboardKPIs: EstimationDashboardKPIs | null;
  initialized: boolean;

  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  selectLibrary: (libraryId: string) => void;
  clearSelection: () => void;
  createRateLibrary: (library: any) => void;
  createRateItem: (item: any) => void;
  createResource: (resource: any) => void;
  createRateAnalysis: (analysis: any) => void;
  createEstimate: (estimate: any) => void;
  loadDashboardKPIs: (companyId: string) => void;
}

export const useRateStore = create<RateState>((set, get) => ({
  rateLibraries: [],
  rateItems: [],
  resources: [],
  rateAnalyses: [],
  estimates: [],
  selectedLibraryId: null,
  selectedAnalysisId: null,
  dashboardKPIs: null,
  initialized: false,

  initialize: (companyId: string) => {
    if (get().initialized) return;
    createDemoRateData(companyId);
    get().refresh(companyId);
    set({ initialized: true });
  },

  refresh: (companyId: string) => {
    set({
      rateLibraries: rateService.getRateLibraries(companyId),
      resources: rateService.getResources(companyId),
      rateAnalyses: rateService.getRateAnalyses(companyId),
      estimates: rateService.getEstimates(companyId),
    });
    
    const selectedId = get().selectedLibraryId;
    if (selectedId) {
      set({ rateItems: rateService.getRateItems(selectedId) });
    }
  },

  selectLibrary: (libraryId: string) => {
    set({
      selectedLibraryId: libraryId,
      rateItems: rateService.getRateItems(libraryId),
    });
  },

  clearSelection: () => {
    set({
      selectedLibraryId: null,
      selectedAnalysisId: null,
      rateItems: [],
    });
  },

  createRateLibrary: (library: any) => {
    rateService.createRateLibrary(library);
    const companyId = library.companyId;
    get().refresh(companyId);
  },

  createRateItem: (item: any) => {
    rateService.createRateItem(item);
    const libraryId = item.rateLibraryId;
    set({ rateItems: rateService.getRateItems(libraryId) });
  },

  createResource: (resource: any) => {
    rateService.createResource(resource);
    const companyId = resource.companyId;
    set({ resources: rateService.getResources(companyId) });
  },

  createRateAnalysis: (analysis: any) => {
    rateService.createRateAnalysis(analysis);
    const companyId = analysis.companyId;
    set({ rateAnalyses: rateService.getRateAnalyses(companyId) });
  },

  createEstimate: (estimate: any) => {
    rateService.createEstimate(estimate);
    const companyId = estimate.companyId;
    set({ estimates: rateService.getEstimates(companyId) });
  },

  loadDashboardKPIs: (companyId: string) => {
    const kpis = rateService.getEstimationDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },
}));

// Demo data creation
function createDemoRateData(companyId: string): void {
  const userId = 'usr_001';
  const now = new Date().toISOString();

  // Create rate libraries
  const cpwdLibrary = rateService.createRateLibrary({
    companyId,
    libraryName: 'CPWD DSR 2024',
    authority: 'CPWD',
    publication: 'Delhi Schedule of Rates',
    year: 2024,
    version: '1.0',
    effectiveDate: '2024-04-01',
    state: 'Delhi',
    category: 'DSR',
    status: 'ACTIVE',
    isOfficial: true,
    importedBy: userId,
    importedAt: now,
    createdBy: userId,
    updatedBy: userId,
  });

  const companyLibrary = rateService.createRateLibrary({
    companyId,
    libraryName: 'Company Standard Rates 2024',
    authority: 'COMPANY',
    publication: 'Internal Rate Library',
    year: 2024,
    version: '2.1',
    effectiveDate: '2024-01-01',
    category: 'STANDARD',
    status: 'ACTIVE',
    isOfficial: false,
    createdBy: userId,
    updatedBy: userId,
  });

  // Create resources
  const cement = rateService.createResource({
    companyId,
    resourceCode: 'MAT-CEM-001',
    resourceName: 'OPC Cement 53 Grade',
    resourceType: 'MATERIAL',
    uom: 'BAG',
    description: '53 Grade Ordinary Portland Cement',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  const steel = rateService.createResource({
    companyId,
    resourceCode: 'MAT-STL-001',
    resourceName: 'TMT Steel Fe500',
    resourceType: 'MATERIAL',
    uom: 'MT',
    description: 'Fe500 TMT Steel Bars',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  const mason = rateService.createResource({
    companyId,
    resourceCode: 'LAB-MAS-001',
    resourceName: 'Skilled Mason',
    resourceType: 'LABOUR',
    uom: 'DAY',
    description: 'Skilled Mason for brick work',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  const excavator = rateService.createResource({
    companyId,
    resourceCode: 'PLT-EXC-001',
    resourceName: 'Hydraulic Excavator 20T',
    resourceType: 'PLANT',
    uom: 'DAY',
    description: '20 Ton Hydraulic Excavator',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  // Create rate items
  rateService.createRateItem({
    rateLibraryId: cpwdLibrary.id,
    itemCode: '3.1.1',
    chapter: 'Concrete Work',
    description: 'Cement Concrete M25 grade in foundation',
    specification: 'As per IS 456:2000',
    uom: 'CUM',
    baseRate: 6500,
    effectiveDate: '2024-04-01',
    source: 'CPWD DSR 2024',
    reference: 'Chapter 3, Item 1.1',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  rateService.createRateItem({
    rateLibraryId: cpwdLibrary.id,
    itemCode: '5.2.1',
    chapter: 'Reinforcement',
    description: 'Reinforcement steel for RCC work',
    specification: 'Fe500 TMT bars',
    uom: 'MT',
    baseRate: 65000,
    effectiveDate: '2024-04-01',
    source: 'CPWD DSR 2024',
    reference: 'Chapter 5, Item 2.1',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  rateService.createRateItem({
    rateLibraryId: companyLibrary.id,
    itemCode: 'COMP-EXC-001',
    chapter: 'Earthwork',
    description: 'Excavation in ordinary soil',
    specification: 'Including lead and lift',
    uom: 'CUM',
    baseRate: 280,
    effectiveDate: '2024-01-01',
    source: 'Company Analysis',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });
}

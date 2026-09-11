// ============================================================
// BUILDCORE ERP - TENDER STORE
// Part 08: Complete Tender Management Module
// ============================================================

import { create } from 'zustand';
import type { TenderMaster, TenderDashboardKPIs, TenderCalendarEvent } from '../types/tender';
import { tenderService } from '../services/tenderService';

interface TenderState {
  // Data
  tenders: TenderMaster[];
  selectedTenderId: string | null;
  selectedTender: TenderMaster | null;
  dashboardKPIs: TenderDashboardKPIs | null;
  calendarEvents: TenderCalendarEvent[];
  
  // State
  initialized: boolean;

  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  selectTender: (tenderId: string) => void;
  clearSelection: () => void;
  createTender: (data: Omit<TenderMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateTender: (id: string, updates: Partial<TenderMaster>) => void;
  updateTenderStatus: (id: string, status: TenderMaster['status']) => void;
  loadDashboardKPIs: (companyId: string) => void;
  loadCalendarEvents: (tenderId: string) => void;
}

export const useTenderStore = create<TenderState>((set, get) => ({
  // Initial state
  tenders: [],
  selectedTenderId: null,
  selectedTender: null,
  dashboardKPIs: null,
  calendarEvents: [],
  initialized: false,

  // Initialize
  initialize: (companyId: string) => {
    if (get().initialized) return;
    // Create demo tenders
    createDemoTenders(companyId);
    get().refresh(companyId);
    set({ initialized: true });
  },

  // Refresh data
  refresh: (companyId: string) => {
    set({
      tenders: tenderService.getTenders(companyId),
    });
  },

  // Select tender
  selectTender: (tenderId: string) => {
    const tender = tenderService.getTender(tenderId);
    if (tender) {
      set({ 
        selectedTenderId: tenderId,
        selectedTender: tender,
        calendarEvents: tenderService.getCalendarEvents(tenderId),
      });
    }
  },

  // Clear selection
  clearSelection: () => {
    set({
      selectedTenderId: null,
      selectedTender: null,
      calendarEvents: [],
    });
  },

  // Create tender
  createTender: (data) => {
    const tender = tenderService.createTender(data);
    get().refresh(tender.companyId);
  },

  // Update tender
  updateTender: (id: string, updates: Partial<TenderMaster>) => {
    tenderService.updateTender(id, updates);
    const selectedId = get().selectedTenderId;
    if (selectedId === id) {
      const tender = tenderService.getTender(id);
      set({ selectedTender: tender || null });
    }
    const tender = tenderService.getTender(id);
    if (tender) {
      get().refresh(tender.companyId);
    }
  },

  // Update tender status
  updateTenderStatus: (id: string, status: TenderMaster['status']) => {
    tenderService.updateTenderStatus(id, status);
    const tender = tenderService.getTender(id);
    if (tender) {
      get().refresh(tender.companyId);
      if (get().selectedTenderId === id) {
        set({ selectedTender: tender });
      }
    }
  },

  // Load dashboard KPIs
  loadDashboardKPIs: (companyId: string) => {
    const kpis = tenderService.getDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },

  // Load calendar events
  loadCalendarEvents: (tenderId: string) => {
    const events = tenderService.getCalendarEvents(tenderId);
    set({ calendarEvents: events });
  },
}));

// ============================================================
// DEMO DATA
// ============================================================

function createDemoTenders(companyId: string): void {
  const now = new Date();
  const userId = 'usr_001';

  // Demo Tender 1: NHAI Highway Project
  tenderService.createTender({
    companyId,
    tenderNumber: 'NHAI/2026/001',
    tenderTitle: 'Construction of 4-Lane Highway from Mumbai to Pune',
    client: 'National Highways Authority of India',
    department: 'Ministry of Road Transport & Highways',
    authority: 'NHAI',
    location: 'Mumbai-Pune, Maharashtra',
    tenderType: 'OPEN',
    projectType: 'HIGHWAY',
    estimatedCost: 8500000000,
    pac: 'PA-2026-001',
    tenderFee: 50000,
    emdAmount: 85000000,
    bidSecurity: 85000000,
    performanceSecurity: 425000000,
    publicationDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    documentDownloadDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    prebidDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    queryDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    submissionDeadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    openingDate: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    validityDays: 120,
    status: 'ESTIMATION',
    tenderManagerId: userId,
    tenderManagerName: 'Rajesh Kumar',
    responsibleTeam: ['TENDER_MANAGER', 'ESTIMATOR', 'QS', 'TECHNICAL'],
    description: 'Construction of 4-lane access-controlled highway with design speed of 120 kmph',
    createdBy: userId,
    updatedBy: userId,
  });

  // Demo Tender 2: Metro Rail Project
  tenderService.createTender({
    companyId,
    tenderNumber: 'CMRL/2026/002',
    tenderTitle: 'Chennai Metro Phase 2 - Corridor 4 Underground Works',
    client: 'Chennai Metro Rail Limited',
    department: 'Urban Development',
    authority: 'CMRL',
    location: 'Chennai, Tamil Nadu',
    tenderType: 'OPEN',
    projectType: 'METRO',
    estimatedCost: 12500000000,
    tenderFee: 100000,
    emdAmount: 125000000,
    publicationDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    submissionDeadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    validityDays: 180,
    status: 'ELIGIBILITY_CHECK',
    tenderManagerId: userId,
    tenderManagerName: 'Rajesh Kumar',
    responsibleTeam: ['TENDER_MANAGER', 'ESTIMATOR', 'TECHNICAL', 'CONTRACTS'],
    description: 'Underground metro station and tunnel works for Corridor 4',
    createdBy: userId,
    updatedBy: userId,
  });

  // Demo Tender 3: Bridge Rehabilitation
  tenderService.createTender({
    companyId,
    tenderNumber: 'APPRDL/2026/003',
    tenderTitle: 'Rehabilitation and Strengthening of Godavari Bridge',
    client: 'Andhra Pradesh Road Development Corporation',
    department: 'Roads & Buildings',
    authority: 'APPRDL',
    location: 'Rajahmundry, Andhra Pradesh',
    tenderType: 'LIMITED',
    projectType: 'BRIDGE',
    estimatedCost: 3200000000,
    tenderFee: 25000,
    emdAmount: 32000000,
    publicationDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    submissionDeadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    validityDays: 90,
    status: 'BID_NO_BID',
    tenderManagerId: userId,
    tenderManagerName: 'Rajesh Kumar',
    responsibleTeam: ['TENDER_MANAGER', 'ESTIMATOR', 'TECHNICAL'],
    description: 'Structural rehabilitation and strengthening of existing bridge',
    createdBy: userId,
    updatedBy: userId,
  });

  // Demo Tender 4: Won Project
  tenderService.createTender({
    companyId,
    tenderNumber: 'NHAI/2025/045',
    tenderTitle: 'Widening of NH-48 from Delhi to Jaipur',
    client: 'National Highways Authority of India',
    department: 'Ministry of Road Transport & Highways',
    authority: 'NHAI',
    location: 'Delhi-Jaipur, Rajasthan',
    tenderType: 'OPEN',
    projectType: 'HIGHWAY',
    estimatedCost: 6500000000,
    tenderFee: 50000,
    emdAmount: 65000000,
    publicationDate: new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    submissionDeadline: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    openingDate: new Date(now.getTime() - 59 * 24 * 60 * 60 * 1000).toISOString(),
    validityDays: 120,
    status: 'WON',
    tenderManagerId: userId,
    tenderManagerName: 'Rajesh Kumar',
    responsibleTeam: ['TENDER_MANAGER', 'ESTIMATOR', 'QS', 'TECHNICAL', 'CONTRACTS'],
    description: 'Widening of existing 4-lane to 6-lane highway',
    createdBy: userId,
    updatedBy: userId,
  });

  // Demo Tender 5: Lost Project
  tenderService.createTender({
    companyId,
    tenderNumber: 'MCGM/2025/032',
    tenderTitle: 'Construction of Storm Water Drain in Mumbai',
    client: 'Municipal Corporation of Greater Mumbai',
    department: 'Hydraulic Engineering',
    authority: 'MCGM',
    location: 'Mumbai, Maharashtra',
    tenderType: 'OPEN',
    projectType: 'INFRASTRUCTURE',
    estimatedCost: 2800000000,
    tenderFee: 25000,
    emdAmount: 28000000,
    publicationDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    submissionDeadline: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    openingDate: new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000).toISOString(),
    validityDays: 90,
    status: 'LOST',
    tenderManagerId: userId,
    tenderManagerName: 'Rajesh Kumar',
    responsibleTeam: ['TENDER_MANAGER', 'ESTIMATOR', 'TECHNICAL'],
    description: 'Construction of storm water drain network',
    createdBy: userId,
    updatedBy: userId,
  });
}

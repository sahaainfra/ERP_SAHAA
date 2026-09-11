// ============================================================
// BUILDCORE ERP - BOQ & ESTIMATION STORE
// Part 10: Complete BOQ and Estimation Management System
// ============================================================

import { create } from 'zustand';
import type { BOQMaster, BOQSection, BOQItem, BOQDashboardKPIs } from '../types/boq';
import { boqService } from '../services/boqService';

interface BOQState {
  boqs: BOQMaster[];
  sections: BOQSection[];
  items: BOQItem[];
  selectedBOQId: string | null;
  selectedBOQ: BOQMaster | null;
  dashboardKPIs: BOQDashboardKPIs | null;
  initialized: boolean;

  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  selectBOQ: (boqId: string) => void;
  clearSelection: () => void;
  createBOQ: (boq: any) => void;
  updateBOQ: (id: string, updates: Partial<BOQMaster>) => void;
  freezeBOQ: (id: string, userId: string) => void;
  createSection: (section: any) => void;
  createItem: (item: any) => void;
  updateItem: (id: string, updates: Partial<BOQItem>, userId: string) => void;
  validateBOQ: (boqId: string, userId: string) => void;
  loadDashboardKPIs: (companyId: string) => void;
}

export const useBOQStore = create<BOQState>((set, get) => ({
  boqs: [],
  sections: [],
  items: [],
  selectedBOQId: null,
  selectedBOQ: null,
  dashboardKPIs: null,
  initialized: false,

  initialize: (companyId: string) => {
    if (get().initialized) return;
    createDemoBOQData(companyId);
    get().refresh(companyId);
    set({ initialized: true });
  },

  refresh: (companyId: string) => {
    set({
      boqs: boqService.getBOQs(companyId),
    });
    
    const selectedId = get().selectedBOQId;
    if (selectedId) {
      set({
        sections: boqService.getSections(selectedId),
        items: boqService.getItems(selectedId),
      });
    }
  },

  selectBOQ: (boqId: string) => {
    const boq = boqService.getBOQ(boqId);
    if (boq) {
      set({
        selectedBOQId: boqId,
        selectedBOQ: boq,
        sections: boqService.getSections(boqId),
        items: boqService.getItems(boqId),
      });
    }
  },

  clearSelection: () => {
    set({
      selectedBOQId: null,
      selectedBOQ: null,
      sections: [],
      items: [],
    });
  },

  createBOQ: (boq: any) => {
    boqService.createBOQ(boq);
    const companyId = boq.companyId;
    get().refresh(companyId);
  },

  updateBOQ: (id: string, updates: Partial<BOQMaster>) => {
    boqService.updateBOQ(id, updates);
    const selectedId = get().selectedBOQId;
    if (selectedId === id) {
      const boq = boqService.getBOQ(id);
      set({ selectedBOQ: boq || null });
    }
    const boq = boqService.getBOQ(id);
    if (boq) {
      get().refresh(boq.companyId);
    }
  },

  freezeBOQ: (id: string, userId: string) => {
    boqService.freezeBOQ(id, userId);
    const boq = boqService.getBOQ(id);
    if (boq) {
      get().refresh(boq.companyId);
    }
  },

  createSection: (section: any) => {
    boqService.createSection(section);
    const boqId = section.boqId;
    set({ sections: boqService.getSections(boqId) });
  },

  createItem: (item: any) => {
    boqService.createItem(item);
    const boqId = item.boqId;
    set({ items: boqService.getItems(boqId) });
    const boq = boqService.getBOQ(boqId);
    if (boq) {
      get().refresh(boq.companyId);
    }
  },

  updateItem: (id: string, updates: Partial<BOQItem>, userId: string) => {
    boqService.updateItem(id, updates, userId);
    for (const boq of get().boqs) {
      const items = boqService.getItems(boq.id);
      if (items.find(i => i.id === id)) {
        set({ items });
        get().refresh(boq.companyId);
        break;
      }
    }
  },

  validateBOQ: (boqId: string, userId: string) => {
    boqService.validateBOQ(boqId, userId);
  },

  loadDashboardKPIs: (companyId: string) => {
    const kpis = boqService.getBOQDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },
}));

// Demo data creation
function createDemoBOQData(companyId: string): void {
  const userId = 'usr_001';
  const now = new Date().toISOString();

  // Create BOQ for Mumbai-Pune Expressway
  const boq1 = boqService.createBOQ({
    companyId,
    boqNumber: 'BOQ-MPEW-001',
    projectId: 'proj_001',
    tenderId: 'tender_001',
    revision: 1,
    revisionType: 'ORIGINAL',
    title: 'Mumbai-Pune Expressway Widening - BOQ',
    description: 'Bill of Quantities for 4-lane highway widening',
    status: 'APPROVED',
    approvedBy: userId,
    approvedAt: now,
    createdBy: userId,
    updatedBy: userId,
  });

  // Create sections
  boqService.createSection({
    boqId: boq1.id,
    sectionCode: 'SEC-01',
    sectionName: 'Earthwork',
    description: 'Earthwork including excavation and embankment',
    level: 1,
    sortOrder: 1,
  });

  boqService.createSection({
    boqId: boq1.id,
    sectionCode: 'SEC-02',
    sectionName: 'Concrete Work',
    description: 'RCC work for bridges and structures',
    level: 1,
    sortOrder: 2,
  });

  // Create items
  boqService.createItem({
    boqId: boq1.id,
    sectionId: boqService.getSections(boq1.id)[0]?.id,
    itemNumber: '1.1',
    chapter: 'Earthwork',
    description: 'Excavation in ordinary soil including lead and lift',
    specification: 'As per IS specifications',
    uom: 'CUM',
    quantity: 50000,
    approvedRate: 280,
    rateSource: 'COMPANY_RATE',
    isVariation: false,
    sortOrder: 1,
    createdBy: userId,
    updatedBy: userId,
  });

  boqService.createItem({
    boqId: boq1.id,
    sectionId: boqService.getSections(boq1.id)[0]?.id,
    itemNumber: '1.2',
    chapter: 'Earthwork',
    description: 'Embankment formation including compaction',
    specification: 'As per MORTH specifications',
    uom: 'CUM',
    quantity: 35000,
    approvedRate: 320,
    rateSource: 'CPWD_DSR',
    isVariation: false,
    sortOrder: 2,
    createdBy: userId,
    updatedBy: userId,
  });

  boqService.createItem({
    boqId: boq1.id,
    sectionId: boqService.getSections(boq1.id)[1]?.id,
    itemNumber: '2.1',
    chapter: 'Concrete Work',
    description: 'Cement Concrete M25 grade in foundation',
    specification: 'As per IS 456:2000',
    uom: 'CUM',
    quantity: 2500,
    approvedRate: 6500,
    rateSource: 'CPWD_DSR',
    isVariation: false,
    sortOrder: 1,
    createdBy: userId,
    updatedBy: userId,
  });

  boqService.createItem({
    boqId: boq1.id,
    sectionId: boqService.getSections(boq1.id)[1]?.id,
    itemNumber: '2.2',
    chapter: 'Concrete Work',
    description: 'Reinforcement steel for RCC work',
    specification: 'Fe500 TMT bars',
    uom: 'MT',
    quantity: 150,
    approvedRate: 65000,
    rateSource: 'CPWD_DSR',
    isVariation: false,
    sortOrder: 2,
    createdBy: userId,
    updatedBy: userId,
  });

  // Create second BOQ for Chennai Metro
  const boq2 = boqService.createBOQ({
    companyId,
    boqNumber: 'BOQ-CMR-002',
    projectId: 'proj_002',
    tenderId: 'tender_002',
    revision: 0,
    revisionType: 'ORIGINAL',
    title: 'Chennai Metro Phase 2 - Underground Works BOQ',
    description: 'Bill of Quantities for underground metro station and tunnel works',
    status: 'IN_REVIEW',
    createdBy: userId,
    updatedBy: userId,
  });

  boqService.createSection({
    boqId: boq2.id,
    sectionCode: 'SEC-01',
    sectionName: 'Tunnel Works',
    description: 'Underground tunnel excavation and lining',
    level: 1,
    sortOrder: 1,
  });

  boqService.createItem({
    boqId: boq2.id,
    sectionId: boqService.getSections(boq2.id)[0]?.id,
    itemNumber: '1.1',
    chapter: 'Tunnel Works',
    description: 'Tunnel excavation using TBM',
    specification: 'As per metro specifications',
    uom: 'RM',
    quantity: 5000,
    approvedRate: 125000,
    rateSource: 'COMPANY_RATE',
    isVariation: false,
    sortOrder: 1,
    createdBy: userId,
    updatedBy: userId,
  });
}

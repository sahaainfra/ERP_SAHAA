// ============================================================
// BUILDCORE ERP - BOQ & ESTIMATION SERVICE
// Part 10: Complete BOQ and Estimation Management System
// ============================================================

import type {
  BOQMaster, BOQSection, BOQItem, DetailedEstimate, AbstractEstimate,
  ResourceSummary, CostSummary, BidScenario, BOQDiscount, BOQNegotiation,
  BOQChange, BOQValidation, BOQDashboardKPIs, BOQDocument, ContractConversion
} from '../types/boq';

export class BOQService {
  private static instance: BOQService;

  // Storage
  private boqs: Map<string, BOQMaster> = new Map();
  private sections: Map<string, BOQSection[]> = new Map();
  private items: Map<string, BOQItem[]> = new Map();
  private detailedEstimates: Map<string, DetailedEstimate> = new Map();
  private abstractEstimates: Map<string, AbstractEstimate> = new Map();
  private resourceSummaries: Map<string, ResourceSummary> = new Map();
  private costSummaries: Map<string, CostSummary> = new Map();
  private bidScenarios: Map<string, BidScenario[]> = new Map();
  private discounts: Map<string, BOQDiscount[]> = new Map();
  private negotiations: Map<string, BOQNegotiation> = new Map();
  private changes: Map<string, BOQChange[]> = new Map();
  private validations: Map<string, BOQValidation[]> = new Map();
  private documents: Map<string, BOQDocument[]> = new Map();
  private contractConversions: Map<string, ContractConversion> = new Map();

  private constructor() {}

  static getInstance(): BOQService {
    if (!BOQService.instance) {
      BOQService.instance = new BOQService();
    }
    return BOQService.instance;
  }

  // BOQ Master Operations
  createBOQ(data: any): BOQMaster {
    const now = new Date().toISOString();
    const boq: BOQMaster = {
      ...data,
      id: `boq_${uuidv4()}`,
      totalItems: 0,
      totalQuantity: 0,
      totalAmount: 0,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.boqs.set(boq.id, boq);
    this.sections.set(boq.id, []);
    this.items.set(boq.id, []);
    this.validations.set(boq.id, []);
    this.documents.set(boq.id, []);
    return boq;
  }

  getBOQ(id: string): BOQMaster | undefined {
    return this.boqs.get(id);
  }

  getBOQs(companyId: string, projectId?: string, tenderId?: string): BOQMaster[] {
    let boqs = Array.from(this.boqs.values()).filter(b => b.companyId === companyId);
    if (projectId) boqs = boqs.filter(b => b.projectId === projectId);
    if (tenderId) boqs = boqs.filter(b => b.tenderId === tenderId);
    return boqs;
  }

  updateBOQ(id: string, updates: Partial<BOQMaster>): BOQMaster | null {
    const boq = this.boqs.get(id);
    if (!boq) return null;
    const updated = { ...boq, ...updates, updatedAt: new Date().toISOString(), version: boq.version + 1 };
    this.boqs.set(id, updated);
    return updated;
  }

  freezeBOQ(id: string, userId: string): BOQMaster | null {
    const boq = this.boqs.get(id);
    if (!boq || boq.status !== 'APPROVED') return null;
    const updated = { ...boq, status: 'FROZEN' as const, frozenAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.boqs.set(id, updated);
    return updated;
  }

  // Section Operations
  createSection(data: any): BOQSection {
    const now = new Date().toISOString();
    const section: BOQSection = { ...data, id: `sec_${uuidv4()}`, createdAt: now, updatedAt: now };
    const sections = this.sections.get(data.boqId) || [];
    sections.push(section);
    this.sections.set(data.boqId, sections);
    return section;
  }

  getSections(boqId: string): BOQSection[] {
    return this.sections.get(boqId) || [];
  }

  // Item Operations
  createItem(data: any): BOQItem {
    const now = new Date().toISOString();
    const amount = data.quantity * data.approvedRate;
    const item: BOQItem = { ...data, id: `item_${uuidv4()}`, amount, createdAt: now, updatedAt: now };
    const items = this.items.get(data.boqId) || [];
    items.push(item);
    this.items.set(data.boqId, items);
    this.updateBOQTotals(data.boqId);
    return item;
  }

  getItems(boqId: string, sectionId?: string): BOQItem[] {
    let items = this.items.get(boqId) || [];
    if (sectionId) items = items.filter(i => i.sectionId === sectionId);
    return items;
  }

  updateItem(id: string, updates: Partial<BOQItem>, userId: string): BOQItem | null {
    for (const [boqId, items] of this.items.entries()) {
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        const oldItem = items[index];
        const updated = { ...oldItem, ...updates, updatedAt: new Date().toISOString() };
        if (updates.quantity !== undefined || updates.approvedRate !== undefined) {
          updated.amount = updated.quantity * updated.approvedRate;
        }
        items[index] = updated;
        this.updateBOQTotals(boqId);
        return updated;
      }
    }
    return null;
  }

  private updateBOQTotals(boqId: string): void {
    const items = this.items.get(boqId) || [];
    const boq = this.boqs.get(boqId);
    if (!boq) return;
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
    const updated = { ...boq, totalItems, totalQuantity, totalAmount, updatedAt: new Date().toISOString() };
    this.boqs.set(boqId, updated);
  }

  // Dashboard KPIs
  getBOQDashboardKPIs(companyId: string): BOQDashboardKPIs {
    const boqs = this.getBOQs(companyId);
    const totalBOQs = boqs.length;
    const totalBOQItems = boqs.reduce((sum, b) => sum + b.totalItems, 0);
    const totalBOQValue = boqs.reduce((sum, b) => sum + b.totalAmount, 0);
    const estimatedCost = totalBOQValue * 0.85;
    const margin = totalBOQValue - estimatedCost;
    const marginPercent = totalBOQValue > 0 ? (margin / totalBOQValue) * 100 : 0;
    const revisionCount = boqs.filter(b => b.revision > 0).length;
    const pendingApprovals = boqs.filter(b => b.status === 'IN_REVIEW').length;
    
    let missingRates = 0, validationErrors = 0, validationWarnings = 0;
    boqs.forEach(boq => {
      const validations = this.getValidations(boq.id);
      missingRates += validations.filter(v => v.validationType === 'MISSING_RATE').length;
      validationErrors += validations.filter(v => v.severity === 'ERROR').length;
      validationWarnings += validations.filter(v => v.severity === 'WARNING').length;
    });

    return {
      totalBOQs, totalBOQItems, totalBOQValue, estimatedCost, margin, marginPercent,
      rateVariance: 0, revisionCount, pendingApprovals, missingRates, validationErrors, validationWarnings,
    };
  }

  // Validation Operations
  validateBOQ(boqId: string, userId: string): BOQValidation[] {
    const items = this.items.get(boqId) || [];
    const validations: BOQValidation[] = [];
    const now = new Date();

    items.forEach(item => {
      if (item.quantity < 0) {
        validations.push({
          id: `val_${uuidv4()}`, boqId, itemId: item.id, validationType: 'NEGATIVE_QUANTITY',
          severity: 'ERROR', message: `Negative quantity for item ${item.itemNumber}`,
          field: 'quantity', currentValue: item.quantity, createdAt: now.toISOString(), createdBy: userId,
        });
      }
      if (item.quantity === 0) {
        validations.push({
          id: `val_${uuidv4()}`, boqId, itemId: item.id, validationType: 'ZERO_QUANTITY',
          severity: 'WARNING', message: `Zero quantity for item ${item.itemNumber}`,
          field: 'quantity', currentValue: item.quantity, createdAt: now.toISOString(), createdBy: userId,
        });
      }
      if (item.approvedRate === 0) {
        validations.push({
          id: `val_${uuidv4()}`, boqId, itemId: item.id, validationType: 'MISSING_RATE',
          severity: 'ERROR', message: `Missing rate for item ${item.itemNumber}`,
          field: 'approvedRate', currentValue: item.approvedRate, createdAt: now.toISOString(), createdBy: userId,
        });
      }
    });

    const itemNumbers = items.map(i => i.itemNumber);
    const duplicates = itemNumbers.filter((num, index) => itemNumbers.indexOf(num) !== index);
    if (duplicates.length > 0) {
      validations.push({
        id: `val_${uuidv4()}`, boqId, validationType: 'DUPLICATE_ITEM', severity: 'ERROR',
        message: `Duplicate item numbers found: ${duplicates.join(', ')}`,
        createdAt: now.toISOString(), createdBy: userId,
      });
    }

    this.validations.set(boqId, validations);
    return validations;
  }

  getValidations(boqId: string): BOQValidation[] {
    return this.validations.get(boqId) || [];
  }

  // Contract Conversion
  convertToContract(tenderId: string, boqId: string, estimateId: string, contractId: string, projectId: string, userId: string): ContractConversion {
    const conversion: ContractConversion = {
      id: `conv_${uuidv4()}`, tenderId, boqId, estimateId, contractId, projectId,
      convertedBy: userId, convertedAt: new Date().toISOString(), status: 'COMPLETED',
    };
    this.contractConversions.set(conversion.id, conversion);
    this.freezeBOQ(boqId, userId);
    return conversion;
  }

  getContractConversion(tenderId: string): ContractConversion | undefined {
    return Array.from(this.contractConversions.values()).find(c => c.tenderId === tenderId);
  }
}

// Helper function for UUID generation
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const boqService = BOQService.getInstance();

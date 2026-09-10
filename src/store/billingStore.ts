// ============================================================
// BUILDCORE ERP - BILLING STORE
// Part 22: RA Bill / Client Billing / Subcontractor Billing
// ============================================================

import { create } from 'zustand';
import type {
  Bill,
  BillItem,
  BillDeduction,
  BillTax,
  BillCertification,
  BillPayment,
  EscalationConfig,
  EscalationCalculation,
  DLPTracking,
  RetentionRelease,
  BillDashboardKPIs,
  BillType,
  BillItemCategory,
  DeductionType
} from '../types/billing';
import { billingService } from '../services/billingService';

interface BillingState {
  // Data
  bills: Bill[];
  currentBill: Bill | null;
  escalationConfigs: EscalationConfig[];
  dlpTrackings: DLPTracking[];
  dashboardKPIs: BillDashboardKPIs | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedBillId: string | null;
  
  // Actions
  loadBills: (companyId: string) => void;
  loadBill: (billId: string) => void;
  loadDashboardKPIs: (companyId: string) => void;
  
  createBill: (companyId: string, billType: BillType, projectId: string, billingPeriod: string, createdBy: string) => void;
  addBillItemFromMB: (billId: string, mbItemId: string, itemCategory: BillItemCategory, updatedBy: string) => void;
  updateBillItem: (billId: string, billItemId: string, updates: Partial<BillItem>, updatedBy: string) => void;
  addDeduction: (billId: string, deductionType: DeductionType, description: string, amount: number, reference: string | undefined, updatedBy: string) => void;
  removeDeduction: (billId: string, deductionId: string, updatedBy: string) => void;
  calculateTaxes: (billId: string, taxRate: number, updatedBy: string) => void;
  calculateEscalation: (billItemId: string, escalationConfigId: string) => void;
  submitBill: (billId: string, submittedBy: string) => void;
  certifyBill: (billId: string, certifiedAmount: number, deductedAmount: number, rejectedAmount: number, certificationReference: string, clientRemarks: string | undefined, certifiedBy: string) => void;
  recordPayment: (billId: string, paymentAmount: number, paymentMode: string, transactionReference: string, remarks: string | undefined, processedBy: string) => void;
  
  createDLPTracking: (projectId: string, contractId: string, dlpStartDate: string, dlpEndDate: string, retentionAmount: number) => void;
  releaseRetention: (dlpTrackingId: string, releaseAmount: number, approvalReference: string, approvedBy: string, remarks: string | undefined) => void;
  
  selectBill: (billId: string | null) => void;
  clearError: () => void;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  // Initial state
  bills: [],
  currentBill: null,
  escalationConfigs: [],
  dlpTrackings: [],
  dashboardKPIs: null,
  isLoading: false,
  error: null,
  selectedBillId: null,

  // Load actions
  loadBills: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get all bills and filter by company
      const allBills = Array.from((billingService as any).bills.values()) as Bill[];
      const filteredBills = allBills.filter(b => b.companyId === companyId);
      set({ bills: filteredBills, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load bills', isLoading: false });
    }
  },

  loadBill: (billId: string) => {
    set({ isLoading: true, error: null });
    try {
      const bill = billingService.getBill(billId);
      set({ currentBill: bill || null, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load bill', isLoading: false });
    }
  },

  loadDashboardKPIs: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const kpis = billingService.getDashboardKPIs(companyId);
      set({ dashboardKPIs: kpis, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load dashboard KPIs', isLoading: false });
    }
  },

  // Bill actions
  createBill: (companyId, billType, projectId, billingPeriod, createdBy) => {
    set({ isLoading: true, error: null });
    try {
      const bill = billingService.createBill(companyId, billType, projectId, billingPeriod, createdBy);
      set(state => ({ bills: [...state.bills, bill], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create bill', isLoading: false });
    }
  },

  addBillItemFromMB: (billId, mbItemId, itemCategory, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      const item = billingService.addBillItemFromMB(billId, mbItemId, itemCategory, updatedBy);
      if (item) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to add bill item', isLoading: false });
    }
  },

  updateBillItem: (billId, billItemId, updates, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      const item = billingService.updateBillItem(billId, billItemId, updates, updatedBy);
      if (item) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update bill item', isLoading: false });
    }
  },

  addDeduction: (billId, deductionType, description, amount, reference, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      const deduction = billingService.addDeduction(billId, deductionType, description, amount, reference, updatedBy);
      if (deduction) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to add deduction', isLoading: false });
    }
  },

  removeDeduction: (billId, deductionId, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      const success = billingService.removeDeduction(billId, deductionId, updatedBy);
      if (success) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to remove deduction', isLoading: false });
    }
  },

  calculateTaxes: (billId, taxRate, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      const taxes = billingService.calculateTaxes(billId, taxRate, updatedBy);
      if (taxes) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to calculate taxes', isLoading: false });
    }
  },

  calculateEscalation: (billItemId, escalationConfigId) => {
    set({ isLoading: true, error: null });
    try {
      const calculation = billingService.calculateEscalation(billItemId, escalationConfigId);
      // In real implementation, update bill item with escalated rate
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to calculate escalation', isLoading: false });
    }
  },

  submitBill: (billId, submittedBy) => {
    set({ isLoading: true, error: null });
    try {
      const success = billingService.submitBill(billId, submittedBy);
      if (success) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to submit bill', isLoading: false });
    }
  },

  certifyBill: (billId, certifiedAmount, deductedAmount, rejectedAmount, certificationReference, clientRemarks, certifiedBy) => {
    set({ isLoading: true, error: null });
    try {
      const certification = billingService.certifyBill(
        billId, certifiedAmount, deductedAmount, rejectedAmount,
        certificationReference, clientRemarks, certifiedBy
      );
      if (certification) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to certify bill', isLoading: false });
    }
  },

  recordPayment: (billId, paymentAmount, paymentMode, transactionReference, remarks, processedBy) => {
    set({ isLoading: true, error: null });
    try {
      const payment = billingService.recordPayment(
        billId, paymentAmount, paymentMode, transactionReference, remarks, processedBy
      );
      if (payment) {
        const bill = billingService.getBill(billId);
        set(state => ({
          currentBill: bill || null,
          bills: state.bills.map(b => b.id === billId ? (bill || b) : b),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to record payment', isLoading: false });
    }
  },

  // DLP actions
  createDLPTracking: (projectId, contractId, dlpStartDate, dlpEndDate, retentionAmount) => {
    set({ isLoading: true, error: null });
    try {
      const tracking = billingService.createDLPTracking(
        projectId, contractId, dlpStartDate, dlpEndDate, retentionAmount
      );
      set(state => ({ dlpTrackings: [...state.dlpTrackings, tracking], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create DLP tracking', isLoading: false });
    }
  },

  releaseRetention: (dlpTrackingId, releaseAmount, approvalReference, approvedBy, remarks) => {
    set({ isLoading: true, error: null });
    try {
      const release = billingService.releaseRetention(
        dlpTrackingId, releaseAmount, approvalReference, approvedBy, remarks
      );
      if (release) {
        const tracking = billingService.getDLPTracking(dlpTrackingId);
        set(state => ({
          dlpTrackings: state.dlpTrackings.map(t => t.id === dlpTrackingId ? (tracking || t) : t),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to release retention', isLoading: false });
    }
  },

  // Selection actions
  selectBill: (billId) => {
    set({ selectedBillId: billId });
    if (billId) {
      get().loadBill(billId);
    } else {
      set({ currentBill: null });
    }
  },

  clearError: () => set({ error: null })
}));

// ============================================================
// BUILDCORE ERP - COMMERCIAL MANAGEMENT STORE
// Part 23: Commercial Management / Receivables / Claims
// ============================================================

import { create } from 'zustand';
import type {
  Commercial360View,
  ContractPosition,
  ReceivableAgeing,
  AgeingBucket,
  ReceivableAgeingSummary,
  CollectionPlan,
  FollowUpActivity,
  CommercialCorrespondence,
  Claim,
  CommercialRisk,
  CommercialDashboardKPIs,
  ClaimStatusSummary,
  CollectionPerformanceSummary
} from '../types/commercial';
import { commercialService } from '../services/commercialService';

interface CommercialState {
  // Data
  commercial360View: Commercial360View | null;
  contractPosition: ContractPosition | null;
  ageingBuckets: AgeingBucket[];
  receivableAgeing: ReceivableAgeing[];
  receivableAgeingSummary: ReceivableAgeingSummary[];
  collectionPlans: CollectionPlan[];
  collectionPerformance: CollectionPerformanceSummary | null;
  followUpActivities: FollowUpActivity[];
  correspondences: CommercialCorrespondence[];
  claims: Claim[];
  claimStatusSummary: ClaimStatusSummary[];
  commercialRisks: CommercialRisk[];
  dashboardKPIs: CommercialDashboardKPIs | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedProjectId: string | null;
  
  // Actions
  loadCommercial360View: (projectId: string) => void;
  loadContractPosition: (projectId: string) => void;
  loadAgeingBuckets: (companyId: string) => void;
  createAgeingBucket: (bucket: Omit<AgeingBucket, 'id'>) => void;
  loadReceivableAgeing: (companyId: string) => void;
  loadReceivableAgeingSummary: (companyId: string) => void;
  loadCollectionPlans: (projectId?: string) => void;
  createCollectionPlan: (plan: Omit<CollectionPlan, 'id'>) => void;
  updateCollectionPlan: (id: string, updates: Partial<CollectionPlan>) => void;
  loadCollectionPerformance: (projectId: string) => void;
  loadFollowUpActivities: (projectId?: string, clientId?: string) => void;
  createFollowUpActivity: (activity: Omit<FollowUpActivity, 'id'>) => void;
  updateFollowUpActivity: (id: string, updates: Partial<FollowUpActivity>) => void;
  loadCorrespondences: (projectId?: string, contractId?: string) => void;
  createCorrespondence: (correspondence: Omit<CommercialCorrespondence, 'id'>) => void;
  updateCorrespondence: (id: string, updates: Partial<CommercialCorrespondence>) => void;
  loadClaims: (companyId: string, projectId?: string) => void;
  createClaim: (claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  loadClaimStatusSummary: (companyId: string) => void;
  loadCommercialRisks: (companyId: string, projectId?: string) => void;
  createCommercialRisk: (risk: Omit<CommercialRisk, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCommercialRisk: (id: string, updates: Partial<CommercialRisk>) => void;
  loadCommercialDashboardKPIs: (companyId: string) => void;
  
  setSelectedProject: (projectId: string | null) => void;
  clearError: () => void;
}

export const useCommercialStore = create<CommercialState>((set, get) => ({
  // Initial state
  commercial360View: null,
  contractPosition: null,
  ageingBuckets: [],
  receivableAgeing: [],
  receivableAgeingSummary: [],
  collectionPlans: [],
  collectionPerformance: null,
  followUpActivities: [],
  correspondences: [],
  claims: [],
  claimStatusSummary: [],
  commercialRisks: [],
  dashboardKPIs: null,
  isLoading: false,
  error: null,
  selectedProjectId: null,

  // Load actions
  loadCommercial360View: (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const view = commercialService.getCommercial360View(projectId);
      set({ commercial360View: view, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load commercial 360 view', isLoading: false });
    }
  },

  loadContractPosition: (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const position = commercialService.getContractPosition(projectId);
      set({ contractPosition: position, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load contract position', isLoading: false });
    }
  },

  loadAgeingBuckets: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const buckets = commercialService.getAgeingBuckets(companyId);
      set({ ageingBuckets: buckets, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load ageing buckets', isLoading: false });
    }
  },

  createAgeingBucket: (bucket) => {
    set({ isLoading: true, error: null });
    try {
      const newBucket = commercialService.createAgeingBucket(bucket);
      set(state => ({ ageingBuckets: [...state.ageingBuckets, newBucket], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create ageing bucket', isLoading: false });
    }
  },

  loadReceivableAgeing: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ageing = commercialService.getReceivableAgeing(companyId);
      set({ receivableAgeing: ageing, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load receivable ageing', isLoading: false });
    }
  },

  loadReceivableAgeingSummary: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const summary = commercialService.getReceivableAgeingSummary(companyId);
      set({ receivableAgeingSummary: summary, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load receivable ageing summary', isLoading: false });
    }
  },

  loadCollectionPlans: (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const plans = commercialService.getCollectionPlans(projectId);
      set({ collectionPlans: plans, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load collection plans', isLoading: false });
    }
  },

  createCollectionPlan: (plan) => {
    set({ isLoading: true, error: null });
    try {
      const newPlan = commercialService.createCollectionPlan(plan);
      set(state => ({ collectionPlans: [...state.collectionPlans, newPlan], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create collection plan', isLoading: false });
    }
  },

  updateCollectionPlan: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = commercialService.updateCollectionPlan(id, updates);
      if (updated) {
        set(state => ({
          collectionPlans: state.collectionPlans.map(c => c.id === id ? updated : c),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update collection plan', isLoading: false });
    }
  },

  loadCollectionPerformance: (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const performance = commercialService.getCollectionPerformanceSummary(projectId);
      set({ collectionPerformance: performance, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load collection performance', isLoading: false });
    }
  },

  loadFollowUpActivities: (projectId, clientId) => {
    set({ isLoading: true, error: null });
    try {
      const activities = commercialService.getFollowUpActivities(projectId, clientId);
      set({ followUpActivities: activities, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load follow-up activities', isLoading: false });
    }
  },

  createFollowUpActivity: (activity) => {
    set({ isLoading: true, error: null });
    try {
      const newActivity = commercialService.createFollowUpActivity(activity);
      set(state => ({ followUpActivities: [...state.followUpActivities, newActivity], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create follow-up activity', isLoading: false });
    }
  },

  updateFollowUpActivity: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = commercialService.updateFollowUpActivity(id, updates);
      if (updated) {
        set(state => ({
          followUpActivities: state.followUpActivities.map(a => a.id === id ? updated : a),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update follow-up activity', isLoading: false });
    }
  },

  loadCorrespondences: (projectId, contractId) => {
    set({ isLoading: true, error: null });
    try {
      const correspondences = commercialService.getCorrespondences(projectId, contractId);
      set({ correspondences, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load correspondences', isLoading: false });
    }
  },

  createCorrespondence: (correspondence) => {
    set({ isLoading: true, error: null });
    try {
      const newCorrespondence = commercialService.createCorrespondence(correspondence);
      set(state => ({ correspondences: [...state.correspondences, newCorrespondence], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create correspondence', isLoading: false });
    }
  },

  updateCorrespondence: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = commercialService.updateCorrespondence(id, updates);
      if (updated) {
        set(state => ({
          correspondences: state.correspondences.map(c => c.id === id ? updated : c),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update correspondence', isLoading: false });
    }
  },

  loadClaims: (companyId, projectId) => {
    set({ isLoading: true, error: null });
    try {
      const claims = commercialService.getClaims(companyId, projectId);
      set({ claims, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load claims', isLoading: false });
    }
  },

  createClaim: (claim) => {
    set({ isLoading: true, error: null });
    try {
      const newClaim = commercialService.createClaim(claim);
      set(state => ({ claims: [...state.claims, newClaim], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create claim', isLoading: false });
    }
  },

  updateClaim: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = commercialService.updateClaim(id, updates);
      if (updated) {
        set(state => ({
          claims: state.claims.map(c => c.id === id ? updated : c),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update claim', isLoading: false });
    }
  },

  loadClaimStatusSummary: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const summary = commercialService.getClaimStatusSummary(companyId);
      set({ claimStatusSummary: summary, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load claim status summary', isLoading: false });
    }
  },

  loadCommercialRisks: (companyId, projectId) => {
    set({ isLoading: true, error: null });
    try {
      const risks = commercialService.getCommercialRisks(companyId, projectId);
      set({ commercialRisks: risks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load commercial risks', isLoading: false });
    }
  },

  createCommercialRisk: (risk) => {
    set({ isLoading: true, error: null });
    try {
      const newRisk = commercialService.createCommercialRisk(risk);
      set(state => ({ commercialRisks: [...state.commercialRisks, newRisk], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create commercial risk', isLoading: false });
    }
  },

  updateCommercialRisk: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = commercialService.updateCommercialRisk(id, updates);
      if (updated) {
        set(state => ({
          commercialRisks: state.commercialRisks.map(r => r.id === id ? updated : r),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update commercial risk', isLoading: false });
    }
  },

  loadCommercialDashboardKPIs: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const kpis = commercialService.getCommercialDashboardKPIs(companyId);
      set({ dashboardKPIs: kpis, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load commercial dashboard KPIs', isLoading: false });
    }
  },

  setSelectedProject: (projectId) => {
    set({ selectedProjectId: projectId });
  },

  clearError: () => set({ error: null })
}));

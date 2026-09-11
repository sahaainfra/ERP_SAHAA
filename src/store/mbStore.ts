// ============================================================
// BUILDCORE ERP - MEASUREMENT BOOK STORE
// Part 21: Advanced Measurement Book (MB) / e-MB Module
// ============================================================

import { create } from 'zustand';
import type {
  MeasurementBook,
  MBItem,
  MBDeduction,
  JointMeasurement,
  MBRevision,
  LevelData,
  MBDashboardKPIs,
  MBStatus
} from '../types/mb';
import { mbService } from '../services/mbService';

interface MBState {
  // Data
  mbs: MeasurementBook[];
  currentMB: MeasurementBook | null;
  currentMBItems: MBItem[];
  jointMeasurements: JointMeasurement[];
  revisions: MBRevision[];
  levelData: LevelData[];
  dashboardKPIs: MBDashboardKPIs | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedMBId: string | null;
  selectedMBItemId: string | null;
  
  // Actions
  loadMBs: (companyId: string) => void;
  loadMB: (mbId: string) => void;
  loadMBItems: (mbId: string) => void;
  loadJointMeasurements: (mbId: string) => void;
  loadRevisions: (mbId: string) => void;
  loadLevelData: (mbItemId: string) => void;
  loadDashboardKPIs: (companyId: string) => void;
  
  createMB: (data: Omit<MeasurementBook, 'id' | 'mbNumber' | 'createdAt' | 'updatedAt' | 'status' | 'revision' | 'totalAmount'>) => void;
  updateMB: (id: string, updates: Partial<MeasurementBook>) => void;
  updateMBStatus: (id: string, status: MBStatus, userId: string, userName: string) => void;
  
  addMBItem: (mbId: string, data: Omit<MBItem, 'id' | 'mbId' | 'createdAt' | 'updatedAt' | 'srNo' | 'cumulativeQuantity' | 'balanceQuantity' | 'excessQuantity' | 'amount'>) => void;
  updateMBItem: (id: string, updates: Partial<MBItem>) => void;
  deleteMBItem: (id: string) => void;
  
  addDeduction: (mbItemId: string, data: Omit<MBDeduction, 'id' | 'mbItemId' | 'quantity'>) => void;
  removeDeduction: (mbItemId: string, deductionId: string) => void;
  
  createJointMeasurement: (mbId: string, mbItemId: string, data: Omit<JointMeasurement, 'id' | 'mbId' | 'mbItemId' | 'createdAt' | 'updatedAt'>) => void;
  createRevision: (mbId: string, reason: string, userId: string, userName: string) => void;
  addLevelData: (mbItemId: string, data: Omit<LevelData, 'id' | 'mbItemId'>) => void;
  
  selectMB: (mbId: string | null) => void;
  selectMBItem: (mbItemId: string | null) => void;
  clearError: () => void;
}

export const useMBStore = create<MBState>((set, get) => ({
  // Initial state
  mbs: [],
  currentMB: null,
  currentMBItems: [],
  jointMeasurements: [],
  revisions: [],
  levelData: [],
  dashboardKPIs: null,
  isLoading: false,
  error: null,
  selectedMBId: null,
  selectedMBItemId: null,

  // Load actions
  loadMBs: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const mbs = mbService.getAllMBs(companyId);
      set({ mbs, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load MBs', isLoading: false });
    }
  },

  loadMB: (mbId: string) => {
    set({ isLoading: true, error: null });
    try {
      const mb = mbService.getMB(mbId);
      set({ currentMB: mb, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load MB', isLoading: false });
    }
  },

  loadMBItems: (mbId: string) => {
    set({ isLoading: true, error: null });
    try {
      const items = mbService.getMBItems(mbId);
      set({ currentMBItems: items, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load MB items', isLoading: false });
    }
  },

  loadJointMeasurements: (mbId: string) => {
    set({ isLoading: true, error: null });
    try {
      const measurements = mbService.getJointMeasurements(mbId);
      set({ jointMeasurements: measurements, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load joint measurements', isLoading: false });
    }
  },

  loadRevisions: (mbId: string) => {
    set({ isLoading: true, error: null });
    try {
      const revisions = mbService.getRevisions(mbId);
      set({ revisions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load revisions', isLoading: false });
    }
  },

  loadLevelData: (mbItemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const levelData = mbService.getLevelData(mbItemId);
      set({ levelData, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load level data', isLoading: false });
    }
  },

  loadDashboardKPIs: (companyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const kpis = mbService.getDashboardKPIs(companyId);
      set({ dashboardKPIs: kpis, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load dashboard KPIs', isLoading: false });
    }
  },

  // MB actions
  createMB: (data) => {
    set({ isLoading: true, error: null });
    try {
      const mb = mbService.createMB(data);
      set(state => ({ mbs: [...state.mbs, mb], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create MB', isLoading: false });
    }
  },

  updateMB: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const mb = mbService.updateMB(id, updates);
      if (mb) {
        set(state => ({
          mbs: state.mbs.map(m => m.id === id ? mb : m),
          currentMB: state.currentMB?.id === id ? mb : state.currentMB,
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update MB', isLoading: false });
    }
  },

  updateMBStatus: (id, status, userId, userName) => {
    set({ isLoading: true, error: null });
    try {
      const mb = mbService.updateMBStatus(id, status, userId, userName);
      if (mb) {
        set(state => ({
          mbs: state.mbs.map(m => m.id === id ? mb : m),
          currentMB: state.currentMB?.id === id ? mb : state.currentMB,
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update MB status', isLoading: false });
    }
  },

  // MB Item actions
  addMBItem: (mbId, data) => {
    set({ isLoading: true, error: null });
    try {
      const item = mbService.addMBItem(mbId, data);
      set(state => ({ currentMBItems: [...state.currentMBItems, item], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to add MB item', isLoading: false });
    }
  },

  updateMBItem: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const item = mbService.updateMBItem(id, updates);
      if (item) {
        set(state => ({
          currentMBItems: state.currentMBItems.map(i => i.id === id ? item : i),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update MB item', isLoading: false });
    }
  },

  deleteMBItem: (id) => {
    set({ isLoading: true, error: null });
    try {
      const success = mbService.deleteMBItem(id);
      if (success) {
        set(state => ({
          currentMBItems: state.currentMBItems.filter(i => i.id !== id),
          isLoading: false
        }));
      }
    } catch (error) {
      set({ error: 'Failed to delete MB item', isLoading: false });
    }
  },

  // Deduction actions
  addDeduction: (mbItemId, data) => {
    set({ isLoading: true, error: null });
    try {
      const deduction = mbService.addDeduction(mbItemId, data);
      // Reload MB items to get updated quantities
      const mbId = get().currentMB?.id;
      if (mbId) {
        get().loadMBItems(mbId);
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to add deduction', isLoading: false });
    }
  },

  removeDeduction: (mbItemId, deductionId) => {
    set({ isLoading: true, error: null });
    try {
      const success = mbService.removeDeduction(mbItemId, deductionId);
      if (success) {
        const mbId = get().currentMB?.id;
        if (mbId) {
          get().loadMBItems(mbId);
        }
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to remove deduction', isLoading: false });
    }
  },

  // Joint measurement actions
  createJointMeasurement: (mbId, mbItemId, data) => {
    set({ isLoading: true, error: null });
    try {
      const measurement = mbService.createJointMeasurement(mbId, mbItemId, data);
      set(state => ({ jointMeasurements: [...state.jointMeasurements, measurement], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create joint measurement', isLoading: false });
    }
  },

  // Revision actions
  createRevision: (mbId, reason, userId, userName) => {
    set({ isLoading: true, error: null });
    try {
      const revision = mbService.createRevision(mbId, reason, userId, userName);
      if (revision) {
        set(state => ({ revisions: [...state.revisions, revision], isLoading: false }));
      }
    } catch (error) {
      set({ error: 'Failed to create revision', isLoading: false });
    }
  },

  // Level data actions
  addLevelData: (mbItemId, data) => {
    set({ isLoading: true, error: null });
    try {
      const levelData = mbService.addLevelData(mbItemId, data);
      set(state => ({ levelData: [...state.levelData, levelData], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to add level data', isLoading: false });
    }
  },

  // Selection actions
  selectMB: (mbId) => {
    set({ selectedMBId: mbId });
    if (mbId) {
      get().loadMB(mbId);
      get().loadMBItems(mbId);
      get().loadJointMeasurements(mbId);
      get().loadRevisions(mbId);
    } else {
      set({ currentMB: null, currentMBItems: [], jointMeasurements: [], revisions: [] });
    }
  },

  selectMBItem: (mbItemId) => {
    set({ selectedMBItemId: mbItemId });
    if (mbItemId) {
      get().loadLevelData(mbItemId);
    } else {
      set({ levelData: [] });
    }
  },

  clearError: () => set({ error: null })
}));

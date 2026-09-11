// ============================================================
// BUILDCORE ERP - RMC PLANT MANAGEMENT STORE
// Part 28: RMC Plant / Batching / Mix Design / Concrete Dispatch
// ============================================================

import { create } from 'zustand';
import { rmcService } from '../services/rmcService';
import type {
  RMCPlantMaster,
  RawMaterialBatch,
  MixDesign,
  BatchTicket,
  QCTestRecord,
  DispatchRecord,
  RMCChallan,
  RMCCostBreakdown,
  RMCDashboardKPIs,
  TraceabilityRecord,
  RMCPlantStatus
} from '../types/rmc';

interface RMCStore {
  // State
  plants: RMCPlantMaster[];
  rawMaterialBatches: RawMaterialBatch[];
  mixDesigns: MixDesign[];
  batchTickets: BatchTicket[];
  qcTestRecords: QCTestRecord[];
  dispatchRecords: DispatchRecord[];
  rmcChallans: RMCChallan[];
  costBreakdowns: RMCCostBreakdown[];
  dashboardKPIs: RMCDashboardKPIs | null;

  // Actions
  loadPlants: () => void;
  createPlant: (data: Omit<RMCPlantMaster, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlant: (id: string, updates: Partial<RMCPlantMaster>) => void;
  updatePlantStatus: (id: string, status: RMCPlantStatus) => void;
  
  loadRawMaterialBatches: (materialId?: string) => void;
  createRawMaterialBatch: (data: Omit<RawMaterialBatch, 'id' | 'availableQuantity' | 'createdAt' | 'updatedAt'>) => void;
  consumeRawMaterial: (batchId: string, quantity: number) => boolean;
  
  loadMixDesigns: (grade?: string) => void;
  createMixDesign: (data: Omit<MixDesign, 'id' | 'createdAt' | 'updatedAt' | 'revision'>) => void;
  createMixDesignRevision: (mixDesignId: string, updates: Partial<MixDesign>) => void;
  
  loadBatchTickets: () => void;
  createBatchTicket: (data: Omit<BatchTicket, 'id' | 'batchNumber' | 'producedQuantity' | 'rejectedQuantity' | 'returnedQuantity' | 'wastedQuantity' | 'createdAt' | 'updatedAt'>) => void;
  updateBatchProduction: (batchId: string, produced: number, rejected: number, returned: number, wasted: number) => void;
  updateBatchStatus: (batchId: string, status: BatchTicket['status']) => void;
  
  loadQCTestRecords: (batchId?: string) => void;
  createQCTestRecord: (data: Omit<QCTestRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQCTestResult: (testId: string, updates: Partial<QCTestRecord>) => void;
  
  loadDispatchRecords: () => void;
  createDispatchRecord: (data: Omit<DispatchRecord, 'id' | 'dispatchId' | 'createdAt' | 'updatedAt'>) => void;
  updateDispatchStatus: (dispatchId: string, status: DispatchRecord['status'], arrivalTime?: string, unloadingTime?: string, returnTime?: string) => void;
  
  loadRMCChallans: () => void;
  createRMCChallan: (data: Omit<RMCChallan, 'id' | 'challanNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateRMCChallan: (id: string, updates: Partial<RMCChallan>) => void;
  
  calculateRMCCost: (mixDesignId: string, period: string) => void;
  loadDashboardKPIs: () => void;
  getTraceabilityRecord: (batchId: string) => TraceabilityRecord | undefined;
}

export const useRMCStore = create<RMCStore>((set) => ({
  plants: [],
  rawMaterialBatches: [],
  mixDesigns: [],
  batchTickets: [],
  qcTestRecords: [],
  dispatchRecords: [],
  rmcChallans: [],
  costBreakdowns: [],
  dashboardKPIs: null,

  loadPlants: () => {
    const plants = rmcService.getAllRMCPlants();
    set({ plants });
  },

  createPlant: (data) => {
    const plant = rmcService.createRMCPlant(data);
    set(state => ({ plants: [...state.plants, plant] }));
  },

  updatePlant: (id, updates) => {
    const plant = rmcService.updateRMCPlant(id, updates);
    if (plant) {
      set(state => ({
        plants: state.plants.map(p => p.id === id ? plant : p)
      }));
    }
  },

  updatePlantStatus: (id, status) => {
    rmcService.updatePlantStatus(id, status);
    const plants = rmcService.getAllRMCPlants();
    set({ plants });
  },

  loadRawMaterialBatches: (materialId) => {
    const batches = materialId 
      ? rmcService.getRawMaterialBatchesByMaterial(materialId)
      : rmcService['rawMaterialBatches'] ? Array.from(rmcService['rawMaterialBatches'].values()) : [];
    set({ rawMaterialBatches: batches });
  },

  createRawMaterialBatch: (data) => {
    const batch = rmcService.createRawMaterialBatch(data);
    set(state => ({ rawMaterialBatches: [...state.rawMaterialBatches, batch] }));
  },

  consumeRawMaterial: (batchId, quantity) => {
    const success = rmcService.consumeRawMaterial(batchId, quantity);
    if (success) {
      const batches = rmcService['rawMaterialBatches'] ? Array.from(rmcService['rawMaterialBatches'].values()) : [];
      set({ rawMaterialBatches: batches });
    }
    return success;
  },

  loadMixDesigns: (grade) => {
    const mixDesigns = grade 
      ? rmcService.getMixDesignsByGrade(grade)
      : rmcService.getAllMixDesigns();
    set({ mixDesigns });
  },

  createMixDesign: (data) => {
    const mixDesign = rmcService.createMixDesign(data);
    set(state => ({ mixDesigns: [...state.mixDesigns, mixDesign] }));
  },

  createMixDesignRevision: (mixDesignId, updates) => {
    const mixDesign = rmcService.createMixDesignRevision(mixDesignId, updates);
    if (mixDesign) {
      set(state => ({ mixDesigns: [...state.mixDesigns, mixDesign] }));
    }
  },

  loadBatchTickets: () => {
    const batchTickets = rmcService.getAllBatchTickets();
    set({ batchTickets });
  },

  createBatchTicket: (data) => {
    const batchTicket = rmcService.createBatchTicket(data);
    set(state => ({ batchTickets: [...state.batchTickets, batchTicket] }));
  },

  updateBatchProduction: (batchId, produced, rejected, returned, wasted) => {
    rmcService.updateBatchProduction(batchId, produced, rejected, returned, wasted);
    const batchTickets = rmcService.getAllBatchTickets();
    set({ batchTickets });
  },

  updateBatchStatus: (batchId, status) => {
    rmcService.updateBatchStatus(batchId, status);
    const batchTickets = rmcService.getAllBatchTickets();
    set({ batchTickets });
  },

  loadQCTestRecords: (batchId) => {
    const qcTestRecords = batchId 
      ? rmcService.getQCTestRecordsByBatch(batchId)
      : rmcService.getAllQCTestRecords();
    set({ qcTestRecords });
  },

  createQCTestRecord: (data) => {
    const qcTestRecord = rmcService.createQCTestRecord(data);
    set(state => ({ qcTestRecords: [...state.qcTestRecords, qcTestRecord] }));
  },

  updateQCTestResult: (testId, updates) => {
    rmcService.updateQCTestResult(testId, updates);
    const qcTestRecords = rmcService.getAllQCTestRecords();
    set({ qcTestRecords });
  },

  loadDispatchRecords: () => {
    const dispatchRecords = rmcService.getAllDispatchRecords();
    set({ dispatchRecords });
  },

  createDispatchRecord: (data) => {
    const dispatchRecord = rmcService.createDispatchRecord(data);
    set(state => ({ dispatchRecords: [...state.dispatchRecords, dispatchRecord] }));
  },

  updateDispatchStatus: (dispatchId, status, arrivalTime, unloadingTime, returnTime) => {
    rmcService.updateDispatchStatus(dispatchId, status, arrivalTime, unloadingTime, returnTime);
    const dispatchRecords = rmcService.getAllDispatchRecords();
    set({ dispatchRecords });
  },

  loadRMCChallans: () => {
    const rmcChallans = Array.from(rmcService['rmcChallans']?.values() || []);
    set({ rmcChallans });
  },

  createRMCChallan: (data) => {
    const rmcChallan = rmcService.createRMCChallan(data);
    set(state => ({ rmcChallans: [...state.rmcChallans, rmcChallan] }));
  },

  updateRMCChallan: (id, updates) => {
    rmcService.updateRMCChallan(id, updates);
    const rmcChallans = Array.from(rmcService['rmcChallans']?.values() || []);
    set({ rmcChallans });
  },

  calculateRMCCost: (mixDesignId, period) => {
    const costBreakdown = rmcService.calculateRMCCost(mixDesignId, period);
    set(state => ({ costBreakdowns: [...state.costBreakdowns, costBreakdown] }));
  },

  loadDashboardKPIs: () => {
    const dashboardKPIs = rmcService.getDashboardKPIs();
    set({ dashboardKPIs });
  },

  getTraceabilityRecord: (batchId) => {
    return rmcService.getTraceabilityRecord(batchId);
  },
}));

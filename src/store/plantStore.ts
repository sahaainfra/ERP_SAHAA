// ============================================================
// BUILDCORE ERP - PLANT & MACHINERY STORE
// Part 27: Plant / Machinery / Equipment Management
// ============================================================

import { create } from 'zustand';
import { plantService } from '../services/plantService';
import type {
  PlantMaster,
  PlantAllocation,
  DailyLogbook,
  FuelRecord,
  MaintenanceWorkOrder,
  EquipmentCost,
  PlantDashboardKPIs,
  PlantAlert,
  PlantStatus,
  MaintenanceType,
  MaintenancePriority
} from '../types/plant';

interface PlantStore {
  // State
  plants: PlantMaster[];
  allocations: Map<string, PlantAllocation[]>;
  logbooks: Map<string, DailyLogbook[]>;
  fuelRecords: Map<string, FuelRecord[]>;
  workOrders: MaintenanceWorkOrder[];
  equipmentCosts: Map<string, EquipmentCost[]>;
  dashboardKPIs: PlantDashboardKPIs | null;
  alerts: PlantAlert[];

  // Actions
  loadPlants: () => void;
  createPlant: (data: Omit<PlantMaster, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlant: (id: string, updates: Partial<PlantMaster>) => void;
  
  allocatePlant: (data: Omit<PlantAllocation, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  releasePlant: (allocationId: string) => void;
  
  createLogbookEntry: (data: Omit<DailyLogbook, 'id' | 'createdAt' | 'updatedAt' | 'workingHours'>) => void;
  
  recordFuel: (data: Omit<FuelRecord, 'id' | 'createdAt' | 'amount'>) => void;
  
  createWorkOrder: (data: Omit<MaintenanceWorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber' | 'totalCost' | 'status'>) => void;
  updateWorkOrderStatus: (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED', completionDate?: string) => void;
  
  calculateEquipmentCost: (plantId: string, period: string) => void;
  
  loadDashboardKPIs: () => void;
  generateAlerts: () => void;
  acknowledgeAlert: (alertId: string) => void;
}

export const usePlantStore = create<PlantStore>((set) => ({
  plants: [],
  allocations: new Map(),
  logbooks: new Map(),
  fuelRecords: new Map(),
  workOrders: [],
  equipmentCosts: new Map(),
  dashboardKPIs: null,
  alerts: [],

  loadPlants: () => {
    const plants = plantService.getAllPlants();
    set({ plants });
  },

  createPlant: (data) => {
    plantService.createPlant(data);
    const plants = plantService.getAllPlants();
    set({ plants });
  },

  updatePlant: (id, updates) => {
    plantService.updatePlant(id, updates);
    const plants = plantService.getAllPlants();
    set({ plants });
  },

  allocatePlant: (data) => {
    plantService.allocatePlant(data);
    const plants = plantService.getAllPlants();
    const allocations = new Map(plantService['allocations']);
    set({ plants, allocations });
  },

  releasePlant: (allocationId) => {
    plantService.releasePlant(allocationId);
    const plants = plantService.getAllPlants();
    const allocations = new Map(plantService['allocations']);
    set({ plants, allocations });
  },

  createLogbookEntry: (data) => {
    plantService.createLogbookEntry(data);
    const logbooks = new Map(plantService['logbooks']);
    set({ logbooks });
  },

  recordFuel: (data) => {
    plantService.recordFuel(data);
    const fuelRecords = new Map(plantService['fuelRecords']);
    set({ fuelRecords });
  },

  createWorkOrder: (data) => {
    plantService.createWorkOrder(data);
    const workOrders = plantService.getAllWorkOrders();
    const plants = plantService.getAllPlants();
    set({ workOrders, plants });
  },

  updateWorkOrderStatus: (id, status, completionDate) => {
    plantService.updateWorkOrderStatus(id, status, completionDate);
    const workOrders = plantService.getAllWorkOrders();
    const plants = plantService.getAllPlants();
    set({ workOrders, plants });
  },

  calculateEquipmentCost: (plantId, period) => {
    plantService.calculateEquipmentCost(plantId, period);
    const equipmentCosts = new Map(plantService['equipmentCosts']);
    set({ equipmentCosts });
  },

  loadDashboardKPIs: () => {
    const dashboardKPIs = plantService.getDashboardKPIs();
    set({ dashboardKPIs });
  },

  generateAlerts: () => {
    plantService.generateAlerts();
    const alerts = plantService.getAlerts();
    set({ alerts });
  },

  acknowledgeAlert: (alertId) => {
    plantService.acknowledgeAlert(alertId);
    const alerts = plantService.getAlerts();
    set({ alerts });
  },
}));

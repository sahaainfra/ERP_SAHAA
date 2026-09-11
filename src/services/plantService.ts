// ============================================================
// BUILDCORE ERP - PLANT & MACHINERY SERVICE
// Part 27: Plant / Machinery / Equipment Management
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  PlantMaster,
  PlantAllocation,
  DailyLogbook,
  FuelRecord,
  MaintenanceWorkOrder,
  MaintenancePart,
  EquipmentCost,
  PlantDashboardKPIs,
  PlantAlert,
  PlantStatus,
  MaintenanceType,
  MaintenancePriority
} from '../types/plant';

export class PlantService {
  private plants: Map<string, PlantMaster> = new Map();
  private allocations: Map<string, PlantAllocation[]> = new Map();
  private logbooks: Map<string, DailyLogbook[]> = new Map();
  private fuelRecords: Map<string, FuelRecord[]> = new Map();
  private workOrders: Map<string, MaintenanceWorkOrder> = new Map();
  private equipmentCosts: Map<string, EquipmentCost[]> = new Map();
  private alerts: PlantAlert[] = [];

  // ============================================================
  // PLANT MASTER MANAGEMENT
  // ============================================================

  createPlant(data: Omit<PlantMaster, 'id' | 'createdAt' | 'updatedAt'>): PlantMaster {
    const plant: PlantMaster = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.plants.set(plant.id, plant);
    return plant;
  }

  getPlant(id: string): PlantMaster | undefined {
    return this.plants.get(id);
  }

  getAllPlants(): PlantMaster[] {
    return Array.from(this.plants.values());
  }

  updatePlant(id: string, updates: Partial<PlantMaster>): PlantMaster | undefined {
    const plant = this.plants.get(id);
    if (!plant) return undefined;

    const updated = { ...plant, ...updates, updatedAt: new Date().toISOString() };
    this.plants.set(id, updated);
    return updated;
  }

  // ============================================================
  // PLANT ALLOCATION
  // ============================================================

  allocatePlant(data: Omit<PlantAllocation, 'id' | 'createdAt' | 'updatedAt' | 'status'>): PlantAllocation {
    const allocation: PlantAllocation = {
      ...data,
      id: uuidv4(),
      status: 'ALLOCATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update plant status
    const plant = this.plants.get(data.plantId);
    if (plant) {
      this.updatePlant(data.plantId, {
        status: 'ALLOCATED',
        currentProject: data.projectId,
        currentSite: data.siteId,
      });
    }

    // Add to allocations map
    const existing = this.allocations.get(data.plantId) || [];
    existing.push(allocation);
    this.allocations.set(data.plantId, existing);

    return allocation;
  }

  releasePlant(allocationId: string): void {
    for (const [plantId, allocations] of this.allocations.entries()) {
      const allocation = allocations.find(a => a.id === allocationId);
      if (allocation) {
        allocation.releaseDate = new Date().toISOString();
        allocation.status = 'RELEASED';
        allocation.updatedAt = new Date().toISOString();

        // Update plant status
        const plant = this.plants.get(plantId);
        if (plant) {
          this.updatePlant(plantId, { status: 'AVAILABLE' });
        }
        break;
      }
    }
  }

  getAllocations(plantId: string): PlantAllocation[] {
    return this.allocations.get(plantId) || [];
  }

  // ============================================================
  // DAILY LOGBOOK
  // ============================================================

  createLogbookEntry(data: Omit<DailyLogbook, 'id' | 'createdAt' | 'updatedAt' | 'workingHours'>): DailyLogbook {
    const workingHours = data.closingMeter - data.openingMeter - data.idleHours - data.breakdownHours;
    
    const entry: DailyLogbook = {
      ...data,
      id: uuidv4(),
      workingHours: Math.max(0, workingHours),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const entries = this.logbooks.get(data.plantId) || [];
    entries.push(entry);
    this.logbooks.set(data.plantId, entries);

    return entry;
  }

  getLogbookEntries(plantId: string): DailyLogbook[] {
    return this.logbooks.get(plantId) || [];
  }

  // ============================================================
  // FUEL MANAGEMENT
  // ============================================================

  recordFuel(data: Omit<FuelRecord, 'id' | 'createdAt' | 'amount'>): FuelRecord {
    const amount = data.quantity * data.rate;
    
    const record: FuelRecord = {
      ...data,
      id: uuidv4(),
      amount,
      createdAt: new Date().toISOString(),
    };

    const records = this.fuelRecords.get(data.plantId) || [];
    records.push(record);
    this.fuelRecords.set(data.plantId, records);

    return record;
  }

  getFuelRecords(plantId: string): FuelRecord[] {
    return this.fuelRecords.get(plantId) || [];
  }

  calculateFuelMetrics(plantId: string): {
    totalFuel: number;
    totalCost: number;
    litersPerHour: number;
    costPerHour: number;
  } {
    const records = this.getFuelRecords(plantId);
    const logbooks = this.getLogbookEntries(plantId);

    const totalFuel = records.reduce((sum, r) => sum + r.quantity, 0);
    const totalCost = records.reduce((sum, r) => sum + r.amount, 0);
    const totalHours = logbooks.reduce((sum, l) => sum + l.workingHours, 0);

    return {
      totalFuel,
      totalCost,
      litersPerHour: totalHours > 0 ? totalFuel / totalHours : 0,
      costPerHour: totalHours > 0 ? totalCost / totalHours : 0,
    };
  }

  // ============================================================
  // MAINTENANCE WORK ORDERS
  // ============================================================

  createWorkOrder(data: Omit<MaintenanceWorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber' | 'totalCost' | 'status'>): MaintenanceWorkOrder {
    const workOrderNumber = `WO-${Date.now()}`;
    const partsCost = data.parts.reduce((sum, p) => sum + p.amount, 0);
    const totalCost = data.labourCost + partsCost;

    const workOrder: MaintenanceWorkOrder = {
      ...data,
      id: uuidv4(),
      workOrderNumber,
      totalCost,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workOrders.set(workOrder.id, workOrder);

    // Update plant status if breakdown
    if (data.maintenanceType === 'BREAKDOWN') {
      this.updatePlant(data.plantId, { status: 'BREAKDOWN' });
    }

    return workOrder;
  }

  getWorkOrder(id: string): MaintenanceWorkOrder | undefined {
    return this.workOrders.get(id);
  }

  getAllWorkOrders(): MaintenanceWorkOrder[] {
    return Array.from(this.workOrders.values());
  }

  updateWorkOrderStatus(id: string, status: MaintenanceWorkOrder['status'], completionDate?: string): void {
    const workOrder = this.workOrders.get(id);
    if (workOrder) {
      workOrder.status = status;
      if (completionDate) {
        workOrder.completionDate = completionDate;
      }
      workOrder.updatedAt = new Date().toISOString();

      // Update plant status if maintenance completed
      if (status === 'COMPLETED' && workOrder.maintenanceType === 'BREAKDOWN') {
        this.updatePlant(workOrder.plantId, { status: 'AVAILABLE' });
      }
    }
  }

  // ============================================================
  // EQUIPMENT COST TRACKING
  // ============================================================

  calculateEquipmentCost(plantId: string, period: string): EquipmentCost {
    const fuelRecords = this.getFuelRecords(plantId);
    const workOrders = this.getAllWorkOrders().filter(wo => wo.plantId === plantId);
    const logbooks = this.getLogbookEntries(plantId);

    const fuelCost = fuelRecords.reduce((sum, r) => sum + r.amount, 0);
    const maintenanceCost = workOrders.reduce((sum, wo) => sum + wo.totalCost, 0);
    const workingHours = logbooks.reduce((sum, l) => sum + l.workingHours, 0);
    
    // Calculate costs (simplified - in real system, these would come from various sources)
    const depreciation = 50000; // Monthly depreciation
    const operatorCost = 80000; // Monthly operator cost
    const sparesCost = 25000; // Monthly spares cost
    const hireCost = 0; // Only if hired
    const transportCost = 15000; // Monthly transport cost

    const totalCost = depreciation + fuelCost + operatorCost + maintenanceCost + sparesCost + hireCost + transportCost;
    const workingDays = workingHours / 8; // Assuming 8 hours per day

    const cost: EquipmentCost = {
      id: uuidv4(),
      plantId,
      period,
      depreciation,
      fuelCost,
      operatorCost,
      maintenanceCost,
      sparesCost,
      hireCost,
      transportCost,
      totalCost,
      workingHours,
      costPerHour: workingHours > 0 ? totalCost / workingHours : 0,
      costPerDay: workingDays > 0 ? totalCost / workingDays : 0,
      createdAt: new Date().toISOString(),
    };

    const costs = this.equipmentCosts.get(plantId) || [];
    costs.push(cost);
    this.equipmentCosts.set(plantId, costs);

    return cost;
  }

  getEquipmentCosts(plantId: string): EquipmentCost[] {
    return this.equipmentCosts.get(plantId) || [];
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getDashboardKPIs(): PlantDashboardKPIs {
    const plants = this.getAllPlants();
    
    const totalEquipment = plants.length;
    const available = plants.filter(p => p.status === 'AVAILABLE' || p.status === 'ALLOCATED').length;
    const working = plants.filter(p => p.status === 'OPERATING').length;
    const idle = plants.filter(p => p.status === 'IDLE').length;
    const breakdown = plants.filter(p => p.status === 'BREAKDOWN').length;
    const maintenance = plants.filter(p => p.status === 'MAINTENANCE').length;

    // Calculate utilization
    const utilization = totalEquipment > 0 ? (working / totalEquipment) * 100 : 0;

    // Calculate total fuel consumption
    let totalFuel = 0;
    plants.forEach(plant => {
      const metrics = this.calculateFuelMetrics(plant.id);
      totalFuel += metrics.totalFuel;
    });

    // Calculate total maintenance cost
    let maintenanceCost = 0;
    const workOrders = this.getAllWorkOrders();
    workOrders.forEach(wo => {
      maintenanceCost += wo.totalCost;
    });

    return {
      totalEquipment,
      available,
      working,
      idle,
      breakdown,
      maintenance,
      utilization,
      totalFuel,
      maintenanceCost,
    };
  }

  // ============================================================
  // ALERT GENERATION
  // ============================================================

  generateAlerts(): void {
    const plants = this.getAllPlants();
    const now = new Date();

    plants.forEach(plant => {
      // Check maintenance due (if no maintenance in last 30 days)
      const workOrders = this.getAllWorkOrders().filter(wo => wo.plantId === plant.id);
      const lastMaintenance = workOrders
        .filter(wo => wo.status === 'COMPLETED')
        .sort((a, b) => new Date(b.completionDate || 0).getTime() - new Date(a.completionDate || 0).getTime())[0];

      if (!lastMaintenance || this.daysBetween(new Date(lastMaintenance.completionDate || 0), now) > 30) {
        this.createAlert({
          alertType: 'MAINTENANCE_DUE',
          plantId: plant.id,
          message: `Maintenance due for ${plant.make} ${plant.model} (${plant.assetId})`,
          severity: 'MEDIUM',
        });
      }

      // Check insurance expiry
      if (plant.insuranceExpiry) {
        const daysUntilExpiry = this.daysBetween(now, new Date(plant.insuranceExpiry));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          this.createAlert({
            alertType: 'INSURANCE_EXPIRY',
            plantId: plant.id,
            message: `Insurance expires in ${daysUntilExpiry} days for ${plant.assetId}`,
            severity: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
          });
        }
      }

      // Check registration expiry
      if (plant.registrationExpiry) {
        const daysUntilExpiry = this.daysBetween(now, new Date(plant.registrationExpiry));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          this.createAlert({
            alertType: 'REGISTRATION_EXPIRY',
            plantId: plant.id,
            message: `Registration expires in ${daysUntilExpiry} days for ${plant.assetId}`,
            severity: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
          });
        }
      }

      // Check calibration
      if (plant.nextCalibration) {
        const daysUntilCalibration = this.daysBetween(now, new Date(plant.nextCalibration));
        if (daysUntilCalibration <= 30 && daysUntilCalibration > 0) {
          this.createAlert({
            alertType: 'CALIBRATION',
            plantId: plant.id,
            message: `Calibration due in ${daysUntilCalibration} days for ${plant.assetId}`,
            severity: daysUntilCalibration <= 7 ? 'HIGH' : 'MEDIUM',
          });
        }
      }

      // Check excess fuel consumption
      const fuelMetrics = this.calculateFuelMetrics(plant.id);
      if (fuelMetrics.litersPerHour > 15) { // Assuming 15 L/hr is excessive
        this.createAlert({
          alertType: 'EXCESS_FUEL',
          plantId: plant.id,
          message: `Excess fuel consumption: ${fuelMetrics.litersPerHour.toFixed(2)} L/hr for ${plant.assetId}`,
          severity: 'MEDIUM',
        });
      }

      // Check low utilization
      const allocations = this.getAllocations(plant.id);
      const activeAllocation = allocations.find(a => a.status === 'ALLOCATED');
      if (activeAllocation) {
        const logbooks = this.getLogbookEntries(plant.id);
        const totalHours = logbooks.reduce((sum, l) => sum + l.workingHours, 0);
        const daysSinceAllocation = this.daysBetween(new Date(activeAllocation.allocationDate), now);
        const utilization = daysSinceAllocation > 0 ? (totalHours / (daysSinceAllocation * 8)) * 100 : 0;
        
        if (utilization < 50 && daysSinceAllocation > 7) {
          this.createAlert({
            alertType: 'LOW_UTILIZATION',
            plantId: plant.id,
            message: `Low utilization: ${utilization.toFixed(1)}% for ${plant.assetId}`,
            severity: 'MEDIUM',
          });
        }
      }

      // Check breakdown
      if (plant.status === 'BREAKDOWN') {
        this.createAlert({
          alertType: 'BREAKDOWN',
          plantId: plant.id,
          message: `Equipment breakdown: ${plant.assetId}`,
          severity: 'CRITICAL',
        });
      }

      // Check idle equipment
      if (plant.status === 'IDLE') {
        this.createAlert({
          alertType: 'IDLE_EQUIPMENT',
          plantId: plant.id,
          message: `Equipment idle: ${plant.assetId}`,
          severity: 'LOW',
        });
      }
    });
  }

  private createAlert(alert: Omit<PlantAlert, 'id' | 'createdAt' | 'acknowledged'>): void {
    this.alerts.push({
      ...alert,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      acknowledged: false,
    });
  }

  getAlerts(): PlantAlert[] {
    return this.alerts;
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  private daysBetween(date1: Date, date2: Date): number {
    return Math.floor(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export const plantService = new PlantService();

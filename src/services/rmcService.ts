// ============================================================
// BUILDCORE ERP - RMC PLANT MANAGEMENT SERVICE
// Part 28: RMC Plant / Batching / Mix Design / Concrete Dispatch
// ============================================================

import { v4 as uuidv4 } from 'uuid';
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

export class RMCService {
  private static instance: RMCService;
  
  private plants: Map<string, RMCPlantMaster> = new Map();
  private rawMaterialBatches: Map<string, RawMaterialBatch> = new Map();
  private mixDesigns: Map<string, MixDesign> = new Map();
  private batchTickets: Map<string, BatchTicket> = new Map();
  private qcTestRecords: Map<string, QCTestRecord> = new Map();
  private dispatchRecords: Map<string, DispatchRecord> = new Map();
  private rmcChallans: Map<string, RMCChallan> = new Map();
  private costBreakdowns: Map<string, RMCCostBreakdown> = new Map();

  private constructor() {}

  static getInstance(): RMCService {
    if (!RMCService.instance) {
      RMCService.instance = new RMCService();
    }
    return RMCService.instance;
  }

  // ============================================================
  // RMC PLANT MASTER
  // ============================================================

  createRMCPlant(data: Omit<RMCPlantMaster, 'id' | 'createdAt' | 'updatedAt'>): RMCPlantMaster {
    const plant: RMCPlantMaster = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.plants.set(plant.id, plant);
    return plant;
  }

  getRMCPlant(id: string): RMCPlantMaster | undefined {
    return this.plants.get(id);
  }

  getAllRMCPlants(): RMCPlantMaster[] {
    return Array.from(this.plants.values());
  }

  updateRMCPlant(id: string, updates: Partial<RMCPlantMaster>): RMCPlantMaster | undefined {
    const plant = this.plants.get(id);
    if (!plant) return undefined;

    const updated = { ...plant, ...updates, updatedAt: new Date().toISOString() };
    this.plants.set(id, updated);
    return updated;
  }

  updatePlantStatus(id: string, status: RMCPlantStatus): void {
    const plant = this.plants.get(id);
    if (plant) {
      plant.status = status;
      plant.updatedAt = new Date().toISOString();
    }
  }

  // ============================================================
  // RAW MATERIAL BATCH
  // ============================================================

  createRawMaterialBatch(data: Omit<RawMaterialBatch, 'id' | 'availableQuantity' | 'createdAt' | 'updatedAt'>): RawMaterialBatch {
    const batch: RawMaterialBatch = {
      ...data,
      id: uuidv4(),
      availableQuantity: data.quantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rawMaterialBatches.set(batch.id, batch);
    return batch;
  }

  getRawMaterialBatch(id: string): RawMaterialBatch | undefined {
    return this.rawMaterialBatches.get(id);
  }

  getRawMaterialBatchesByMaterial(materialId: string): RawMaterialBatch[] {
    return Array.from(this.rawMaterialBatches.values()).filter(b => b.materialId === materialId);
  }

  consumeRawMaterial(batchId: string, quantity: number): boolean {
    const batch = this.rawMaterialBatches.get(batchId);
    if (!batch || batch.availableQuantity < quantity) {
      return false;
    }

    batch.availableQuantity -= quantity;
    batch.updatedAt = new Date().toISOString();
    return true;
  }

  // ============================================================
  // MIX DESIGN LIBRARY
  // ============================================================

  createMixDesign(data: Omit<MixDesign, 'id' | 'createdAt' | 'updatedAt' | 'revision'>): MixDesign {
    const mixDesign: MixDesign = {
      ...data,
      id: uuidv4(),
      revision: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mixDesigns.set(mixDesign.id, mixDesign);
    return mixDesign;
  }

  getMixDesign(id: string): MixDesign | undefined {
    return this.mixDesigns.get(id);
  }

  getMixDesignsByGrade(grade: string): MixDesign[] {
    return Array.from(this.mixDesigns.values()).filter(m => m.grade === grade);
  }

  getActiveMixDesign(mixDesignId: string): MixDesign | undefined {
    const mixDesign = this.mixDesigns.get(mixDesignId);
    if (!mixDesign) return undefined;
    
    const now = new Date();
    const validFrom = new Date(mixDesign.validFrom);
    const validTo = mixDesign.validTo ? new Date(mixDesign.validTo) : null;

    if (now >= validFrom && (!validTo || now <= validTo)) {
      return mixDesign;
    }
    return undefined;
  }

  createMixDesignRevision(mixDesignId: string, updates: Partial<MixDesign>): MixDesign | undefined {
    const existing = this.mixDesigns.get(mixDesignId);
    if (!existing) return undefined;

    // Mark old version as expired
    existing.validTo = new Date().toISOString();
    existing.updatedAt = new Date().toISOString();

    // Create new revision
    const newRevision: MixDesign = {
      ...existing,
      ...updates,
      id: uuidv4(),
      revision: existing.revision + 1,
      validFrom: new Date().toISOString(),
      validTo: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mixDesigns.set(newRevision.id, newRevision);
    return newRevision;
  }

  // ============================================================
  // BATCH TICKET
  // ============================================================

  createBatchTicket(data: Omit<BatchTicket, 'id' | 'batchNumber' | 'producedQuantity' | 'rejectedQuantity' | 'returnedQuantity' | 'wastedQuantity' | 'createdAt' | 'updatedAt'>): BatchTicket {
    const batchNumber = `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const batchTicket: BatchTicket = {
      ...data,
      id: uuidv4(),
      batchNumber,
      producedQuantity: 0,
      rejectedQuantity: 0,
      returnedQuantity: 0,
      wastedQuantity: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.batchTickets.set(batchTicket.id, batchTicket);
    return batchTicket;
  }

  getBatchTicket(id: string): BatchTicket | undefined {
    return this.batchTickets.get(id);
  }

  getBatchTicketByNumber(batchNumber: string): BatchTicket | undefined {
    return Array.from(this.batchTickets.values()).find(b => b.batchNumber === batchNumber);
  }

  updateBatchProduction(batchId: string, produced: number, rejected: number, returned: number, wasted: number): void {
    const batch = this.batchTickets.get(batchId);
    if (batch) {
      batch.producedQuantity = produced;
      batch.rejectedQuantity = rejected;
      batch.returnedQuantity = returned;
      batch.wastedQuantity = wasted;
      batch.updatedAt = new Date().toISOString();
    }
  }

  updateBatchStatus(batchId: string, status: BatchTicket['status']): void {
    const batch = this.batchTickets.get(batchId);
    if (batch) {
      batch.status = status;
      batch.updatedAt = new Date().toISOString();
    }
  }

  // ============================================================
  // QC TEST RECORD
  // ============================================================

  createQCTestRecord(data: Omit<QCTestRecord, 'id' | 'createdAt' | 'updatedAt'>): QCTestRecord {
    const record: QCTestRecord = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.qcTestRecords.set(record.id, record);
    return record;
  }

  getQCTestRecord(id: string): QCTestRecord | undefined {
    return this.qcTestRecords.get(id);
  }

  getQCTestRecordsByBatch(batchId: string): QCTestRecord[] {
    return Array.from(this.qcTestRecords.values()).filter(r => r.batchId === batchId);
  }

  updateQCTestResult(testId: string, updates: Partial<QCTestRecord>): void {
    const record = this.qcTestRecords.get(testId);
    if (record) {
      Object.assign(record, updates);
      record.updatedAt = new Date().toISOString();
    }
  }

  // ============================================================
  // DISPATCH RECORD
  // ============================================================

  createDispatchRecord(data: Omit<DispatchRecord, 'id' | 'dispatchId' | 'createdAt' | 'updatedAt'>): DispatchRecord {
    const dispatchId = `DISP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const record: DispatchRecord = {
      ...data,
      id: uuidv4(),
      dispatchId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.dispatchRecords.set(record.id, record);

    // Update batch status
    this.updateBatchStatus(record.batchId, 'DISPATCHED');

    return record;
  }

  getDispatchRecord(id: string): DispatchRecord | undefined {
    return this.dispatchRecords.get(id);
  }

  getDispatchRecordByDispatchId(dispatchId: string): DispatchRecord | undefined {
    return Array.from(this.dispatchRecords.values()).find(d => d.dispatchId === dispatchId);
  }

  updateDispatchStatus(dispatchId: string, status: DispatchRecord['status'], arrivalTime?: string, unloadingTime?: string, returnTime?: string): void {
    const record = this.dispatchRecords.get(dispatchId);
    if (record) {
      record.status = status;
      if (arrivalTime) record.arrivalTime = arrivalTime;
      if (unloadingTime) record.unloadingTime = unloadingTime;
      if (returnTime) record.returnTime = returnTime;
      record.updatedAt = new Date().toISOString();

      // Update batch status based on dispatch status
      if (status === 'DELIVERED') {
        this.updateBatchStatus(record.batchId, 'DELIVERED');
      } else if (status === 'RETURNED') {
        this.updateBatchStatus(record.batchId, 'RETURNED');
      }
    }
  }

  // ============================================================
  // RMC DELIVERY CHALLAN
  // ============================================================

  createRMCChallan(data: Omit<RMCChallan, 'id' | 'challanNumber' | 'createdAt' | 'updatedAt'>): RMCChallan {
    const challanNumber = `CHALLAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const challan: RMCChallan = {
      ...data,
      id: uuidv4(),
      challanNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.rmcChallans.set(challan.id, challan);
    return challan;
  }

  getRMCChallan(id: string): RMCChallan | undefined {
    return this.rmcChallans.get(id);
  }

  getRMCChallanByNumber(challanNumber: string): RMCChallan | undefined {
    return Array.from(this.rmcChallans.values()).find(c => c.challanNumber === challanNumber);
  }

  updateRMCChallan(id: string, updates: Partial<RMCChallan>): void {
    const challan = this.rmcChallans.get(id);
    if (challan) {
      Object.assign(challan, updates);
      challan.updatedAt = new Date().toISOString();
    }
  }

  // ============================================================
  // RMC COST BREAKDOWN
  // ============================================================

  calculateRMCCost(mixDesignId: string, period: string): RMCCostBreakdown {
    const mixDesign = this.getMixDesign(mixDesignId);
    if (!mixDesign) {
      throw new Error('Mix design not found');
    }

    // Calculate material costs (assuming rates from material master)
    const cementCost = mixDesign.cement * 8; // ₹8/kg
    const scmCost = mixDesign.scm * 5; // ₹5/kg
    const aggregate20mmCost = mixDesign.aggregate20mm * 1.2; // ₹1.2/kg
    const aggregate12mmCost = mixDesign.aggregate12mm * 1.3; // ₹1.3/kg
    const sandCost = mixDesign.sand * 1.5; // ₹1.5/kg
    const admixtureCost = mixDesign.admixture * 150; // ₹150/liter
    const waterCost = mixDesign.water * 0.05; // ₹0.05/liter

    // Fixed costs per m³
    const labourCost = 150; // ₹150/m³
    const electricityCost = 80; // ₹80/m³
    const plantCost = 120; // ₹120/m³
    const transportCost = 200; // ₹200/m³ (average)
    const wastageCost = 50; // ₹50/m³

    const totalCost = cementCost + scmCost + aggregate20mmCost + aggregate12mmCost + 
                     sandCost + admixtureCost + waterCost + labourCost + 
                     electricityCost + plantCost + transportCost + wastageCost;

    const costBreakdown: RMCCostBreakdown = {
      id: uuidv4(),
      mixDesignId,
      period,
      cementCost,
      scmCost,
      aggregate20mmCost,
      aggregate12mmCost,
      sandCost,
      admixtureCost,
      waterCost,
      labourCost,
      electricityCost,
      plantCost,
      transportCost,
      wastageCost,
      totalCost,
      costPerM3: totalCost,
      createdAt: new Date().toISOString(),
    };

    this.costBreakdowns.set(costBreakdown.id, costBreakdown);
    return costBreakdown;
  }

  getCostBreakdown(id: string): RMCCostBreakdown | undefined {
    return this.costBreakdowns.get(id);
  }

  getCostBreakdownsByMixDesign(mixDesignId: string): RMCCostBreakdown[] {
    return Array.from(this.costBreakdowns.values()).filter(c => c.mixDesignId === mixDesignId);
  }

  // ============================================================
  // TRACEABILITY
  // ============================================================

  getTraceabilityRecord(batchId: string): TraceabilityRecord | undefined {
    const batch = this.batchTickets.get(batchId);
    if (!batch) return undefined;

    const mixDesign = this.mixDesigns.get(batch.mixDesignId);
    if (!mixDesign) return undefined;

    // Get QC test records
    const qcRecords = this.getQCTestRecordsByBatch(batchId);

    // Get dispatch info
    const dispatch = Array.from(this.dispatchRecords.values()).find(d => d.batchId === batchId);

    // Get raw material batches (simplified - in real system, this would be tracked per batch)
    const rawMaterials = [
      {
        materialId: 'MAT001',
        materialName: 'Cement',
        batchNumber: 'BATCH-CEM-001',
        grnNumber: 'GRN-001',
        vendorName: 'UltraTech Cement',
        quantity: batch.materialWeights.cement,
        qcCertificateId: 'QC-CEM-001',
      },
      {
        materialId: 'MAT002',
        materialName: 'Sand',
        batchNumber: 'BATCH-SAND-001',
        grnNumber: 'GRN-002',
        vendorName: 'Local Supplier',
        quantity: batch.materialWeights.sand,
        qcCertificateId: 'QC-SAND-001',
      },
      {
        materialId: 'MAT003',
        materialName: 'Aggregate 20mm',
        batchNumber: 'BATCH-AGG20-001',
        grnNumber: 'GRN-003',
        vendorName: 'Local Quarry',
        quantity: batch.materialWeights.aggregate20mm,
        qcCertificateId: 'QC-AGG20-001',
      },
    ];

    const traceability: TraceabilityRecord = {
      batchId,
      batchNumber: batch.batchNumber,
      mixDesign: {
        id: mixDesign.id,
        grade: mixDesign.grade,
        revision: mixDesign.revision,
      },
      rawMaterials,
      qcResults: qcRecords.map(qc => ({
        testId: qc.id,
        testType: qc.sampleType,
        result: qc.sevenDayResult || qc.twentyEightDayResult || qc.slumpResult || 0,
        passFail: qc.passFail,
        testDate: qc.testDate || qc.castingDate,
      })),
      dispatchInfo: dispatch ? {
        dispatchId: dispatch.dispatchId,
        projectId: dispatch.projectId,
        projectName: 'Project Name', // Would fetch from project master
        quantity: dispatch.quantity,
        dispatchTime: dispatch.departureTime,
        deliveryTime: dispatch.arrivalTime,
      } : undefined,
    };

    return traceability;
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getDashboardKPIs(): RMCDashboardKPIs {
    const allBatches = Array.from(this.batchTickets.values());
    const allDispatches = Array.from(this.dispatchRecords.values());

    const today = new Date().toISOString().split('T')[0];

    const totalProduction = allBatches.reduce((sum, b) => sum + b.producedQuantity, 0);
    const totalDispatch = allDispatches.reduce((sum, d) => sum + d.quantity, 0);
    const totalDelivery = allDispatches.filter(d => d.status === 'DELIVERED').reduce((sum, d) => sum + d.quantity, 0);
    const totalRejection = allBatches.reduce((sum, b) => sum + b.rejectedQuantity, 0);
    const totalWastage = allBatches.reduce((sum, b) => sum + b.wastedQuantity, 0);

    // Calculate average cost per m³
    const allCosts = Array.from(this.costBreakdowns.values());
    const averageCostPerM3 = allCosts.length > 0 
      ? allCosts.reduce((sum, c) => sum + c.costPerM3, 0) / allCosts.length 
      : 0;

    // Calculate QC pass rate
    const allQCTests = Array.from(this.qcTestRecords.values());
    const passedTests = allQCTests.filter(qc => qc.passFail === 'PASS').length;
    const qcPassRate = allQCTests.length > 0 ? (passedTests / allQCTests.length) * 100 : 0;

    // Calculate plant utilization (simplified)
    const activePlants = Array.from(this.plants.values()).filter(p => p.status === 'OPERATIONAL').length;
    const totalPlants = this.plants.size;
    const plantUtilization = totalPlants > 0 ? (activePlants / totalPlants) * 100 : 0;

    // Today's production and dispatch
    const todayProduction = allBatches
      .filter(b => b.createdAt.startsWith(today))
      .reduce((sum, b) => sum + b.producedQuantity, 0);

    const todayDispatch = allDispatches
      .filter(d => d.createdAt.startsWith(today))
      .reduce((sum, d) => sum + d.quantity, 0);

    // Pending deliveries
    const pendingDeliveries = allDispatches.filter(d => d.status === 'DISPATCHED' || d.status === 'IN_TRANSIT').length;

    // Active batches (produced but not yet delivered)
    const activeBatches = allBatches.filter(b => b.status === 'PRODUCED' || b.status === 'DISPATCHED').length;

    return {
      totalProduction,
      totalDispatch,
      totalDelivery,
      totalRejection,
      totalWastage,
      averageCostPerM3,
      qcPassRate,
      plantUtilization,
      todayProduction,
      todayDispatch,
      pendingDeliveries,
      activeBatches,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  getAllMixDesigns(): MixDesign[] {
    return Array.from(this.mixDesigns.values());
  }

  getAllBatchTickets(): BatchTicket[] {
    return Array.from(this.batchTickets.values());
  }

  getAllDispatchRecords(): DispatchRecord[] {
    return Array.from(this.dispatchRecords.values());
  }

  getAllQCTestRecords(): QCTestRecord[] {
    return Array.from(this.qcTestRecords.values());
  }
}

export const rmcService = RMCService.getInstance();

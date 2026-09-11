// ============================================================
// BUILDCORE ERP - RMC PLANT MANAGEMENT TYPES
// Part 28: RMC Plant / Batching / Mix Design / Concrete Dispatch
// ============================================================

export type RMCPlantStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'BREAKDOWN' | 'CALIBRATION' | 'IDLE';

// ============================================================
// RMC PLANT MASTER
// ============================================================
export interface RMCPlantMaster {
  id: string;
  plantId: string;
  plantName: string;
  location: string;
  capacity: number; // m³/hour
  manufacturer: string;
  status: RMCPlantStatus;
  lastCalibration?: string;
  nextCalibration?: string;
  manager?: string;
  projectId?: string;
  costCentre?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// RAW MATERIAL BATCH
// ============================================================
export interface RawMaterialBatch {
  id: string;
  materialId: string;
  batchNumber: string;
  grnId?: string;
  vendorId?: string;
  quantity: number;
  availableQuantity: number;
  qcStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  testCertificateId?: string;
  receiptDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// MIX DESIGN LIBRARY
// ============================================================
export interface MixDesign {
  id: string;
  mixDesignId: string;
  grade: string; // M20, M25, M30, etc.
  exposure: 'MILD' | 'MODERATE' | 'SEVERE' | 'VERY_SEVERE' | 'EXTREME';
  cement: number; // kg/m³
  scm: number; // Supplementary Cementitious Material (kg/m³)
  aggregate20mm: number; // kg/m³
  aggregate12mm: number; // kg/m³
  sand: number; // kg/m³
  water: number; // liters/m³
  admixture: number; // liters/m³
  waterCementRatio: number;
  slump: number; // mm
  targetStrength: number; // MPa (28-day)
  approvedBy?: string;
  revision: number;
  validFrom: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// BATCH TICKET
// ============================================================
export interface BatchTicket {
  id: string;
  batchNumber: string;
  mixDesignId: string;
  mixDesignRevision: number;
  plannedQuantity: number; // m³
  producedQuantity: number; // m³
  rejectedQuantity: number; // m³
  returnedQuantity: number; // m³
  wastedQuantity: number; // m³
  materialWeights: {
    cement: number; // kg
    scm: number; // kg
    aggregate20mm: number; // kg
    aggregate12mm: number; // kg
    sand: number; // kg
    water: number; // liters
    admixture: number; // liters
  };
  moistureCorrection: number; // liters
  waterCorrection: number; // liters
  batchTime: string;
  plantId: string;
  operator: string;
  projectId?: string;
  pourLocation?: string;
  status: 'PRODUCED' | 'DISPATCHED' | 'DELIVERED' | 'REJECTED' | 'RETURNED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// QC TEST RECORD
// ============================================================
export interface QCTestRecord {
  id: string;
  batchId: string;
  cubeId: string;
  sampleType: 'CUBE' | 'CYLINDER' | 'SLUMP';
  castingDate: string;
  testDate?: string;
  sevenDayResult?: number; // MPa
  twentyEightDayResult?: number; // MPa
  slumpResult?: number; // mm
  passFail: 'PASS' | 'FAIL' | 'PENDING';
  certificateId?: string;
  testedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// DISPATCH RECORD
// ============================================================
export interface DispatchRecord {
  id: string;
  dispatchId: string;
  batchId: string;
  projectId: string;
  customerId: string;
  location: string;
  quantity: number; // m³
  transitMixerId: string;
  driver: string;
  departureTime: string;
  arrivalTime?: string;
  unloadingTime?: string;
  returnTime?: string;
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// RMC DELIVERY CHALLAN
// ============================================================
export interface RMCChallan {
  id: string;
  challanNumber: string;
  dispatchId: string;
  batchId: string;
  companyId: string;
  customerId: string;
  projectId: string;
  mixGrade: string;
  quantity: number; // m³
  batchNumber: string;
  vehicleNumber: string;
  driver: string;
  dispatchTime: string;
  deliveryTime?: string;
  receivedBy?: string;
  signature?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// RMC COST BREAKDOWN
// ============================================================
export interface RMCCostBreakdown {
  id: string;
  mixDesignId: string;
  period: string;
  cementCost: number;
  scmCost: number;
  aggregate20mmCost: number;
  aggregate12mmCost: number;
  sandCost: number;
  admixtureCost: number;
  waterCost: number;
  labourCost: number;
  electricityCost: number;
  plantCost: number;
  transportCost: number;
  wastageCost: number;
  totalCost: number;
  costPerM3: number;
  createdAt: string;
}

// ============================================================
// RMC DASHBOARD KPIs
// ============================================================
export interface RMCDashboardKPIs {
  totalProduction: number; // m³
  totalDispatch: number; // m³
  totalDelivery: number; // m³
  totalRejection: number; // m³
  totalWastage: number; // m³
  averageCostPerM3: number;
  qcPassRate: number; // percentage
  plantUtilization: number; // percentage
  todayProduction: number; // m³
  todayDispatch: number; // m³
  pendingDeliveries: number;
  activeBatches: number;
}

// ============================================================
// TRACEABILITY RECORD
// ============================================================
export interface TraceabilityRecord {
  batchId: string;
  batchNumber: string;
  mixDesign: {
    id: string;
    grade: string;
    revision: number;
  };
  rawMaterials: Array<{
    materialId: string;
    materialName: string;
    batchNumber: string;
    grnNumber?: string;
    vendorName?: string;
    quantity: number;
    qcCertificateId?: string;
  }>;
  qcResults: Array<{
    testId: string;
    testType: string;
    result: number;
    passFail: string;
    testDate: string;
  }>;
  dispatchInfo?: {
    dispatchId: string;
    projectId: string;
    projectName: string;
    quantity: number;
    dispatchTime: string;
    deliveryTime?: string;
  };
}

// ============================================================
// BUILDCORE ERP - PLANT & MACHINERY TYPES
// Part 27: Plant / Machinery / Equipment Management
// ============================================================

export type PlantOwnership = 'OWNED' | 'HIRED' | 'LEASED' | 'SUBCONTRACTOR';

export type PlantStatus = 
  | 'PURCHASED'
  | 'COMMISSIONED'
  | 'AVAILABLE'
  | 'ALLOCATED'
  | 'OPERATING'
  | 'MAINTENANCE'
  | 'TRANSFERRED'
  | 'DISPOSED'
  | 'IDLE'
  | 'BREAKDOWN';

export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'BREAKDOWN' | 'INSPECTION' | 'SERVICE';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// ============================================================
// PLANT MASTER
// ============================================================
export interface PlantMaster {
  id: string;
  plantId: string;
  assetId: string;
  category: string;
  make: string;
  model: string;
  serialNumber: string;
  registration: string;
  capacity: string;
  ownership: PlantOwnership;
  purchaseDate: string;
  currentProject?: string;
  currentSite?: string;
  operator?: string;
  status: PlantStatus;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  lastCalibration?: string;
  nextCalibration?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// PLANT ALLOCATION
// ============================================================
export interface PlantAllocation {
  id: string;
  plantId: string;
  projectId: string;
  siteId?: string;
  wbsId?: string;
  activityId?: string;
  allocationDate: string;
  releaseDate?: string;
  operator?: string;
  costCentre?: string;
  status: 'ALLOCATED' | 'RELEASED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// DAILY LOGBOOK
// ============================================================
export interface DailyLogbook {
  id: string;
  plantId: string;
  date: string;
  openingMeter: number;
  closingMeter: number;
  workingHours: number;
  idleHours: number;
  breakdownHours: number;
  operator: string;
  activity: string;
  location: string;
  fuelConsumed: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// FUEL MANAGEMENT
// ============================================================
export interface FuelRecord {
  id: string;
  plantId: string;
  date: string;
  fuelType: string;
  quantity: number;
  rate: number;
  amount: number;
  hourMeter: number;
  projectId: string;
  createdAt: string;
}

// ============================================================
// MAINTENANCE WORK ORDER
// ============================================================
export interface MaintenanceWorkOrder {
  id: string;
  workOrderNumber: string;
  plantId: string;
  maintenanceType: MaintenanceType;
  problem: string;
  priority: MaintenancePriority;
  technician: string;
  startDate: string;
  completionDate?: string;
  parts: MaintenancePart[];
  labourCost: number;
  totalCost: number;
  downtime: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePart {
  id: string;
  materialId: string;
  quantity: number;
  rate: number;
  amount: number;
}

// ============================================================
// EQUIPMENT COST
// ============================================================
export interface EquipmentCost {
  id: string;
  plantId: string;
  period: string;
  depreciation: number;
  fuelCost: number;
  operatorCost: number;
  maintenanceCost: number;
  sparesCost: number;
  hireCost: number;
  transportCost: number;
  totalCost: number;
  workingHours: number;
  costPerHour: number;
  costPerDay: number;
  costPerUnit?: number;
  createdAt: string;
}

// ============================================================
// PLANT DASHBOARD KPIs
// ============================================================
export interface PlantDashboardKPIs {
  totalEquipment: number;
  available: number;
  working: number;
  idle: number;
  breakdown: number;
  maintenance: number;
  utilization: number;
  totalFuel: number;
  maintenanceCost: number;
}

// ============================================================
// ALERTS
// ============================================================
export interface PlantAlert {
  id: string;
  alertType: 'MAINTENANCE_DUE' | 'INSURANCE_EXPIRY' | 'REGISTRATION_EXPIRY' | 'CALIBRATION' | 'EXCESS_FUEL' | 'LOW_UTILIZATION' | 'BREAKDOWN' | 'IDLE_EQUIPMENT';
  plantId: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  acknowledged: boolean;
}

// ============================================================
// BUILDCORE ERP - MATERIAL CONTROL & COST ANALYTICS TYPES
// Part 19: Advanced Material Control and Cost-Analytics Engine
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. MATERIAL CONSUMPTION REGISTER
// ============================================================
export interface MaterialConsumption {
  id: string;
  companyId: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  wbsId?: string;
  wbsName?: string;
  activityId?: string;
  activityName?: string;
  boqItemId?: string;
  boqItemDescription?: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  consumptionDate: string;
  issuedQuantity: number;
  returnedQuantity: number;
  netConsumption: number;
  theoreticalConsumption: number;
  variance: number;
  variancePercent: number;
  uom: string;
  costCodeId?: string;
  costCodeName?: string;
  issueId?: string;
  issueNumber?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 2. THEORETICAL CONSUMPTION
// ============================================================
export interface TheoreticalConsumption {
  id: string;
  companyId: string;
  projectId: string;
  boqItemId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  executedQuantity: number;
  materialCoefficient: number;
  theoreticalQuantity: number;
  uom: string;
  calculatedAt: string;
  calculatedBy: string;
}

// ============================================================
// 3. CONSUMPTION VARIANCE
// ============================================================
export interface ConsumptionVariance {
  id: string;
  companyId: string;
  projectId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  period: string; // YYYY-MM
  theoreticalConsumption: number;
  actualConsumption: number;
  variance: number;
  variancePercent: number;
  status: 'WITHIN_LIMIT' | 'EXCESS' | 'SHORTAGE';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 4. WASTAGE TRACKING
// ============================================================
export interface MaterialWastage {
  id: string;
  companyId: string;
  projectId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  period: string;
  theoreticalQuantity: number;
  allowedWastagePercent: number;
  allowedWastageQuantity: number;
  actualWastageQuantity: number;
  excessWastageQuantity: number;
  excessWastagePercent: number;
  uom: string;
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'NORMAL' | 'EXCESS' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 5. MATERIAL RECONCILIATION
// ============================================================
export interface ConsumptionReconciliation {
  id: string;
  companyId: string;
  projectId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  reconciliationDate: string;
  openingStock: number;
  receipts: number;
  transfersIn: number;
  issues: number;
  transfersOut: number;
  returns: number;
  adjustments: number;
  systemClosing: number;
  physicalStock: number;
  variance: number;
  variancePercent: number;
  uom: string;
  remarks?: string;
  reconciledBy: string;
  reconciledByName: string;
  status: 'PENDING' | 'RECONCILED' | 'DISCREPANCY';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 6. BOQ RECONCILIATION
// ============================================================
export interface BOQReconciliation {
  id: string;
  companyId: string;
  projectId: string;
  boqItemId: string;
  boqItemDescription: string;
  boqQuantity: number;
  executedQuantity: number;
  expectedMaterial: number;
  actualMaterial: number;
  balance: number;
  variance: number;
  variancePercent: number;
  uom: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  reconciliationDate: string;
  reconciledBy: string;
  reconciledByName: string;
  status: 'WITHIN_LIMIT' | 'EXCESS' | 'SHORTAGE';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 7. PROJECT MATERIAL COST
// ============================================================
export interface ProjectMaterialCost {
  id: string;
  companyId: string;
  projectId: string;
  projectName: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  period: string;
  receivedValue: number;
  issuedValue: number;
  consumedValue: number;
  closingInventoryValue: number;
  consumptionCost: number;
  uom: string;
  quantity: number;
  averageRate: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 8. MATERIAL PRICE VARIANCE
// ============================================================
export interface MaterialPriceVariance {
  id: string;
  companyId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  period: string;
  tenderRate: number;
  budgetRate: number;
  poRate: number;
  actualRate: number;
  tenderVariance: number;
  tenderVariancePercent: number;
  budgetVariance: number;
  budgetVariancePercent: number;
  poVariance: number;
  poVariancePercent: number;
  uom: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 9. PURCHASE PRICE VARIANCE
// ============================================================
export interface PurchasePriceVariance {
  id: string;
  companyId: string;
  projectId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  poId: string;
  poNumber: string;
  poDate: string;
  approvedBudgetRate: number;
  actualPurchaseRate: number;
  variance: number;
  variancePercent: number;
  quantity: number;
  totalVariance: number;
  uom: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 10. RATE TREND
// ============================================================
export interface RateTrend {
  materialId: string;
  materialCode: string;
  materialName: string;
  vendorId?: string;
  vendorName?: string;
  projectId?: string;
  projectName?: string;
  period: string; // YYYY-MM
  averageRate: number;
  minRate: number;
  maxRate: number;
  totalQuantity: number;
  totalValue: number;
  uom: string;
}

// ============================================================
// 11. VENDOR PRICE COMPARISON
// ============================================================
export interface VendorPriceComparison {
  materialId: string;
  materialCode: string;
  materialName: string;
  specification: string;
  vendors: VendorPrice[];
  lowestVendorId: string;
  lowestVendorName: string;
  lowestRate: number;
  uom: string;
}

export interface VendorPrice {
  vendorId: string;
  vendorName: string;
  rate: number;
  lastQuoteDate: string;
  totalOrders: number;
  averageDeliveryDays: number;
  qualityScore: number;
}

// ============================================================
// 12. PROJECT COMPARISON
// ============================================================
export interface ProjectComparison {
  materialId: string;
  materialCode: string;
  materialName: string;
  projects: ProjectConsumption[];
  averageConsumption: number;
  uom: string;
}

export interface ProjectConsumption {
  projectId: string;
  projectName: string;
  consumedQuantity: number;
  executedQuantity: number;
  consumptionRate: number; // consumption per unit executed
  variance: number;
  variancePercent: number;
}

// ============================================================
// 13. MATERIAL FORECAST
// ============================================================
export interface MaterialForecast {
  id: string;
  companyId: string;
  projectId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  forecastDate: string;
  plannedActivities: number;
  remainingBOQ: number;
  productivity: number;
  historicalConsumption: number;
  requiredQuantity: number;
  expectedDate: string;
  currentStock: number;
  incomingQuantity: number;
  potentialShortage: number;
  shortageFlag: boolean;
  uom: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 14. PROCUREMENT PLANNING
// ============================================================
export interface ProcurementPlan {
  id: string;
  companyId: string;
  projectId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  planDate: string;
  requiredForRemainingWork: number;
  availableStock: number;
  incomingApprovedQuantity: number;
  suggestedProcurement: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedVendorId?: string;
  suggestedVendorName?: string;
  estimatedRate?: number;
  estimatedValue?: number;
  uom: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 15. STOCK HEALTH
// ============================================================
export interface StockHealth {
  materialId: string;
  materialCode: string;
  materialName: string;
  storeId: string;
  storeName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  safetyStock: number;
  healthStatus: 'CRITICAL' | 'LOW' | 'NORMAL' | 'HIGH' | 'EXCESS' | 'DEAD';
  daysOfStock: number;
  lastMovementDate: string;
  uom: string;
}

// ============================================================
// 16. MATERIAL AGEING
// ============================================================
export interface MaterialAgeing {
  materialId: string;
  materialCode: string;
  materialName: string;
  storeId: string;
  storeName: string;
  batchNumber?: string;
  receiptDate: string;
  quantity: number;
  ageDays: number;
  ageBucket: '0-30' | '31-60' | '61-90' | '91-180' | '180+';
  value: number;
  uom: string;
}

export interface AgeingBucketConfig {
  id: string;
  companyId: string;
  bucketName: string;
  minDays: number;
  maxDays: number;
  sortOrder: number;
}

// ============================================================
// 17. MATERIAL LOSS REGISTER
// ============================================================
export interface MaterialLoss {
  id: string;
  companyId: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  activityId?: string;
  activityName?: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  lossDate: string;
  quantity: number;
  uom: string;
  reason: 'THEFT' | 'MISHANDLING' | 'NATURAL_DISASTER' | 'EXPIRY' | 'UNKNOWN' | 'OTHER';
  responsibleArea: string;
  evidence?: string;
  estimatedValue: number;
  approvedBy?: string;
  approvedAt?: string;
  status: 'REPORTED' | 'UNDER_INVESTIGATION' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 18. DAMAGE REGISTER
// ============================================================
export interface MaterialDamage {
  id: string;
  companyId: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  damageDate: string;
  damageType: 'DAMAGED' | 'EXPIRED' | 'REJECTED' | 'LOST';
  quantity: number;
  uom: string;
  cause: string;
  evidence?: string;
  estimatedValue: number;
  disposition: 'REPAIR' | 'DISPOSE' | 'RETURN' | 'USE_AS_IS';
  approvedBy?: string;
  approvedAt?: string;
  status: 'REPORTED' | 'ASSESSED' | 'APPROVED' | 'DISPOSED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 19. MATERIAL TRANSFER ANALYTICS
// ============================================================
export interface TransferAnalytics {
  transferId: string;
  transferNumber: string;
  sourceStoreId: string;
  sourceStoreName: string;
  destinationStoreId: string;
  destinationStoreName: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  uom: string;
  dispatchedDate: string;
  receivedDate?: string;
  transitDays: number;
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'RECEIVED' | 'PENDING_RECEIPT';
}

// ============================================================
// 20. PROJECT MATERIAL DASHBOARD KPIs
// ============================================================
export interface ProjectMaterialDashboardKPIs {
  materialBudget: number;
  procuredValue: number;
  receivedValue: number;
  issuedValue: number;
  consumedValue: number;
  stockValue: number;
  forecastValue: number;
  varianceValue: number;
  variancePercent: number;
  wastageValue: number;
  wastagePercent: number;
  totalMaterials: number;
  criticalStock: number;
  lowStock: number;
  excessStock: number;
  deadStock: number;
}

// ============================================================
// 21. ALERT ENGINE
// ============================================================
export interface MaterialControlAlert {
  id: string;
  companyId: string;
  alertType: MaterialControlAlertType;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  projectId?: string;
  materialId?: string;
  storeId?: string;
  value?: number;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

export type MaterialControlAlertType =
  | 'EXCESS_CONSUMPTION'
  | 'UNUSUAL_PRICE'
  | 'LOW_STOCK'
  | 'NEGATIVE_STOCK'
  | 'DEAD_STOCK'
  | 'EXCESS_STOCK'
  | 'DELAYED_MATERIAL'
  | 'HIGH_WASTAGE'
  | 'BOQ_OVER_CONSUMPTION';

// ============================================================
// 22. COST-CODE LINK
// ============================================================
export interface CostCodeLink {
  id: string;
  issueId: string;
  issueNumber: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  wbsId?: string;
  wbsName?: string;
  costCodeId?: string;
  costCodeName?: string;
  activityId?: string;
  activityName?: string;
  quantity: number;
  value: number;
  uom: string;
  linkedAt: string;
  linkedBy: string;
}

// ============================================================
// 23. COMPLETE TRACE
// ============================================================
export interface MaterialTrace {
  materialId: string;
  materialCode: string;
  materialName: string;
  tenderEstimate?: {
    quantity: number;
    rate: number;
    value: number;
  };
  boq?: {
    quantity: number;
    rate: number;
    value: number;
  };
  materialCoefficient?: number;
  procurement?: {
    poNumber: string;
    quantity: number;
    rate: number;
    value: number;
  };
  grn?: {
    grnNumber: string;
    receivedQuantity: number;
    receivedDate: string;
  };
  stock?: {
    storeName: string;
    currentStock: number;
    value: number;
  };
  issue?: {
    issueNumber: string;
    issuedQuantity: number;
    issuedDate: string;
  };
  consumption?: {
    consumedQuantity: number;
    theoreticalQuantity: number;
    variance: number;
  };
  reconciliation?: {
    systemClosing: number;
    physicalStock: number;
    variance: number;
  };
  projectCost?: {
    consumedValue: number;
    closingInventoryValue: number;
    totalCost: number;
  };
}

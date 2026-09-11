// ============================================================
// BUILDCORE ERP - STORE & WAREHOUSE TYPES
// Part 17: Complete Store and Warehouse Management System
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. STORE MASTER
// ============================================================
export interface StoreMaster {
  id: string;
  companyId: string;
  storeCode: string;
  storeName: string;
  projectId?: string;
  siteId?: string;
  warehouseType: WarehouseType;
  address?: string;
  storeKeeperId?: string;
  storeKeeperName?: string;
  capacity?: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 2. WAREHOUSE TYPES
// ============================================================
export type WarehouseType = 
  | 'CENTRAL'
  | 'PROJECT'
  | 'SITE'
  | 'RMC'
  | 'PLANT_SPARE'
  | 'CONSUMABLE'
  | 'OTHER';

// ============================================================
// 3. BIN MANAGEMENT
// ============================================================
export interface BinMaster {
  id: string;
  storeId: string;
  binCode: string;
  zone?: string;
  rack?: string;
  shelf?: string;
  position?: string;
  capacity?: number;
  materialCategory?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 4. STOCK LOCATION
// ============================================================
export interface StockLocation {
  companyId: string;
  projectId?: string;
  siteId?: string;
  storeId?: string;
  binId?: string;
}

// ============================================================
// 5. STOCK LEDGER
// ============================================================
export interface StockLedgerEntry {
  id: string;
  companyId: string;
  transactionId: string;
  transactionDate: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  serialNumber?: string;
  fromLocation?: StockLocation;
  toLocation?: StockLocation;
  quantity: number;
  uom: string;
  rate: number;
  value: number;
  transactionType: StockTransactionType;
  referenceId?: string;
  referenceNumber?: string;
  userId: string;
  userName: string;
  remarks?: string;
  createdAt: string;
}

// ============================================================
// 6. TRANSACTION TYPES
// ============================================================
export type StockTransactionType = 
  | 'RECEIPT'
  | 'ISSUE'
  | 'RETURN'
  | 'TRANSFER'
  | 'ADJUSTMENT'
  | 'CONSUMPTION'
  | 'DAMAGE'
  | 'REJECTION'
  | 'STOCK_COUNT'
  | 'OPENING_BALANCE';

// ============================================================
// 7. MATERIAL ISSUE
// ============================================================
export interface MaterialIssue {
  id: string;
  companyId: string;
  issueNumber: string;
  issueDate: string;
  projectId: string;
  siteId?: string;
  wbsId?: string;
  activityId?: string;
  costCodeId?: string;
  storeId: string;
  items: MaterialIssueItem[];
  purpose: string;
  requesterId: string;
  requesterName: string;
  approverId?: string;
  approverName?: string;
  storeKeeperId: string;
  storeKeeperName: string;
  status: IssueStatus;
  approvedAt?: string;
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface MaterialIssueItem {
  id: string;
  issueId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  binId?: string;
  requestedQuantity: number;
  issuedQuantity: number;
  uom: string;
  rate: number;
  value: number;
  status: IssueItemStatus;
}

export type IssueStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ISSUED' | 'REJECTED' | 'CANCELLED';
export type IssueItemStatus = 'PENDING' | 'ISSUED' | 'PARTIALLY_ISSUED' | 'CANCELLED';

// ============================================================
// 8. MATERIAL RETURN
// ============================================================
export interface MaterialReturn {
  id: string;
  companyId: string;
  returnNumber: string;
  returnDate: string;
  issueId: string;
  issueNumber: string;
  storeId: string;
  items: MaterialReturnItem[];
  reason: string;
  inspectionResult: 'ACCEPTED' | 'REJECTED' | 'PARTIALLY_ACCEPTED';
  receivedById: string;
  receivedByName: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface MaterialReturnItem {
  id: string;
  returnId: string;
  issueItemId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  returnedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  uom: string;
  condition: string;
  binId?: string;
}

export type ReturnStatus = 'DRAFT' | 'SUBMITTED' | 'INSPECTED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

// ============================================================
// 9. STOCK TRANSFER
// ============================================================
export interface StockTransfer {
  id: string;
  companyId: string;
  transferNumber: string;
  transferDate: string;
  fromStoreId: string;
  fromStoreName: string;
  toStoreId: string;
  toStoreName: string;
  items: StockTransferItem[];
  dispatchedById: string;
  dispatchedByName: string;
  dispatchedAt?: string;
  receivedById?: string;
  receivedByName?: string;
  receivedAt?: string;
  status: TransferStatus;
  transitNotes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface StockTransferItem {
  id: string;
  transferId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  quantity: number;
  uom: string;
  dispatchedQuantity: number;
  receivedQuantity: number;
  fromBinId?: string;
  toBinId?: string;
}

export type TransferStatus = 'DRAFT' | 'DISPATCHED' | 'IN_TRANSIT' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';

// ============================================================
// 10. STOCK ADJUSTMENT
// ============================================================
export interface StockAdjustment {
  id: string;
  companyId: string;
  adjustmentNumber: string;
  adjustmentDate: string;
  storeId: string;
  items: StockAdjustmentItem[];
  reason: AdjustmentReason;
  reasonDescription: string;
  evidence?: string;
  approvedById: string;
  approvedByName: string;
  approvedAt: string;
  status: AdjustmentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface StockAdjustmentItem {
  id: string;
  adjustmentId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  binId?: string;
  currentQuantity: number;
  adjustedQuantity: number;
  variance: number;
  uom: string;
}

export type AdjustmentReason = 'PHYSICAL_SHORTAGE' | 'DAMAGE' | 'EXPIRY' | 'COUNTING_ERROR' | 'SYSTEM_CORRECTION' | 'OTHER';
export type AdjustmentStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// ============================================================
// 11. STOCK RESERVATION
// ============================================================
export interface StockReservation {
  id: string;
  companyId: string;
  reservationNumber: string;
  reservationDate: string;
  projectId: string;
  wbsId?: string;
  activityId?: string;
  prId?: string;
  poId?: string;
  storeId: string;
  items: StockReservationItem[];
  reservedById: string;
  reservedByName: string;
  expiryDate?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface StockReservationItem {
  id: string;
  reservationId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  binId?: string;
  reservedQuantity: number;
  issuedQuantity: number;
  uom: string;
}

export type ReservationStatus = 'ACTIVE' | 'PARTIALLY_ISSUED' | 'FULLY_ISSUED' | 'EXPIRED' | 'CANCELLED';

// ============================================================
// 12. STOCK BALANCE
// ============================================================
export interface StockBalance {
  id: string;
  companyId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  serialNumber?: string;
  storeId: string;
  binId?: string;
  physicalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  uom: string;
  rate: number;
  value: number;
  lastReceiptDate?: string;
  lastIssueDate?: string;
  lastMovementDate?: string;
  valuationMethod: 'WEIGHTED_AVERAGE' | 'FIFO';
  updatedAt: string;
}

// ============================================================
// 13. MIN/MAX STOCK CONFIGURATION
// ============================================================
export interface MinMaxStockConfig {
  id: string;
  companyId: string;
  materialId: string;
  storeId: string;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  safetyStock: number;
  uom: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 14. REORDER ALERT
// ============================================================
export interface ReorderAlert {
  id: string;
  companyId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  storeId: string;
  storeName: string;
  currentStock: number;
  reorderLevel: number;
  shortage: number;
  uom: string;
  alertDate: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'ORDERED' | 'RECEIVED';
}

// ============================================================
// 15. DEAD STOCK ANALYSIS
// ============================================================
export interface DeadStockAnalysis {
  materialId: string;
  materialCode: string;
  materialName: string;
  storeId: string;
  storeName: string;
  quantity: number;
  value: number;
  uom: string;
  lastMovementDate: string;
  daysInactive: number;
  batchNumber?: string;
  lotNumber?: string;
}

// ============================================================
// 16. SLOW MOVING ANALYSIS
// ============================================================
export interface SlowMovingAnalysis {
  materialId: string;
  materialCode: string;
  materialName: string;
  storeId: string;
  storeName: string;
  quantity: number;
  value: number;
  uom: string;
  issueFrequency: number; // issues per month
  averageIssueQuantity: number;
  daysOfStock: number;
}

// ============================================================
// 17. STOCK AGEING ANALYSIS
// ============================================================
export interface StockAgeingAnalysis {
  materialId: string;
  materialCode: string;
  materialName: string;
  storeId: string;
  storeName: string;
  batchNumber?: string;
  lotNumber?: string;
  receiptDate: string;
  quantity: number;
  value: number;
  uom: string;
  ageDays: number;
  ageCategory: '0-30' | '31-60' | '61-90' | '91-180' | '181-365' | '365+';
}

// ============================================================
// 18. MATERIAL RECONCILIATION
// ============================================================
export interface MaterialReconciliation {
  id: string;
  companyId: string;
  reconciliationDate: string;
  projectId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  boqQuantity: number;
  procuredQuantity: number;
  receivedQuantity: number;
  issuedQuantity: number;
  consumedQuantity: number;
  returnedQuantity: number;
  closingStock: number;
  expectedConsumption: number;
  variance: number;
  variancePercent: number;
  remarks?: string;
  preparedById: string;
  preparedByName: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 19. STORE DASHBOARD KPIs
// ============================================================
export interface StoreDashboardKPIs {
  totalStockValue: number;
  lowStockItems: number;
  negativeStockItems: number;
  excessStockItems: number;
  deadStockValue: number;
  slowMovingValue: number;
  pendingGRN: number;
  pendingQC: number;
  pendingIssues: number;
  pendingReturns: number;
  pendingTransfers: number;
  pendingReconciliation: number;
  totalMaterials: number;
  totalStores: number;
  reorderAlerts: number;
}

// ============================================================
// 20. STOCK VALUATION CONFIGURATION
// ============================================================
export interface StockValuationConfig {
  id: string;
  companyId: string;
  materialId: string;
  valuationMethod: 'WEIGHTED_AVERAGE' | 'FIFO';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

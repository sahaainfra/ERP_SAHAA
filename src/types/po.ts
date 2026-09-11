// ============================================================
// BUILDCORE ERP - PURCHASE ORDER & DELIVERY TYPES
// Part 16: Complete Purchase Order and Supplier Delivery Lifecycle
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. PURCHASE ORDER MASTER
// ============================================================
export interface PurchaseOrderMaster {
  id: string;
  companyId: string;
  poNumber: string;
  poDate: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  prId?: string;
  prNumber?: string;
  rfqId?: string;
  rfqNumber?: string;
  comparativeId?: string;
  currency: string;
  paymentTerms: string;
  deliveryLocation: string;
  deliverySchedule: string;
  validity: string;
  contactPerson?: string;
  contactMobile?: string;
  contactEmail?: string;
  buyerId: string;
  buyerName: string;
  approvalStatus: POApprovalStatus;
  workflowInstanceId?: string;
  approvedBy?: string;
  approvedAt?: string;
  items: PurchaseOrderItem[];
  terms: POTerms;
  basicTotal: number;
  discount: number;
  freight: number;
  taxes: PurchaseOrderTaxes;
  otherCharges: number;
  grandTotal: number;
  status: PurchaseOrderStatus;
  version: number;
  amendments: POAmendment[];
  deliveryScheduleItems: DeliverySchedule[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type POApprovalStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
export type PurchaseOrderStatus = 'DRAFT' | 'APPROVED' | 'ISSUED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CLOSED' | 'CANCELLED';

// ============================================================
// 2. PO ITEMS
// ============================================================
export interface PurchaseOrderItem {
  id: string;
  poId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  description: string;
  specification?: string;
  quantity: number;
  uom: string;
  rate: number;
  discount: number;
  discountPercent: number;
  taxPercent: number;
  taxAmount: number;
  freight: number;
  otherCharges: number;
  netAmount: number;
  deliveryDate: string;
  receivedQuantity: number;
  balanceQuantity: number;
  status: POItemStatus;
}

export type POItemStatus = 'PENDING' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'EXCESS' | 'CANCELLED';

// ============================================================
// 3. PO TERMS
// ============================================================
export interface POTerms {
  paymentTerms: string;
  deliveryTerms: string;
  inspectionTerms: string;
  warrantyTerms: string;
  qualityTerms: string;
  penaltyTerms?: string;
  taxTerms: string;
  insuranceTerms?: string;
  packingTerms?: string;
  transportationTerms?: string;
  documentationTerms?: string;
}

// ============================================================
// 4. PO TAXES
// ============================================================
export interface PurchaseOrderTaxes {
  cgst: number;
  cgstPercent: number;
  sgst: number;
  sgstPercent: number;
  igst: number;
  igstPercent: number;
  cess: number;
  cessPercent: number;
  totalTax: number;
}

// ============================================================
// 5. PO AMENDMENT
// ============================================================
export interface POAmendment {
  id: string;
  poId: string;
  amendmentNumber: number;
  amendmentDate: string;
  reason: string;
  originalPO: any;
  revisedPO: any;
  approvedBy: string;
  approvedAt: string;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
}

// ============================================================
// 6. DELIVERY SCHEDULE
// ============================================================
export interface DeliverySchedule {
  id: string;
  poId: string;
  poItemId: string;
  scheduledQuantity: number;
  scheduledDate: string;
  deliveredQuantity: number;
  deliveredDate?: string;
  balanceQuantity: number;
  status: DeliveryStatus;
}

export type DeliveryStatus = 'SCHEDULED' | 'DISPATCHED' | 'IN_TRANSIT' | 'AT_SITE' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'REJECTED' | 'CLOSED';

// ============================================================
// 7. GATE ENTRY
// ============================================================
export interface GateEntry {
  id: string;
  companyId: string;
  entryNumber: string;
  entryDate: string;
  entryTime: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile?: string;
  supplierName: string;
  poId: string;
  poNumber: string;
  deliveryChallanNumber: string;
  deliveryChallanDate: string;
  materialName: string;
  quantity: number;
  uom: string;
  projectId: string;
  siteId: string;
  securityUserId: string;
  securityUserName: string;
  photos: string[];
  remarks?: string;
  status: 'ENTRY' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 8. GOODS RECEIPT NOTE (GRN)
// ============================================================
export interface GoodsReceiptNote {
  id: string;
  companyId: string;
  grnNumber: string;
  grnDate: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  gateEntryId?: string;
  deliveryChallanNumber: string;
  vehicleNumber: string;
  projectId: string;
  siteId: string;
  items: GRNItem[];
  receivedBy: string;
  receivedByName: string;
  remarks?: string;
  status: GRNStatus;
  qcStatus: QCStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface GRNItem {
  id: string;
  grnId: string;
  poItemId: string;
  materialId: string;
  materialName: string;
  uom: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  batchNumber?: string;
  lotNumber?: string;
  remarks?: string;
}

export type GRNStatus = 'DRAFT' | 'SUBMITTED' | 'QC_PENDING' | 'ACCEPTED' | 'CONDITIONALLY_ACCEPTED' | 'REJECTED';
export type QCStatus = 'PENDING' | 'ACCEPTED' | 'CONDITIONALLY_ACCEPTED' | 'REJECTED';

// ============================================================
// 9. INVOICE
// ============================================================
export interface SupplierInvoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  invoiceDate: string;
  vendorId: string;
  vendorName: string;
  poId: string;
  poNumber: string;
  grnId?: string;
  grnNumber?: string;
  basicAmount: number;
  taxes: PurchaseOrderTaxes;
  totalAmount: number;
  dueDate: string;
  paymentTerms: string;
  status: InvoiceStatus;
  threeWayMatchStatus: ThreeWayMatchStatus;
  approvedBy?: string;
  approvedAt?: string;
  paidAmount: number;
  outstandingAmount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type InvoiceStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID' | 'PARTIALLY_PAID';
export type ThreeWayMatchStatus = 'PENDING' | 'MATCHED' | 'MISMATCH' | 'EXCEPTION';

// ============================================================
// 10. 3-WAY MATCH
// ============================================================
export interface ThreeWayMatch {
  id: string;
  companyId: string;
  invoiceId: string;
  invoiceNumber: string;
  poId: string;
  poNumber: string;
  grnId: string;
  grnNumber: string;
  matchDate: string;
  performedBy: string;
  performedByName: string;
  items: ThreeWayMatchItem[];
  overallStatus: ThreeWayMatchStatus;
  exceptions: MatchException[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThreeWayMatchItem {
  id: string;
  matchId: string;
  materialId: string;
  materialName: string;
  poQuantity: number;
  grnQuantity: number;
  invoiceQuantity: number;
  poRate: number;
  invoiceRate: number;
  quantityVariance: number;
  rateVariance: number;
  amountVariance: number;
  status: 'MATCHED' | 'MISMATCH';
}

export interface MatchException {
  id: string;
  matchId: string;
  exceptionType: 'QUANTITY' | 'RATE' | 'TAX' | 'AMOUNT';
  description: string;
  toleranceExceeded: boolean;
  explanation?: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'OPEN' | 'EXPLAINED' | 'APPROVED' | 'REJECTED';
}

// ============================================================
// 11. MATCH TOLERANCE CONFIGURATION
// ============================================================
export interface MatchToleranceConfig {
  id: string;
  companyId: string;
  quantityTolerancePercent: number;
  rateTolerancePercent: number;
  taxTolerancePercent: number;
  amountTolerancePercent: number;
  requireApprovalForExcess: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 12. PO CLOSURE
// ============================================================
export interface POClosure {
  id: string;
  poId: string;
  closureDate: string;
  closedBy: string;
  closedByName: string;
  reason: string;
  allQuantitiesReceived: boolean;
  allInvoicesProcessed: boolean;
  noOpenClaims: boolean;
  noOpenExceptions: boolean;
  manualClosure: boolean;
  manualClosureReason?: string;
  createdAt: string;
}

// ============================================================
// 13. PO DASHBOARD KPIs
// ============================================================
export interface PODashboardKPIs {
  openPO: number;
  openPOValue: number;
  deliveredValue: number;
  balanceValue: number;
  overdueDeliveries: number;
  pendingGRN: number;
  pendingQC: number;
  invoicePending: number;
  threeWayMismatch: number;
  totalPOValue: number;
  averageDeliveryTime: number;
  vendorPerformanceScore: number;
}

// ============================================================
// 14. PO ALERT
// ============================================================
export interface POAlert {
  id: string;
  alertType: POAlertType;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  entityId?: string;
  entityType?: string;
  dueDate?: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

export type POAlertType = 
  | 'DELIVERY_OVERDUE'
  | 'GRN_PENDING'
  | 'QC_PENDING'
  | 'INVOICE_PENDING'
  | 'THREE_WAY_MISMATCH'
  | 'PAYMENT_DUE';

// ============================================================
// 15. DELIVERY CHALLAN
// ============================================================
export interface DeliveryChallan {
  id: string;
  challanNumber: string;
  challanDate: string;
  vendorId: string;
  vendorName: string;
  poId: string;
  poNumber: string;
  documentPath: string;
  uploadedBy: string;
  uploadedAt: string;
  status: EntityStatus;
}

// ============================================================
// 16. PO DOCUMENT
// ============================================================
export interface PODocument {
  id: string;
  poId: string;
  documentType: 'PO' | 'AMENDMENT' | 'DELIVERY_CHALLAN' | 'INVOICE' | 'OTHER';
  documentNumber: string;
  documentPath: string;
  uploadedBy: string;
  uploadedAt: string;
  status: EntityStatus;
}

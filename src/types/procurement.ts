// ============================================================
// BUILDCORE ERP - PROCUREMENT TYPES
// Part 15: Complete End-to-End Procurement Module
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. MATERIAL REQUISITION
// ============================================================
export interface MaterialRequisition {
  id: string;
  companyId: string;
  mrNumber: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  wbsId?: string;
  activityId?: string;
  materialId: string;
  materialName: string;
  quantity: number;
  uom: string;
  requiredDate: string;
  purpose: string;
  specification?: string;
  requesterId: string;
  requesterName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  stockAvailability?: StockAvailability;
  status: MRStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type MRStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_PR';

export interface StockAvailability {
  availableStock: number;
  reservedStock: number;
  incomingStock: number;
  netAvailable: number;
  shortage: number;
  requiredPurchase: number;
}

// ============================================================
// 2. PURCHASE REQUISITION
// ============================================================
export interface PurchaseRequisition {
  id: string;
  companyId: string;
  prNumber: string;
  mrId?: string;
  mrNumber?: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  materialId: string;
  materialName: string;
  specification?: string;
  quantity: number;
  uom: string;
  requiredDate: string;
  suggestedVendorId?: string;
  suggestedVendorName?: string;
  estimatedRate: number;
  estimatedAmount: number;
  budget: number;
  costCodeId?: string;
  costCodeName?: string;
  requesterId: string;
  requesterName: string;
  remarks?: string;
  attachments: string[];
  status: PRStatus;
  workflowInstanceId?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type PRStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// ============================================================
// 3. RFQ (REQUEST FOR QUOTATION)
// ============================================================
export interface RFQ {
  id: string;
  companyId: string;
  rfqNumber: string;
  prId?: string;
  prNumber?: string;
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  vendors: RFQVendor[];
  items: RFQItem[];
  requiredDeliveryDate: string;
  quotationDeadline: string;
  terms?: string;
  attachments: string[];
  status: RFQStatus;
  issuedBy: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface RFQVendor {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  contactPerson?: string;
  contactEmail?: string;
  contactMobile?: string;
  invitedAt: string;
  status: 'INVITED' | 'QUOTATION_RECEIVED' | 'NO_RESPONSE' | 'WITHDRAWN';
}

export interface RFQItem {
  id: string;
  rfqId: string;
  materialId: string;
  materialName: string;
  specification?: string;
  quantity: number;
  uom: string;
  requiredDate?: string;
}

export type RFQStatus = 'DRAFT' | 'ISSUED' | 'QUOTATION_RECEIVED' | 'EVALUATION' | 'CLOSED' | 'CANCELLED';

// ============================================================
// 4. VENDOR QUOTATION
// ============================================================
export interface VendorQuotation {
  id: string;
  companyId: string;
  quotationNumber: string;
  rfqId: string;
  rfqNumber: string;
  vendorId: string;
  vendorName: string;
  quotationDate: string;
  validityDays: number;
  validityEndDate: string;
  items: QuotationItem[];
  basicTotal: number;
  discount: number;
  discountPercent: number;
  freight: number;
  loading: number;
  taxes: QuotationTaxes;
  otherCharges: number;
  netTotal: number;
  deliveryDays: number;
  paymentTerms?: string;
  warranty?: string;
  documentPath?: string;
  status: QuotationStatus;
  receivedBy: string;
  receivedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  rfqItemId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  uom: string;
  basicRate: number;
  basicAmount: number;
  discount?: number;
  discountPercent?: number;
  netRate: number;
  netAmount: number;
}

export interface QuotationTaxes {
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

export type QuotationStatus = 'RECEIVED' | 'UNDER_EVALUATION' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

// ============================================================
// 5. TECHNICAL EVALUATION
// ============================================================
export interface TechnicalEvaluation {
  id: string;
  companyId: string;
  quotationId: string;
  vendorId: string;
  vendorName: string;
  evaluationDate: string;
  evaluatedBy: string;
  evaluatedByName: string;
  criteria: TechnicalCriteria[];
  overallStatus: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT';
  overallScore: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalCriteria {
  id: string;
  evaluationId: string;
  criteriaName: string;
  requirement: string;
  offered: string;
  status: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT';
  score: number;
  remarks?: string;
}

// ============================================================
// 6. COMMERCIAL EVALUATION
// ============================================================
export interface CommercialEvaluation {
  id: string;
  companyId: string;
  quotationId: string;
  vendorId: string;
  vendorName: string;
  evaluationDate: string;
  evaluatedBy: string;
  evaluatedByName: string;
  basicTotal: number;
  freight: number;
  taxes: number;
  discount: number;
  totalLandedCost: number;
  effectiveRate: number;
  deliveryDays: number;
  paymentTerms: string;
  warranty: string;
  overallScore: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 7. COMPARATIVE STATEMENT
// ============================================================
export interface ComparativeStatement {
  id: string;
  companyId: string;
  rfqId: string;
  rfqNumber: string;
  projectId: string;
  projectName: string;
  statementDate: string;
  preparedBy: string;
  preparedByName: string;
  items: ComparativeItem[];
  recommendation?: ComparativeRecommendation;
  status: 'DRAFT' | 'FINAL' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
}

export interface ComparativeItem {
  id: string;
  comparativeId: string;
  materialId: string;
  materialName: string;
  specification?: string;
  quantity: number;
  uom: string;
  vendorQuotes: VendorQuote[];
  lowestVendorId?: string;
  lowestVendorName?: string;
  lowestRate?: number;
  recommendedVendorId?: string;
  recommendedVendorName?: string;
}

export interface VendorQuote {
  vendorId: string;
  vendorName: string;
  quotationId: string;
  basicRate: number;
  netRate: number;
  effectiveRate: number;
  deliveryDays: number;
  technicalStatus: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT';
  technicalScore: number;
  commercialScore: number;
  overallScore: number;
  isLowest: boolean;
  isRecommended: boolean;
}

export interface ComparativeRecommendation {
  recommendationType: 'LOWEST_COMPLIANT' | 'BEST_TECHNICAL' | 'BEST_DELIVERY' | 'BEST_COMMERCIAL' | 'MANAGEMENT_OVERRIDE';
  vendorId: string;
  vendorName: string;
  quotationId: string;
  reason: string;
  approvedBy?: string;
  approvedAt?: string;
}

// ============================================================
// 8. NEGOTIATION
// ============================================================
export interface ProcurementNegotiation {
  id: string;
  companyId: string;
  quotationId: string;
  vendorId: string;
  vendorName: string;
  negotiationDate: string;
  negotiatedBy: string;
  negotiatedByName: string;
  originalRate: number;
  negotiatedRate: number;
  savings: number;
  savingsPercent: number;
  reason: string;
  status: 'ONGOING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 9. PROCUREMENT SAVINGS
// ============================================================
export interface ProcurementSavings {
  id: string;
  companyId: string;
  projectId: string;
  prId: string;
  budgetEstimate: number;
  originalQuotation: number;
  finalNegotiated: number;
  savings: number;
  savingsPercent: number;
  calculatedAt: string;
  calculatedBy: string;
}

// ============================================================
// 10. PURCHASE ORDER
// ============================================================
export interface PurchaseOrder {
  id: string;
  companyId: string;
  poNumber: string;
  prId?: string;
  prNumber?: string;
  rfqId?: string;
  rfqNumber?: string;
  quotationId?: string;
  quotationNumber?: string;
  projectId: string;
  projectName: string;
  vendorId: string;
  vendorName: string;
  poDate: string;
  deliveryDate: string;
  items: POItem[];
  basicTotal: number;
  discount: number;
  freight: number;
  taxes: POTaxes;
  otherCharges: number;
  grandTotal: number;
  paymentTerms?: string;
  deliveryTerms?: string;
  warranty?: string;
  status: POStatus;
  workflowInstanceId?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface POItem {
  id: string;
  poId: string;
  quotationItemId?: string;
  materialId: string;
  materialName: string;
  specification?: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
  deliveryDate?: string;
  costCodeId?: string;
  costCodeName?: string;
}

export interface POTaxes {
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

export type POStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ISSUED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CLOSED' | 'CANCELLED';

// ============================================================
// 11. PROCUREMENT DASHBOARD KPIs
// ============================================================
export interface ProcurementDashboardKPIs {
  openMR: number;
  openPR: number;
  activeRFQ: number;
  quotationPending: number;
  comparativePending: number;
  approvalPending: number;
  poPending: number;
  delayedProcurement: number;
  totalSavings: number;
  totalProcurementValue: number;
  averageProcurementTime: number; // days
  onTimeDeliveryPercent: number;
}

// ============================================================
// 12. PROCUREMENT ALERT
// ============================================================
export interface ProcurementAlert {
  id: string;
  alertType: ProcurementAlertType;
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

export type ProcurementAlertType = 
  | 'PR_OVERDUE'
  | 'RFQ_CLOSING'
  | 'QUOTATION_MISSING'
  | 'REQUIRED_DATE_APPROACHING'
  | 'APPROVAL_OVERDUE'
  | 'VENDOR_RESPONSE_MISSING';

// ============================================================
// 13. PROCUREMENT STATUS TRACKING
// ============================================================
export type ProcurementStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'RFQ'
  | 'QUOTATION_RECEIVED'
  | 'EVALUATION'
  | 'COMPARATIVE'
  | 'NEGOTIATION'
  | 'APPROVED'
  | 'PO_PENDING'
  | 'CLOSED'
  | 'CANCELLED';

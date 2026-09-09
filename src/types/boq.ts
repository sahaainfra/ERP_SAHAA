// ============================================================
// BUILDCORE ERP - BOQ & ESTIMATION TYPES
// Part 10: Complete BOQ and Estimation Management System
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. BOQ MASTER
// ============================================================
export interface BOQMaster {
  id: string;
  companyId: string;
  boqNumber: string;
  projectId?: string;
  tenderId?: string;
  revision: number;
  revisionType: BOQRevisionType;
  title: string;
  description?: string;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  status: BOQStatus;
  approvedBy?: string;
  approvedAt?: string;
  frozenAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type BOQRevisionType = 
  | 'ORIGINAL'
  | 'ADDENDUM'
  | 'CORRIGENDUM'
  | 'REVISED'
  | 'NEGOTIATED'
  | 'CONTRACT'
  | 'VARIATION';

export type BOQStatus = 
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'FROZEN'
  | 'SUPERSEDED'
  | 'CANCELLED';

// ============================================================
// 2. BOQ HIERARCHY
// ============================================================
export interface BOQSection {
  id: string;
  boqId: string;
  sectionCode: string;
  sectionName: string;
  description?: string;
  parentSectionId?: string;
  level: number; // 1=Section, 2=Subsection, 3=Item, 4=Sub-item
  sortOrder: number;
  subtotalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 3. BOQ ITEM
// ============================================================
export interface BOQItem {
  id: string;
  boqId: string;
  sectionId?: string;
  itemNumber: string;
  chapter?: string;
  subchapter?: string;
  description: string;
  specification?: string;
  uom: string;
  quantity: number;
  clientRate?: number;
  approvedRate: number;
  amount: number;
  rateSource: RateSource;
  rateAnalysisId?: string;
  remarks?: string;
  sortOrder: number;
  isVariation: boolean;
  originalQuantity?: number;
  quantityVariance?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type RateSource = 
  | 'CPWD_DSR'
  | 'CPWD_DAR'
  | 'COMPANY_RATE'
  | 'PROJECT_RATE'
  | 'MARKET_RATE'
  | 'VENDOR_QUOTATION'
  | 'USER_ANALYSIS'
  | 'CLIENT_PROVIDED';

// ============================================================
// 4. DETAILED ESTIMATE
// ============================================================
export interface DetailedEstimate {
  id: string;
  boqItemId: string;
  materialCost: number;
  labourCost: number;
  plantCost: number;
  subcontractCost: number;
  otherDirectCost: number;
  directCost: number;
  wastagePercent: number;
  wastageAmount: number;
  transportationCost: number;
  leadLiftCost: number;
  overheads: OverheadBreakdown;
  profitPercent: number;
  profitAmount: number;
  taxes: TaxBreakdown;
  totalRate: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OverheadBreakdown {
  siteOverheadPercent: number;
  siteOverheadAmount: number;
  hoOverheadPercent: number;
  hoOverheadAmount: number;
  supervisionPercent: number;
  supervisionAmount: number;
  temporaryWorks: number;
  mobilization: number;
  insurance: number;
  testing: number;
  other: number;
  total: number;
}

export interface TaxBreakdown {
  baseAmount: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  igstPercent: number;
  igstAmount: number;
  cessPercent: number;
  cessAmount: number;
  totalTax: number;
  grandTotal: number;
}

// ============================================================
// 5. ABSTRACT ESTIMATE
// ============================================================
export interface AbstractEstimate {
  id: string;
  boqId: string;
  summaryType: 'CHAPTER' | 'TRADE' | 'WBS' | 'COST_CODE' | 'RESOURCE_TYPE';
  items: AbstractEstimateItem[];
  subtotal: number;
  overheads: number;
  profit: number;
  taxes: number;
  grandTotal: number;
  createdAt: string;
}

export interface AbstractEstimateItem {
  id: string;
  abstractEstimateId: string;
  category: string;
  amount: number;
  percentage: number;
}

// ============================================================
// 6. RESOURCE SUMMARY
// ============================================================
export interface ResourceSummary {
  id: string;
  boqId: string;
  materials: MaterialSummary[];
  labour: LabourSummary[];
  plant: PlantSummary[];
  totalMaterialCost: number;
  totalLabourCost: number;
  totalPlantCost: number;
  createdAt: string;
}

export interface MaterialSummary {
  id: string;
  resourceSummaryId: string;
  materialName: string;
  uom: string;
  totalQuantity: number;
  totalCost: number;
  percentage: number;
}

export interface LabourSummary {
  id: string;
  resourceSummaryId: string;
  labourCategory: string;
  totalDays: number;
  totalCost: number;
  percentage: number;
}

export interface PlantSummary {
  id: string;
  resourceSummaryId: string;
  equipmentName: string;
  totalHours: number;
  totalCost: number;
  percentage: number;
}

// ============================================================
// 7. COST SUMMARY
// ============================================================
export interface CostSummary {
  id: string;
  boqId: string;
  directCost: number;
  indirectCost: number;
  siteOverhead: number;
  hoOverhead: number;
  contingency: number;
  profit: number;
  taxes: number;
  total: number;
  createdAt: string;
}

// ============================================================
// 8. BID SCENARIO
// ============================================================
export interface BidScenario {
  id: string;
  boqId: string;
  scenarioName: string;
  scenarioType: 'A' | 'B' | 'C';
  totalBid: number;
  margin: number;
  marginPercent: number;
  materialExposure: number;
  labourExposure: number;
  plantExposure: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  description?: string;
  isRecommended: boolean;
  createdAt: string;
  createdBy: string;
}

// ============================================================
// 9. DISCOUNT
// ============================================================
export interface BOQDiscount {
  id: string;
  boqId: string;
  discountType: 'ITEM' | 'SECTION' | 'OVERALL';
  itemId?: string;
  sectionId?: string;
  discountPercent: number;
  discountAmount: number;
  grossAmount: number;
  netAmount: number;
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  createdBy: string;
}

// ============================================================
// 10. NEGOTIATION
// ============================================================
export interface BOQNegotiation {
  id: string;
  boqId: string;
  originalBid: number;
  negotiatedAmount: number;
  negotiatedItems: NegotiatedItem[];
  reason: string;
  managementApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  finalBid: number;
  createdAt: string;
  createdBy: string;
}

export interface NegotiatedItem {
  id: string;
  negotiationId: string;
  itemId: string;
  itemNumber: string;
  originalRate: number;
  negotiatedRate: number;
  originalAmount: number;
  negotiatedAmount: number;
  variance: number;
}

// ============================================================
// 11. BOQ CHANGE CONTROL
// ============================================================
export interface BOQChange {
  id: string;
  boqId: string;
  changeType: 'QUANTITY' | 'RATE' | 'ITEM_ADDED' | 'ITEM_REMOVED' | 'SPECIFICATION';
  itemId?: string;
  oldValue?: any;
  newValue: any;
  variance?: number;
  reason: string;
  sourceRef?: string; // Corrigendum reference
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  createdBy: string;
}

// ============================================================
// 12. BOQ VALIDATION
// ============================================================
export interface BOQValidation {
  id: string;
  boqId: string;
  itemId?: string;
  validationType: BOQValidationType;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  field?: string;
  currentValue?: any;
  expectedValue?: any;
  createdAt: string;
  createdBy: string;
}

export type BOQValidationType = 
  | 'NEGATIVE_QUANTITY'
  | 'ZERO_QUANTITY'
  | 'UNUSUAL_QUANTITY'
  | 'UOM_MISMATCH'
  | 'DUPLICATE_ITEM'
  | 'MISSING_RATE'
  | 'RATE_BELOW_THRESHOLD'
  | 'RATE_ABOVE_THRESHOLD'
  | 'OUTDATED_RATE'
  | 'UNAPPROVED_CUSTOM_RATE';

// ============================================================
// 13. BOQ DASHBOARD KPIs
// ============================================================
export interface BOQDashboardKPIs {
  totalBOQs: number;
  totalBOQItems: number;
  totalBOQValue: number;
  estimatedCost: number;
  margin: number;
  marginPercent: number;
  rateVariance: number;
  revisionCount: number;
  pendingApprovals: number;
  missingRates: number;
  validationErrors: number;
  validationWarnings: number;
}

// ============================================================
// 14. BOQ DOCUMENT
// ============================================================
export interface BOQDocument {
  id: string;
  boqId: string;
  documentType: 'BOQ' | 'DETAILED_ESTIMATE' | 'ABSTRACT_ESTIMATE' | 'RATE_ANALYSIS' | 'RESOURCE_SUMMARY' | 'BID_SUMMARY';
  fileName: string;
  filePath: string;
  fileSize: number;
  format: 'PDF' | 'EXCEL' | 'WORD';
  generatedBy: string;
  generatedAt: string;
  status: EntityStatus;
}

// ============================================================
// 15. CONTRACT CONVERSION
// ============================================================
export interface ContractConversion {
  id: string;
  tenderId: string;
  boqId: string;
  estimateId: string;
  contractId: string;
  projectId: string;
  convertedBy: string;
  convertedAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  remarks?: string;
}

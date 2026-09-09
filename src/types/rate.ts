// ============================================================
// BUILDCORE ERP - RATE LIBRARY & ANALYSIS TYPES
// Part 09: Professional Rate Library and Rate Analysis Engine
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. RATE LIBRARY
// ============================================================
export interface RateLibrary {
  id: string;
  companyId: string;
  libraryName: string;
  authority: RateLibraryAuthority;
  publication: string;
  year: number;
  version: string;
  effectiveDate: string;
  state?: string;
  region?: string;
  category: RateLibraryCategory;
  status: EntityStatus;
  isOfficial: boolean;
  importedBy?: string;
  importedAt?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type RateLibraryAuthority = 
  | 'CPWD'
  | 'STATE_PWD'
  | 'COMPANY'
  | 'PROJECT'
  | 'VENDOR'
  | 'MARKET'
  | 'CUSTOM';

export type RateLibraryCategory = 
  | 'DSR' // Delhi Schedule of Rates
  | 'DAR' // District Analysis of Rates
  | 'STANDARD'
  | 'PROJECT_SPECIFIC'
  | 'VENDOR_QUOTED'
  | 'MARKET_SURVEY'
  | 'CUSTOM_ANALYSIS';

// ============================================================
// 2. ITEM MASTER
// ============================================================
export interface RateItem {
  id: string;
  rateLibraryId: string;
  itemCode: string;
  chapter?: string;
  subchapter?: string;
  description: string;
  specification?: string;
  uom: string;
  baseRate: number;
  effectiveDate: string;
  source?: string;
  reference?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 3. RESOURCE MASTER
// ============================================================
export interface Resource {
  id: string;
  companyId: string;
  resourceCode: string;
  resourceName: string;
  resourceType: ResourceType;
  uom: string;
  description?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type ResourceType = 'MATERIAL' | 'LABOUR' | 'PLANT' | 'SUBCONTRACT' | 'OTHER';

// ============================================================
// 4. MATERIAL RATE
// ============================================================
export interface MaterialRate {
  id: string;
  resourceId: string;
  rateLibraryId: string;
  basicRate: number;
  loading: number;
  transportation: number;
  lead: number; // in km
  leadRate: number; // per km
  taxes: TaxBreakdown;
  wastagePercent: number;
  finalRate: number;
  effectiveDate: string;
  supplier?: string;
  remarks?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface TaxBreakdown {
  gstPercent: number;
  cgstPercent?: number;
  sgstPercent?: number;
  igstPercent?: number;
  cessPercent?: number;
  totalTaxAmount: number;
}

// ============================================================
// 5. LABOUR RATE
// ============================================================
export interface LabourRate {
  id: string;
  resourceId: string;
  rateLibraryId: string;
  labourCategory: string;
  skill: 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';
  basicWage: number;
  allowances: LabourAllowances;
  productivityFactor: number; // output per day
  effectiveRate: number; // per day
  effectiveDate: string;
  remarks?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface LabourAllowances {
  da: number; // Dearness Allowance
  hra: number; // House Rent Allowance
  conveyance: number;
  overtime: number;
  other: number;
  total: number;
}

// ============================================================
// 6. PLANT RATE
// ============================================================
export interface PlantRate {
  id: string;
  resourceId: string;
  rateLibraryId: string;
  equipment: string;
  capacity?: string;
  hourlyRate: number;
  dailyRate: number;
  fuelConsumption: number; // per hour
  fuelRate: number; // per liter
  operatorCost: number; // per hour
  maintenanceCost: number; // per hour
  depreciationOrHire: number; // per hour
  operatingCost: number; // total per hour
  effectiveDate: string;
  remarks?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 7. RATE ANALYSIS
// ============================================================
export interface RateAnalysis {
  id: string;
  companyId: string;
  analysisCode: string;
  itemName: string;
  itemDescription: string;
  uom: string;
  quantity: number;
  resources: RateAnalysisResource[];
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
  sourceLibraryId?: string;
  isTemplate: boolean;
  approvedBy?: string;
  approvedAt?: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'FROZEN';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface RateAnalysisResource {
  id: string;
  rateAnalysisId: string;
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
  productivity?: number;
  remarks?: string;
  parentResourceId?: string; // For hierarchy
  sortOrder: number;
}

// ============================================================
// 8. OVERHEAD BREAKDOWN
// ============================================================
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

// ============================================================
// 9. LEAD & LIFT
// ============================================================
export interface LeadLiftConfig {
  id: string;
  rateAnalysisId: string;
  initialLead: number; // km
  additionalLead: number; // km
  initialLift: number; // m
  additionalLift: number; // m
  transportationMode: 'ROAD' | 'RAIL' | 'WATER' | 'MANUAL';
  distance: number; // total km
  leadRate: number; // per km
  liftRate: number; // per m
  totalLeadCost: number;
  totalLiftCost: number;
  totalCost: number;
}

// ============================================================
// 10. RATE COMPARISON
// ============================================================
export interface RateComparison {
  id: string;
  itemId: string;
  itemName: string;
  uom: string;
  comparisons: RateComparisonItem[];
  variance: number;
  variancePercent: number;
  recommendedRate: number;
  recommendedSource: string;
  createdAt: string;
  createdBy: string;
}

export interface RateComparisonItem {
  source: 'CPWD' | 'COMPANY' | 'PROJECT' | 'VENDOR' | 'MARKET' | 'ANALYSIS';
  sourceName: string;
  rate: number;
  effectiveDate: string;
  variance?: number;
  variancePercent?: number;
}

// ============================================================
// 11. RATE HISTORY
// ============================================================
export interface RateHistory {
  id: string;
  entityType: 'ITEM' | 'MATERIAL' | 'LABOUR' | 'PLANT' | 'ANALYSIS';
  entityId: string;
  oldRate: number;
  newRate: number;
  effectiveDate: string;
  source?: string;
  changedBy: string;
  changedByName: string;
  changedAt: string;
  reason: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
}

// ============================================================
// 12. ESTIMATE
// ============================================================
export interface Estimate {
  id: string;
  companyId: string;
  projectId?: string;
  tenderId?: string;
  estimateCode: string;
  estimateName: string;
  estimateType: 'ABSTRACT' | 'DETAILED' | 'REVISED' | 'SUPPLEMENTARY';
  items: EstimateItem[];
  civilAmount: number;
  structuralAmount: number;
  architecturalAmount: number;
  electricalAmount: number;
  mechanicalAmount: number;
  plumbingAmount: number;
  roadAmount: number;
  bridgeAmount: number;
  otherAmount: number;
  subtotal: number;
  overheads: OverheadBreakdown;
  profitPercent: number;
  profitAmount: number;
  taxes: TaxBreakdown;
  grandTotal: number;
  status: EstimateStatus;
  rateLibraryId?: string;
  approvedBy?: string;
  approvedAt?: string;
  frozenAt?: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type EstimateStatus = 'DRAFT' | 'REVISION_1' | 'REVISION_2' | 'APPROVED' | 'TENDER_SUBMITTED' | 'AWARDED';

export interface EstimateItem {
  id: string;
  estimateId: string;
  category: EstimateCategory;
  itemCode: string;
  description: string;
  specification?: string;
  uom: string;
  quantity: number;
  rateAnalysisId: string;
  rate: number;
  amount: number;
  remarks?: string;
  sortOrder: number;
}

export type EstimateCategory = 
  | 'CIVIL'
  | 'STRUCTURAL'
  | 'ARCHITECTURAL'
  | 'ELECTRICAL'
  | 'MECHANICAL'
  | 'PLUMBING'
  | 'ROAD'
  | 'BRIDGE'
  | 'OTHER';

// ============================================================
// 13. RATE VALIDATION
// ============================================================
export interface RateValidation {
  id: string;
  entityType: 'ITEM' | 'MATERIAL' | 'LABOUR' | 'PLANT' | 'ANALYSIS' | 'ESTIMATE';
  entityId: string;
  validationType: ValidationType;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  field?: string;
  currentValue?: any;
  expectedValue?: any;
  createdAt: string;
  createdBy: string;
}

export type ValidationType = 
  | 'RATE_MISSING'
  | 'RESOURCE_MISSING'
  | 'UOM_MISMATCH'
  | 'EXPIRED_RATE'
  | 'DUPLICATE_RESOURCE'
  | 'NEGATIVE_RATE'
  | 'ZERO_QUANTITY'
  | 'INVALID_CONVERSION'
  | 'WASTAGE_DUPLICATE'
  | 'RATE_VARIANCE_HIGH';

// ============================================================
// 14. BULK IMPORT
// ============================================================
export interface BulkImport {
  id: string;
  companyId: string;
  importType: 'RATE_LIBRARY' | 'ITEMS' | 'MATERIALS' | 'LABOUR' | 'PLANT' | 'ANALYSIS';
  fileName: string;
  fileType: 'EXCEL' | 'CSV';
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  previewData: any[];
  errors: ImportError[];
  status: 'UPLOADED' | 'VALIDATED' | 'IMPORTED' | 'FAILED';
  importedBy: string;
  importedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportError {
  rowNumber: number;
  field: string;
  error: string;
  value?: any;
}

// ============================================================
// 15. ESTIMATION DASHBOARD KPIs
// ============================================================
export interface EstimationDashboardKPIs {
  totalEstimates: number;
  pendingApproval: number;
  tenderEstimates: number;
  approvedEstimates: number;
  averageRate: number;
  rateVariance: number;
  topCostComponents: CostComponent[];
  materialShare: number;
  labourShare: number;
  plantShare: number;
  overheadShare: number;
  profitShare: number;
  totalEstimateValue: number;
}

export interface CostComponent {
  name: string;
  amount: number;
  percentage: number;
}

// ============================================================
// 16. ITEM OVERRIDE
// ============================================================
export interface ItemOverride {
  id: string;
  itemId: string;
  projectId?: string;
  tenderId?: string;
  originalRate: number;
  overrideRate: number;
  reason: string;
  effectiveDate: string;
  expiryDate?: string;
  approvedBy: string;
  approvedAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// BUILDCORE ERP - MATERIAL MASTER TYPES
// Part 13: Central Material Master and Material Management Engine
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. MATERIAL MASTER
// ============================================================
export interface MaterialMaster {
  id: string;
  companyId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  shortDescription?: string;
  longDescription?: string;
  materialType: MaterialType;
  materialGroup: string;
  materialCategory: string;
  subcategory?: string;
  specification?: string;
  technicalDescription?: string;
  
  // UOM
  primaryUOM: string;
  purchaseUOM?: string;
  stockUOM?: string;
  issueUOM?: string;
  consumptionUOM?: string;
  conversionFactor?: number;
  
  // Tax & HSN
  hsnCode?: string;
  hsnDescription?: string;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cessRate?: number;
  
  // Product Details
  brand?: string;
  make?: string;
  manufacturer?: string;
  model?: string;
  grade?: string;
  size?: string;
  dimension?: string;
  color?: string;
  density?: string;
  strength?: string;
  standard?: string;
  specificationReference?: string;
  
  // Storage & Handling
  shelfLife?: number; // days
  storageCondition?: string;
  batchRequired: boolean;
  serialRequired: boolean;
  qcRequired: boolean;
  approvalRequired: boolean;
  
  // Safety
  isHazardous: boolean;
  msdsRequired: boolean;
  msdsDocumentId?: string;
  
  // Status
  status: MaterialStatus;
  blockedReason?: string;
  
  // Procurement Parameters
  leadTime?: number; // days
  minimumOrderQuantity?: number;
  reorderLevel?: number;
  minimumStock?: number;
  maximumStock?: number;
  safetyStock?: number;
  economicOrderQuantity?: number;
  
  // Quality Parameters
  inspectionRequired: boolean;
  samplingMethod?: string;
  testRequired: boolean;
  acceptanceCriteria?: string;
  certificateRequired: boolean;
  
  // Metadata
  documents: MaterialDocument[];
  images: MaterialImage[];
  approvedVendors: string[];
  alternatives: MaterialAlternative[];
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type MaterialType = 
  | 'RAW_MATERIAL'
  | 'FINISHED_GOOD'
  | 'SEMI_FINISHED'
  | 'CONSUMABLE'
  | 'SPARE_PART'
  | 'SERVICE'
  | 'PACKAGING'
  | 'OTHER';

export type MaterialStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'BLOCKED'
  | 'INACTIVE';

// ============================================================
// 2. MATERIAL CLASSIFICATION
// ============================================================
export interface MaterialClassification {
  id: string;
  companyId: string;
  classificationCode: string;
  classificationName: string;
  parentClassificationId?: string;
  level: number;
  description?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 3. MATERIAL GROUP
// ============================================================
export interface MaterialGroup {
  id: string;
  companyId: string;
  groupCode: string;
  groupName: string;
  parentGroupId?: string;
  level: number;
  description?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 4. MATERIAL DOCUMENT
// ============================================================
export interface MaterialDocument {
  id: string;
  materialId: string;
  documentType: MaterialDocumentType;
  documentNumber?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  expiryDate?: string;
  status: EntityStatus;
}

export type MaterialDocumentType = 
  | 'CATALOGUE'
  | 'TECHNICAL_DATA_SHEET'
  | 'SPECIFICATION'
  | 'DRAWING'
  | 'TEST_CERTIFICATE'
  | 'MSDS'
  | 'SAFETY_DOCUMENT'
  | 'MANUFACTURER_CERTIFICATE'
  | 'WARRANTY'
  | 'APPROVAL_LETTER'
  | 'PHOTO'
  | 'OTHER';

// ============================================================
// 5. MATERIAL IMAGE
// ============================================================
export interface MaterialImage {
  id: string;
  materialId: string;
  imageType: MaterialImageType;
  fileName: string;
  filePath: string;
  fileSize: number;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  isPrimary: boolean;
}

export type MaterialImageType = 
  | 'FRONT'
  | 'SIDE'
  | 'LABEL'
  | 'PACKAGING'
  | 'PRODUCT'
  | 'TECHNICAL'
  | 'OTHER';

// ============================================================
// 6. MATERIAL ALTERNATIVE
// ============================================================
export interface MaterialAlternative {
  id: string;
  originalMaterialId: string;
  alternativeMaterialId: string;
  alternativeType: 'EQUIVALENT' | 'APPROVED_ALTERNATIVE' | 'SUBSTITUTE';
  reason: string;
  approvedBy: string;
  approvedAt: string;
  status: EntityStatus;
}

// ============================================================
// 7. APPROVED MATERIAL LIST
// ============================================================
export interface ApprovedMaterialList {
  id: string;
  projectId: string;
  materialId: string;
  approvedBrand?: string;
  approvedGrade?: string;
  specification?: string;
  approvalDate: string;
  expiryDate?: string;
  documentId?: string;
  approvedBy: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 8. MATERIAL RATE HISTORY
// ============================================================
export interface MaterialRateHistory {
  id: string;
  materialId: string;
  rateType: MaterialRateType;
  rate: number;
  currency: string;
  effectiveDate: string;
  vendorId?: string;
  projectId?: string;
  source: string;
  createdAt: string;
  createdBy: string;
}

export type MaterialRateType = 
  | 'PURCHASE_RATE'
  | 'TENDER_RATE'
  | 'CPWD_RATE'
  | 'PROJECT_RATE'
  | 'LAST_PURCHASE_RATE'
  | 'AVERAGE_RATE';

// ============================================================
// 9. MATERIAL VENDOR LINK
// ============================================================
export interface MaterialVendorLink {
  id: string;
  materialId: string;
  vendorId: string;
  vendorName: string;
  isPreferred: boolean;
  leadTime?: number;
  minimumOrderQuantity?: number;
  lastPurchaseRate?: number;
  lastPurchaseDate?: string;
  rating?: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 10. MATERIAL RATE ALERT
// ============================================================
export interface MaterialRateAlert {
  id: string;
  materialId: string;
  alertType: MaterialRateAlertType;
  currentRate: number;
  previousRate?: number;
  variance?: number;
  variancePercent?: number;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

export type MaterialRateAlertType = 
  | 'RATE_INCREASE'
  | 'RATE_DECREASE'
  | 'UNUSUAL_RATE'
  | 'EXPIRED_RATE'
  | 'VENDOR_PRICE_VARIANCE';

// ============================================================
// 11. MATERIAL SEARCH
// ============================================================
export interface MaterialSearchResult {
  materialId: string;
  materialCode: string;
  materialName: string;
  materialCategory: string;
  brand?: string;
  primaryUOM: string;
  status: MaterialStatus;
  lastPurchaseRate?: number;
}

// ============================================================
// 12. MATERIAL COMPARISON
// ============================================================
export interface MaterialComparison {
  materialIds: string[];
  comparisonPoints: MaterialComparisonPoint[];
}

export interface MaterialComparisonPoint {
  attribute: string;
  values: Record<string, any>; // materialId -> value
}

// ============================================================
// 13. BULK IMPORT
// ============================================================
export interface MaterialBulkImport {
  id: string;
  companyId: string;
  fileName: string;
  fileType: 'EXCEL' | 'CSV';
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  importedMaterials: string[];
  errors: MaterialImportError[];
  status: 'UPLOADED' | 'VALIDATED' | 'IMPORTED' | 'FAILED';
  importedBy: string;
  importedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialImportError {
  rowNumber: number;
  field: string;
  error: string;
  value?: any;
}

// ============================================================
// 14. MATERIAL DASHBOARD KPIs
// ============================================================
export interface MaterialDashboardKPIs {
  totalMaterials: number;
  approvedMaterials: number;
  pendingApproval: number;
  blockedMaterials: number;
  totalCategories: number;
  totalGroups: number;
  materialsWithVendors: number;
  materialsWithoutVendors: number;
  rateAlerts: number;
  expiringDocuments: number;
  hazardousMaterials: number;
  materialsRequiringQC: number;
}

// ============================================================
// 15. MATERIAL NUMBERING CONFIG
// ============================================================
export interface MaterialNumberingConfig {
  id: string;
  companyId: string;
  materialType: MaterialType;
  prefix: string;
  sequenceLength: number;
  currentSequence: number;
  includeCategory: boolean;
  resetFrequency: 'NEVER' | 'YEARLY' | 'MONTHLY';
  lastResetAt?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

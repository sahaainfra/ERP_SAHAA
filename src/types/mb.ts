// ============================================================
// BUILDCORE ERP - MEASUREMENT BOOK TYPES
// Part 21: Advanced Measurement Book (MB) / e-MB Module
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. MB MASTER
// ============================================================
export interface MeasurementBook {
  id: string;
  companyId: string;
  mbNumber: string;
  projectId: string;
  projectCode: string;
  contractId?: string;
  contractNumber?: string;
  workOrderId?: string;
  packageId?: string;
  clientId?: string;
  consultantId?: string;
  contractorId?: string;
  subcontractorId?: string;
  siteId: string;
  workFrontId?: string;
  wbsId?: string;
  costCodeId?: string;
  measurementPeriod: string;
  measurementDate: string;
  preparedById: string;
  preparedByName: string;
  checkedById?: string;
  checkedByName?: string;
  verifiedById?: string;
  verifiedByName?: string;
  approvedById?: string;
  approvedByName?: string;
  certificationAuthority?: string;
  status: MBStatus;
  revision: number;
  totalAmount: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type MBStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'QS_REVIEW'
  | 'SITE_VERIFICATION'
  | 'PROJECT_MANAGER'
  | 'CONSULTANT'
  | 'CLIENT'
  | 'APPROVED'
  | 'CERTIFIED'
  | 'REJECTED'
  | 'REVISION';

// ============================================================
// 2. MB ITEM (Measurement Grid Row)
// ============================================================
export interface MBItem {
  id: string;
  mbId: string;
  srNo: number;
  boqItemId: string;
  boqItemCode: string;
  description: string;
  location?: string;
  chainageFrom?: string;
  chainageTo?: string;
  lhs?: boolean;
  rhs?: boolean;
  drawingRef?: string;
  wirRef?: string;
  measurementDate: string;
  
  // Dimensions
  noOfUnits?: number;
  length?: number;
  width?: number;
  height?: number;
  depth?: number;
  
  // Calculated values
  area?: number;
  volume?: number;
  weight?: number;
  
  // Quantities
  grossQuantity: number;
  deductions: MBDeduction[];
  netQuantity: number;
  
  // Previous/Current/Cumulative
  previousQuantity: number;
  currentQuantity: number;
  cumulativeQuantity: number;
  balanceQuantity: number;
  excessQuantity: number;
  
  // Rates and amounts
  rate: number;
  amount: number;
  
  // References
  variationId?: string;
  extraItemId?: string;
  
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 3. MB DEDUCTION
// ============================================================
export interface MBDeduction {
  id: string;
  mbItemId: string;
  deductionType: 'OPENING' | 'DOOR' | 'WINDOW' | 'SHAFT' | 'VOID' | 'EMBEDDED' | 'OVERLAP' | 'OTHER';
  description: string;
  length?: number;
  width?: number;
  height?: number;
  quantity: number;
  remarks?: string;
}

// ============================================================
// 4. JOINT MEASUREMENT
// ============================================================
export interface JointMeasurement {
  id: string;
  mbId: string;
  mbItemId: string;
  measurementDate: string;
  location: string;
  participants: JointParticipant[];
  contractorQuantity: number;
  clientQuantity?: number;
  consultantQuantity?: number;
  agreedQuantity: number;
  dispute?: string;
  remarks?: string;
  signatures: JointSignature[];
  createdAt: string;
  updatedAt: string;
}

export interface JointParticipant {
  id: string;
  jointMeasurementId: string;
  participantType: 'CONTRACTOR' | 'SUBCONTRACTOR' | 'SITE_ENGINEER' | 'QS' | 'CONSULTANT' | 'CLIENT';
  participantId: string;
  participantName: string;
  designation?: string;
}

export interface JointSignature {
  id: string;
  jointMeasurementId: string;
  participantId: string;
  participantName: string;
  signatureDate: string;
  signatureData?: string; // Base64 encoded signature
}

// ============================================================
// 5. MB REVISION
// ============================================================
export interface MBRevision {
  id: string;
  mbId: string;
  revisionNumber: number;
  previousValue: number;
  revisedValue: number;
  difference: number;
  reason: string;
  revisedBy: string;
  revisedByName: string;
  revisedAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
}

// ============================================================
// 6. LEVEL DATA (for infrastructure projects)
// ============================================================
export interface LevelData {
  id: string;
  mbItemId: string;
  chainage: string;
  existingRL?: number;
  designRL?: number;
  actualRL?: number;
  topRL?: number;
  bottomRL?: number;
  depth?: number;
  cut?: number;
  fill?: number;
}

// ============================================================
// 7. MB DASHBOARD KPIs
// ============================================================
export interface MBDashboardKPIs {
  totalMB: number;
  draftMB: number;
  pendingMB: number;
  approvedMB: number;
  certifiedMB: number;
  disputedMB: number;
  excessQuantity: number;
  currentQuantity: number;
  cumulativeQuantity: number;
  billingReadyQuantity: number;
  totalValue: number;
}

// ============================================================
// 8. MB REPORT TYPES
// ============================================================
export type MBReportType =
  | 'MB_REGISTER'
  | 'DETAILED_MB'
  | 'ABSTRACT_MB'
  | 'ITEM_WISE'
  | 'LOCATION_WISE'
  | 'CHAINAGE_WISE'
  | 'CURRENT_PREVIOUS_CUMULATIVE'
  | 'EXCESS_QUANTITY'
  | 'JOINT_MEASUREMENT'
  | 'DISPUTE_REGISTER'
  | 'VARIATION_MEASUREMENT'
  | 'WIR_TO_MB';

// ============================================================
// 9. WIR INTEGRATION
// ============================================================
export interface WIRStatus {
  wirId: string;
  wirNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedDate?: string;
  mbEligible: boolean;
}

// ============================================================
// 10. DIMENSION CALCULATION
// ============================================================
export interface DimensionCalculation {
  formula: 'LENGTH' | 'AREA' | 'VOLUME' | 'WEIGHT' | 'CUSTOM';
  inputs: Record<string, number>;
  result: number;
  unit: string;
}

// ============================================================
// 11. MB SEARCH
// ============================================================
export interface MBSearchResult {
  id: string;
  mbNumber: string;
  projectName: string;
  siteName: string;
  measurementDate: string;
  status: MBStatus;
  totalAmount: number;
}

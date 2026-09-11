// ============================================================
// BUILDCORE ERP - MATERIAL QUALITY CONTROL TYPES
// Part 18: Material Quality Control System
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. MATERIAL INSPECTION REQUEST (MIR)
// ============================================================
export interface MaterialInspectionRequest {
  id: string;
  companyId: string;
  mirNumber: string;
  grnId?: string;
  grnNumber?: string;
  poId?: string;
  poNumber?: string;
  vendorId: string;
  vendorName: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  quantity: number;
  uom: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  inspectionDate: string;
  inspectorId: string;
  inspectorName: string;
  status: MIRStatus;
  checklist: InspectionChecklistItem[];
  inspectionNotes?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  conditionalConditions?: string;
  conditionalExpiryDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type MIRStatus = 'PENDING' | 'ACCEPTED' | 'CONDITIONALLY_ACCEPTED' | 'REJECTED' | 'HOLD';

// ============================================================
// 2. INSPECTION CHECKLIST
// ============================================================
export interface InspectionChecklistItem {
  id: string;
  mirId: string;
  checklistItem: string;
  category: string;
  required: boolean;
  result: 'PASS' | 'FAIL' | 'NA' | 'PENDING';
  remarks?: string;
  photoIds?: string[];
}

export interface MaterialInspectionChecklist {
  id: string;
  companyId: string;
  materialCategory: string;
  checklistName: string;
  items: ChecklistTemplateItem[];
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ChecklistTemplateItem {
  id: string;
  checklistId: string;
  item: string;
  category: string;
  required: boolean;
  sortOrder: number;
}

// ============================================================
// 3. TEST REGISTER
// ============================================================
export interface MaterialTest {
  id: string;
  companyId: string;
  testId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  sampleId?: string;
  testName: string;
  testStandard: string;
  requirement: string;
  result?: string;
  resultUnit?: string;
  acceptanceCriteria: string;
  labName?: string;
  technicianName?: string;
  testDate?: string;
  status: TestStatus;
  certificateId?: string;
  mirId?: string;
  ncrId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type TestStatus = 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'CONDITIONAL';

// ============================================================
// 4. TEST CERTIFICATE
// ============================================================
export interface TestCertificate {
  id: string;
  companyId: string;
  certificateNumber: string;
  certificateType: 'MANUFACTURER' | 'THIRD_PARTY' | 'LAB_REPORT' | 'MILL_CERTIFICATE';
  materialId: string;
  materialName: string;
  batchNumber?: string;
  vendorId?: string;
  vendorName?: string;
  issueDate: string;
  expiryDate?: string;
  documentPath: string;
  testIds: string[];
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 5. SAMPLE TRACKING
// ============================================================
export interface MaterialSample {
  id: string;
  companyId: string;
  sampleId: string;
  materialId: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  collectedDate: string;
  collectedById: string;
  collectedByName: string;
  labName?: string;
  quantity: number;
  uom: string;
  testIds: string[];
  status: SampleStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type SampleStatus = 'COLLECTED' | 'SENT_TO_LAB' | 'TESTING' | 'COMPLETED' | 'DISPOSED';

// ============================================================
// 6. NON-CONFORMANCE REPORT (NCR)
// ============================================================
export interface NonConformanceReport {
  id: string;
  companyId: string;
  ncrNumber: string;
  materialId: string;
  materialName: string;
  batchNumber?: string;
  grnId?: string;
  poId?: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  testId?: string;
  mirId?: string;
  nonConformanceType: 'MATERIAL' | 'TEST_FAILURE' | 'DAMAGE' | 'SPECIFICATION' | 'OTHER';
  description: string;
  quantity: number;
  uom: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  disposition: 'REJECT' | 'RETURN' | 'USE_AS_IS' | 'REWORK' | 'SCRAP';
  raisedById: string;
  raisedByName: string;
  raisedDate: string;
  resolvedById?: string;
  resolvedByName?: string;
  resolvedDate?: string;
  status: NCRStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type NCRStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'CORRECTIVE_ACTION' | 'RESOLVED' | 'CLOSED';

// ============================================================
// 7. MATERIAL HOLD
// ============================================================
export interface MaterialHold {
  id: string;
  companyId: string;
  materialId: string;
  materialName: string;
  batchNumber?: string;
  lotNumber?: string;
  storeId: string;
  quantity: number;
  uom: string;
  holdReason: string;
  holdDate: string;
  heldById: string;
  heldByName: string;
  releaseDate?: string;
  releasedById?: string;
  releasedByName?: string;
  releaseAuthorization?: string;
  status: 'HOLD' | 'RELEASED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 8. INSPECTION PHOTO
// ============================================================
export interface InspectionPhoto {
  id: string;
  mirId: string;
  photoType: 'MATERIAL' | 'PACKAGING' | 'LABEL' | 'DAMAGE' | 'TEST_SAMPLE' | 'OTHER';
  filePath: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
}

// ============================================================
// 11. CALIBRATION RECORD
// ============================================================
export interface CalibrationRecord {
  id: string;
  companyId: string;
  equipmentId: string;
  equipmentName: string;
  calibrationDate: string;
  nextCalibrationDate: string;
  certificateNumber: string;
  certificatePath: string;
  calibratedBy: string;
  result: 'PASS' | 'FAIL' | 'CONDITIONAL';
  remarks?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 12. VENDOR QUALITY SCORE
// ============================================================
export interface VendorQualityScore {
  vendorId: string;
  vendorName: string;
  totalInspections: number;
  acceptedCount: number;
  rejectedCount: number;
  conditionalCount: number;
  rejectionRate: number;
  testFailures: number;
  damageCount: number;
  ncrCount: number;
  overallScore: number;
  lastUpdated: string;
}

// ============================================================
// 13. QUALITY ALERT
// ============================================================
export interface QualityAlert {
  id: string;
  companyId: string;
  alertType: QualityAlertType;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mirId?: string;
  testId?: string;
  ncrId?: string;
  certificateId?: string;
  dueDate?: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

export type QualityAlertType = 
  | 'PENDING_INSPECTION'
  | 'TEST_DUE'
  | 'CERTIFICATE_EXPIRY'
  | 'FAILED_TEST'
  | 'NCR_OVERDUE'
  | 'CALIBRATION_DUE';

// ============================================================
// 14. QUALITY DASHBOARD KPIs
// ============================================================
export interface QualityDashboardKPIs {
  pendingMIR: number;
  acceptedMIR: number;
  rejectedMIR: number;
  conditionalMIR: number;
  openNCR: number;
  testFailures: number;
  pendingTests: number;
  expiringCertificates: number;
  calibrationDue: number;
  averageInspectionTime: number;
  overallAcceptanceRate: number;
  vendorQualityScore: number;
}

// ============================================================
// 15. MATERIAL QUALITY HISTORY
// ============================================================
export interface MaterialQualityHistory {
  materialId: string;
  materialName: string;
  vendorId: string;
  vendorName: string;
  batchNumber?: string;
  projectId: string;
  projectName: string;
  mirId: string;
  mirNumber: string;
  inspectionDate: string;
  status: MIRStatus;
  testResults?: TestResultSummary[];
  ncrId?: string;
  remarks?: string;
}

export interface TestResultSummary {
  testId: string;
  testName: string;
  result: string;
  status: TestStatus;
  testDate: string;
}

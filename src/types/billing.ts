// ============================================================
// BUILDCORE ERP - BILLING TYPES
// Part 22: RA Bill / Client Billing / Subcontractor Billing
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. BILL TYPES
// ============================================================
export type BillType =
  | 'RA_BILL'
  | 'INTERIM_BILL'
  | 'CLIENT_BILL'
  | 'SUBCONTRACTOR_BILL'
  | 'SUPPLEMENTARY_BILL'
  | 'VARIATION_BILL'
  | 'EXTRA_ITEM_BILL'
  | 'FINAL_BILL';

// ============================================================
// 2. BILL HEADER
// ============================================================
export interface Bill {
  id: string;
  companyId: string;
  billNumber: string;
  billType: BillType;
  projectId: string;
  contractId?: string;
  contractorId?: string;
  clientId?: string;
  billingPeriod: string;
  mbReference?: string;
  billDate: string;
  dueDate: string;
  grossAmount: number;
  deductions: BillDeduction[];
  taxes: BillTax[];
  netAmount: number;
  certificationStatus: CertificationStatus;
  paymentStatus: PaymentStatus;
  items: BillItem[];
  remarks?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: number;
  status: BillStatus;
}

export type BillStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_QS_REVIEW'
  | 'UNDER_PM_REVIEW'
  | 'UNDER_COMMERCIAL_REVIEW'
  | 'UNDER_CONSULTANT_REVIEW'
  | 'UNDER_CLIENT_REVIEW'
  | 'CERTIFIED'
  | 'UNDER_FINANCE_REVIEW'
  | 'APPROVED_FOR_PAYMENT'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export type CertificationStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'PARTIALLY_CERTIFIED'
  | 'FULLY_CERTIFIED'
  | 'REJECTED';

export type PaymentStatus =
  | 'NOT_DUE'
  | 'DUE'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE';

// ============================================================
// 3. BILL ITEM
// ============================================================
export interface BillItem {
  id: string;
  billId: string;
  itemCategory: BillItemCategory;
  itemId: string; // BOQ item ID, Variation ID, etc.
  itemCode: string;
  description: string;
  unit: string;
  rate: number;
  previousQuantity: number;
  currentQuantity: number;
  cumulativeQuantity: number;
  previousAmount: number;
  currentAmount: number;
  cumulativeAmount: number;
  approvalReference?: string; // For variations, extra items, claims
  remarks?: string;
}

export type BillItemCategory =
  | 'ORIGINAL_BOQ'
  | 'VARIATION'
  | 'DEVIATION'
  | 'EXTRA_ITEM'
  | 'NON_SCHEDULE'
  | 'PROVISIONAL_ITEM'
  | 'CLAIM_ITEM'
  | 'ESCALATION';

// ============================================================
// 4. BILL DEDUCTION
// ============================================================
export interface BillDeduction {
  id: string;
  billId: string;
  deductionType: DeductionType;
  description: string;
  amount: number;
  reference?: string;
}

export type DeductionType =
  | 'RETENTION'
  | 'SECURITY_DEPOSIT'
  | 'ADVANCE_RECOVERY'
  | 'MATERIAL_RECOVERY'
  | 'CEMENT_RECOVERY'
  | 'STEEL_RECOVERY'
  | 'LABOUR_RECOVERY'
  | 'ROYALTY'
  | 'WATER'
  | 'ELECTRICITY'
  | 'TESTING'
  | 'PENALTY'
  | 'LD'
  | 'TDS'
  | 'OTHER_RECOVERY';

// ============================================================
// 5. BILL TAX
// ============================================================
export interface BillTax {
  id: string;
  billId: string;
  taxType: string;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
}

// ============================================================
// 6. BILL CERTIFICATION
// ============================================================
export interface BillCertification {
  id: string;
  billId: string;
  submittedAmount: number;
  certifiedAmount: number;
  deductedAmount: number;
  rejectedAmount: number;
  certificationDate: string;
  certificationReference: string;
  clientRemarks?: string;
  certifiedBy: string;
}

// ============================================================
// 7. BILL PAYMENT
// ============================================================
export interface BillPayment {
  id: string;
  billId: string;
  paymentDate: string;
  paymentAmount: number;
  paymentMode: string;
  transactionReference: string;
  remarks?: string;
  processedBy: string;
}

// ============================================================
// 8. ESCALATION
// ============================================================
export interface EscalationConfig {
  id: string;
  companyId: string;
  name: string;
  description: string;
  baseIndex: number;
  currentIndices: EscalationIndex[];
  formula: string;
  status: EntityStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface EscalationIndex {
  id: string;
  escalationConfigId: string;
  indexType: 'LABOUR' | 'MATERIAL' | 'FUEL' | 'OTHER';
  indexName: string;
  baseValue: number;
  currentValue: number;
  effectiveDate: string;
}

export interface EscalationCalculation {
  id: string;
  billItemId: string;
  escalationConfigId: string;
  baseRate: number;
  escalatedRate: number;
  escalationAmount: number;
  calculationDate: string;
  indices: EscalationIndexSnapshot[];
}

export interface EscalationIndexSnapshot {
  indexType: string;
  indexName: string;
  baseValue: number;
  currentValue: number;
  escalationFactor: number;
}

// ============================================================
// 9. SUBCONTRACTOR BILL
// ============================================================
export interface SubcontractorBill extends Bill {
  subcontractWorkOrderId: string;
  materialIssues: MaterialIssueReference[];
  recoveries: SubcontractorRecovery[];
}

export interface MaterialIssueReference {
  id: string;
  issueId: string;
  issueNumber: string;
  issueDate: string;
  materialId: string;
  materialName: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface SubcontractorRecovery {
  id: string;
  billId: string;
  recoveryType: 'MATERIAL' | 'ADVANCE' | 'PENALTY' | 'OTHER';
  description: string;
  amount: number;
  reference?: string;
}

// ============================================================
// 10. DLP / RETENTION
// ============================================================
export interface DLPTracking {
  id: string;
  projectId: string;
  contractId: string;
  dlpStartDate: string;
  dlpEndDate: string;
  retentionAmount: number;
  retentionReleased: number;
  retentionBalance: number;
  defects: DLPDefect[];
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
}

export interface DLPDefect {
  id: string;
  dlpTrackingId: string;
  defectDescription: string;
  reportedDate: string;
  reportedBy: string;
  closureDate?: string;
  closedBy?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

export interface RetentionRelease {
  id: string;
  dlpTrackingId: string;
  releaseDate: string;
  releaseAmount: number;
  approvalReference: string;
  approvedBy: string;
  paymentReference?: string;
  remarks?: string;
}

// ============================================================
// 11. BILL DASHBOARD KPIs
// ============================================================
export interface BillDashboardKPIs {
  billsPrepared: number;
  pendingApproval: number;
  pendingCertification: number;
  certified: number;
  paid: number;
  outstanding: number;
  retention: number;
  advance: number;
  monthlyBilling: number;
  cumulativeBilling: number;
}

// ============================================================
// 12. BILL REPORT TYPES
// ============================================================
export type BillReportType =
  | 'RA_BILL'
  | 'BILL_REGISTER'
  | 'ABSTRACT_BILL'
  | 'CLIENT_BILLING_STATEMENT'
  | 'SUBCONTRACTOR_BILLING_STATEMENT'
  | 'DEDUCTION_STATEMENT'
  | 'RETENTION_STATEMENT'
  | 'ADVANCE_RECOVERY_STATEMENT'
  | 'CERTIFIED_VS_BILLED'
  | 'BILLING_VS_COLLECTION';

// ============================================================
// 13. DOCUMENT CHECKLIST
// ============================================================
export interface DocumentChecklist {
  id: string;
  companyId: string;
  billType: BillType;
  documentType: string;
  isMandatory: boolean;
  description: string;
  sortOrder: number;
}

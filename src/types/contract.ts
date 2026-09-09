// ============================================================
// BUILDCORE ERP - CONTRACT MANAGEMENT TYPES
// Part 11: Complete Contract Management Module
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. CONTRACT MASTER
// ============================================================
export interface ContractMaster {
  id: string;
  companyId: string;
  contractNumber: string;
  contractCode: string;
  tenderId?: string;
  tenderNumber?: string;
  projectId: string;
  projectName: string;
  client: string;
  employer?: string;
  consultant?: string;
  contractor: string;
  agreementNumber?: string;
  loaNumber?: string;
  workOrderNumber?: string;
  contractType: ContractType;
  contractValue: number;
  originalContractValue: number;
  revisedContractValue: number;
  currency: string;
  gstTreatment: 'INCLUSIVE' | 'EXCLUSIVE' | 'REVERSE_CHARGE';
  awardDate: string;
  agreementDate?: string;
  commencementDate: string;
  originalCompletionDate: string;
  revisedCompletionDate?: string;
  dlpStart?: string;
  dlpEnd?: string;
  contractDuration: number; // days
  eotDays?: number;
  retentionPercent: number;
  securityDeposit: number;
  performanceGuarantee: number;
  mobilizationAdvance: number;
  paymentTerms: string;
  defectLiability: number; // months
  status: ContractStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type ContractType = 
  | 'ITEM_RATE'
  | 'PERCENTAGE_RATE'
  | 'LUMP_SUM'
  | 'EPC'
  | 'TURNKEY'
  | 'DESIGN_BUILD'
  | 'CONSTRUCTION'
  | 'MAINTENANCE'
  | 'AMC'
  | 'SUBCONTRACT'
  | 'SUPPLY'
  | 'SERVICE'
  | 'OTHER';

export type ContractStatus = 
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'DLP_PERIOD'
  | 'CLOSED'
  | 'TERMINATED';

// ============================================================
// 2. CONTRACT DOCUMENT
// ============================================================
export interface ContractDocument {
  id: string;
  contractId: string;
  documentType: ContractDocumentType;
  documentNumber?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  version: number;
  revisionDate?: string;
  uploadedBy: string;
  uploadedAt: string;
  status: EntityStatus;
}

export type ContractDocumentType = 
  | 'LOA'
  | 'WORK_ORDER'
  | 'AGREEMENT'
  | 'BOQ'
  | 'SPECIFICATIONS'
  | 'DRAWINGS'
  | 'GCC'
  | 'SCC'
  | 'TECHNICAL_SPEC'
  | 'PRICE_SCHEDULE'
  | 'PAYMENT_TERMS'
  | 'INSURANCE'
  | 'PERFORMANCE_GUARANTEE'
  | 'BANK_GUARANTEE'
  | 'TENDER_DOCUMENTS'
  | 'CORRIGENDUM'
  | 'ADDENDUM'
  | 'CORRESPONDENCE';

// ============================================================
// 3. CONTRACT AMENDMENT
// ============================================================
export interface ContractAmendment {
  id: string;
  contractId: string;
  amendmentNumber: number;
  amendmentType: 'AMENDMENT' | 'SUPPLEMENTARY' | 'REVISION' | 'VARIATION';
  title: string;
  description: string;
  reason: string;
  originalValue: number;
  newValue: number;
  valueVariance: number;
  effectiveDate: string;
  approvedBy?: string;
  approvedAt?: string;
  documentId?: string;
  impactOnBOQ: boolean;
  impactOnSchedule: boolean;
  impactOnCost: boolean;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 4. CONTRACT MILESTONE
// ============================================================
export interface ContractMilestone {
  id: string;
  contractId: string;
  milestoneName: string;
  description?: string;
  baselineDate: string;
  contractDate: string;
  forecastDate?: string;
  actualDate?: string;
  value: number;
  paymentLinkId?: string;
  isPaymentLinked: boolean;
  status: 'PENDING' | 'ACHIEVED' | 'DELAYED' | 'AT_RISK';
  varianceDays: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 5. BANK GUARANTEE
// ============================================================
export interface BankGuarantee {
  id: string;
  contractId: string;
  bgType: 'BID_BOND' | 'PERFORMANCE' | 'ADVANCE' | 'RETENTION' | 'OTHER';
  bgNumber: string;
  bankName: string;
  branchName?: string;
  amount: number;
  currency: string;
  issueDate: string;
  expiryDate: string;
  claimPeriod?: number; // days
  beneficiary: string;
  purpose: string;
  projectId: string;
  originalDocument?: string;
  renewalHistory: BGRenewal[];
  status: 'ACTIVE' | 'EXPIRED' | 'CLAIMED' | 'RELEASED' | 'RENEWED';
  alertSent: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface BGRenewal {
  id: string;
  renewalDate: string;
  newExpiryDate: string;
  renewalDocument?: string;
  renewedBy: string;
  remarks?: string;
}

// ============================================================
// 6. PERFORMANCE GUARANTEE
// ============================================================
export interface PerformanceGuarantee {
  id: string;
  contractId: string;
  pgNumber: string;
  bankName: string;
  amount: number;
  currency: string;
  issueDate: string;
  expiryDate: string;
  claimPeriod?: number;
  renewalRequired: boolean;
  lastRenewalDate?: string;
  nextRenewalDate?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CLAIMED' | 'RELEASED';
  documentId?: string;
  alertSent: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 7. ADVANCE MANAGEMENT
// ============================================================
export interface ContractAdvance {
  id: string;
  contractId: string;
  advanceType: 'MOBILIZATION' | 'MATERIAL' | 'OTHER';
  advanceNumber?: string;
  originalAmount: number;
  releasedAmount: number;
  recoveredAmount: number;
  balanceAmount: number;
  recoveryPercent: number;
  releaseDate?: string;
  recoveryStartBill?: string;
  recoveryCompletionBill?: string;
  status: 'RELEASED' | 'PARTIALLY_RECOVERED' | 'FULLY_RECOVERED' | 'OVERDUE';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 8. RETENTION
// ============================================================
export interface ContractRetention {
  id: string;
  contractId: string;
  retentionPercent: number;
  totalRetentionAmount: number;
  releasedAmount: number;
  balanceAmount: number;
  releaseMilestoneId?: string;
  releaseMilestoneName?: string;
  releaseDate?: string;
  releaseConditions?: string;
  status: 'ACCUMULATING' | 'READY_FOR_RELEASE' | 'RELEASED' | 'PARTIALLY_RELEASED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 9. SECURITY DEPOSIT
// ============================================================
export interface SecurityDeposit {
  id: string;
  contractId: string;
  depositAmount: number;
  depositType: 'CASH' | 'FD' | 'BG' | 'OTHER';
  depositDate: string;
  releaseConditions: string;
  releasedAmount: number;
  balanceAmount: number;
  releaseDate?: string;
  status: 'DEPOSITED' | 'PARTIALLY_RELEASED' | 'RELEASED' | 'FORFEITED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 10. CONTRACT OBLIGATION
// ============================================================
export interface ContractObligation {
  id: string;
  contractId: string;
  obligation: string;
  clauseReference: string;
  responsibleParty: 'CLIENT' | 'CONSULTANT' | 'CONTRACTOR';
  dueDate: string;
  evidence?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'WAIVED';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 11. CONTRACT NOTICE
// ============================================================
export interface ContractNotice {
  id: string;
  contractId: string;
  noticeNumber: string;
  noticeDate: string;
  clauseReference: string;
  subject: string;
  sender: string;
  receiver: string;
  responseDueDate?: string;
  response?: string;
  responseDate?: string;
  status: 'SENT' | 'RECEIVED' | 'RESPONDED' | 'CLOSED';
  linkedToIssue?: string;
  linkedToClaim?: string;
  linkedToEOT?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 12. CONTRACT VALUE CONTROL
// ============================================================
export interface ContractValueControl {
  id: string;
  contractId: string;
  originalValue: number;
  approvedVariations: number;
  extraItems: number;
  deviations: number;
  deductions: number;
  revisedValue: number;
  executedValue: number;
  certifiedValue: number;
  receivedValue: number;
  outstandingValue: number;
  lastUpdated: string;
}

// ============================================================
// 13. CONTRACT RESPONSIBILITY MATRIX
// ============================================================
export interface ContractResponsibilityMatrix {
  id: string;
  contractId: string;
  role: string;
  userId: string;
  userName: string;
  responsibilities: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 14. CONTRACT CLOSEOUT
// ============================================================
export interface ContractCloseout {
  id: string;
  contractId: string;
  checklist: CloseoutItem[];
  overallStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
  completedBy?: string;
  handoverDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CloseoutItem {
  id: string;
  category: string;
  item: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  remarks?: string;
}

// ============================================================
// 15. CONTRACT ALERT
// ============================================================
export interface ContractAlert {
  id: string;
  contractId: string;
  alertType: ContractAlertType;
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

export type ContractAlertType = 
  | 'CONTRACT_EXPIRY'
  | 'BG_EXPIRY'
  | 'INSURANCE_EXPIRY'
  | 'DLP_START'
  | 'DLP_END'
  | 'PG_EXPIRY'
  | 'RETENTION_RELEASE'
  | 'MILESTONE_DUE'
  | 'PAYMENT_DEADLINE'
  | 'OBLIGATION_DUE';

// ============================================================
// 16. CONTRACT DASHBOARD KPIs
// ============================================================
export interface ContractDashboardKPIs {
  totalContracts: number;
  activeContracts: number;
  totalContractValue: number;
  totalRevisedValue: number;
  totalExecutedValue: number;
  totalCertifiedValue: number;
  totalReceivedValue: number;
  totalOutstandingValue: number;
  totalVariations: number;
  totalClaims: number;
  totalEOT: number;
  totalRetention: number;
  totalSecurityDeposit: number;
  totalAdvance: number;
  totalBG: number;
  expiringBG: number;
  expiringPG: number;
  overdueObligations: number;
  pendingMilestones: number;
  contractsInDLP: number;
}

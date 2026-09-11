// ============================================================
// BUILDCORE ERP - COMMERCIAL MANAGEMENT TYPES
// Part 23: Commercial Management / Receivables / Claims
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. COMMERCIAL 360° VIEW
// ============================================================
export interface Commercial360View {
  projectId: string;
  contractValue: ContractValueBreakdown;
  executionValue: number;
  measuredValue: number;
  billingValue: BillingValueBreakdown;
  certificationValue: CertificationValueBreakdown;
  receivableValue: ReceivableValueBreakdown;
  collectionValue: CollectionValueBreakdown;
  profitability: ProfitabilityBreakdown;
}

export interface ContractValueBreakdown {
  originalValue: number;
  revisedValue: number;
  variationValue: number;
  claimValue: number;
  totalValue: number;
}

export interface BillingValueBreakdown {
  billedAmount: number;
  certifiedAmount: number;
  uncertifiedAmount: number;
}

export interface CertificationValueBreakdown {
  certifiedAmount: number;
  pendingCertification: number;
  rejectedAmount: number;
}

export interface ReceivableValueBreakdown {
  totalReceivable: number;
  currentReceivable: number;
  overdueReceivable: number;
}

export interface CollectionValueBreakdown {
  collectedAmount: number;
  pendingCollection: number;
  collectionTarget: number;
}

export interface ProfitabilityBreakdown {
  contractValue: number;
  totalCost: number;
  grossProfit: number;
  grossProfitMargin: number;
  netProfit: number;
  netProfitMargin: number;
}

// ============================================================
// 2. CONTRACT POSITION
// ============================================================
export interface ContractPosition {
  projectId: string;
  contractId: string;
  originalContractValue: number;
  revisedContractValue: number;
  executedValue: number;
  measuredValue: number;
  certifiedValue: number;
  billedValue: number;
  receivedValue: number;
  outstanding: number;
  variance: number;
  variancePercent: number;
}

// ============================================================
// 3. RECEIVABLE AGEING
// ============================================================
export interface ReceivableAgeing {
  id: string;
  projectId: string;
  clientId: string;
  billId: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  outstandingAmount: number;
  ageingBucket: AgeingBucket;
  daysOutstanding: number;
}

export interface AgeingBucket {
  id: string;
  companyId: string;
  bucketName: string;
  minDays: number;
  maxDays: number;
  sortOrder: number;
}

export interface ReceivableAgeingSummary {
  bucketName: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

// ============================================================
// 4. COLLECTION PLANNING
// ============================================================
export interface CollectionPlan {
  id: string;
  projectId: string;
  clientId: string;
  month: string;
  expectedAmount: number;
  responsiblePersonId: string;
  responsiblePersonName: string;
  commitmentDate: string;
  actualReceipt?: number;
  receiptDate?: string;
  status: CollectionStatus;
  remarks?: string;
}

export type CollectionStatus = 'PLANNED' | 'COMMITTED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'OVERDUE';

// ============================================================
// 5. FOLLOW-UP CRM
// ============================================================
export interface FollowUpActivity {
  id: string;
  projectId?: string;
  clientId?: string;
  billId?: string;
  activityType: FollowUpType;
  activityDate: string;
  description: string;
  performedBy: string;
  performedByName: string;
  nextFollowUpDate?: string;
  outcome?: string;
  attachments?: string[];
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
}

export type FollowUpType = 'PHONE_CALL' | 'EMAIL' | 'MEETING' | 'SITE_VISIT' | 'REMINDER' | 'LETTER' | 'NOTICE';

// ============================================================
// 6. COMMERCIAL CORRESPONDENCE
// ============================================================
export interface CommercialCorrespondence {
  id: string;
  projectId?: string;
  contractId?: string;
  billId?: string;
  correspondenceType: 'INCOMING' | 'OUTGOING';
  referenceNumber: string;
  subject: string;
  date: string;
  sender: string;
  recipient: string;
  contractClause?: string;
  responseDueDate?: string;
  content: string;
  attachments: string[];
  status: CorrespondenceStatus;
  responseReceived?: boolean;
  responseDate?: string;
  responseContent?: string;
}

export type CorrespondenceStatus = 'DRAFT' | 'SENT' | 'RECEIVED' | 'RESPONDED' | 'CLOSED';

// ============================================================
// 7. CLAIM MANAGEMENT
// ============================================================
export interface Claim {
  id: string;
  companyId: string;
  claimNumber: string;
  projectId: string;
  contractId: string;
  claimType: ClaimType;
  title: string;
  description: string;
  claimAmount: number;
  claimedDate: string;
  eventDate: string;
  supportingDocuments: string[];
  status: ClaimStatus;
  noticeSent: boolean;
  noticeDate?: string;
  submittedDate?: string;
  reviewDate?: string;
  queryRaised?: boolean;
  queryDate?: string;
  queryResponse?: string;
  negotiationStarted?: boolean;
  negotiationDate?: string;
  approvedAmount?: number;
  approvedDate?: string;
  rejectedReason?: string;
  certifiedAmount?: number;
  certifiedDate?: string;
  paidAmount?: number;
  paidDate?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: number;
}

export type ClaimType =
  | 'DELAY'
  | 'EOT'
  | 'ESCALATION'
  | 'VARIATION'
  | 'EXTRA_ITEM'
  | 'IDLE_RESOURCES'
  | 'PROLONGATION_COST'
  | 'CLIENT_INSTRUCTION'
  | 'QUANTITY_VARIATION';

export type ClaimStatus =
  | 'DRAFT'
  | 'NOTICE_SENT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'QUERY_RAISED'
  | 'IN_NEGOTIATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'CERTIFIED'
  | 'PAID';

// ============================================================
// 8. COMMERCIAL RISK REGISTER
// ============================================================
export interface CommercialRisk {
  id: string;
  companyId: string;
  projectId: string;
  riskType: CommercialRiskType;
  title: string;
  description: string;
  amount: number;
  probability: RiskProbability;
  impact: RiskImpact;
  riskScore: number;
  mitigationPlan?: string;
  status: RiskStatus;
  identifiedDate: string;
  resolvedDate?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export type CommercialRiskType =
  | 'UNCERTIFIED_BILLS'
  | 'LONG_OUTSTANDING_RECEIVABLES'
  | 'UNAPPROVED_VARIATION'
  | 'UNRECOVERED_ADVANCE'
  | 'EXCESS_QUANTITY'
  | 'RETENTION'
  | 'SECURITY'
  | 'CLAIM_AGEING'
  | 'CONTRACT_EXPIRY';

export type RiskProbability = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
export type RiskImpact = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskStatus = 'IDENTIFIED' | 'MITIGATING' | 'RESOLVED' | 'ACCEPTED';

// ============================================================
// 9. COMMERCIAL DASHBOARD KPIs
// ============================================================
export interface CommercialDashboardKPIs {
  contractValue: number;
  billingValue: number;
  certificationValue: number;
  collectionValue: number;
  outstandingValue: number;
  claimsValue: number;
  variationsValue: number;
  retentionValue: number;
  advanceValue: number;
  commercialRiskScore: number;
  receivableAgeing: ReceivableAgeingSummary[];
  claimStatus: ClaimStatusSummary[];
  collectionPerformance: CollectionPerformanceSummary;
}

export interface ClaimStatusSummary {
  status: ClaimStatus;
  count: number;
  totalAmount: number;
}

export interface CollectionPerformanceSummary {
  targetAmount: number;
  collectedAmount: number;
  collectionPercentage: number;
  overdueAmount: number;
}

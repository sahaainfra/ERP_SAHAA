// ============================================================
// BUILDCORE ERP - COMMERCIAL CHANGE CONTROL TYPES
// Part 12: Complete Commercial Change-Control System
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. VARIATION MASTER
// ============================================================
export interface VariationMaster {
  id: string;
  companyId: string;
  variationNumber: string;
  projectId: string;
  projectName: string;
  contractId: string;
  contractNumber: string;
  boqItemId?: string;
  wbsId?: string;
  description: string;
  variationType: VariationType;
  originalQuantity: number;
  revisedQuantity: number;
  varianceQuantity: number;
  originalRate: number;
  proposedRate: number;
  approvedRate: number;
  originalAmount: number;
  revisedAmount: number;
  varianceAmount: number;
  percentageVariance: number;
  reason: string;
  initiatedBy: string;
  initiatedDate: string;
  status: VariationStatus;
  approvedBy?: string;
  approvedAt?: string;
  supportingDocumentId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type VariationType = 
  | 'QUANTITY_VARIATION'
  | 'RATE_VARIATION'
  | 'SCOPE_CHANGE'
  | 'SPECIFICATION_CHANGE'
  | 'DESIGN_CHANGE'
  | 'CLIENT_INSTRUCTION'
  | 'CONSULTANT_INSTRUCTION'
  | 'OMISSION'
  | 'ADDITION'
  | 'SUBSTITUTION'
  | 'RE_MEASUREMENT'
  | 'OTHER';

export type VariationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

// ============================================================
// 2. DEVIATION CONTROL
// ============================================================
export interface DeviationControl {
  id: string;
  contractId: string;
  boqItemId: string;
  itemNumber: string;
  description: string;
  contractQuantity: number;
  executedQuantity: number;
  balanceQuantity: number;
  deviationPercent: number;
  allowedThreshold: number;
  approvalRequired: boolean;
  status: 'WITHIN_LIMIT' | 'THRESHOLD_EXCEEDED' | 'APPROVAL_PENDING' | 'APPROVED';
  alertSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 3. EXTRA ITEM
// ============================================================
export interface ExtraItem {
  id: string;
  companyId: string;
  extraItemNumber: string;
  projectId: string;
  contractId: string;
  description: string;
  specification?: string;
  uom: string;
  quantity: number;
  proposedRate: number;
  approvedRate?: number;
  rateAnalysisId?: string;
  rateSource: 'COMPANY_RATE' | 'MARKET_QUOTATION' | 'VENDOR_QUOTATION' | 'RATE_ANALYSIS' | 'NEGOTIATED_RATE';
  supportingDocumentId?: string;
  clientInstructionId?: string;
  reason: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 4. RATE NEGOTIATION
// ============================================================
export interface RateNegotiation {
  id: string;
  extraItemId?: string;
  variationId?: string;
  itemDescription: string;
  initialProposedRate: number;
  clientRate?: number;
  contractorRate: number;
  negotiatedRate: number;
  finalApprovedRate: number;
  negotiationHistory: NegotiationEntry[];
  participants: string[];
  conclusionDate?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface NegotiationEntry {
  id: string;
  date: string;
  proposedBy: string;
  proposedRate: number;
  remarks?: string;
}

// ============================================================
// 5. CLIENT INSTRUCTION
// ============================================================
export interface ClientInstruction {
  id: string;
  companyId: string;
  instructionNumber: string;
  projectId: string;
  contractId: string;
  instructionDate: string;
  issuer: string;
  issuerOrganization: string;
  clauseReference?: string;
  description: string;
  impact: string;
  requiredAction: string;
  attachmentId?: string;
  status: 'RECEIVED' | 'UNDER_REVIEW' | 'ACKNOWLEDGED' | 'IMPLEMENTED' | 'DISPUTED';
  responseDate?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 6. SITE INSTRUCTION
// ============================================================
export interface SiteInstruction {
  id: string;
  companyId: string;
  instructionNumber: string;
  projectId: string;
  siteId: string;
  contractId: string;
  instructionDate: string;
  issuedBy: string;
  issuedByName: string;
  activity?: string;
  description: string;
  impact?: string;
  complianceRequired: boolean;
  evidenceId?: string;
  status: 'ISSUED' | 'ACKNOWLEDGED' | 'COMPLETED' | 'CLOSED';
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 7. CLAIM REGISTER
// ============================================================
export interface ClaimRegister {
  id: string;
  companyId: string;
  claimNumber: string;
  projectId: string;
  projectName: string;
  contractId: string;
  contractNumber: string;
  claimType: ClaimType;
  claimAmount: number;
  basis: string;
  clauseReference: string;
  eventDate: string;
  noticeDate: string;
  submissionDate?: string;
  supportingEvidence: ClaimEvidence[];
  status: ClaimStatus;
  recommendedAmount?: number;
  approvedAmount?: string;
  certifiedAmount?: number;
  paidAmount?: number;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type ClaimType = 
  | 'ADDITIONAL_WORK'
  | 'DELAY'
  | 'PRICE_ESCALATION'
  | 'IDLE_RESOURCES'
  | 'ACCELERATION'
  | 'PROLONGATION'
  | 'VARIATION'
  | 'COMPENSATION'
  | 'OTHER';

export type ClaimStatus = 
  | 'DRAFT'
  | 'NOTICE_ISSUED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'QUERY_RAISED'
  | 'NEGOTIATION'
  | 'RECOMMENDED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CERTIFIED'
  | 'PAID'
  | 'CLOSED';

export interface ClaimEvidence {
  id: string;
  claimId: string;
  evidenceType: ClaimEvidenceType;
  documentId: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
}

export type ClaimEvidenceType = 
  | 'LETTER'
  | 'PHOTO'
  | 'DAILY_REPORT'
  | 'PROGRAMME'
  | 'MEASUREMENT'
  | 'INVOICE'
  | 'RESOURCE_RECORD'
  | 'PLANT_LOG'
  | 'ATTENDANCE'
  | 'CORRESPONDENCE';

// ============================================================
// 8. EOT REGISTER
// ============================================================
export interface EOTRegister {
  id: string;
  companyId: string;
  eotNumber: string;
  projectId: string;
  projectName: string;
  contractId: string;
  contractNumber: string;
  reason: EOTReason;
  eventDescription: string;
  eventStartDate: string;
  eventEndDate?: string;
  affectedActivities: string[];
  originalCompletionDate: string;
  requestedExtension: number; // days
  approvedExtension?: number; // days
  revisedCompletionDate?: string;
  status: EOTStatus;
  supportingDocuments: string[];
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type EOTReason = 
  | 'CLIENT_DELAY'
  | 'DRAWING_DELAY'
  | 'LAND_ISSUE'
  | 'UTILITY_SHIFTING'
  | 'MATERIAL_APPROVAL'
  | 'DESIGN_CHANGE'
  | 'FORCE_MAJEURE'
  | 'WEATHER'
  | 'STATUTORY_APPROVAL'
  | 'OTHER';

export type EOTStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PARTIALLY_APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

// ============================================================
// 9. DELAY EVENT
// ============================================================
export interface DelayEvent {
  id: string;
  companyId: string;
  eventNumber: string;
  projectId: string;
  contractId: string;
  cause: string;
  responsibleParty: 'CLIENT' | 'CONSULTANT' | 'CONTRACTOR' | 'THIRD_PARTY' | 'FORCE_MAJEURE';
  startDate: string;
  endDate?: string;
  durationDays: number;
  affectedActivity?: string;
  evidence?: string;
  noticeIssued: boolean;
  noticeDate?: string;
  claimId?: string;
  eotId?: string;
  status: 'IDENTIFIED' | 'NOTIFIED' | 'UNDER_ANALYSIS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 10. COMMERCIAL IMPACT
// ============================================================
export interface CommercialImpact {
  id: string;
  variationId?: string;
  claimId?: string;
  eotId?: string;
  additionalCost: number;
  lostProductivity: number;
  idlePlant: number;
  idleManpower: number;
  materialEscalation: number;
  overhead: number;
  revenueImpact: number;
  totalImpact: number;
  calculatedAt: string;
  calculatedBy: string;
}

// ============================================================
// 11. CHANGE REGISTER
// ============================================================
export interface ChangeRegister {
  id: string;
  changeType: 'VARIATION' | 'DEVIATION' | 'EXTRA_ITEM' | 'CLAIM' | 'EOT' | 'INSTRUCTION' | 'AMENDMENT';
  changeId: string;
  changeNumber: string;
  projectId: string;
  contractId: string;
  description: string;
  value: number;
  status: string;
  date: string;
  impact: 'COST' | 'TIME' | 'BOTH' | 'NONE';
}

// ============================================================
// 12. COMMERCIAL DASHBOARD KPIs
// ============================================================
export interface CommercialDashboardKPIs {
  totalVariations: number;
  variationValue: number;
  pendingVariations: number;
  approvedVariations: number;
  extraItemValue: number;
  pendingExtraItems: number;
  totalClaims: number;
  claimValue: number;
  pendingClaims: number;
  approvedClaims: number;
  claimAgeing: ClaimAgeingBucket[];
  eotRequests: number;
  approvedEOT: number;
  totalEOTDays: number;
  delayDays: number;
  potentialRecovery: number;
  deviationAlerts: number;
}

export interface ClaimAgeingBucket {
  bucket: string; // 0-30, 31-60, 61-90, 90+
  count: number;
  value: number;
}

// ============================================================
// 13. COMMERCIAL ALERT
// ============================================================
export interface CommercialAlert {
  id: string;
  alertType: CommercialAlertType;
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

export type CommercialAlertType = 
  | 'VARIATION_THRESHOLD_EXCEEDED'
  | 'EXTRA_ITEM_PENDING'
  | 'CLAIM_DEADLINE'
  | 'EOT_DEADLINE'
  | 'NOTICE_RESPONSE_OVERDUE'
  | 'CLIENT_INSTRUCTION_PENDING';

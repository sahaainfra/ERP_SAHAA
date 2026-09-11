// ============================================================
// BUILDCORE ERP - TENDER MANAGEMENT TYPES
// Part 08: Complete Tender Management Module
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. TENDER REGISTER
// ============================================================
export interface TenderMaster {
  id: string;
  companyId: string;
  tenderNumber: string;
  tenderTitle: string;
  client: string;
  department?: string;
  authority?: string;
  location: string;
  tenderType: TenderType;
  projectType: string;
  estimatedCost: number;
  pac?: string;
  tenderFee: number;
  emdAmount: number;
  bidSecurity?: number;
  performanceSecurity?: number;
  publicationDate: string;
  documentDownloadDate?: string;
  prebidDate?: string;
  queryDeadline?: string;
  submissionDeadline: string;
  openingDate?: string;
  validityDays: number;
  status: TenderStatus;
  tenderManagerId?: string;
  tenderManagerName?: string;
  responsibleTeam: string[];
  description?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type TenderType = 
  | 'OPEN'
  | 'LIMITED'
  | 'SINGLE'
  | 'EPC'
  | 'ITEM_RATE'
  | 'PERCENTAGE_RATE'
  | 'LUMP_SUM'
  | 'TURNKEY'
  | 'DESIGN_BUILD'
  | 'TWO_STAGE'
  | 'QCBS'
  | 'OTHER';

export type TenderStatus = 
  | 'IDENTIFIED'
  | 'UNDER_REVIEW'
  | 'ELIGIBILITY_CHECK'
  | 'ESTIMATION'
  | 'BID_NO_BID'
  | 'APPROVED'
  | 'SUBMITTED'
  | 'OPENED'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'CANCELLED'
  | 'DISQUALIFIED'
  | 'WITHDRAWN';

// ============================================================
// 2. TENDER DOCUMENT REPOSITORY
// ============================================================
export interface TenderDocument {
  id: string;
  tenderId: string;
  documentType: TenderDocumentType;
  fileName: string;
  filePath: string;
  fileSize: number;
  version: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  corrigendumNumber?: number;
  isSuperseded: boolean;
  supersededBy?: string;
  remarks?: string;
  status: EntityStatus;
}

export type TenderDocumentType = 
  | 'NIT'
  | 'TENDER_NOTICE'
  | 'RFP'
  | 'BOQ'
  | 'SPECIFICATIONS'
  | 'DRAWINGS'
  | 'SCHEDULES'
  | 'CORRIGENDUM'
  | 'ADDENDUM'
  | 'ELIGIBILITY'
  | 'TECHNICAL_CRITERIA'
  | 'FINANCIAL_CRITERIA'
  | 'CONTRACT_CONDITIONS'
  | 'SPECIAL_CONDITIONS'
  | 'GENERAL_CONDITIONS'
  | 'FORMS'
  | 'DECLARATIONS'
  | 'OTHER';

// ============================================================
// 3. TENDER CHECKLIST
// ============================================================
export interface TenderChecklist {
  id: string;
  tenderId: string;
  items: ChecklistItem[];
  completionPercentage: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  itemName: string;
  isRequired: boolean;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  evidence?: string;
  remarks?: string;
}

export type ChecklistCategory = 
  | 'REGISTRATION'
  | 'ELIGIBILITY'
  | 'EXPERIENCE'
  | 'TURNOVER'
  | 'FINANCIAL_CAPACITY'
  | 'SIMILAR_WORKS'
  | 'TECHNICAL_STAFF'
  | 'EQUIPMENT'
  | 'EMD'
  | 'TENDER_FEE'
  | 'POWER_OF_ATTORNEY'
  | 'GST'
  | 'PAN'
  | 'SOLVENCY'
  | 'AFFIDAVITS'
  | 'DECLARATIONS'
  | 'OTHER';

// ============================================================
// 4. ELIGIBILITY MATRIX
// ============================================================
export interface EligibilityMatrix {
  id: string;
  tenderId: string;
  criteria: EligibilityCriterion[];
  overallStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PENDING' | 'QUERY';
  lastUpdated: string;
  updatedBy: string;
}

export interface EligibilityCriterion {
  id: string;
  requirement: string;
  minimumValue: string;
  bidderValue: string;
  evidence?: string;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PENDING' | 'QUERY';
  remarks?: string;
}

// ============================================================
// 5. TENDER TEAM
// ============================================================
export interface TenderTeam {
  id: string;
  tenderId: string;
  userId: string;
  userName: string;
  role: TenderTeamRole;
  assignedAt: string;
  assignedBy: string;
}

export type TenderTeamRole = 
  | 'TENDER_MANAGER'
  | 'ESTIMATOR'
  | 'PLANNING'
  | 'QS'
  | 'TECHNICAL'
  | 'CONTRACTS'
  | 'FINANCE'
  | 'LEGAL'
  | 'MANAGEMENT';

// ============================================================
// 6. PRE-BID MANAGEMENT
// ============================================================
export interface PreBidQuery {
  id: string;
  tenderId: string;
  question: string;
  clauseReference?: string;
  clarificationRequested: string;
  submittedDate: string;
  submittedBy: string;
  submittedByName: string;
  clientResponse?: string;
  responseDate?: string;
  impactOnEstimate: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  impactOnBOQ: boolean;
  actionRequired?: string;
  status: 'SUBMITTED' | 'RESPONDED' | 'CLOSED';
}

// ============================================================
// 7. CORRIGENDUM CONTROL
// ============================================================
export interface Corrigendum {
  id: string;
  tenderId: string;
  corrigendumNumber: number;
  issueDate: string;
  changes: CorrigendumChange[];
  impactAssessment: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface CorrigendumChange {
  id: string;
  changeType: 'BOQ' | 'QUANTITY' | 'SPECIFICATION' | 'DEADLINE' | 'ELIGIBILITY' | 'COMMERCIAL_TERMS' | 'OTHER';
  description: string;
  affectedItems: string[];
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// ============================================================
// 8. TENDER BOQ
// ============================================================
export interface TenderBOQ {
  id: string;
  tenderId: string;
  items: TenderBOQItem[];
  totalAmount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface TenderBOQItem {
  id: string;
  tenderBOQId: string;
  itemNumber: string;
  description: string;
  specification?: string;
  uom: string;
  quantity: number;
  clientRate?: number;
  amount: number;
  rateLibraryId?: string;
  remarks?: string;
}

// ============================================================
// 9. BID ESTIMATE
// ============================================================
export interface BidEstimate {
  id: string;
  tenderId: string;
  scenario: BidScenario;
  items: BidEstimateItem[];
  totalBaseCost: number;
  totalOverheads: number;
  totalProfit: number;
  totalRisk: number;
  totalGST: number;
  finalBidAmount: number;
  margin: number;
  marginPercent: number;
  preparedBy: string;
  preparedAt: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'SUBMITTED';
  version: number;
}

export interface BidEstimateItem {
  id: string;
  bidEstimateId: string;
  tenderBOQItemId: string;
  itemNumber: string;
  description: string;
  quantity: number;
  baseRate: number;
  materialCost: number;
  labourCost: number;
  plantCost: number;
  subcontractCost: number;
  overheads: number;
  profit: number;
  risk: number;
  wastage: number;
  leadLift: number;
  gst: number;
  finalRate: number;
  amount: number;
}

export type BidScenario = 'CONSERVATIVE' | 'TARGET' | 'AGGRESSIVE' | 'MANAGEMENT_APPROVED';

// ============================================================
// 10. BID/NO-BID DECISION
// ============================================================
export interface BidNoBidDecision {
  id: string;
  tenderId: string;
  decision: 'BID' | 'NO_BID' | 'PENDING';
  scoring: BidNoBidScore[];
  totalScore: number;
  recommendation: 'BID' | 'NO_BID' | 'CONDITIONAL';
  managementOverride?: 'BID' | 'NO_BID';
  overrideReason?: string;
  decidedBy: string;
  decidedAt: string;
  remarks?: string;
}

export interface BidNoBidScore {
  id: string;
  category: BidNoBidCategory;
  score: number; // 1-10
  weightage: number; // percentage
  weightedScore: number;
  remarks?: string;
}

export type BidNoBidCategory = 
  | 'STRATEGIC_VALUE'
  | 'CLIENT_QUALITY'
  | 'COMPETITION'
  | 'MARGIN'
  | 'RISK'
  | 'RESOURCE_AVAILABILITY'
  | 'FINANCIAL_CAPACITY'
  | 'LOCATION'
  | 'PAYMENT_TERMS'
  | 'CONTRACT_RISK';

// ============================================================
// 11. EMD TRACKING
// ============================================================
export interface EMDTracking {
  id: string;
  tenderId: string;
  amount: number;
  instrumentType: 'DD' | 'PAY_ORDER' | 'BANK_GUARANTEE' | 'FDR';
  instrumentNumber: string;
  bankName: string;
  issueDate: string;
  expiryDate: string;
  submissionDate?: string;
  refundDate?: string;
  forfeitureDate?: string;
  status: 'PREPARED' | 'SUBMITTED' | 'REFUNDED' | 'FORFEITED' | 'ADJUSTED';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 12. COMPETITOR REGISTER
// ============================================================
export interface CompetitorBid {
  id: string;
  tenderId: string;
  bidderName: string;
  quotedValue: number;
  rank?: number;
  result: 'L1' | 'L2' | 'L3' | 'OTHER' | 'DISQUALIFIED';
  remarks?: string;
  source: 'PUBLIC' | 'OPENING' | 'OTHER';
  recordedBy: string;
  recordedAt: string;
}

// ============================================================
// 13. TENDER RESULT
// ============================================================
export interface TenderResult {
  id: string;
  tenderId: string;
  result: 'WON' | 'LOST' | 'CANCELLED' | 'DISQUALIFIED' | 'WITHDRAWN' | 'PENDING';
  loAReceived?: boolean;
  loADate?: string;
  loANumber?: string;
  loAAmount?: number;
  negotiationRequired?: boolean;
  negotiationDetails?: string;
  performanceSecuritySubmitted?: boolean;
  agreementSigned?: boolean;
  workOrderReceived?: boolean;
  contractId?: string;
  projectId?: string;
  remarks?: string;
  recordedBy: string;
  recordedAt: string;
}

// ============================================================
// 14. TENDER CALENDAR
// ============================================================
export interface TenderCalendarEvent {
  id: string;
  tenderId: string;
  eventType: TenderCalendarEventType;
  eventDate: string;
  title: string;
  description?: string;
  isMandatory: boolean;
  completedAt?: string;
  completedBy?: string;
}

export type TenderCalendarEventType = 
  | 'SUBMISSION_DEADLINE'
  | 'PREBID_MEETING'
  | 'OPENING_DATE'
  | 'EMD_EXPIRY'
  | 'CLARIFICATION_DEADLINE'
  | 'SITE_VISIT'
  | 'TECHNICAL_EVALUATION'
  | 'FINANCIAL_EVALUATION'
  | 'NEGOTIATION'
  | 'LOA_ISSUE'
  | 'OTHER';

// ============================================================
// 15. TENDER DASHBOARD KPIs
// ============================================================
export interface TenderDashboardKPIs {
  openTenders: number;
  closingSoon: number; // within 7 days
  bidNoBidPending: number;
  estimatePending: number;
  approvalPending: number;
  submitted: number;
  won: number;
  lost: number;
  winRate: number; // percentage
  estimatedValue: number;
  pipeline: number; // total value of open tenders
  wonValue: number;
  lostValue: number;
}

// ============================================================
// 16. TENDER WORKFLOW INTEGRATION
// ============================================================
export interface TenderWorkflowLink {
  tenderId: string;
  workflowInstanceId: string;
  workflowType: 'BID_APPROVAL' | 'ESTIMATE_APPROVAL' | 'EMD_APPROVAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

// ============================================================
// BUILDCORE ERP - WORKFLOW ENGINE TYPES
// Part 04: Enterprise Workflow & Approval Engine
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. WORKFLOW MASTER
// ============================================================
export interface WorkflowMaster {
  id: string;
  companyId: string;
  workflowCode: string;
  workflowName: string;
  module: string;
  transactionType: string;
  description?: string;
  projectId?: string;
  departmentId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  levels: WorkflowLevel[];
  conditions: WorkflowCondition[];
  version: number;
  isActive: boolean;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 2. WORKFLOW LEVEL
// ============================================================
export interface WorkflowLevel {
  id: string;
  levelNumber: number;
  approverType: 'ROLE' | 'USER' | 'DEPARTMENT' | 'PROJECT' | 'HIERARCHY' | 'FINANCIAL' | 'PARALLEL';
  approverRoleId?: string;
  approverUserId?: string;
  approverDepartmentId?: string;
  financialLimit?: number;
  isRequired: boolean;
  approvalMode: 'SEQUENTIAL' | 'PARALLEL';
  slaHours: number;
  escalationLevel?: number;
  delegationAllowed: boolean;
  parallelApprovers?: string[]; // User IDs for parallel approval
}

// ============================================================
// 3. WORKFLOW CONDITION
// ============================================================
export interface WorkflowCondition {
  id: string;
  conditionType: 'AMOUNT' | 'PROJECT' | 'DEPARTMENT' | 'TRANSACTION_TYPE' | 'COST_CODE' | 'BUDGET_STATUS' | 'VENDOR' | 'MATERIAL_CATEGORY' | 'USER_ROLE' | 'RISK_LEVEL' | 'QUANTITY_VARIANCE' | 'CONTRACT_VALUE';
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_EQUAL' | 'LESS_EQUAL' | 'IN' | 'NOT_IN' | 'CONTAINS';
  value: any;
  targetLevel: number; // Which workflow level this condition applies to
  logic: 'AND' | 'OR';
}

// ============================================================
// 4. WORKFLOW INSTANCE
// ============================================================
export interface WorkflowInstance {
  id: string;
  companyId: string;
  workflowMasterId: string;
  workflowVersion: number;
  entityType: string;
  entityId: string;
  entityNumber: string;
  entityAmount: number;
  projectId?: string;
  siteId?: string;
  departmentId?: string;
  requesterId: string;
  requesterName: string;
  currentLevel: number;
  status: WorkflowStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedAt: string;
  dueAt: string;
  completedAt?: string;
  totalLevels: number;
  levelStatuses: LevelStatus[];
  createdAt: string;
  updatedAt: string;
}

export type WorkflowStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  | 'QUERY_RAISED'
  | 'CORRECTION_REQUIRED'
  | 'ESCALATED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface LevelStatus {
  levelNumber: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED' | 'ESCALATED';
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
  comments?: string;
  slaDueAt: string;
  slaStatus: 'ON_TIME' | 'DUE_SOON' | 'AT_RISK' | 'OVERDUE' | 'ESCALATED';
}

// ============================================================
// 5. APPROVAL ACTION
// ============================================================
export interface ApprovalAction {
  id: string;
  workflowInstanceId: string;
  levelNumber: number;
  actionType: 'APPROVE' | 'REJECT' | 'RETURN' | 'QUERY' | 'FORWARD' | 'DELEGATE' | 'HOLD' | 'ESCALATE';
  performedBy: string;
  performedByName: string;
  performedAt: string;
  comments?: string;
  reason?: string;
  signatureData?: string;
  ipAddress?: string;
  deviceInfo?: string;
  delegatedTo?: string;
  forwardedTo?: string;
}

// ============================================================
// 6. QUERY SYSTEM
// ============================================================
export interface WorkflowQuery {
  id: string;
  workflowInstanceId: string;
  queryId: string;
  documentId: string;
  fieldReference?: string;
  question: string;
  comment: string;
  attachmentIds?: string[];
  raisedBy: string;
  raisedByName: string;
  raisedAt: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  response?: string;
  respondedBy?: string;
  respondedByName?: string;
  respondedAt?: string;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
}

// ============================================================
// 7. DELEGATION
// ============================================================
export interface WorkflowDelegation {
  id: string;
  companyId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  startDate: string;
  endDate: string;
  modules?: string[];
  transactionTypes?: string[];
  reason: string;
  approvalScope: 'ALL' | 'SPECIFIC';
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  createdBy: string;
  revokedAt?: string;
  revokedBy?: string;
}

// ============================================================
// 8. ESCALATION
// ============================================================
export interface EscalationEvent {
  id: string;
  workflowInstanceId: string;
  levelNumber: number;
  escalationLevel: number; // 1, 2, 3 (management)
  escalatedFrom: string;
  escalatedTo: string;
  escalatedAt: string;
  reason: string;
  slaBreached: boolean;
}

// ============================================================
// 9. APPROVAL TIMELINE
// ============================================================
export interface WorkflowTimelineEntry {
  id: string;
  workflowInstanceId: string;
  eventType: 'CREATED' | 'SUBMITTED' | 'LEVEL_STARTED' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'QUERY_RAISED' | 'QUERY_ANSWERED' | 'RESUBMITTED' | 'ESCALATED' | 'DELEGATED' | 'FORWARDED' | 'COMPLETED' | 'CANCELLED';
  levelNumber?: number;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  comments?: string;
  metadata?: Record<string, any>;
}

// ============================================================
// 10. APPROVAL COMMENTS
// ============================================================
export interface ApprovalComment {
  id: string;
  workflowInstanceId: string;
  comment: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  parentId?: string; // For threaded comments
  attachments?: string[];
  isEdited: boolean;
  editedAt?: string;
}

// ============================================================
// 11. DIGITAL SIGNATURE
// ============================================================
export interface DigitalSignature {
  id: string;
  userId: string;
  signatureImage?: string;
  signatureText?: string;
  approvalTimestamp: string;
  documentHash?: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
}

// ============================================================
// 12. SLA CONFIGURATION
// ============================================================
export interface SLAConfiguration {
  id: string;
  companyId: string;
  workflowMasterId: string;
  levelNumber: number;
  reminderHours: number;
  escalationLevel1Hours: number;
  escalationLevel2Hours: number;
  managementEscalationHours: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 13. APPROVAL DASHBOARD KPIs
// ============================================================
export interface ApprovalDashboardKPIs {
  pendingApprovals: number;
  approvedToday: number;
  rejected: number;
  returned: number;
  queries: number;
  overdue: number;
  escalated: number;
  averageApprovalTime: number; // in hours
  bottlenecks: BottleneckInfo[];
}

export interface BottleneckInfo {
  approverName: string;
  pendingCount: number;
  averageDelay: number; // in hours
}

// ============================================================
// 14. WORKFLOW BUILDER NODES
// ============================================================
export type WorkflowNodeType = 
  | 'START'
  | 'CONDITION'
  | 'APPROVER'
  | 'PARALLEL_BRANCH'
  | 'APPROVAL'
  | 'QUERY'
  | 'REJECTION'
  | 'ESCALATION'
  | 'END';

export interface WorkflowBuilderNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  position: { x: number; y: number };
  config?: any;
  connections: string[]; // IDs of connected nodes
}

export interface WorkflowBuilderEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

// ============================================================
// 15. REPORTS
// ============================================================
export interface ApprovalReport {
  reportType: 'APPROVAL_REGISTER' | 'PENDING_APPROVAL' | 'OVERDUE_APPROVAL' | 'TURNAROUND' | 'APPROVER_PERFORMANCE' | 'WORKFLOW_HISTORY' | 'DELEGATION' | 'ESCALATION' | 'QUERY' | 'REJECTED_TRANSACTION';
  filters: ReportFilters;
  data: any[];
  generatedAt: string;
  generatedBy: string;
}

export interface ReportFilters {
  companyId?: string;
  projectId?: string;
  siteId?: string;
  departmentId?: string;
  module?: string;
  transactionType?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: WorkflowStatus[];
  priority?: string[];
  approverId?: string;
}

// ============================================================
// 16. NOTIFICATION TYPES FOR WORKFLOW
// ============================================================
export interface WorkflowNotification {
  id: string;
  workflowInstanceId: string;
  notificationType: 'SUBMISSION' | 'ASSIGNMENT' | 'REMINDER' | 'QUERY' | 'RESPONSE' | 'APPROVAL' | 'REJECTION' | 'RETURN' | 'ESCALATION' | 'DELEGATION' | 'CANCELLATION';
  recipientId: string;
  recipientName: string;
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// ============================================================
// 17. CONTROLLED EDIT MODE
// ============================================================
export interface ControlledEditSession {
  id: string;
  workflowInstanceId: string;
  userId: string;
  permittedFields: string[];
  lockedFields: string[];
  startedAt: string;
  endedAt?: string;
  changes: FieldChange[];
  correctionReason?: string;
  revisionNumber: number;
}

export interface FieldChange {
  fieldName: string;
  oldValue: any;
  newValue: any;
  changedAt: string;
  changedBy: string;
}

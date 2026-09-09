// ============================================================
// BUILDCORE ERP - CORE TYPE SYSTEM
// Part 01: Foundation Types for all 30 Parts
// ============================================================

// --- Enterprise Hierarchy ---
export interface Company {
  id: string;
  name: string;
  code: string;
  address: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  logo?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface BusinessUnit {
  id: string;
  companyId: string;
  name: string;
  code: string;
  headId?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  businessUnitId: string;
  name: string;
  code: string;
  location: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  code: string;
  parentId?: string;
  headId?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  companyId: string;
  businessUnitId?: string;
  name: string;
  code: string;
  type: ProjectType;
  description?: string;
  location: string;
  clientName: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  status: EntityStatus;
  progress: number;
  budget: number;
  spent: number;
  projectManagerId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProjectSite {
  id: string;
  projectId: string;
  name: string;
  code: string;
  location: string;
  siteInchargeId?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  projectId: string;
  name: string;
  code: string;
  description?: string;
  value: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WBS {
  id: string;
  projectId: string;
  parentId?: string;
  code: string;
  name: string;
  level: number;
  budget: number;
  actual: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CostCode {
  id: string;
  projectId: string;
  wbsId?: string;
  code: string;
  name: string;
  category: CostCategory;
  budget: number;
  actual: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// --- Authentication & Authorization ---
export interface User {
  id: string;
  companyId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation?: string;
  departmentId?: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'SUSPENDED';
  lastLoginAt?: string;
  loginAttempts: number;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  companyId: string;
  name: string;
  code: string;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: PermissionAction;
  description?: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  projectId?: string;
  siteId?: string;
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  deviceInfo: string;
  ipAddress: string;
  createdAt: string;
}

// --- Transaction Status Engine ---
export type TransactionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'QUERY_RAISED'
  | 'CORRECTION_REQUIRED'
  | 'RESUBMITTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  | 'FORWARDED'
  | 'ESCALATED'
  | 'POSTED'
  | 'PARTIALLY_COMPLETED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ON_HOLD'
  | 'CLOSED'
  | 'REOPENED';

export interface StatusTransition {
  from: TransactionStatus;
  to: TransactionStatus;
  requiredPermission?: string;
  requiresApproval?: boolean;
  requiresReason?: boolean;
}

// --- Workflow Engine ---
export interface WorkflowDefinition {
  id: string;
  companyId: string;
  module: string;
  name: string;
  description?: string;
  levels: WorkflowLevel[];
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowLevel {
  level: number;
  approverType: 'ROLE' | 'USER' | 'DEPARTMENT_HEAD' | 'PROJECT_MANAGER' | 'HIERARCHY';
  approverId?: string;
  approverRoleId?: string;
  isMandatory: boolean;
  slaHours?: number;
  autoEscalate?: boolean;
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  entityType: string;
  entityId: string;
  currentLevel: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED' | 'CANCELLED';
  approvals: WorkflowApproval[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowApproval {
  id: string;
  instanceId: string;
  level: number;
  approverId: string;
  action: 'APPROVED' | 'REJECTED' | 'FORWARDED' | 'ESCALATED' | 'PENDING';
  comments?: string;
  actedAt?: string;
  dueAt?: string;
}

// --- Audit Engine ---
export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  entityDescription?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  changedFields?: string[];
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// --- Notification Engine ---
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  readAt?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  expiresAt?: string;
}

// --- Document Engine ---
export interface Document {
  id: string;
  companyId: string;
  projectId?: string;
  entityType: string;
  entityId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  version: number;
  documentType: DocumentType;
  confidentiality: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  expiryDate?: string;
  tags?: string[];
  uploadedBy: string;
  uploadedAt: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
}

// --- Numbering Engine ---
export interface NumberingConfig {
  id: string;
  companyId: string;
  module: string;
  prefix: string;
  includeYear: boolean;
  includeProject: boolean;
  includeDepartment: boolean;
  sequenceLength: number;
  currentSequence: number;
  resetFrequency: 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY';
  lastResetAt?: string;
  separator: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// --- Calculation Engine ---
export interface CalculationResult {
  id: string;
  entityType: string;
  entityId: string;
  formula: string;
  inputs: Record<string, number>;
  result: number;
  roundingRule?: string;
  version: number;
  calculatedAt: string;
  calculatedBy: string;
}

// --- Search Engine ---
export interface SearchResult {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  subtitle?: string;
  description?: string;
  module: string;
  icon?: string;
  score: number;
  url: string;
}

// --- Enums ---
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type ProjectType =
  | 'ROAD'
  | 'BRIDGE'
  | 'RAILWAY'
  | 'METRO'
  | 'TUNNEL'
  | 'DAM'
  | 'WATER_INFRA'
  | 'BUILDING'
  | 'INDUSTRIAL'
  | 'MINING'
  | 'RMC_PLANT'
  | 'EPC'
  | 'OTHER';

export type CostCategory = 'LABOUR' | 'MATERIAL' | 'PLANT' | 'OVERHEAD' | 'SUBCONTRACT' | 'OTHER';

export type PermissionAction = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE' | 'REJECT' | 'SUBMIT' | 'EXPORT' | 'PRINT' | 'ADMIN';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'FAILED_LOGIN'
  | 'CREATE'
  | 'EDIT'
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'RETURN'
  | 'FORWARD'
  | 'DELEGATE'
  | 'ESCALATE'
  | 'CANCEL'
  | 'REVISE'
  | 'POST'
  | 'CLOSE'
  | 'REOPEN'
  | 'UPLOAD'
  | 'DOWNLOAD'
  | 'PRINT'
  | 'EXPORT'
  | 'PERMISSION_CHANGE'
  | 'ROLE_CHANGE'
  | 'MASTER_DATA_CHANGE'
  | 'WORKFLOW_CHANGE';

export type NotificationType = 'IN_APP' | 'EMAIL' | 'PUSH' | 'SMS' | 'CHAT';

export type NotificationCategory =
  | 'APPROVAL'
  | 'QUERY'
  | 'REJECTION'
  | 'OVERDUE'
  | 'ESCALATION'
  | 'PAYMENT'
  | 'PROCUREMENT'
  | 'DELIVERY'
  | 'STOCK'
  | 'ATTENDANCE'
  | 'QUALITY'
  | 'SAFETY'
  | 'CONTRACT'
  | 'BILLING'
  | 'DOCUMENT_EXPIRY'
  | 'PLANT_BREAKDOWN'
  | 'PROJECT_DELAY';

export type DocumentType =
  | 'CONTRACT'
  | 'DRAWING'
  | 'INVOICE'
  | 'REPORT'
  | 'CERTIFICATE'
  | 'PERMIT'
  | 'CORRESPONDENCE'
  | 'PHOTO'
  | 'SPECIFICATION'
  | 'TEST_REPORT'
  | 'MEASUREMENT'
  | 'BILL'
  | 'OTHER';

// --- API Response Types ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationMeta;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// --- Dashboard Types ---
export interface DashboardKPI {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  user: string;
  userAvatar?: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
  status?: TransactionStatus;
}

// --- Theme ---
export type ThemeMode = 'light' | 'dark' | 'system';

// Re-export all master data types from Part 02
export * from './master';

// Re-export all security types from Part 03
export * from './security';

// Re-export all workflow types from Part 04
export * from './workflow';

// Re-export all dashboard types from Part 05
export * from './dashboard';

// Re-export all project types from Part 06
export * from './project';

// Re-export all planning types from Part 07
export * from './planning';

// Re-export all tender types from Part 08
export * from './tender';

// Re-export all rate types from Part 09
export * from './rate';

// Re-export all BOQ types from Part 10
// Avoiding conflicts with other modules
export type {
  BOQMaster,
  BOQSection,
  BOQRevisionType,
  BOQStatus,
  BOQDiscount,
  BOQNegotiation,
  BOQChange,
  BOQValidation,
  BOQValidationType,
  BOQDashboardKPIs,
  BOQDocument,
  ContractConversion,
  RateSource,
  DetailedEstimate as BOQDetailedEstimate,
  AbstractEstimate as BOQAbstractEstimate,
  ResourceSummary as BOQResourceSummary,
  CostSummary as BOQCostSummary,
  BidScenario as BOQBidScenario,
  OverheadBreakdown as BOQOverheadBreakdown,
  TaxBreakdown as BOQTaxBreakdown,
} from './boq';

// Re-export all contract types from Part 11
export * from './contract';

// Re-export all commercial types from Part 12
export * from './commercial';

// Re-export all material types from Part 13
export * from './material';

// Re-export all vendor types from Part 14
export * from './vendor';

// Re-export all procurement types from Part 15
export * from './procurement';

// Re-export all PO types from Part 16
export * from './po';

// Re-export all store types from Part 17
export * from './store';

// Re-export all quality types from Part 18
export * from './quality';

// Re-export all material control types from Part 19
export * from './materialControl';

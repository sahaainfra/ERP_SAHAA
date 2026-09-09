// ============================================================
// BUILDCORE ERP - SECURITY & AUTHORIZATION TYPES
// Part 03: User, Role, Permission & Security Management
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. USER MASTER
// ============================================================
export interface UserMaster {
  id: string;
  companyId: string;
  employeeId: string;
  loginId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePhoto?: string;
  mobile: string;
  designationId: string;
  designationName: string;
  departmentId: string;
  departmentName: string;
  branchId?: string;
  branchName?: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  functionalManagerId?: string;
  functionalManagerName?: string;
  approvalManagerId?: string;
  approvalManagerName?: string;
  backupApproverId?: string;
  backupApproverName?: string;
  roleId: string;
  roleName: string;
  userType: UserType;
  projectAssignments: ProjectAssignment[];
  siteAssignments: SiteAssignment[];
  financialAuthority: FinancialAuthorityConfig;
  attendanceAuthority: boolean;
  passwordHash: string;
  passwordExpiryDate?: string;
  failedLoginAttempts: number;
  lastLoginAt?: string;
  lastLoginIp?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  status: UserStatus;
  joiningDate?: string;
  exitDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type UserType =
  | 'SUPER_ADMIN'
  | 'DIRECTOR'
  | 'PROJECT_MANAGER'
  | 'SITE_ENGINEER'
  | 'PLANNING_ENGINEER'
  | 'QS_BILLING_ENGINEER'
  | 'COMMERCIAL_MANAGER'
  | 'ACCOUNTS_MANAGER'
  | 'FINANCE'
  | 'PROCUREMENT_MANAGER'
  | 'PURCHASE_OFFICER'
  | 'STORE_KEEPER'
  | 'HR_MANAGER'
  | 'QA_QC'
  | 'SAFETY_HSE'
  | 'PLANT_MANAGER'
  | 'RMC_MANAGER'
  | 'TENDER_MANAGER'
  | 'EMPLOYEE'
  | 'LABOUR'
  | 'VENDOR_EXTERNAL';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'SUSPENDED' | 'EXITED';

export interface ProjectAssignment {
  projectId: string;
  projectName: string;
  accessLevel: 'FULL' | 'EDIT' | 'VIEW' | 'NO_ACCESS';
  assignedDate: string;
  endDate?: string;
}

export interface SiteAssignment {
  projectId: string;
  siteId: string;
  siteName: string;
  accessLevel: 'FULL' | 'EDIT' | 'VIEW' | 'NO_ACCESS';
  assignedDate: string;
  endDate?: string;
}

export interface FinancialAuthorityConfig {
  maxRecommendation: number;
  maxApproval: number;
  maxPayment: number;
  currencyId: string;
  transactionTypes: string[];
}

// ============================================================
// 2. ROLE MASTER
// ============================================================
export interface RoleMaster {
  id: string;
  companyId: string;
  roleCode: string;
  roleName: string;
  description?: string;
  isSystem: boolean;
  permissions: Permission[];
  moduleAccess: ModuleAccess[];
  financialLimits: FinancialLimit[];
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface Permission {
  id: string;
  module: string;
  tool?: string;
  action: PermissionAction;
  description?: string;
}

export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE_DRAFT'
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
  | 'CERTIFY'
  | 'SIGN'
  | 'PRINT'
  | 'EXPORT'
  | 'DOWNLOAD'
  | 'UPLOAD'
  | 'COMMENT'
  | 'QUERY';

export interface ModuleAccess {
  module: string;
  accessLevel: 'FULL' | 'EDIT' | 'VIEW' | 'NO_ACCESS';
  tools?: string[];
}

export interface FinancialLimit {
  transactionType: string;
  maxAmount: number;
  currencyId: string;
}

// ============================================================
// 3. PASSWORD POLICY
// ============================================================
export interface PasswordPolicy {
  id: string;
  companyId: string;
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  specialChars: string;
  maxAge: number; // days
  historyCount: number;
  lockoutThreshold: number;
  lockoutDuration: number; // minutes
  resetTokenExpiry: number; // minutes
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 4. LOGIN HISTORY
// ============================================================
export interface LoginHistory {
  id: string;
  userId: string;
  loginId: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  status: 'SUCCESS' | 'FAILED' | 'LOGOUT' | 'EXPIRED';
  failureReason?: string;
  sessionId: string;
}

// ============================================================
// 5. SESSION MANAGEMENT
// ============================================================
export interface UserSession {
  id: string;
  userId: string;
  sessionId: string;
  refreshToken: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
  isActive: boolean;
}

// ============================================================
// 6. DELEGATION
// ============================================================
export interface Delegation {
  id: string;
  companyId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  startDate: string;
  endDate: string;
  module?: string;
  transactionType?: string;
  reason: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  createdBy: string;
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
}

// ============================================================
// 7. APPROVAL CENTER
// ============================================================
export interface ApprovalItem {
  id: string;
  documentId: string;
  documentNumber: string;
  documentType: string;
  documentTypeName: string;
  projectId?: string;
  projectName?: string;
  amount: number;
  currency: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  age: number; // days
  slaDueDate: string;
  slaStatus: 'ON_TIME' | 'AT_RISK' | 'OVERDUE' | 'ESCALATED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  currentStatus: string;
  currentLevel: number;
  approvalLevel: number;
  isDelegated: boolean;
  delegatedFrom?: string;
  comments?: string;
  attachments?: string[];
}

// ============================================================
// 8. APPROVAL TIMELINE
// ============================================================
export interface ApprovalTimelineEntry {
  id: string;
  documentId: string;
  action: 'CREATED' | 'SUBMITTED' | 'REVIEWED' | 'QUERY_RAISED' | 'CORRECTION' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'FORWARDED' | 'ESCALATED' | 'POSTED';
  performedBy: string;
  performedByName: string;
  performedAt: string;
  comments?: string;
  level: number;
  oldStatus?: string;
  newStatus?: string;
}

// ============================================================
// 9. QUERY MODE
// ============================================================
export interface ApprovalQuery {
  id: string;
  documentId: string;
  raisedBy: string;
  raisedByName: string;
  raisedAt: string;
  question: string;
  fieldReference?: string;
  comment: string;
  attachments?: string[];
  dueDate?: string;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
}

// ============================================================
// 10. SLA CONFIGURATION
// ============================================================
export interface SLAConfig {
  id: string;
  companyId: string;
  documentType: string;
  approvalLevel: number;
  dueHours: number;
  reminderHours: number;
  escalationLevel1Hours: number;
  escalationLevel2Hours: number;
  managementEscalationHours: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 11. USER HISTORY
// ============================================================
export interface UserHistory {
  id: string;
  userId: string;
  eventType: 'JOINING' | 'ROLE_CHANGE' | 'DEPARTMENT_TRANSFER' | 'PROJECT_TRANSFER' | 'PROMOTION' | 'MANAGER_CHANGE' | 'PERMISSION_CHANGE' | 'SUSPENSION' | 'REACTIVATION' | 'EXIT';
  eventDate: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  performedBy: string;
  performedByName: string;
}

// ============================================================
// 12. SECURITY DASHBOARD KPIs
// ============================================================
export interface SecurityDashboardKPIs {
  activeUsers: number;
  inactiveUsers: number;
  lockedAccounts: number;
  failedLoginsToday: number;
  activeSessions: number;
  pendingApprovals: number;
  overdueApprovals: number;
  activeDelegations: number;
  recentSuspiciousActivity: number;
  passwordExpiringSoon: number;
}

// ============================================================
// 13. USER DASHBOARD KPIs
// ============================================================
export interface UserDashboardKPIs {
  myTasks: number;
  myApprovals: number;
  myQueries: number;
  myProjects: number;
  myNotifications: number;
  pendingActions: number;
  todayAttendance: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  pendingLeaves: number;
}

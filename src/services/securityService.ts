// ============================================================
// BUILDCORE ERP - SECURITY SERVICE
// Part 03: User, Role, Permission & Security Management
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  UserMaster, RoleMaster, PasswordPolicy, LoginHistory,
  UserSession, Delegation, ApprovalItem, ApprovalTimelineEntry,
  ApprovalQuery, SLAConfig, UserHistory, UserType, UserStatus,
  PermissionAction, ProjectAssignment, SiteAssignment
} from '../types/security';

// ============================================================
// SECURITY SERVICE
// ============================================================
export class SecurityService {
  private static instance: SecurityService;

  // Storage
  private users: Map<string, UserMaster> = new Map();
  private roles: Map<string, RoleMaster> = new Map();
  private passwordPolicy: PasswordPolicy | null = null;
  private loginHistory: LoginHistory[] = [];
  private sessions: Map<string, UserSession> = new Map();
  private delegations: Map<string, Delegation> = new Map();
  private approvalItems: Map<string, ApprovalItem> = new Map();
  private approvalTimelines: Map<string, ApprovalTimelineEntry[]> = new Map();
  private queries: Map<string, ApprovalQuery> = new Map();
  private slaConfigs: Map<string, SLAConfig> = new Map();
  private userHistories: Map<string, UserHistory[]> = new Map();

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // ============================================================
  // INITIALIZE DEMO DATA
  // ============================================================
  initializeDemoData(companyId: string): void {
    if (this.users.size > 0) return;

    const now = new Date().toISOString();

    // Password Policy
    this.passwordPolicy = {
      id: 'pwd_policy_001',
      companyId,
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
      maxAge: 90,
      historyCount: 5,
      lockoutThreshold: 5,
      lockoutDuration: 30,
      resetTokenExpiry: 60,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      createdBy: 'usr_001',
      updatedBy: 'usr_001',
      version: 1,
    };

    // Roles
    const roles: RoleMaster[] = [
      {
        id: 'role_super_admin',
        companyId,
        roleCode: 'SUPER_ADMIN',
        roleName: 'Super Administrator',
        description: 'Full system access with all permissions',
        isSystem: true,
        permissions: [{ id: 'p_all', module: '*', action: 'VIEW' as PermissionAction }],
        moduleAccess: [
          { module: '*', accessLevel: 'FULL' }
        ],
        financialLimits: [
          { transactionType: 'ALL', maxAmount: 1000000000, currencyId: 'cur_inr' }
        ],
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
      {
        id: 'role_project_manager',
        companyId,
        roleCode: 'PM',
        roleName: 'Project Manager',
        description: 'Project-level management and approvals',
        isSystem: true,
        permissions: [
          { id: 'p_proj_view', module: 'projects', action: 'VIEW' },
          { id: 'p_proj_edit', module: 'projects', action: 'EDIT' },
          { id: 'p_proc_view', module: 'procurement', action: 'VIEW' },
          { id: 'p_proc_approve', module: 'procurement', action: 'APPROVE' },
          { id: 'p_bill_view', module: 'billing', action: 'VIEW' },
          { id: 'p_bill_approve', module: 'billing', action: 'APPROVE' },
        ],
        moduleAccess: [
          { module: 'projects', accessLevel: 'FULL' },
          { module: 'procurement', accessLevel: 'FULL' },
          { module: 'billing', accessLevel: 'FULL' },
          { module: 'inventory', accessLevel: 'VIEW' },
          { module: 'finance', accessLevel: 'VIEW' },
        ],
        financialLimits: [
          { transactionType: 'PO', maxAmount: 10000000, currencyId: 'cur_inr' },
          { transactionType: 'BILL', maxAmount: 5000000, currencyId: 'cur_inr' },
        ],
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
      {
        id: 'role_site_engineer',
        companyId,
        roleCode: 'SE',
        roleName: 'Site Engineer',
        description: 'Site-level operations and execution',
        isSystem: true,
        permissions: [
          { id: 'p_proj_view', module: 'projects', action: 'VIEW' },
          { id: 'p_proj_create', module: 'projects', action: 'CREATE' },
          { id: 'p_inventory_view', module: 'inventory', action: 'VIEW' },
          { id: 'p_inventory_create', module: 'inventory', action: 'CREATE' },
          { id: 'p_quality_create', module: 'quality', action: 'CREATE' },
        ],
        moduleAccess: [
          { module: 'projects', accessLevel: 'EDIT' },
          { module: 'inventory', accessLevel: 'EDIT' },
          { module: 'quality', accessLevel: 'FULL' },
          { module: 'safety', accessLevel: 'FULL' },
        ],
        financialLimits: [
          { transactionType: 'PR', maxAmount: 250000, currencyId: 'cur_inr' },
        ],
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
      {
        id: 'role_accounts_manager',
        companyId,
        roleCode: 'AM',
        roleName: 'Accounts Manager',
        description: 'Financial operations and accounting',
        isSystem: true,
        permissions: [
          { id: 'p_finance_full', module: 'finance', action: 'VIEW' },
          { id: 'p_finance_post', module: 'finance', action: 'POST' },
          { id: 'p_billing_view', module: 'billing', action: 'VIEW' },
          { id: 'p_billing_certify', module: 'billing', action: 'CERTIFY' },
        ],
        moduleAccess: [
          { module: 'finance', accessLevel: 'FULL' },
          { module: 'billing', accessLevel: 'FULL' },
          { module: 'procurement', accessLevel: 'VIEW' },
          { module: 'projects', accessLevel: 'VIEW' },
        ],
        financialLimits: [
          { transactionType: 'PAYMENT', maxAmount: 50000000, currencyId: 'cur_inr' },
          { transactionType: 'JV', maxAmount: 100000000, currencyId: 'cur_inr' },
        ],
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
      {
        id: 'role_procurement_manager',
        companyId,
        roleCode: 'PROC_MGR',
        roleName: 'Procurement Manager',
        description: 'Procurement operations and vendor management',
        isSystem: true,
        permissions: [
          { id: 'p_proc_full', module: 'procurement', action: 'VIEW' },
          { id: 'p_proc_create', module: 'procurement', action: 'CREATE' },
          { id: 'p_proc_approve', module: 'procurement', action: 'APPROVE' },
        ],
        moduleAccess: [
          { module: 'procurement', accessLevel: 'FULL' },
          { module: 'inventory', accessLevel: 'VIEW' },
          { module: 'projects', accessLevel: 'VIEW' },
        ],
        financialLimits: [
          { transactionType: 'PO', maxAmount: 25000000, currencyId: 'cur_inr' },
        ],
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
    ];
    roles.forEach(r => this.roles.set(r.id, r));

    // Users
    const users: UserMaster[] = [
      {
        id: 'usr_001',
        companyId,
        employeeId: 'EMP001',
        loginId: 'admin',
        email: 'admin@buildcore.io',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        fullName: 'Rajesh Kumar',
        mobile: '+91-9876543210',
        designationId: 'desig_cmd',
        designationName: 'Chairman & MD',
        departmentId: 'dept_mgt',
        departmentName: 'Management',
        reportingManagerId: undefined,
        functionalManagerId: undefined,
        approvalManagerId: undefined,
        backupApproverId: 'usr_002',
        backupApproverName: 'Priya Sharma',
        roleId: 'role_super_admin',
        roleName: 'Super Administrator',
        userType: 'SUPER_ADMIN',
        projectAssignments: [
          { projectId: 'proj_001', projectName: 'Mumbai-Pune Expressway', accessLevel: 'FULL', assignedDate: '2025-01-01' },
          { projectId: 'proj_002', projectName: 'Chennai Metro', accessLevel: 'FULL', assignedDate: '2025-01-01' },
        ],
        siteAssignments: [],
        financialAuthority: {
          maxRecommendation: 1000000000,
          maxApproval: 1000000000,
          maxPayment: 1000000000,
          currencyId: 'cur_inr',
          transactionTypes: ['ALL'],
        },
        attendanceAuthority: true,
        passwordHash: this.hashPassword('demo123'),
        failedLoginAttempts: 0,
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        lastLoginIp: '192.168.1.100',
        mfaEnabled: false,
        status: 'ACTIVE',
        joiningDate: '2020-01-01',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
      {
        id: 'usr_002',
        companyId,
        employeeId: 'EMP002',
        loginId: 'priya',
        email: 'pm@buildcore.io',
        firstName: 'Priya',
        lastName: 'Sharma',
        fullName: 'Priya Sharma',
        mobile: '+91-9876543211',
        designationId: 'desig_pm',
        designationName: 'Project Manager',
        departmentId: 'dept_proj',
        departmentName: 'Projects',
        reportingManagerId: 'usr_001',
        reportingManagerName: 'Rajesh Kumar',
        backupApproverId: 'usr_001',
        backupApproverName: 'Rajesh Kumar',
        roleId: 'role_project_manager',
        roleName: 'Project Manager',
        userType: 'PROJECT_MANAGER',
        projectAssignments: [
          { projectId: 'proj_001', projectName: 'Mumbai-Pune Expressway', accessLevel: 'FULL', assignedDate: '2025-01-01' },
          { projectId: 'proj_002', projectName: 'Chennai Metro', accessLevel: 'EDIT', assignedDate: '2025-01-01' },
        ],
        siteAssignments: [
          { projectId: 'proj_001', siteId: 'site_001', siteName: 'Site A - Mumbai', accessLevel: 'FULL', assignedDate: '2025-01-01' },
          { projectId: 'proj_001', siteId: 'site_002', siteName: 'Site B - Pune', accessLevel: 'VIEW', assignedDate: '2025-01-01' },
        ],
        financialAuthority: {
          maxRecommendation: 10000000,
          maxApproval: 10000000,
          maxPayment: 5000000,
          currencyId: 'cur_inr',
          transactionTypes: ['PO', 'BILL', 'PR'],
        },
        attendanceAuthority: true,
        passwordHash: this.hashPassword('demo123'),
        failedLoginAttempts: 0,
        lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
        lastLoginIp: '192.168.1.101',
        mfaEnabled: false,
        status: 'ACTIVE',
        joiningDate: '2021-03-15',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
      {
        id: 'usr_003',
        companyId,
        employeeId: 'EMP003',
        loginId: 'amit',
        email: 'engineer@buildcore.io',
        firstName: 'Amit',
        lastName: 'Patel',
        fullName: 'Amit Patel',
        mobile: '+91-9876543212',
        designationId: 'desig_se',
        designationName: 'Site Engineer',
        departmentId: 'dept_civil',
        departmentName: 'Civil',
        reportingManagerId: 'usr_002',
        reportingManagerName: 'Priya Sharma',
        roleId: 'role_site_engineer',
        roleName: 'Site Engineer',
        userType: 'SITE_ENGINEER',
        projectAssignments: [
          { projectId: 'proj_001', projectName: 'Mumbai-Pune Expressway', accessLevel: 'EDIT', assignedDate: '2025-01-01' },
        ],
        siteAssignments: [
          { projectId: 'proj_001', siteId: 'site_001', siteName: 'Site A - Mumbai', accessLevel: 'FULL', assignedDate: '2025-01-01' },
        ],
        financialAuthority: {
          maxRecommendation: 250000,
          maxApproval: 0,
          maxPayment: 0,
          currencyId: 'cur_inr',
          transactionTypes: ['PR'],
        },
        attendanceAuthority: false,
        passwordHash: this.hashPassword('demo123'),
        failedLoginAttempts: 0,
        lastLoginAt: new Date(Date.now() - 1800000).toISOString(),
        lastLoginIp: '192.168.1.102',
        mfaEnabled: false,
        status: 'ACTIVE',
        joiningDate: '2023-06-01',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
    ];
    users.forEach(u => this.users.set(u.id, u));

    // Login History
    this.loginHistory = [
      {
        id: 'lh_001',
        userId: 'usr_001',
        loginId: 'admin',
        loginTime: new Date(Date.now() - 3600000).toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        location: 'Mumbai, India',
        status: 'SUCCESS',
        sessionId: 'sess_001',
      },
      {
        id: 'lh_002',
        userId: 'usr_002',
        loginId: 'priya',
        loginTime: new Date(Date.now() - 7200000).toISOString(),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        location: 'Pune, India',
        status: 'SUCCESS',
        sessionId: 'sess_002',
      },
    ];

    // Sessions
    const sessions: UserSession[] = [
      {
        id: 'sess_001',
        userId: 'usr_001',
        sessionId: `session_${uuidv4()}`,
        refreshToken: `refresh_${uuidv4()}`,
        deviceInfo: 'Chrome on Windows 10',
        ipAddress: '192.168.1.100',
        location: 'Mumbai, India',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
        lastActivityAt: new Date().toISOString(),
        isActive: true,
      },
    ];
    sessions.forEach(s => this.sessions.set(s.id, s));

    // Approval Items (Demo)
    const approvals: ApprovalItem[] = [
      {
        id: 'appr_001',
        documentId: 'po_012',
        documentNumber: 'PO-2026-000012',
        documentType: 'PO',
        documentTypeName: 'Purchase Order',
        projectId: 'proj_001',
        projectName: 'Mumbai-Pune Expressway',
        amount: 2500000,
        currency: 'INR',
        requesterId: 'usr_003',
        requesterName: 'Amit Patel',
        requestDate: new Date(Date.now() - 86400000).toISOString(),
        age: 1,
        slaDueDate: new Date(Date.now() + 48 * 3600000).toISOString(),
        slaStatus: 'ON_TIME',
        priority: 'HIGH',
        currentStatus: 'PENDING_APPROVAL',
        currentLevel: 1,
        approvalLevel: 1,
        isDelegated: false,
      },
      {
        id: 'appr_002',
        documentId: 'bill_045',
        documentNumber: 'RAB-2026-000045',
        documentType: 'RAB',
        documentTypeName: 'RA Bill',
        projectId: 'proj_001',
        projectName: 'Mumbai-Pune Expressway',
        amount: 18500000,
        currency: 'INR',
        requesterId: 'usr_003',
        requesterName: 'Amit Patel',
        requestDate: new Date(Date.now() - 172800000).toISOString(),
        age: 2,
        slaDueDate: new Date(Date.now() + 24 * 3600000).toISOString(),
        slaStatus: 'AT_RISK',
        priority: 'URGENT',
        currentStatus: 'PENDING_APPROVAL',
        currentLevel: 2,
        approvalLevel: 2,
        isDelegated: false,
      },
    ];
    approvals.forEach(a => this.approvalItems.set(a.id, a));

    // SLA Configs
    const slaConfigs: SLAConfig[] = [
      {
        id: 'sla_001',
        companyId,
        documentType: 'PO',
        approvalLevel: 1,
        dueHours: 48,
        reminderHours: 24,
        escalationLevel1Hours: 72,
        escalationLevel2Hours: 96,
        managementEscalationHours: 120,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        version: 1,
      },
    ];
    slaConfigs.forEach(s => this.slaConfigs.set(s.id, s));
  }

  // ============================================================
  // PASSWORD SECURITY
  // ============================================================
  hashPassword(password: string): string {
    // In production, use bcrypt or similar
    // For demo, simple hash
    return `hashed_${password}_${Date.now()}`;
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const policy = this.passwordPolicy;
    if (!policy) return { valid: true, errors: [] };

    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (policy.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (policy.requireSpecialChars && !new RegExp(`[${policy.specialChars}]`).test(password)) {
      errors.push(`Password must contain at least one special character`);
    }

    return { valid: errors.length === 0, errors };
  }

  // ============================================================
  // AUTHENTICATION
  // ============================================================
  async authenticate(loginId: string, password: string, ipAddress: string, userAgent: string): Promise<{ success: boolean; user?: UserMaster; token?: string; error?: string }> {
    const user = Array.from(this.users.values()).find(u => u.loginId === loginId || u.email === loginId);

    if (!user) {
      this.logFailedLogin(loginId, ipAddress, userAgent, 'User not found');
      return { success: false, error: 'Invalid credentials' };
    }

    if (user.status === 'LOCKED') {
      this.logFailedLogin(loginId, ipAddress, userAgent, 'Account locked');
      return { success: false, error: 'Account is locked. Contact administrator.' };
    }

    if (user.status === 'SUSPENDED') {
      this.logFailedLogin(loginId, ipAddress, userAgent, 'Account suspended');
      return { success: false, error: 'Account is suspended. Contact administrator.' };
    }

    // Password validation (simplified for demo)
    if (password !== 'demo123') {
      user.failedLoginAttempts++;
      if (user.failedLoginAttempts >= (this.passwordPolicy?.lockoutThreshold || 5)) {
        user.status = 'LOCKED';
      }
      this.logFailedLogin(loginId, ipAddress, userAgent, 'Invalid password');
      return { success: false, error: 'Invalid credentials' };
    }

    // Success
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date().toISOString();
    user.lastLoginIp = ipAddress;

    const token = `token_${uuidv4()}`;
    const sessionId = `sess_${uuidv4()}`;

    // Create session
    const session: UserSession = {
      id: sessionId,
      userId: user.id,
      sessionId: token,
      refreshToken: `refresh_${uuidv4()}`,
      deviceInfo: userAgent,
      ipAddress,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
      lastActivityAt: new Date().toISOString(),
      isActive: true,
    };
    this.sessions.set(sessionId, session);

    // Log successful login
    this.loginHistory.unshift({
      id: `lh_${uuidv4()}`,
      userId: user.id,
      loginId: user.loginId,
      loginTime: new Date().toISOString(),
      ipAddress,
      userAgent,
      status: 'SUCCESS',
      sessionId,
    });

    return { success: true, user, token };
  }

  private logFailedLogin(loginId: string, ipAddress: string, userAgent: string, reason: string): void {
    this.loginHistory.unshift({
      id: `lh_${uuidv4()}`,
      userId: '',
      loginId,
      loginTime: new Date().toISOString(),
      ipAddress,
      userAgent,
      status: 'FAILED',
      failureReason: reason,
      sessionId: '',
    });
  }

  // ============================================================
  // AUTHORIZATION
  // ============================================================
  hasPermission(userId: string, module: string, action: PermissionAction, projectId?: string, siteId?: string): boolean {
    const user = this.users.get(userId);
    if (!user || user.status !== 'ACTIVE') return false;

    // Super admin has all permissions
    if (user.userType === 'SUPER_ADMIN') return true;

    const role = this.roles.get(user.roleId);
    if (!role) return false;

    // Check module access
    const moduleAccess = role.moduleAccess.find(m => m.module === module || m.module === '*');
    if (!moduleAccess || moduleAccess.accessLevel === 'NO_ACCESS') return false;

    // Check specific permission
    const hasPermission = role.permissions.some(p =>
      (p.module === module || p.module === '*') && p.action === action
    );

    if (!hasPermission) return false;

    // Check project access
    if (projectId) {
      const projectAssignment = user.projectAssignments.find(pa => pa.projectId === projectId);
      if (!projectAssignment || projectAssignment.accessLevel === 'NO_ACCESS') return false;

      // Check site access
      if (siteId) {
        const siteAssignment = user.siteAssignments.find(sa => sa.projectId === projectId && sa.siteId === siteId);
        if (!siteAssignment || siteAssignment.accessLevel === 'NO_ACCESS') return false;
      }
    }

    return true;
  }

  checkFinancialAuthority(userId: string, transactionType: string, amount: number): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    if (user.userType === 'SUPER_ADMIN') return true;

    return user.financialAuthority.transactionTypes.includes(transactionType) &&
           amount <= user.financialAuthority.maxApproval;
  }

  // ============================================================
  // USER MANAGEMENT
  // ============================================================
  getUsers(companyId?: string): UserMaster[] {
    return Array.from(this.users.values()).filter(u => !companyId || u.companyId === companyId);
  }

  getUser(id: string): UserMaster | undefined {
    return this.users.get(id);
  }

  createUser(data: Omit<UserMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>): UserMaster {
    const now = new Date().toISOString();
    const user: UserMaster = {
      ...data,
      id: `usr_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.users.set(user.id, user);
    return user;
  }

  updateUser(id: string, data: Partial<UserMaster>): UserMaster | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updated = { ...user, ...data, updatedAt: new Date().toISOString(), version: user.version + 1 };
    this.users.set(id, updated);
    return updated;
  }

  lockUser(id: string): void {
    const user = this.users.get(id);
    if (user) {
      user.status = 'LOCKED';
      user.updatedAt = new Date().toISOString();
    }
  }

  unlockUser(id: string): void {
    const user = this.users.get(id);
    if (user) {
      user.status = 'ACTIVE';
      user.failedLoginAttempts = 0;
      user.updatedAt = new Date().toISOString();
    }
  }

  // ============================================================
  // ROLE MANAGEMENT
  // ============================================================
  getRoles(companyId?: string): RoleMaster[] {
    return Array.from(this.roles.values()).filter(r => !companyId || r.companyId === companyId);
  }

  getRole(id: string): RoleMaster | undefined {
    return this.roles.get(id);
  }

  // ============================================================
  // SESSION MANAGEMENT
  // ============================================================
  getActiveSessions(userId?: string): UserSession[] {
    return Array.from(this.sessions.values()).filter(s =>
      s.isActive && (!userId || s.userId === userId)
    );
  }

  revokeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
    }
  }

  revokeAllUserSessions(userId: string): void {
    Array.from(this.sessions.values())
      .filter(s => s.userId === userId)
      .forEach(s => { s.isActive = false; });
  }

  // ============================================================
  // DELEGATION
  // ============================================================
  createDelegation(data: Omit<Delegation, 'id' | 'createdAt' | 'status'>): Delegation {
    const delegation: Delegation = {
      ...data,
      id: `del_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
    };
    this.delegations.set(delegation.id, delegation);
    return delegation;
  }

  getActiveDelegations(userId: string): Delegation[] {
    return Array.from(this.delegations.values()).filter(d =>
      d.toUserId === userId && d.status === 'ACTIVE' &&
      new Date(d.endDate) > new Date()
    );
  }

  // ============================================================
  // APPROVAL CENTER
  // ============================================================
  getPendingApprovals(userId: string): ApprovalItem[] {
    const user = this.users.get(userId);
    if (!user) return [];

    return Array.from(this.approvalItems.values()).filter(item =>
      item.currentStatus === 'PENDING_APPROVAL' &&
      this.hasPermission(userId, item.documentType.toLowerCase(), 'APPROVE')
    );
  }

  approveDocument(approvalId: string, userId: string, comments?: string): void {
    const item = this.approvalItems.get(approvalId);
    if (item) {
      item.currentStatus = 'APPROVED';
      // Add timeline entry
      this.addTimelineEntry(item.documentId, 'APPROVED', userId, comments);
    }
  }

  rejectDocument(approvalId: string, userId: string, comments: string): void {
    const item = this.approvalItems.get(approvalId);
    if (item) {
      item.currentStatus = 'REJECTED';
      this.addTimelineEntry(item.documentId, 'REJECTED', userId, comments);
    }
  }

  queryDocument(approvalId: string, userId: string, question: string, comment: string): void {
    const item = this.approvalItems.get(approvalId);
    if (item) {
      item.currentStatus = 'QUERY_RAISED';
      this.addTimelineEntry(item.documentId, 'QUERY_RAISED', userId, comment);

      // Create query
      const query: ApprovalQuery = {
        id: `qry_${uuidv4().slice(0, 8)}`,
        documentId: item.documentId,
        raisedBy: userId,
        raisedByName: this.users.get(userId)?.fullName || '',
        raisedAt: new Date().toISOString(),
        question,
        comment,
        status: 'OPEN',
      };
      this.queries.set(query.id, query);
    }
  }

  private addTimelineEntry(documentId: string, action: ApprovalTimelineEntry['action'], userId: string, comments?: string): void {
    const user = this.users.get(userId);
    const entry: ApprovalTimelineEntry = {
      id: `tl_${uuidv4().slice(0, 8)}`,
      documentId,
      action,
      performedBy: userId,
      performedByName: user?.fullName || '',
      performedAt: new Date().toISOString(),
      comments,
      level: 1,
    };

    const timeline = this.approvalTimelines.get(documentId) || [];
    timeline.push(entry);
    this.approvalTimelines.set(documentId, timeline);
  }

  getApprovalTimeline(documentId: string): ApprovalTimelineEntry[] {
    return this.approvalTimelines.get(documentId) || [];
  }

  // ============================================================
  // SECURITY DASHBOARD
  // ============================================================
  getSecurityDashboardKPIs(companyId: string): any {
    const users = this.getUsers(companyId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return {
      activeUsers: users.filter(u => u.status === 'ACTIVE').length,
      inactiveUsers: users.filter(u => u.status === 'INACTIVE').length,
      lockedAccounts: users.filter(u => u.status === 'LOCKED').length,
      failedLoginsToday: this.loginHistory.filter(lh =>
        lh.status === 'FAILED' && new Date(lh.loginTime) >= today
      ).length,
      activeSessions: this.getActiveSessions().length,
      pendingApprovals: Array.from(this.approvalItems.values()).filter(a => a.currentStatus === 'PENDING_APPROVAL').length,
      overdueApprovals: Array.from(this.approvalItems.values()).filter(a => a.slaStatus === 'OVERDUE').length,
      activeDelegations: Array.from(this.delegations.values()).filter(d => d.status === 'ACTIVE').length,
      recentSuspiciousActivity: 0,
      passwordExpiringSoon: 0,
    };
  }

  getUserDashboardKPIs(userId: string): any {
    const user = this.users.get(userId);
    if (!user) return null;

    return {
      myTasks: 5,
      myApprovals: this.getPendingApprovals(userId).length,
      myQueries: Array.from(this.queries.values()).filter(q => q.status === 'OPEN').length,
      myProjects: user.projectAssignments.length,
      myNotifications: 8,
      pendingActions: 3,
      todayAttendance: 'PRESENT' as const,
      pendingLeaves: 0,
    };
  }

  // ============================================================
  // LOGIN HISTORY & REPORTS
  // ============================================================
  getLoginHistory(userId?: string, limit = 50): LoginHistory[] {
    let history = [...this.loginHistory];
    if (userId) {
      history = history.filter(lh => lh.userId === userId);
    }
    return history.slice(0, limit);
  }
}

export const securityService = SecurityService.getInstance();

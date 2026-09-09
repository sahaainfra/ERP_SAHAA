// ============================================================
// BUILDCORE ERP - CORE SERVICES LAYER
// Part 01: All foundational services
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  AuditLog, AuditAction, Notification, NotificationCategory,
  Document, NumberingConfig, CalculationResult, SearchResult,
  TransactionStatus, StatusTransition, WorkflowInstance,
  WorkflowApproval, User, Project, Company, ActivityItem,
  DashboardKPI, Permission, PermissionAction
} from '../types';

// ============================================================
// AUTHENTICATION SERVICE
// ============================================================
export class AuthService {
  private static instance: AuthService;
  private sessions: Map<string, any> = new Map();

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string } | null> {
    // Simulate API call - in production this hits the backend
    await this.delay(800);
    
    const demoUsers = this.getDemoUsers();
    const user = demoUsers.find(u => u.email === email);
    
    if (!user || password !== 'demo123') {
      return null;
    }

    const token = `bc_${uuidv4()}`;
    const refreshToken = `bcr_${uuidv4()}`;
    
    this.sessions.set(token, {
      userId: user.id,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      deviceInfo: navigator.userAgent,
    });

    return { user, token, refreshToken };
  }

  async logout(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async validateSession(token: string): Promise<boolean> {
    const session = this.sessions.get(token);
    if (!session) return false;
    if (new Date(session.expiresAt) < new Date()) return false;
    return true;
  }

  async resetPassword(email: string): Promise<boolean> {
    await this.delay(500);
    return true;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    await this.delay(500);
    return true;
  }

  private getDemoUsers(): User[] {
    return [
      {
        id: 'usr_001',
        companyId: 'comp_001',
        employeeId: 'EMP001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'admin@buildcore.io',
        phone: '+91-9876543210',
        designation: 'Chief Executive Officer',
        departmentId: 'dept_001',
        status: 'ACTIVE',
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        loginAttempts: 0,
        mfaEnabled: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_002',
        companyId: 'comp_001',
        employeeId: 'EMP002',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'pm@buildcore.io',
        phone: '+91-9876543211',
        designation: 'Project Manager',
        departmentId: 'dept_002',
        status: 'ACTIVE',
        lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
        loginAttempts: 0,
        mfaEnabled: false,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_003',
        companyId: 'comp_001',
        employeeId: 'EMP003',
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'engineer@buildcore.io',
        phone: '+91-9876543212',
        designation: 'Site Engineer',
        departmentId: 'dept_003',
        status: 'ACTIVE',
        lastLoginAt: new Date(Date.now() - 1800000).toISOString(),
        loginAttempts: 0,
        mfaEnabled: false,
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================
// RBAC SERVICE
// ============================================================
export class RBACService {
  private static instance: RBACService;

  static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }

  getUserPermissions(userId: string): Permission[] {
    // Demo: Admin gets all permissions
    if (userId === 'usr_001') {
      return this.getAllPermissions();
    }
    // PM gets most permissions
    if (userId === 'usr_002') {
      return this.getPMPermissions();
    }
    // Engineer gets limited permissions
    return this.getEngineerPermissions();
  }

  hasPermission(userId: string, module: string, action: PermissionAction): boolean {
    const permissions = this.getUserPermissions(userId);
    return permissions.some(p => p.module === module && p.action === action) ||
           permissions.some(p => p.module === '*' && p.action === 'ADMIN');
  }

  hasProjectAccess(userId: string, projectId: string): boolean {
    // Demo: all users have access to all projects
    return true;
  }

  hasSiteAccess(userId: string, siteId: string): boolean {
    return true;
  }

  private getAllPermissions(): Permission[] {
    return [
      { id: 'p_admin', module: '*', action: 'ADMIN' as PermissionAction },
    ];
  }

  private getPMPermissions(): Permission[] {
    const modules = ['projects', 'procurement', 'finance', 'hr', 'documents', 'reports', 'inventory', 'contracts', 'billing', 'quality', 'safety'];
    const actions: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'SUBMIT', 'APPROVE', 'EXPORT', 'PRINT'];
    return modules.flatMap(m => actions.map(a => ({
      id: `p_${m}_${a}`, module: m, action: a
    })));
  }

  private getEngineerPermissions(): Permission[] {
    const modules = ['projects', 'documents', 'quality', 'safety', 'inventory'];
    const actions: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'SUBMIT'];
    return modules.flatMap(m => actions.map(a => ({
      id: `p_${m}_${a}`, module: m, action: a
    })));
  }
}

// ============================================================
// WORKFLOW ENGINE SERVICE
// ============================================================
export class WorkflowService {
  private static instance: WorkflowService;
  private instances: Map<string, WorkflowInstance> = new Map();

  static getInstance(): WorkflowService {
    if (!WorkflowService.instance) {
      WorkflowService.instance = new WorkflowService();
    }
    return WorkflowService.instance;
  }

  async initiateWorkflow(definitionId: string, entityType: string, entityId: string): Promise<WorkflowInstance> {
    const instance: WorkflowInstance = {
      id: `wf_${uuidv4()}`,
      definitionId,
      entityType,
      entityId,
      currentLevel: 1,
      status: 'PENDING',
      approvals: [
        {
          id: `wa_${uuidv4()}`,
          instanceId: '',
          level: 1,
          approverId: 'usr_001',
          action: 'PENDING',
          dueAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    instance.approvals[0].instanceId = instance.id;
    this.instances.set(instance.id, instance);
    return instance;
  }

  async approve(instanceId: string, approverId: string, comments?: string): Promise<WorkflowInstance> {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Workflow instance not found');
    
    const currentApproval = instance.approvals.find(a => a.level === instance.currentLevel && a.action === 'PENDING');
    if (currentApproval) {
      currentApproval.action = 'APPROVED';
      currentApproval.actedAt = new Date().toISOString();
      currentApproval.comments = comments;
    }
    
    instance.currentLevel++;
    instance.updatedAt = new Date().toISOString();
    
    if (instance.currentLevel > instance.approvals.length) {
      instance.status = 'APPROVED';
    }
    
    return instance;
  }

  async reject(instanceId: string, approverId: string, comments: string): Promise<WorkflowInstance> {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error('Workflow instance not found');
    
    const currentApproval = instance.approvals.find(a => a.level === instance.currentLevel && a.action === 'PENDING');
    if (currentApproval) {
      currentApproval.action = 'REJECTED';
      currentApproval.actedAt = new Date().toISOString();
      currentApproval.comments = comments;
    }
    
    instance.status = 'REJECTED';
    instance.updatedAt = new Date().toISOString();
    return instance;
  }

  getPendingApprovals(userId: string): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter(
      i => i.status === 'PENDING' && i.approvals.some(a => a.approverId === userId && a.action === 'PENDING')
    );
  }
}

// ============================================================
// AUDIT ENGINE SERVICE
// ============================================================
export class AuditService {
  private static instance: AuditService;
  private logs: AuditLog[] = [];

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  log(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const auditLog: AuditLog = {
      ...entry,
      id: `audit_${uuidv4()}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(auditLog);
    if (this.logs.length > 10000) this.logs.pop();
    return auditLog;
  }

  getLogs(filters?: { userId?: string; entityType?: string; action?: AuditAction; fromDate?: string; toDate?: string }): AuditLog[] {
    let filtered = [...this.logs];
    if (filters?.userId) filtered = filtered.filter(l => l.userId === filters.userId);
    if (filters?.entityType) filtered = filtered.filter(l => l.entityType === filters.entityType);
    if (filters?.action) filtered = filtered.filter(l => l.action === filters.action);
    return filtered;
  }

  getEntityHistory(entityType: string, entityId: string): AuditLog[] {
    return this.logs.filter(l => l.entityType === entityType && l.entityId === entityId);
  }
}

// ============================================================
// NOTIFICATION ENGINE SERVICE
// ============================================================
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  send(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Notification {
    const notif: Notification = {
      ...notification,
      id: `notif_${uuidv4()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  markAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      notif.readAt = new Date().toISOString();
    }
  }

  markAllAsRead(userId: string): void {
    this.notifications
      .filter(n => n.userId === userId && !n.isRead)
      .forEach(n => {
        n.isRead = true;
        n.readAt = new Date().toISOString();
      });
  }

  getUnread(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId && !n.isRead);
  }

  getAll(userId: string, limit = 20): Notification[] {
    return this.notifications.filter(n => n.userId === userId).slice(0, limit);
  }

  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }

  initializeDemoNotifications(userId: string): void {
    const demos: Omit<Notification, 'id' | 'isRead' | 'createdAt'>[] = [
      { userId, type: 'IN_APP', category: 'APPROVAL', title: 'Purchase Order Pending', message: 'PO-2026-000012 requires your approval', priority: 'HIGH', entityType: 'PO', entityId: 'po_012' },
      { userId, type: 'IN_APP', category: 'PAYMENT', title: 'Payment Released', message: '₹24,50,000 released to Shreeji Constructions', priority: 'MEDIUM', entityType: 'PAYMENT', entityId: 'pay_003' },
      { userId, type: 'IN_APP', category: 'OVERDUE', title: 'GRN Overdue', message: 'GRN for material batch #MB-2026-000045 is 2 days overdue', priority: 'HIGH', entityType: 'GRN', entityId: 'grn_045' },
      { userId, type: 'IN_APP', category: 'SAFETY', title: 'Safety Inspection Due', message: 'Monthly safety inspection for Site B is scheduled for tomorrow', priority: 'MEDIUM', entityType: 'INSPECTION', entityId: 'insp_012' },
      { userId, type: 'IN_APP', category: 'PROCUREMENT', title: 'RFQ Response Received', message: '3 vendors have responded to RFQ-2026-000089', priority: 'LOW', entityType: 'RFQ', entityId: 'rfq_089' },
      { userId, type: 'IN_APP', category: 'PROJECT_DELAY', title: 'Milestone Alert', message: 'Foundation work for Bridge Package 2 is behind schedule by 5 days', priority: 'URGENT', entityType: 'MILESTONE', entityId: 'ms_023' },
      { userId, type: 'IN_APP', category: 'DOCUMENT_EXPIRY', title: 'Document Expiring', message: 'Trade license for RMC Plant expires in 15 days', priority: 'MEDIUM', entityType: 'DOCUMENT', entityId: 'doc_156' },
      { userId, type: 'IN_APP', category: 'STOCK', title: 'Low Stock Alert', message: 'Cement (OPC 53 Grade) stock below minimum level at Site A', priority: 'HIGH', entityType: 'INVENTORY', entityId: 'inv_078' },
    ];
    
    demos.forEach(d => this.send(d));
  }
}

// ============================================================
// DOCUMENT ENGINE SERVICE
// ============================================================
export class DocumentService {
  private static instance: DocumentService;
  private documents: Document[] = [];

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  async upload(file: File, metadata: Partial<Document>): Promise<Document> {
    const doc: Document = {
      id: `doc_${uuidv4()}`,
      companyId: metadata.companyId || 'comp_001',
      projectId: metadata.projectId,
      entityType: metadata.entityType || 'GENERAL',
      entityId: metadata.entityId || '',
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      storagePath: `/uploads/${new Date().getFullYear()}/${uuidv4()}_${file.name}`,
      version: 1,
      documentType: metadata.documentType || 'OTHER',
      confidentiality: metadata.confidentiality || 'INTERNAL',
      expiryDate: metadata.expiryDate,
      tags: metadata.tags,
      uploadedBy: metadata.uploadedBy || 'usr_001',
      uploadedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };
    this.documents.push(doc);
    return doc;
  }

  getByEntity(entityType: string, entityId: string): Document[] {
    return this.documents.filter(d => d.entityType === entityType && d.entityId === entityId && d.status === 'ACTIVE');
  }

  softDelete(id: string, userId: string, reason: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.status = 'DELETED';
      doc.deletedAt = new Date().toISOString();
      doc.deletedBy = userId;
      doc.deletionReason = reason;
    }
  }
}

// ============================================================
// NUMBERING ENGINE SERVICE
// ============================================================
export class NumberingService {
  private static instance: NumberingService;
  private configs: Map<string, NumberingConfig> = new Map();

  static getInstance(): NumberingService {
    if (!NumberingService.instance) {
      NumberingService.instance = new NumberingService();
    }
    return NumberingService.instance;
  }

  initializeDefaults(companyId: string): void {
    const modules = [
      { module: 'PROJECT', prefix: 'PROJECT', sequenceLength: 4 },
      { module: 'PR', prefix: 'PR', sequenceLength: 6 },
      { module: 'RFQ', prefix: 'RFQ', sequenceLength: 6 },
      { module: 'PO', prefix: 'PO', sequenceLength: 6 },
      { module: 'GRN', prefix: 'GRN', sequenceLength: 6 },
      { module: 'MR', prefix: 'MR', sequenceLength: 6 },
      { module: 'MB', prefix: 'MB', sequenceLength: 6 },
      { module: 'RAB', prefix: 'RAB', sequenceLength: 6 },
      { module: 'PAY', prefix: 'PAY', sequenceLength: 6 },
      { module: 'JV', prefix: 'JV', sequenceLength: 6 },
      { module: 'WO', prefix: 'WO', sequenceLength: 6 },
      { module: 'INV', prefix: 'INV', sequenceLength: 6 },
    ];

    modules.forEach(m => {
      this.configs.set(`${companyId}_${m.module}`, {
        id: `num_${uuidv4()}`,
        companyId,
        module: m.module,
        prefix: m.prefix,
        includeYear: true,
        includeProject: false,
        includeDepartment: false,
        sequenceLength: m.sequenceLength,
        currentSequence: Math.floor(Math.random() * 100) + 1,
        resetFrequency: 'YEARLY',
        separator: '-',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  }

  generateNumber(companyId: string, module: string, projectId?: string): string {
    const key = `${companyId}_${module}`;
    let config = this.configs.get(key);
    
    if (!config) {
      this.initializeDefaults(companyId);
      config = this.configs.get(key)!;
    }

    config.currentSequence++;
    const year = new Date().getFullYear();
    const seq = String(config.currentSequence).padStart(config.sequenceLength, '0');
    
    let number = `${config.prefix}${config.separator}`;
    if (config.includeYear) number += `${year}${config.separator}`;
    number += seq;
    
    config.updatedAt = new Date().toISOString();
    return number;
  }

  getConfigs(companyId: string): NumberingConfig[] {
    return Array.from(this.configs.values()).filter(c => c.companyId === companyId);
  }
}

// ============================================================
// CALCULATION ENGINE SERVICE
// ============================================================
export class CalculationService {
  private static instance: CalculationService;
  private results: CalculationResult[] = [];

  static getInstance(): CalculationService {
    if (!CalculationService.instance) {
      CalculationService.instance = new CalculationService();
    }
    return CalculationService.instance;
  }

  calculateQuantityRate(quantity: number, rate: number): number {
    return quantity * rate;
  }

  calculateGST(baseAmount: number, gstPercent: number, type: 'CGST_SGST' | 'IGST' = 'CGST_SGST'): { cgst: number; sgst: number; igst: number; total: number } {
    if (type === 'IGST') {
      const igst = baseAmount * (gstPercent / 100);
      return { cgst: 0, sgst: 0, igst, total: baseAmount + igst };
    }
    const halfGst = gstPercent / 2;
    const cgst = baseAmount * (halfGst / 100);
    const sgst = baseAmount * (halfGst / 100);
    return { cgst, sgst, igst: 0, total: baseAmount + cgst + sgst };
  }

  calculateTDS(amount: number, tdsPercent: number): { tdsAmount: number; netAmount: number } {
    const tdsAmount = amount * (tdsPercent / 100);
    return { tdsAmount, netAmount: amount - tdsAmount };
  }

  calculateRetention(amount: number, retentionPercent: number): { retentionAmount: number; payableAmount: number } {
    const retentionAmount = amount * (retentionPercent / 100);
    return { retentionAmount, payableAmount: amount - retentionAmount };
  }

  calculateEscalation(baseAmount: number, escalationPercent: number, periods: number): number {
    return baseAmount * Math.pow(1 + escalationPercent / 100, periods);
  }

  calculateWastage(quantity: number, wastagePercent: number): { wastageQty: number; totalQty: number } {
    const wastageQty = quantity * (wastagePercent / 100);
    return { wastageQty, totalQty: quantity + wastageQty };
  }

  roundAmount(amount: number, rule: 'UP' | 'DOWN' | 'NEAREST' = 'NEAREST', decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    switch (rule) {
      case 'UP': return Math.ceil(amount * factor) / factor;
      case 'DOWN': return Math.floor(amount * factor) / factor;
      default: return Math.round(amount * factor) / factor;
    }
  }

  amountInWords(amount: number): string {
    // Simplified amount in words for INR
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function convert(num: number): string {
      if (num < 20) return ones[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convert(num % 100) : '');
      if (num < 100000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convert(num % 1000) : '');
      if (num < 10000000) return convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convert(num % 100000) : '');
      return convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + convert(num % 10000000) : '');
    }

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    
    let result = convert(rupees) + ' Rupees';
    if (paise > 0) result += ' and ' + convert(paise) + ' Paise';
    return result + ' Only';
  }

  storeCalculation(entityType: string, entityId: string, formula: string, inputs: Record<string, number>, result: number, userId: string): CalculationResult {
    const calc: CalculationResult = {
      id: `calc_${uuidv4()}`,
      entityType,
      entityId,
      formula,
      inputs,
      result,
      version: 1,
      calculatedAt: new Date().toISOString(),
      calculatedBy: userId,
    };
    this.results.push(calc);
    return calc;
  }
}

// ============================================================
// SEARCH ENGINE SERVICE
// ============================================================
export class SearchService {
  private static instance: SearchService;

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  search(query: string, userId: string, modules?: string[]): SearchResult[] {
    if (!query || query.length < 2) return [];
    
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search across all entity types
    const demoData = this.getSearchableData();
    
    demoData.forEach(item => {
      const score = this.calculateRelevance(q, item.title + ' ' + (item.subtitle || '') + ' ' + (item.description || ''));
      if (score > 0) {
        results.push({ ...item, score });
      }
    });

    if (modules && modules.length > 0) {
      return results.filter(r => modules.includes(r.module)).sort((a, b) => b.score - a.score).slice(0, 20);
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  private calculateRelevance(query: string, text: string): number {
    const lowerText = text.toLowerCase();
    if (lowerText.includes(query)) return 10;
    const words = query.split(' ');
    return words.reduce((score, word) => lowerText.includes(word) ? score + 1 : score, 0);
  }

  private getSearchableData(): SearchResult[] {
    return [
      { id: '1', entityType: 'Project', entityId: 'proj_001', title: 'Mumbai-Pune Expressway Widening', subtitle: 'ROAD', description: '6-lane expressway widening project', module: 'projects', score: 0, url: '/projects/proj_001' },
      { id: '2', entityType: 'Project', entityId: 'proj_002', title: 'Chennai Metro Phase 2', subtitle: 'METRO', description: 'Underground metro corridor', module: 'projects', score: 0, url: '/projects/proj_002' },
      { id: '3', entityType: 'Project', entityId: 'proj_003', title: 'Godavari Bridge Rehabilitation', subtitle: 'BRIDGE', description: 'Bridge strengthening and widening', module: 'projects', score: 0, url: '/projects/proj_003' },
      { id: '4', entityType: 'Purchase Order', entityId: 'po_001', title: 'PO-2026-000012', subtitle: 'Shreeji Constructions', description: 'Steel reinforcement supply', module: 'procurement', score: 0, url: '/procurement/po/po_001' },
      { id: '5', entityType: 'Vendor', entityId: 'vendor_001', title: 'Tata Steel Ltd', subtitle: 'Material Supplier', description: 'Primary steel supplier', module: 'vendors', score: 0, url: '/vendors/vendor_001' },
      { id: '6', entityType: 'Employee', entityId: 'usr_002', title: 'Priya Sharma', subtitle: 'Project Manager', description: 'Infrastructure Division', module: 'people', score: 0, url: '/people/usr_002' },
      { id: '7', entityType: 'Material', entityId: 'mat_001', title: 'OPC 53 Grade Cement', subtitle: 'Bag - 50kg', description: 'UltraTech Cement', module: 'materials', score: 0, url: '/materials/mat_001' },
      { id: '8', entityType: 'RFQ', entityId: 'rfq_001', title: 'RFQ-2026-000089', subtitle: 'Structural Steel', description: 'Steel procurement for bridge work', module: 'procurement', score: 0, url: '/procurement/rfq/rfq_001' },
      { id: '9', entityType: 'Invoice', entityId: 'inv_001', title: 'INV-2026-000034', subtitle: '₹18,50,000', description: 'Progress bill for March 2026', module: 'billing', score: 0, url: '/billing/inv_001' },
      { id: '10', entityType: 'Report', entityId: 'rpt_001', title: 'Monthly Progress Report - Feb 2026', subtitle: 'Mumbai-Pune Expressway', description: 'Physical and financial progress', module: 'reports', score: 0, url: '/reports/rpt_001' },
      { id: '11', entityType: 'Contract', entityId: 'cont_001', title: 'CT-2025-000003', subtitle: 'NHAI', description: 'Expressway widening contract', module: 'contracts', score: 0, url: '/contracts/cont_001' },
      { id: '12', entityType: 'Measurement Book', entityId: 'mb_001', title: 'MB-2026-000023', subtitle: 'Chainage 12.5 - 15.0 km', description: 'Earthwork measurements', module: 'billing', score: 0, url: '/billing/mb/mb_001' },
      { id: '13', entityType: 'Plant', entityId: 'plant_001', title: 'CAT 320 Excavator', subtitle: 'Site A - Active', description: '20T hydraulic excavator', module: 'plant', score: 0, url: '/plant/plant_001' },
      { id: '14', entityType: 'RMC Batch', entityId: 'rmc_001', title: 'Batch #B-2026-04521', subtitle: 'M30 Grade', description: '12.5 cum delivered to Foundation Zone C', module: 'rmc', score: 0, url: '/rmc/rmc_001' },
    ];
  }
}

// ============================================================
// STATUS ENGINE SERVICE
// ============================================================
export class StatusService {
  private static instance: StatusService;
  private transitions: StatusTransition[] = [];

  static getInstance(): StatusService {
    if (!StatusService.instance) {
      StatusService.instance = new StatusService();
      StatusService.instance.initializeTransitions();
    }
    return StatusService.instance;
  }

  private initializeTransitions(): void {
    this.transitions = [
      { from: 'DRAFT', to: 'SUBMITTED', requiresReason: false },
      { from: 'SUBMITTED', to: 'UNDER_REVIEW' },
      { from: 'SUBMITTED', to: 'PENDING_APPROVAL' },
      { from: 'UNDER_REVIEW', to: 'QUERY_RAISED', requiresReason: true },
      { from: 'UNDER_REVIEW', to: 'APPROVED' },
      { from: 'QUERY_RAISED', to: 'CORRECTION_REQUIRED' },
      { from: 'CORRECTION_REQUIRED', to: 'RESUBMITTED' },
      { from: 'RESUBMITTED', to: 'UNDER_REVIEW' },
      { from: 'PENDING_APPROVAL', to: 'APPROVED' },
      { from: 'PENDING_APPROVAL', to: 'REJECTED', requiresReason: true },
      { from: 'PENDING_APPROVAL', to: 'RETURNED', requiresReason: true },
      { from: 'PENDING_APPROVAL', to: 'FORWARDED' },
      { from: 'PENDING_APPROVAL', to: 'ESCALATED' },
      { from: 'APPROVED', to: 'POSTED' },
      { from: 'POSTED', to: 'PARTIALLY_COMPLETED' },
      { from: 'POSTED', to: 'COMPLETED' },
      { from: 'PARTIALLY_COMPLETED', to: 'COMPLETED' },
      { from: 'COMPLETED', to: 'CLOSED' },
      { from: 'CLOSED', to: 'REOPENED', requiresReason: true },
      { from: 'DRAFT', to: 'CANCELLED', requiresReason: true },
      { from: 'SUBMITTED', to: 'CANCELLED', requiresReason: true },
      { from: 'APPROVED', to: 'CANCELLED', requiresReason: true },
      { from: 'DRAFT', to: 'ON_HOLD', requiresReason: true },
      { from: 'ON_HOLD', to: 'DRAFT' },
      { from: 'REJECTED', to: 'DRAFT' },
      { from: 'RETURNED', to: 'DRAFT' },
    ];
  }

  canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
    return this.transitions.some(t => t.from === from && t.to === to);
  }

  getAvailableTransitions(currentStatus: TransactionStatus): TransactionStatus[] {
    return this.transitions.filter(t => t.from === currentStatus).map(t => t.to);
  }

  getTransition(from: TransactionStatus, to: TransactionStatus): StatusTransition | undefined {
    return this.transitions.find(t => t.from === from && t.to === to);
  }

  getStatusColor(status: TransactionStatus): string {
    const colors: Record<string, string> = {
      DRAFT: 'gray',
      SUBMITTED: 'blue',
      UNDER_REVIEW: 'indigo',
      QUERY_RAISED: 'orange',
      CORRECTION_REQUIRED: 'amber',
      RESUBMITTED: 'blue',
      PENDING_APPROVAL: 'yellow',
      APPROVED: 'green',
      REJECTED: 'red',
      RETURNED: 'orange',
      FORWARDED: 'purple',
      ESCALATED: 'red',
      POSTED: 'emerald',
      PARTIALLY_COMPLETED: 'teal',
      COMPLETED: 'green',
      CANCELLED: 'gray',
      ON_HOLD: 'yellow',
      CLOSED: 'slate',
      REOPENED: 'blue',
    };
    return colors[status] || 'gray';
  }
}

// ============================================================
// API SERVICE (Foundation)
// ============================================================
export class ApiService {
  private static instance: ApiService;
  private baseUrl: string = '/api/v1';
  private token: string = '';

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setToken(token: string): void {
    this.token = token;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }

  private async request<T>(method: string, endpoint: string, data?: any, params?: Record<string, string>): Promise<ApiResponse<T>> {
    // In production, this would make real HTTP requests
    // For now, returns structured response format
    return {
      success: true,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>;
  }
}

// Helper type for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  timestamp: string;
}

// ============================================================
// EXPORT ALL SERVICES
// ============================================================
export const authService = AuthService.getInstance();
export const rbacService = RBACService.getInstance();
export const workflowService = WorkflowService.getInstance();
export const auditService = AuditService.getInstance();
export const notificationService = NotificationService.getInstance();
export const documentService = DocumentService.getInstance();
export const numberingService = NumberingService.getInstance();
export const calculationService = CalculationService.getInstance();
export const searchService = SearchService.getInstance();
export const statusService = StatusService.getInstance();
export const apiService = ApiService.getInstance();

// Part 02: Master Data Service
export { masterDataService, MasterDataService } from './masterService';

// Part 03: Security Service
export { securityService, SecurityService } from './securityService';

// Part 04: Workflow Service
export { approvalEngine, ApprovalEngine } from './workflowService';

// Part 05: Dashboard Service
export { dashboardService, DashboardService } from './dashboardService';

// Part 06: Project Service
export { projectService, ProjectService } from './projectService';

// Part 07: Planning Service
export { planningService, PlanningService } from './planningService';

// Part 08: Tender Service
export { tenderService, TenderService } from './tenderService';

// Part 09: Rate Service
export { rateService, RateService } from './rateService';

// Part 10: BOQ Service
export { boqService, BOQService } from './boqService';

// Part 11: Contract Service
export { contractService, ContractService } from './contractService';

// Part 12: Commercial Service
export { commercialService, CommercialService } from './commercialService';

// Part 13: Material Service
export { materialService, MaterialService } from './materialService';

// Part 14: Vendor Service
export { vendorService, VendorService } from './vendorService';

// Part 15: Procurement Service
export { procurementService, ProcurementService } from './procurementService';

// Part 16: PO Service
export { poService, POService } from './poService';

// Part 17: Store & Warehouse Service
export { storeService, StoreService } from './storeService';

// ============================================================
// BUILDCORE ERP - WORKFLOW STORE
// Part 04: Enterprise Workflow & Approval Engine
// ============================================================

import { create } from 'zustand';
import type {
  WorkflowMaster, WorkflowInstance, ApprovalDashboardKPIs,
  WorkflowQuery, ApprovalComment, WorkflowNotification,
  WorkflowTimelineEntry, ApprovalAction
} from '../types/workflow';
import { approvalEngine } from '../services/workflowService';

interface WorkflowState {
  // Data
  workflows: WorkflowMaster[];
  instances: WorkflowInstance[];
  pendingApprovals: WorkflowInstance[];
  myRequests: WorkflowInstance[];
  dashboardKPIs: ApprovalDashboardKPIs | null;
  notifications: WorkflowNotification[];
  unreadCount: number;
  initialized: boolean;

  // Actions
  initialize: (companyId: string, userId: string) => void;
  refresh: (companyId: string, userId: string) => void;
  
  // Workflow Master
  createWorkflow: (data: Omit<WorkflowMaster, 'id' | 'createdAt' | 'updatedAt'>) => WorkflowMaster;
  getWorkflow: (id: string) => WorkflowMaster | undefined;
  updateWorkflow: (id: string, updates: Partial<WorkflowMaster>, userId: string) => WorkflowMaster | null;
  
  // Workflow Instance
  createInstance: (
    companyId: string,
    module: string,
    transactionType: string,
    entityId: string,
    entityNumber: string,
    entityAmount: number,
    projectId: string | undefined,
    siteId: string | undefined,
    departmentId: string | undefined,
    requesterId: string,
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  ) => WorkflowInstance | null;
  
  getInstance: (id: string) => WorkflowInstance | undefined;
  getTimeline: (instanceId: string) => WorkflowTimelineEntry[];
  getActions: (instanceId: string) => ApprovalAction[];
  getQueries: (instanceId: string) => WorkflowQuery[];
  getComments: (instanceId: string) => ApprovalComment[];
  
  // Approval Actions
  approve: (instanceId: string, userId: string, comments?: string, signatureData?: string) => { success: boolean; message: string };
  reject: (instanceId: string, userId: string, reason: string) => { success: boolean; message: string };
  returnToMaker: (instanceId: string, userId: string, reason: string, instructions?: string) => { success: boolean; message: string };
  raiseQuery: (
    instanceId: string,
    userId: string,
    question: string,
    fieldReference: string | undefined,
    comment: string,
    dueDate: string | undefined,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  ) => { success: boolean; message: string; queryId?: string };
  answerQuery: (queryId: string, userId: string, response: string) => { success: boolean; message: string };
  
  // Comments
  addComment: (instanceId: string, userId: string, comment: string, parentId?: string) => ApprovalComment;
  
  // Notifications
  markNotificationRead: (notificationId: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  instances: [],
  pendingApprovals: [],
  myRequests: [],
  dashboardKPIs: null,
  notifications: [],
  unreadCount: 0,
  initialized: false,

  initialize: (companyId: string, userId: string) => {
    if (get().initialized) return;
    
    // Create demo workflows
    createDemoWorkflows(companyId, userId);
    
    get().refresh(companyId, userId);
    set({ initialized: true });
  },

  refresh: (companyId: string, userId: string) => {
    set({
      workflows: Array.from((approvalEngine as any).workflows.values()),
      instances: approvalEngine.getAllInstances(companyId),
      pendingApprovals: approvalEngine.getPendingApprovals(companyId, userId),
      myRequests: approvalEngine.getMyRequests(companyId, userId),
      dashboardKPIs: approvalEngine.getDashboardKPIs(companyId, userId),
      notifications: approvalEngine.getNotifications(userId),
      unreadCount: approvalEngine.getUnreadNotificationCount(userId),
    });
  },

  createWorkflow: (data) => {
    const workflow = approvalEngine.createWorkflow(data);
    get().refresh(data.companyId, data.createdBy);
    return workflow;
  },

  getWorkflow: (id) => approvalEngine.getWorkflow(id),

  updateWorkflow: (id, updates, userId) => {
    const workflow = approvalEngine.updateWorkflow(id, updates, userId);
    if (workflow) {
      get().refresh(workflow.companyId, userId);
    }
    return workflow;
  },

  createInstance: (companyId, module, transactionType, entityId, entityNumber, entityAmount, projectId, siteId, departmentId, requesterId, priority = 'MEDIUM') => {
    const instance = approvalEngine.createWorkflowInstance(
      companyId, module, transactionType, entityId, entityNumber, entityAmount,
      projectId, siteId, departmentId, requesterId, priority
    );
    if (instance) {
      get().refresh(companyId, requesterId);
    }
    return instance;
  },

  getInstance: (id) => approvalEngine.getInstance(id),

  getTimeline: (instanceId) => approvalEngine.getTimeline(instanceId),

  getActions: (instanceId) => approvalEngine.getActions(instanceId),

  getQueries: (instanceId) => approvalEngine.getQueries(instanceId),

  getComments: (instanceId) => approvalEngine.getComments(instanceId),

  approve: (instanceId, userId, comments, signatureData) => {
    const result = approvalEngine.approve(instanceId, userId, comments, signatureData);
    if (result.success) {
      const instance = approvalEngine.getInstance(instanceId);
      if (instance) {
        get().refresh(instance.companyId, userId);
      }
    }
    return result;
  },

  reject: (instanceId, userId, reason) => {
    const result = approvalEngine.reject(instanceId, userId, reason);
    if (result.success) {
      const instance = approvalEngine.getInstance(instanceId);
      if (instance) {
        get().refresh(instance.companyId, userId);
      }
    }
    return result;
  },

  returnToMaker: (instanceId, userId, reason, instructions) => {
    const result = approvalEngine.returnToMaker(instanceId, userId, reason, instructions);
    if (result.success) {
      const instance = approvalEngine.getInstance(instanceId);
      if (instance) {
        get().refresh(instance.companyId, userId);
      }
    }
    return result;
  },

  raiseQuery: (instanceId, userId, question, fieldReference, comment, dueDate, priority) => {
    const result = approvalEngine.raiseQuery(instanceId, userId, question, fieldReference, comment, dueDate, priority);
    if (result.success) {
      const instance = approvalEngine.getInstance(instanceId);
      if (instance) {
        get().refresh(instance.companyId, userId);
      }
    }
    return result;
  },

  answerQuery: (queryId, userId, response) => {
    const result = approvalEngine.answerQuery(queryId, userId, response);
    // Refresh will be handled by component
    return result;
  },

  addComment: (instanceId, userId, comment, parentId) => {
    const newComment = approvalEngine.addComment(instanceId, userId, comment, parentId);
    const instance = approvalEngine.getInstance(instanceId);
    if (instance) {
      get().refresh(instance.companyId, userId);
    }
    return newComment;
  },

  markNotificationRead: (notificationId) => {
    approvalEngine.markNotificationRead(notificationId);
    // Refresh notifications
    const notifications = approvalEngine.getNotifications('');
    const unreadCount = notifications.filter((n: any) => !n.isRead).length;
    set({ notifications, unreadCount });
  },
}));

// ============================================================
// DEMO WORKFLOWS
// ============================================================

function createDemoWorkflows(companyId: string, userId: string): void {
  // PO Approval Workflow
  approvalEngine.createWorkflow({
    companyId,
    workflowCode: 'PO_APPROVAL',
    workflowName: 'Purchase Order Approval',
    module: 'PROCUREMENT',
    transactionType: 'PO',
    description: 'Multi-level approval workflow for purchase orders based on amount',
    effectiveFrom: '2024-01-01T00:00:00Z',
    levels: [
      {
        id: 'lvl_1',
        levelNumber: 1,
        approverType: 'HIERARCHY',
        isRequired: true,
        approvalMode: 'SEQUENTIAL',
        slaHours: 24,
        delegationAllowed: true,
      },
      {
        id: 'lvl_2',
        levelNumber: 2,
        approverType: 'FINANCIAL',
        financialLimit: 500000,
        isRequired: true,
        approvalMode: 'SEQUENTIAL',
        slaHours: 48,
        delegationAllowed: true,
      },
      {
        id: 'lvl_3',
        levelNumber: 3,
        approverType: 'ROLE',
        approverRoleId: 'role_accounts_manager',
        isRequired: true,
        approvalMode: 'SEQUENTIAL',
        slaHours: 24,
        delegationAllowed: false,
      },
    ],
    conditions: [
      {
        id: 'cond_1',
        conditionType: 'AMOUNT',
        operator: 'LESS_EQUAL',
        value: 100000,
        targetLevel: 1,
        logic: 'AND',
      },
      {
        id: 'cond_2',
        conditionType: 'AMOUNT',
        operator: 'GREATER_THAN',
        value: 100000,
        targetLevel: 2,
        logic: 'AND',
      },
      {
        id: 'cond_3',
        conditionType: 'AMOUNT',
        operator: 'GREATER_THAN',
        value: 500000,
        targetLevel: 3,
        logic: 'AND',
      },
    ],
    isActive: true,
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  // Leave Approval Workflow
  approvalEngine.createWorkflow({
    companyId,
    workflowCode: 'LEAVE_APPROVAL',
    workflowName: 'Leave Application Approval',
    module: 'HR',
    transactionType: 'LEAVE',
    description: 'Leave approval workflow',
    effectiveFrom: '2024-01-01T00:00:00Z',
    levels: [
      {
        id: 'lvl_1',
        levelNumber: 1,
        approverType: 'HIERARCHY',
        isRequired: true,
        approvalMode: 'SEQUENTIAL',
        slaHours: 8,
        delegationAllowed: true,
      },
    ],
    conditions: [],
    isActive: true,
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  // Bill Approval Workflow
  approvalEngine.createWorkflow({
    companyId,
    workflowCode: 'BILL_APPROVAL',
    workflowName: 'RA Bill Approval',
    module: 'BILLING',
    transactionType: 'RA_BILL',
    description: 'Running account bill approval with parallel QA/QC and Commercial approval',
    effectiveFrom: '2024-01-01T00:00:00Z',
    levels: [
      {
        id: 'lvl_1',
        levelNumber: 1,
        approverType: 'USER',
        approverUserId: 'usr_002', // Project Manager
        isRequired: true,
        approvalMode: 'SEQUENTIAL',
        slaHours: 24,
        delegationAllowed: true,
      },
      {
        id: 'lvl_2',
        levelNumber: 2,
        approverType: 'PARALLEL',
        parallelApprovers: ['usr_003', 'usr_004'], // QA/QC and Commercial
        isRequired: true,
        approvalMode: 'PARALLEL',
        slaHours: 48,
        delegationAllowed: false,
      },
      {
        id: 'lvl_3',
        levelNumber: 3,
        approverType: 'ROLE',
        approverRoleId: 'role_accounts_manager',
        isRequired: true,
        approvalMode: 'SEQUENTIAL',
        slaHours: 24,
        delegationAllowed: false,
      },
    ],
    conditions: [],
    isActive: true,
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });
}

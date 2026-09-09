// ============================================================
// BUILDCORE ERP - WORKFLOW ENGINE SERVICE
// Part 04: Enterprise Workflow & Approval Engine
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  WorkflowMaster, WorkflowLevel, WorkflowCondition, WorkflowInstance,
  LevelStatus, ApprovalAction, WorkflowQuery, WorkflowDelegation,
  EscalationEvent, WorkflowTimelineEntry, ApprovalComment,
  DigitalSignature, SLAConfiguration, ApprovalDashboardKPIs,
  WorkflowStatus, WorkflowNotification, ControlledEditSession,
  FieldChange, BottleneckInfo
} from '../types/workflow';
import { securityService } from './securityService';
import { auditService } from './index';

export class ApprovalEngine {
  private static instance: ApprovalEngine;
  
  private workflows: Map<string, WorkflowMaster> = new Map();
  private instances: Map<string, WorkflowInstance> = new Map();
  private actions: Map<string, ApprovalAction[]> = new Map();
  private queries: Map<string, WorkflowQuery[]> = new Map();
  private delegations: Map<string, WorkflowDelegation> = new Map();
  private escalations: Map<string, EscalationEvent[]> = new Map();
  private timelines: Map<string, WorkflowTimelineEntry[]> = new Map();
  private comments: Map<string, ApprovalComment[]> = new Map();
  private signatures: Map<string, DigitalSignature> = new Map();
  private slaConfigs: Map<string, SLAConfiguration> = new Map();
  private notifications: Map<string, WorkflowNotification[]> = new Map();
  private editSessions: Map<string, ControlledEditSession> = new Map();

  private constructor() {}

  static getInstance(): ApprovalEngine {
    if (!ApprovalEngine.instance) {
      ApprovalEngine.instance = new ApprovalEngine();
    }
    return ApprovalEngine.instance;
  }

  // ============================================================
  // WORKFLOW MASTER MANAGEMENT
  // ============================================================

  createWorkflow(data: Omit<WorkflowMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>): WorkflowMaster {
    const workflow: WorkflowMaster = {
      ...data,
      id: `wf_${uuidv4()}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workflows.set(workflow.id, workflow);

    auditService.log({
      companyId: workflow.companyId,
      userId: workflow.createdBy,
      userName: securityService.getUser(workflow.createdBy)?.fullName || '',
      action: 'CREATE',
      entityType: 'WORKFLOW',
      entityId: workflow.id,
      entityDescription: `Created workflow: ${workflow.workflowName}`,
    });

    return workflow;
  }

  getWorkflow(id: string): WorkflowMaster | undefined {
    return this.workflows.get(id);
  }

  getWorkflowsByModule(companyId: string, module: string): WorkflowMaster[] {
    return Array.from(this.workflows.values()).filter(
      wf => wf.companyId === companyId && wf.module === module && wf.isActive
    );
  }

  getActiveWorkflow(companyId: string, module: string, transactionType: string): WorkflowMaster | undefined {
    const now = new Date().toISOString();
    return Array.from(this.workflows.values()).find(
      wf => wf.companyId === companyId && 
            wf.module === module && 
            wf.transactionType === transactionType &&
            wf.isActive &&
            wf.effectiveFrom <= now &&
            (!wf.effectiveTo || wf.effectiveTo >= now)
    );
  }

  updateWorkflow(id: string, updates: Partial<WorkflowMaster>, userId: string): WorkflowMaster | null {
    const workflow = this.workflows.get(id);
    if (!workflow) return null;

    const updated: WorkflowMaster = {
      ...workflow,
      ...updates,
      version: workflow.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    this.workflows.set(id, updated);

    auditService.log({
      companyId: workflow.companyId,
      userId,
      userName: securityService.getUser(userId)?.fullName || '',
      action: 'EDIT',
      entityType: 'WORKFLOW',
      entityId: id,
      entityDescription: `Updated workflow: ${workflow.workflowName}`,
      oldValue: workflow,
      newValue: updated,
    });

    return updated;
  }

  // ============================================================
  // WORKFLOW INSTANCE CREATION
  // ============================================================

  createWorkflowInstance(
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
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'
  ): WorkflowInstance | null {
    // Find active workflow
    const workflow = this.getActiveWorkflow(companyId, module, transactionType);
    if (!workflow) {
      console.error(`No active workflow found for ${module}/${transactionType}`);
      return null;
    }

    // Evaluate conditions to determine applicable levels
    const applicableLevels = this.evaluateConditions(workflow, {
      amount: entityAmount,
      projectId,
      departmentId,
      transactionType,
    });

    const requester = securityService.getUser(requesterId);
    if (!requester) {
      console.error('Requester not found');
      return null;
    }

    // Calculate SLA due date based on first level
    const firstLevel = applicableLevels[0];
    const slaHours = firstLevel?.slaHours || 24;
    const dueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();

    // Create level statuses
    const levelStatuses: LevelStatus[] = applicableLevels.map(level => ({
      levelNumber: level.levelNumber,
      status: 'PENDING',
      slaDueAt: new Date(Date.now() + level.slaHours * 60 * 60 * 1000).toISOString(),
      slaStatus: 'ON_TIME',
    }));

    const instance: WorkflowInstance = {
      id: `wfi_${uuidv4()}`,
      companyId,
      workflowMasterId: workflow.id,
      workflowVersion: workflow.version,
      entityType: module,
      entityId,
      entityNumber,
      entityAmount,
      projectId,
      siteId,
      departmentId,
      requesterId,
      requesterName: requester.fullName,
      currentLevel: 1,
      status: 'SUBMITTED',
      priority,
      submittedAt: new Date().toISOString(),
      dueAt,
      totalLevels: applicableLevels.length,
      levelStatuses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.instances.set(instance.id, instance);
    this.timelines.set(instance.id, []);
    this.actions.set(instance.id, []);
    this.comments.set(instance.id, []);

    // Add timeline entry
    this.addTimelineEntry(instance.id, 'SUBMITTED', requesterId, requester.fullName, 0, 'Workflow instance created and submitted');

    // Send notification to first approver
    this.notifyFirstApprover(instance, workflow);

    auditService.log({
      companyId,
      userId: requesterId,
      userName: requester.fullName,
      action: 'SUBMIT',
      entityType: module,
      entityId,
      entityDescription: `Submitted ${entityNumber} for approval`,
    });

    return instance;
  }

  // ============================================================
  // CONDITION EVALUATION
  // ============================================================

  private evaluateConditions(
    workflow: WorkflowMaster,
    context: { amount: number; projectId?: string; departmentId?: string; transactionType: string }
  ): WorkflowLevel[] {
    if (workflow.conditions.length === 0) {
      return workflow.levels;
    }

    const applicableLevels = new Set<number>();

    workflow.conditions.forEach(condition => {
      const matches = this.evaluateCondition(condition, context);
      if (matches) {
        applicableLevels.add(condition.targetLevel);
      }
    });

    // If no conditions matched, use all levels
    if (applicableLevels.size === 0) {
      return workflow.levels;
    }

    return workflow.levels.filter(level => applicableLevels.has(level.levelNumber));
  }

  private evaluateCondition(
    condition: WorkflowCondition,
    context: { amount: number; projectId?: string; departmentId?: string; transactionType: string }
  ): boolean {
    const { conditionType, operator, value } = condition;

    switch (conditionType) {
      case 'AMOUNT':
        return this.compareValues(context.amount, operator, value);
      case 'PROJECT':
        return this.compareValues(context.projectId, operator, value);
      case 'DEPARTMENT':
        return this.compareValues(context.departmentId, operator, value);
      case 'TRANSACTION_TYPE':
        return this.compareValues(context.transactionType, operator, value);
      default:
        return true;
    }
  }

  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'EQUALS':
        return actual === expected;
      case 'NOT_EQUALS':
        return actual !== expected;
      case 'GREATER_THAN':
        return actual > expected;
      case 'LESS_THAN':
        return actual < expected;
      case 'GREATER_EQUAL':
        return actual >= expected;
      case 'LESS_EQUAL':
        return actual <= expected;
      case 'IN':
        return Array.isArray(expected) && expected.includes(actual);
      case 'NOT_IN':
        return Array.isArray(expected) && !expected.includes(actual);
      case 'CONTAINS':
        return typeof actual === 'string' && actual.includes(expected);
      default:
        return false;
    }
  }

  // ============================================================
  // APPROVER RESOLUTION
  // ============================================================

  private resolveApprover(level: WorkflowLevel, instance: WorkflowInstance): string | null {
    switch (level.approverType) {
      case 'USER':
        return level.approverUserId || null;

      case 'ROLE':
        // Find user with this role in the project/department
        const users = securityService.getUsers(instance.companyId);
        const userWithRole = users.find(u => 
          u.roleId === level.approverRoleId &&
          u.status === 'ACTIVE' &&
          (!level.financialLimit || u.financialAuthority.maxApproval >= level.financialLimit)
        );
        return userWithRole?.id || null;

      case 'DEPARTMENT':
        // Find department head
        const deptUsers = securityService.getUsers(instance.companyId);
        const deptHead = deptUsers.find(u => 
          u.departmentId === level.approverDepartmentId &&
          u.designationName?.includes('Head') &&
          u.status === 'ACTIVE'
        );
        return deptHead?.id || null;

      case 'HIERARCHY':
        // Use requester's reporting manager
        const requester = securityService.getUser(instance.requesterId);
        return requester?.reportingManagerId || null;

      case 'FINANCIAL':
        // Find approver based on amount
        const finUsers = securityService.getUsers(instance.companyId);
        const finApprover = finUsers.find(u =>
          u.status === 'ACTIVE' &&
          u.financialAuthority.maxApproval >= instance.entityAmount
        );
        return finApprover?.id || null;

      default:
        return null;
    }
  }

  // ============================================================
  // APPROVAL ACTIONS
  // ============================================================

  approve(
    instanceId: string,
    userId: string,
    comments?: string,
    signatureData?: string
  ): { success: boolean; message: string } {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return { success: false, message: 'Workflow instance not found' };
    }

    const user = securityService.getUser(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if user is authorized approver
    const workflow = this.getWorkflow(instance.workflowMasterId);
    if (!workflow) {
      return { success: false, message: 'Workflow not found' };
    }

    const currentLevel = workflow.levels.find(l => l.levelNumber === instance.currentLevel);
    if (!currentLevel) {
      return { success: false, message: 'Current level not found' };
    }

    const resolvedApprover = this.resolveApprover(currentLevel, instance);
    if (resolvedApprover !== userId) {
      return { success: false, message: 'You are not authorized to approve at this level' };
    }

    // Maker-checker: Prevent self-approval
    if (instance.requesterId === userId) {
      return { success: false, message: 'Cannot approve your own submission (maker-checker rule)' };
    }

    // Record approval action
    const action: ApprovalAction = {
      id: `act_${uuidv4()}`,
      workflowInstanceId: instanceId,
      levelNumber: instance.currentLevel,
      actionType: 'APPROVE',
      performedBy: userId,
      performedByName: user.fullName,
      performedAt: new Date().toISOString(),
      comments,
      signatureData,
    };

    const instanceActions = this.actions.get(instanceId) || [];
    instanceActions.push(action);
    this.actions.set(instanceId, instanceActions);

    // Update level status
    const levelStatus = instance.levelStatuses.find(ls => ls.levelNumber === instance.currentLevel);
    if (levelStatus) {
      levelStatus.status = 'APPROVED';
      levelStatus.approverId = userId;
      levelStatus.approverName = user.fullName;
      levelStatus.approvedAt = new Date().toISOString();
      levelStatus.comments = comments;
    }

    // Add timeline entry
    this.addTimelineEntry(instanceId, 'APPROVED', userId, user.fullName, instance.currentLevel, comments);

    // Check if this is the final level
    if (instance.currentLevel >= instance.totalLevels) {
      instance.status = 'APPROVED';
      instance.completedAt = new Date().toISOString();
      this.addTimelineEntry(instanceId, 'COMPLETED', userId, user.fullName, 0, 'All approvals completed');
    } else {
      // Move to next level
      instance.currentLevel++;
      instance.status = 'PENDING_APPROVAL';
      
      // Notify next approver
      this.notifyNextApprover(instance, workflow);
    }

    instance.updatedAt = new Date().toISOString();

    auditService.log({
      companyId: instance.companyId,
      userId,
      userName: user.fullName,
      action: 'APPROVE',
      entityType: instance.entityType,
      entityId: instance.entityId,
      entityDescription: `Approved ${instance.entityNumber} at level ${instance.currentLevel}`,
    });

    return { success: true, message: 'Approved successfully' };
  }

  reject(
    instanceId: string,
    userId: string,
    reason: string
  ): { success: boolean; message: string } {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return { success: false, message: 'Workflow instance not found' };
    }

    const user = securityService.getUser(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Record rejection action
    const action: ApprovalAction = {
      id: `act_${uuidv4()}`,
      workflowInstanceId: instanceId,
      levelNumber: instance.currentLevel,
      actionType: 'REJECT',
      performedBy: userId,
      performedByName: user.fullName,
      performedAt: new Date().toISOString(),
      reason,
    };

    const instanceActions = this.actions.get(instanceId) || [];
    instanceActions.push(action);
    this.actions.set(instanceId, instanceActions);

    // Update instance status
    instance.status = 'REJECTED';
    instance.completedAt = new Date().toISOString();
    instance.updatedAt = new Date().toISOString();

    // Update level status
    const levelStatus = instance.levelStatuses.find(ls => ls.levelNumber === instance.currentLevel);
    if (levelStatus) {
      levelStatus.status = 'REJECTED';
      levelStatus.approverId = userId;
      levelStatus.approverName = user.fullName;
      levelStatus.approvedAt = new Date().toISOString();
      levelStatus.comments = reason;
    }

    // Add timeline entry
    this.addTimelineEntry(instanceId, 'REJECTED', userId, user.fullName, instance.currentLevel, reason);

    // Notify requester
    this.sendNotification(instance, 'REJECTION', instance.requesterId, 'Request Rejected', 
      `Your request ${instance.entityNumber} has been rejected. Reason: ${reason}`);

    auditService.log({
      companyId: instance.companyId,
      userId,
      userName: user.fullName,
      action: 'REJECT',
      entityType: instance.entityType,
      entityId: instance.entityId,
      entityDescription: `Rejected ${instance.entityNumber}: ${reason}`,
    });

    return { success: true, message: 'Rejected successfully' };
  }

  returnToMaker(
    instanceId: string,
    userId: string,
    reason: string,
    instructions?: string
  ): { success: boolean; message: string } {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return { success: false, message: 'Workflow instance not found' };
    }

    const user = securityService.getUser(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Record return action
    const action: ApprovalAction = {
      id: `act_${uuidv4()}`,
      workflowInstanceId: instanceId,
      levelNumber: instance.currentLevel,
      actionType: 'RETURN',
      performedBy: userId,
      performedByName: user.fullName,
      performedAt: new Date().toISOString(),
      reason,
      comments: instructions,
    };

    const instanceActions = this.actions.get(instanceId) || [];
    instanceActions.push(action);
    this.actions.set(instanceId, instanceActions);

    // Update instance status
    instance.status = 'RETURNED';
    instance.updatedAt = new Date().toISOString();

    // Add timeline entry
    this.addTimelineEntry(instanceId, 'RETURNED', userId, user.fullName, instance.currentLevel, 
      `${reason}${instructions ? `\nInstructions: ${instructions}` : ''}`);

    // Notify requester
    this.sendNotification(instance, 'RETURN', instance.requesterId, 'Request Returned', 
      `Your request ${instance.entityNumber} has been returned for correction. Reason: ${reason}`);

    return { success: true, message: 'Returned to maker successfully' };
  }

  raiseQuery(
    instanceId: string,
    userId: string,
    question: string,
    fieldReference: string | undefined,
    comment: string,
    dueDate: string | undefined,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  ): { success: boolean; message: string; queryId?: string } {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return { success: false, message: 'Workflow instance not found' };
    }

    const user = securityService.getUser(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const query: WorkflowQuery = {
      id: `qry_${uuidv4()}`,
      workflowInstanceId: instanceId,
      queryId: `Q${Date.now()}`,
      documentId: instance.entityId,
      fieldReference,
      question,
      comment,
      raisedBy: userId,
      raisedByName: user.fullName,
      raisedAt: new Date().toISOString(),
      dueDate,
      priority,
      status: 'OPEN',
    };

    const instanceQueries = this.queries.get(instanceId) || [];
    instanceQueries.push(query);
    this.queries.set(instanceId, instanceQueries);

    // Update instance status
    instance.status = 'QUERY_RAISED';
    instance.updatedAt = new Date().toISOString();

    // Add timeline entry
    this.addTimelineEntry(instanceId, 'QUERY_RAISED', userId, user.fullName, instance.currentLevel, 
      `Query: ${question}`);

    // Notify requester
    this.sendNotification(instance, 'QUERY', instance.requesterId, 'Query Raised', 
      `A query has been raised on your request ${instance.entityNumber}: ${question}`);

    return { success: true, message: 'Query raised successfully', queryId: query.id };
  }

  answerQuery(
    queryId: string,
    userId: string,
    response: string
  ): { success: boolean; message: string } {
    // Find query
    let foundQuery: WorkflowQuery | undefined;
    let instanceId: string | undefined;

    for (const [instId, queries] of this.queries.entries()) {
      const query = queries.find(q => q.id === queryId);
      if (query) {
        foundQuery = query;
        instanceId = instId;
        break;
      }
    }

    if (!foundQuery || !instanceId) {
      return { success: false, message: 'Query not found' };
    }

    const user = securityService.getUser(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Update query
    foundQuery.response = response;
    foundQuery.respondedBy = userId;
    foundQuery.respondedByName = user.fullName;
    foundQuery.respondedAt = new Date().toISOString();
    foundQuery.status = 'ANSWERED';

    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.status = 'PENDING_APPROVAL';
      instance.updatedAt = new Date().toISOString();

      // Add timeline entry
      this.addTimelineEntry(instanceId, 'QUERY_ANSWERED', userId, user.fullName, instance.currentLevel, 
        `Query answered: ${response}`);

      // Notify approver
      const workflow = this.getWorkflow(instance.workflowMasterId);
      if (workflow) {
        this.notifyNextApprover(instance, workflow);
      }
    }

    return { success: true, message: 'Query answered successfully' };
  }

  // ============================================================
  // DELEGATION
  // ============================================================

  createDelegation(
    companyId: string,
    fromUserId: string,
    toUserId: string,
    startDate: string,
    endDate: string,
    modules: string[] | undefined,
    transactionTypes: string[] | undefined,
    reason: string
  ): WorkflowDelegation {
    const fromUser = securityService.getUser(fromUserId);
    const toUser = securityService.getUser(toUserId);

    const delegation: WorkflowDelegation = {
      id: `del_${uuidv4()}`,
      companyId,
      fromUserId,
      fromUserName: fromUser?.fullName || '',
      toUserId,
      toUserName: toUser?.fullName || '',
      startDate,
      endDate,
      modules,
      transactionTypes,
      reason,
      approvalScope: modules || transactionTypes ? 'SPECIFIC' : 'ALL',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: fromUserId,
    };

    this.delegations.set(delegation.id, delegation);

    auditService.log({
      companyId,
      userId: fromUserId,
      userName: fromUser?.fullName || '',
      action: 'DELEGATE',
      entityType: 'DELEGATION',
      entityId: delegation.id,
      entityDescription: `Delegated approval authority to ${toUser?.fullName}`,
    });

    return delegation;
  }

  getActiveDelegation(fromUserId: string, module?: string, transactionType?: string): WorkflowDelegation | undefined {
    const now = new Date().toISOString();
    return Array.from(this.delegations.values()).find(d =>
      d.fromUserId === fromUserId &&
      d.status === 'ACTIVE' &&
      d.startDate <= now &&
      d.endDate >= now &&
      (!d.modules || d.modules.includes(module || '')) &&
      (!d.transactionTypes || d.transactionTypes.includes(transactionType || ''))
    );
  }

  // ============================================================
  // ESCALATION
  // ============================================================

  checkAndEscalate(): void {
    const now = new Date();

    this.instances.forEach(instance => {
      if (instance.status !== 'PENDING_APPROVAL') return;

      const currentLevelStatus = instance.levelStatuses.find(ls => ls.levelNumber === instance.currentLevel);
      if (!currentLevelStatus) return;

      const slaDue = new Date(currentLevelStatus.slaDueAt);
      const hoursOverdue = (now.getTime() - slaDue.getTime()) / (1000 * 60 * 60);

      if (hoursOverdue > 0) {
        // Update SLA status
        if (hoursOverdue < 24) {
          currentLevelStatus.slaStatus = 'AT_RISK';
        } else if (hoursOverdue < 48) {
          currentLevelStatus.slaStatus = 'OVERDUE';
        } else {
          currentLevelStatus.slaStatus = 'ESCALATED';
          
          // Create escalation event
          const escalation: EscalationEvent = {
            id: `esc_${uuidv4()}`,
            workflowInstanceId: instance.id,
            levelNumber: instance.currentLevel,
            escalationLevel: Math.floor(hoursOverdue / 24),
            escalatedFrom: currentLevelStatus.approverId || '',
            escalatedTo: '', // TODO: Resolve escalation target
            escalatedAt: new Date().toISOString(),
            reason: `SLA breached by ${Math.floor(hoursOverdue)} hours`,
            slaBreached: true,
          };

          const instanceEscalations = this.escalations.get(instance.id) || [];
          instanceEscalations.push(escalation);
          this.escalations.set(instance.id, instanceEscalations);

          // Add timeline entry
          this.addTimelineEntry(instance.id, 'ESCALATED', 'SYSTEM', 'System', instance.currentLevel, 
            escalation.reason);

          // Notify
          this.sendNotification(instance, 'ESCALATION', instance.requesterId, 'Approval Escalated', 
            `Your request ${instance.entityNumber} has been escalated due to SLA breach`);
        }
      } else if ((slaDue.getTime() - now.getTime()) / (1000 * 60 * 60) < 4) {
        currentLevelStatus.slaStatus = 'DUE_SOON';
      }
    });
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  private notifyFirstApprover(instance: WorkflowInstance, workflow: WorkflowMaster): void {
    const firstLevel = workflow.levels[0];
    const approverId = this.resolveApprover(firstLevel, instance);
    
    if (approverId) {
      this.sendNotification(instance, 'ASSIGNMENT', approverId, 'New Approval Request', 
        `You have a new approval request: ${instance.entityNumber}`);
    }
  }

  private notifyNextApprover(instance: WorkflowInstance, workflow: WorkflowMaster): void {
    const currentLevel = workflow.levels.find(l => l.levelNumber === instance.currentLevel);
    if (!currentLevel) return;

    const approverId = this.resolveApprover(currentLevel, instance);
    if (approverId) {
      this.sendNotification(instance, 'ASSIGNMENT', approverId, 'Approval Request', 
        `You have a new approval request: ${instance.entityNumber}`);
    }
  }

  private sendNotification(
    instance: WorkflowInstance,
    type: WorkflowNotification['notificationType'],
    recipientId: string,
    title: string,
    message: string
  ): void {
    const notification: WorkflowNotification = {
      id: `notif_${uuidv4()}`,
      workflowInstanceId: instance.id,
      notificationType: type,
      recipientId,
      recipientName: securityService.getUser(recipientId)?.fullName || '',
      title,
      message,
      priority: instance.priority,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const userNotifications = this.notifications.get(recipientId) || [];
    userNotifications.push(notification);
    this.notifications.set(recipientId, userNotifications);
  }

  // ============================================================
  // TIMELINE
  // ============================================================

  private addTimelineEntry(
    instanceId: string,
    eventType: WorkflowTimelineEntry['eventType'],
    performedBy: string,
    performedByName: string,
    levelNumber: number,
    comments?: string
  ): void {
    const entry: WorkflowTimelineEntry = {
      id: `tl_${uuidv4()}`,
      workflowInstanceId: instanceId,
      eventType,
      levelNumber,
      performedBy,
      performedByName,
      performedAt: new Date().toISOString(),
      comments,
    };

    const timeline = this.timelines.get(instanceId) || [];
    timeline.push(entry);
    this.timelines.set(instanceId, timeline);
  }

  getTimeline(instanceId: string): WorkflowTimelineEntry[] {
    return this.timelines.get(instanceId) || [];
  }

  // ============================================================
  // COMMENTS
  // ============================================================

  addComment(
    instanceId: string,
    userId: string,
    comment: string,
    parentId?: string
  ): ApprovalComment {
    const user = securityService.getUser(userId);
    
    const approvalComment: ApprovalComment = {
      id: `cmt_${uuidv4()}`,
      workflowInstanceId: instanceId,
      comment,
      authorId: userId,
      authorName: user?.fullName || '',
      createdAt: new Date().toISOString(),
      parentId,
      isEdited: false,
    };

    const comments = this.comments.get(instanceId) || [];
    comments.push(approvalComment);
    this.comments.set(instanceId, comments);

    return approvalComment;
  }

  getComments(instanceId: string): ApprovalComment[] {
    return this.comments.get(instanceId) || [];
  }

  // ============================================================
  // QUERIES
  // ============================================================

  getQueries(instanceId: string): WorkflowQuery[] {
    return this.queries.get(instanceId) || [];
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getDashboardKPIs(companyId: string, userId: string): ApprovalDashboardKPIs {
    const userInstances = Array.from(this.instances.values()).filter(i => i.companyId === companyId);
    
    const pendingForUser = userInstances.filter(i => {
      if (i.status !== 'PENDING_APPROVAL') return false;
      const workflow = this.getWorkflow(i.workflowMasterId);
      if (!workflow) return false;
      const currentLevel = workflow.levels.find(l => l.levelNumber === i.currentLevel);
      if (!currentLevel) return false;
      const approverId = this.resolveApprover(currentLevel, i);
      return approverId === userId;
    });

    const approvedToday = userInstances.filter(i => {
      if (!i.completedAt) return false;
      const today = new Date();
      const completedDate = new Date(i.completedAt);
      return completedDate.toDateString() === today.toDateString() && i.status === 'APPROVED';
    });

    const overdue = userInstances.filter(i => {
      const levelStatus = i.levelStatuses.find(ls => ls.levelNumber === i.currentLevel);
      return levelStatus?.slaStatus === 'OVERDUE' || levelStatus?.slaStatus === 'ESCALATED';
    });

    // Calculate average approval time
    const completedInstances = userInstances.filter(i => i.completedAt && i.submittedAt);
    const avgTime = completedInstances.length > 0
      ? completedInstances.reduce((sum, i) => {
          const submitted = new Date(i.submittedAt).getTime();
          const completed = new Date(i.completedAt!).getTime();
          return sum + (completed - submitted) / (1000 * 60 * 60);
        }, 0) / completedInstances.length
      : 0;

    // Find bottlenecks
    const approverPending: Record<string, number> = {};
    pendingForUser.forEach(i => {
      const workflow = this.getWorkflow(i.workflowMasterId);
      if (!workflow) return;
      const currentLevel = workflow.levels.find(l => l.levelNumber === i.currentLevel);
      if (!currentLevel) return;
      const approverId = this.resolveApprover(currentLevel, i);
      if (approverId) {
        approverPending[approverId] = (approverPending[approverId] || 0) + 1;
      }
    });

    const bottlenecks: BottleneckInfo[] = Object.entries(approverPending)
      .map(([approverId, count]) => ({
        approverName: securityService.getUser(approverId)?.fullName || '',
        pendingCount: count,
        averageDelay: 0, // TODO: Calculate actual delay
      }))
      .sort((a, b) => b.pendingCount - a.pendingCount)
      .slice(0, 5);

    return {
      pendingApprovals: pendingForUser.length,
      approvedToday: approvedToday.length,
      rejected: userInstances.filter(i => i.status === 'REJECTED').length,
      returned: userInstances.filter(i => i.status === 'RETURNED').length,
      queries: Array.from(this.queries.values()).flat().filter(q => q.status === 'OPEN').length,
      overdue: overdue.length,
      escalated: userInstances.filter(i => i.levelStatuses.some(ls => ls.slaStatus === 'ESCALATED')).length,
      averageApprovalTime: Math.round(avgTime * 10) / 10,
      bottlenecks,
    };
  }

  // ============================================================
  // GETTERS
  // ============================================================

  getInstance(id: string): WorkflowInstance | undefined {
    return this.instances.get(id);
  }

  getPendingApprovals(companyId: string, userId: string): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter(i => {
      if (i.companyId !== companyId || i.status !== 'PENDING_APPROVAL') return false;
      
      const workflow = this.getWorkflow(i.workflowMasterId);
      if (!workflow) return false;
      
      const currentLevel = workflow.levels.find(l => l.levelNumber === i.currentLevel);
      if (!currentLevel) return false;
      
      const approverId = this.resolveApprover(currentLevel, i);
      return approverId === userId;
    });
  }

  getMyRequests(companyId: string, userId: string): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter(
      i => i.companyId === companyId && i.requesterId === userId
    );
  }

  getAllInstances(companyId: string): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter(i => i.companyId === companyId);
  }

  getActions(instanceId: string): ApprovalAction[] {
    return this.actions.get(instanceId) || [];
  }

  getNotifications(userId: string): WorkflowNotification[] {
    return this.notifications.get(userId) || [];
  }

  getUnreadNotificationCount(userId: string): number {
    const notifications = this.notifications.get(userId) || [];
    return notifications.filter(n => !n.isRead).length;
  }

  markNotificationRead(notificationId: string): void {
    for (const notifications of this.notifications.values()) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        break;
      }
    }
  }
}

export const approvalEngine = ApprovalEngine.getInstance();

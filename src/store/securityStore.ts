// ============================================================
// BUILDCORE ERP - SECURITY STORE
// Part 03: User, Role, Permission & Security Management
// ============================================================

import { create } from 'zustand';
import { securityService } from '../services/securityService';
import type {
  UserMaster, RoleMaster, LoginHistory, UserSession,
  Delegation, ApprovalItem, ApprovalTimelineEntry,
  ApprovalQuery, SLAConfig, UserHistory
} from '../types/security';

interface SecurityState {
  // Data
  users: UserMaster[];
  roles: RoleMaster[];
  loginHistory: LoginHistory[];
  activeSessions: UserSession[];
  delegations: Delegation[];
  pendingApprovals: ApprovalItem[];
  approvalTimelines: Map<string, ApprovalTimelineEntry[]>;
  queries: ApprovalQuery[];
  slaConfigs: SLAConfig[];
  securityDashboardKPIs: any;
  userDashboardKPIs: any;
  initialized: boolean;

  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId?: string, userId?: string) => void;
  updateUser: (id: string, data: Partial<UserMaster>) => void;
  lockUser: (id: string) => void;
  unlockUser: (id: string) => void;
  revokeSession: (sessionId: string) => void;
  revokeAllUserSessions: (userId: string) => void;
  approveDocument: (approvalId: string, userId: string, comments?: string) => void;
  rejectDocument: (approvalId: string, userId: string, comments: string) => void;
  queryDocument: (approvalId: string, userId: string, question: string, comment: string) => void;
}

export const useSecurityStore = create<SecurityState>((set, get) => ({
  users: [],
  roles: [],
  loginHistory: [],
  activeSessions: [],
  delegations: [],
  pendingApprovals: [],
  approvalTimelines: new Map(),
  queries: [],
  slaConfigs: [],
  securityDashboardKPIs: null,
  userDashboardKPIs: null,
  initialized: false,

  initialize: (companyId: string) => {
    if (get().initialized) return;
    securityService.initializeDemoData(companyId);
    get().refresh(companyId);
    set({ initialized: true });
  },

  refresh: (companyId?: string, userId?: string) => {
    set({
      users: securityService.getUsers(companyId),
      roles: securityService.getRoles(companyId),
      loginHistory: securityService.getLoginHistory(),
      activeSessions: securityService.getActiveSessions(),
      delegations: [],
      pendingApprovals: userId ? securityService.getPendingApprovals(userId) : [],
      approvalTimelines: new Map(),
      queries: [],
      slaConfigs: [],
      securityDashboardKPIs: companyId ? securityService.getSecurityDashboardKPIs(companyId) : null,
      userDashboardKPIs: userId ? securityService.getUserDashboardKPIs(userId) : null,
    });
  },

  updateUser: (id: string, data: Partial<UserMaster>) => {
    securityService.updateUser(id, data);
    get().refresh();
  },

  lockUser: (id) => {
    securityService.lockUser(id);
    get().refresh();
  },

  unlockUser: (id) => {
    securityService.unlockUser(id);
    get().refresh();
  },

  revokeSession: (sessionId) => {
    securityService.revokeSession(sessionId);
    get().refresh();
  },

  revokeAllUserSessions: (userId) => {
    securityService.revokeAllUserSessions(userId);
    get().refresh();
  },

  approveDocument: (approvalId, userId, comments) => {
    securityService.approveDocument(approvalId, userId, comments);
    get().refresh();
  },

  rejectDocument: (approvalId, userId, comments) => {
    securityService.rejectDocument(approvalId, userId, comments);
    get().refresh();
  },

  queryDocument: (approvalId, userId, question, comment) => {
    securityService.queryDocument(approvalId, userId, question, comment);
    get().refresh();
  },
}));

// ============================================================
// BUILDCORE ERP - STATE MANAGEMENT (Zustand Stores)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ThemeMode, Notification, Project, Company, ActivityItem, AuditLog } from '../types';
import { authService, notificationService, auditService, numberingService } from '../services';

// ============================================================
// AUTH STORE
// ============================================================
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.login(email, password);
          if (result) {
            // Initialize services for this user
            numberingService.initializeDefaults(result.user.companyId);
            notificationService.initializeDemoNotifications(result.user.id);
            
            auditService.log({
              companyId: result.user.companyId,
              userId: result.user.id,
              userName: `${result.user.firstName} ${result.user.lastName}`,
              action: 'LOGIN',
              entityType: 'SESSION',
              entityId: result.user.id,
              ipAddress: '127.0.0.1',
              userAgent: navigator.userAgent,
            });

            set({
              user: result.user,
              token: result.token,
              refreshToken: result.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            set({ isLoading: false, error: 'Invalid email or password' });
            return false;
          }
        } catch (err) {
          set({ isLoading: false, error: 'Login failed. Please try again.' });
          return false;
        }
      },

      logout: () => {
        const { user } = get();
        if (user) {
          auditService.log({
            companyId: user.companyId,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            action: 'LOGOUT',
            entityType: 'SESSION',
            entityId: user.id,
          });
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'buildcore-auth',
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// ============================================================
// THEME STORE
// ============================================================
interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      resolvedTheme: 'light',
      setMode: (mode: ThemeMode) => {
        const resolved = mode === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : mode;
        set({ mode, resolvedTheme: resolved });
        applyTheme(resolved);
      },
      toggle: () => {
        set((state) => {
          const newMode: ThemeMode = state.mode === 'light' ? 'dark' : state.mode === 'dark' ? 'system' : 'light';
          const resolved = newMode === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : newMode;
          applyTheme(resolved);
          return { mode: newMode, resolvedTheme: resolved };
        });
      },
    }),
    {
      name: 'buildcore-theme',
    }
  )
);

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

// ============================================================
// APP STORE
// ============================================================
interface AppState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  commandCenterOpen: boolean;
  activeModule: string;
  breadcrumbs: { label: string; url?: string }[];
  notifications: Notification[];
  unreadCount: number;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setCommandCenterOpen: (open: boolean) => void;
  setActiveModule: (module: string) => void;
  setBreadcrumbs: (breadcrumbs: { label: string; url?: string }[]) => void;
  refreshNotifications: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  commandCenterOpen: false,
  activeModule: 'dashboard',
  breadcrumbs: [{ label: 'Dashboard' }],
  notifications: [],
  unreadCount: 0,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  setCommandCenterOpen: (open) => set({ commandCenterOpen: open }),
  setActiveModule: (module) => set({ activeModule: module }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  refreshNotifications: () => {
    const user = useAuthStore.getState().user;
    if (user) {
      const notifications = notificationService.getAll(user.id);
      const unreadCount = notificationService.getUnreadCount(user.id);
      set({ notifications, unreadCount });
    }
  },

  markNotificationRead: (id) => {
    notificationService.markAsRead(id);
    get().refreshNotifications();
  },

  markAllNotificationsRead: () => {
    const user = useAuthStore.getState().user;
    if (user) {
      notificationService.markAllAsRead(user.id);
      get().refreshNotifications();
    }
  },
}));

// ============================================================
// DATA STORE (Demo Data)
// ============================================================
interface DataState {
  companies: Company[];
  projects: Project[];
  activities: ActivityItem[];
  auditLogs: AuditLog[];
  initializeDemoData: () => void;
}

export const useDataStore = create<DataState>()((set) => ({
  companies: [],
  projects: [],
  activities: [],
  auditLogs: [],

  initializeDemoData: () => {
    const companies: Company[] = [
      {
        id: 'comp_001',
        name: 'BuildCore Infrastructure Pvt Ltd',
        code: 'BCI',
        address: 'Mumbai, Maharashtra, India',
        gstNumber: '27AABCB1234F1Z5',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
      }
    ];

    const projects: Project[] = [
      {
        id: 'proj_001',
        companyId: 'comp_001',
        name: 'Mumbai-Pune Expressway Widening',
        code: 'MPEW-001',
        type: 'ROAD',
        description: '6-lane expressway widening from 4 lanes',
        location: 'Mumbai - Pune, Maharashtra',
        clientName: 'NHAI',
        contractValue: 4850000000,
        startDate: '2025-03-01',
        endDate: '2028-02-28',
        status: 'ACTIVE',
        progress: 34,
        budget: 4850000000,
        spent: 1649000000,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
      },
      {
        id: 'proj_002',
        companyId: 'comp_001',
        name: 'Chennai Metro Phase 2 - Corridor 4',
        code: 'CMR-002',
        type: 'METRO',
        description: 'Underground metro station and tunnel works',
        location: 'Chennai, Tamil Nadu',
        clientName: 'CMRL',
        contractValue: 3200000000,
        startDate: '2025-06-01',
        endDate: '2029-05-31',
        status: 'ACTIVE',
        progress: 18,
        budget: 3200000000,
        spent: 576000000,
        createdAt: '2025-04-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
      },
      {
        id: 'proj_003',
        companyId: 'comp_001',
        name: 'Godavari Bridge Rehabilitation',
        code: 'GBR-003',
        type: 'BRIDGE',
        description: 'Structural strengthening and deck replacement',
        location: 'Rajahmundry, Andhra Pradesh',
        clientName: 'APPRDL',
        contractValue: 890000000,
        startDate: '2025-09-01',
        endDate: '2027-08-31',
        status: 'ACTIVE',
        progress: 8,
        budget: 890000000,
        spent: 71200000,
        createdAt: '2025-07-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
      },
      {
        id: 'proj_004',
        companyId: 'comp_001',
        name: 'Delhi-Mumbai Industrial Corridor - Package 7',
        code: 'DMIC-004',
        type: 'EPC',
        description: 'Industrial infrastructure development',
        location: 'Gujarat',
        clientName: 'DMIC Trust',
        contractValue: 2100000000,
        startDate: '2025-11-01',
        endDate: '2027-10-31',
        status: 'ACTIVE',
        progress: 5,
        budget: 2100000000,
        spent: 105000000,
        createdAt: '2025-10-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
      },
      {
        id: 'proj_005',
        companyId: 'comp_001',
        name: 'Polavaram Dam Spillway Works',
        code: 'PDW-005',
        type: 'DAM',
        description: 'Concrete spillway construction',
        location: 'Eluru, Andhra Pradesh',
        clientName: 'APWRD',
        contractValue: 1560000000,
        startDate: '2026-01-15',
        endDate: '2028-12-31',
        status: 'ACTIVE',
        progress: 2,
        budget: 1560000000,
        spent: 31200000,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
      },
    ];

    const activities: ActivityItem[] = [
      { id: 'act_1', type: 'approval', title: 'Purchase Order Approved', description: 'PO-2026-000011 for structural steel approved by Director', user: 'Rajesh Kumar', timestamp: new Date(Date.now() - 1800000).toISOString(), entityType: 'PO', entityId: 'po_011', status: 'APPROVED' },
      { id: 'act_2', type: 'submission', title: 'RA Bill Submitted', description: 'RA Bill #12 for Mumbai-Pune Expressway submitted for certification', user: 'Priya Sharma', timestamp: new Date(Date.now() - 3600000).toISOString(), entityType: 'BILL', entityId: 'rab_012', status: 'SUBMITTED' },
      { id: 'act_3', type: 'delivery', title: 'Material Received', description: '45 MT of TMT bars received at Site A against PO-2026-000009', user: 'Amit Patel', timestamp: new Date(Date.now() - 7200000).toISOString(), entityType: 'GRN', entityId: 'grn_034', status: 'COMPLETED' },
      { id: 'act_4', type: 'query', title: 'Query Raised on Subcontractor Bill', description: 'Discrepancy found in measurement for chainage 8.5-9.0 km', user: 'Priya Sharma', timestamp: new Date(Date.now() - 14400000).toISOString(), entityType: 'BILL', entityId: 'scb_005', status: 'QUERY_RAISED' },
      { id: 'act_5', type: 'creation', title: 'New RFQ Created', description: 'RFQ-2026-000091 created for ready-mix concrete supply', user: 'Amit Patel', timestamp: new Date(Date.now() - 28800000).toISOString(), entityType: 'RFQ', entityId: 'rfq_091', status: 'DRAFT' },
      { id: 'act_6', type: 'safety', title: 'Safety Observation Closed', description: 'PPE compliance issue at Formwork Zone B resolved', user: 'Amit Patel', timestamp: new Date(Date.now() - 43200000).toISOString(), entityType: 'SAFETY', entityId: 'obs_078', status: 'CLOSED' },
      { id: 'act_7', type: 'payment', title: 'Payment Processed', description: '₹12,80,000 paid to M/s Steel Tech Suppliers', user: 'Rajesh Kumar', timestamp: new Date(Date.now() - 86400000).toISOString(), entityType: 'PAYMENT', entityId: 'pay_045', status: 'POSTED' },
      { id: 'act_8', type: 'document', title: 'Drawing Uploaded', description: 'Revised GAD for Pier Cap Beam uploaded (Rev. C)', user: 'Priya Sharma', timestamp: new Date(Date.now() - 100000000).toISOString(), entityType: 'DOCUMENT', entityId: 'doc_234', status: 'APPROVED' },
    ];

    set({ companies, projects, activities });
  },
}));

// Part 02: Master Data Store
export { useMasterDataStore } from './masterStore';

// Part 03: Security Store
export { useSecurityStore } from './securityStore';

// Part 04: Workflow Store
export { useWorkflowStore } from './workflowStore';

// Part 05: Dashboard Store
export { useDashboardStore } from './dashboardStore';

// Part 06: Project Store
export { useProjectStore } from './projectStore';

// Part 07: Planning Store
export { usePlanningStore } from './planningStore';

// Part 08: Tender Store
export { useTenderStore } from './tenderStore';

// Part 09: Rate Store
export { useRateStore } from './rateStore';

// Part 10: BOQ Store
export { useBOQStore } from './boqStore';

// Part 11: Contract Store
export { useContractStore } from './contractStore';

// Part 12: Commercial Store
export { useCommercialStore } from './commercialStore';

// Part 13: Material Store
export { useMaterialStore } from './materialStore';

// Part 14: Vendor Store
export { useVendorStore } from './vendorStore';

// Part 15: Procurement Store
export { useProcurementStore } from './procurementStore';

// Part 16: PO Store
export { usePOStore } from './poStore';

// Part 17: Store & Warehouse Store
export { useStoreStore } from './storeStore';

// Part 18: Quality Store
export { useQualityStore } from './qualityStore';

// Part 19: Material Control Store
export { useMaterialControlStore } from './materialControlStore';

// Part 20: Procurement Control Store
export { useProcurementControlStore } from './procurementControlStore';

// Part 21: Measurement Book Store
export { useMBStore } from './mbStore';

// Part 22: Billing Store
export { useBillingStore } from './billingStore';

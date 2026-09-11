// ============================================================
// BUILDCORE ERP - DASHBOARD STORE
// Part 05: Real-Time Management Dashboard & Business Intelligence
// ============================================================

import { create } from 'zustand';
import type {
  DashboardConfig, KPIResult, KPIType, DashboardAlert,
  SCurveData, TrendData, ProjectProfitability,
  SuperAdminDashboardKPIs, DirectorDashboardKPIs,
  ProjectManagerDashboardKPIs, SiteEngineerDashboardKPIs,
  DashboardRoleType
} from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';

interface DashboardState {
  // Configuration
  currentDashboard: DashboardConfig | null;
  savedDashboards: DashboardConfig[];
  
  // KPI Data
  kpiData: Map<KPIType, KPIResult>;
  
  // Role-specific KPIs
  superAdminKPIs: SuperAdminDashboardKPIs | null;
  directorKPIs: DirectorDashboardKPIs | null;
  projectManagerKPIs: ProjectManagerDashboardKPIs | null;
  siteEngineerKPIs: SiteEngineerDashboardKPIs | null;
  
  // S-Curve & Trends
  sCurveData: SCurveData | null;
  trendData: TrendData | null;
  
  // Profitability
  projectProfitability: ProjectProfitability | null;
  
  // Alerts
  alerts: DashboardAlert[];
  alertCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  
  // Real-time
  lastUpdated: string;
  isRefreshing: boolean;
  
  // Actions
  loadDashboard: (roleType: DashboardRoleType, companyId: string) => void;
  calculateKPI: (kpiType: KPIType, companyId: string, filters?: Record<string, any>) => KPIResult;
  loadSuperAdminKPIs: (companyId: string) => void;
  loadDirectorKPIs: (companyId: string) => void;
  loadProjectManagerKPIs: (companyId: string, projectId?: string) => void;
  loadSiteEngineerKPIs: (companyId: string, siteId?: string) => void;
  loadSCurveData: (projectId: string) => void;
  loadTrendData: (kpiType: KPIType, period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => void;
  loadProjectProfitability: (projectId: string) => void;
  loadAlerts: (companyId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  refreshAll: (companyId: string, roleType: DashboardRoleType) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  currentDashboard: null,
  savedDashboards: [],
  kpiData: new Map(),
  superAdminKPIs: null,
  directorKPIs: null,
  projectManagerKPIs: null,
  siteEngineerKPIs: null,
  sCurveData: null,
  trendData: null,
  projectProfitability: null,
  alerts: [],
  alertCounts: { critical: 0, high: 0, medium: 0, low: 0 },
  lastUpdated: new Date().toISOString(),
  isRefreshing: false,

  // Load dashboard configuration
  loadDashboard: (roleType, companyId) => {
    const config = dashboardService.getDashboardConfig(roleType, companyId);
    set({ currentDashboard: config });
  },

  // Calculate KPI
  calculateKPI: (kpiType, companyId, filters) => {
    const result = dashboardService.calculateKPI(kpiType, companyId, filters);
    const kpiData = new Map(get().kpiData);
    kpiData.set(kpiType, result);
    set({ kpiData, lastUpdated: new Date().toISOString() });
    return result;
  },

  // Load role-specific KPIs
  loadSuperAdminKPIs: (companyId) => {
    const kpis = dashboardService.getSuperAdminDashboardKPIs(companyId);
    set({ superAdminKPIs: kpis, lastUpdated: new Date().toISOString() });
  },

  loadDirectorKPIs: (companyId) => {
    const kpis = dashboardService.getDirectorDashboardKPIs(companyId);
    set({ directorKPIs: kpis, lastUpdated: new Date().toISOString() });
  },

  loadProjectManagerKPIs: (companyId, projectId) => {
    const kpis = dashboardService.getProjectManagerDashboardKPIs(companyId, projectId);
    set({ projectManagerKPIs: kpis, lastUpdated: new Date().toISOString() });
  },

  loadSiteEngineerKPIs: (companyId, siteId) => {
    const kpis = dashboardService.getSiteEngineerDashboardKPIs(companyId, siteId);
    set({ siteEngineerKPIs: kpis, lastUpdated: new Date().toISOString() });
  },

  // Load S-Curve data
  loadSCurveData: (projectId) => {
    const data = dashboardService.getSCurveData(projectId);
    set({ sCurveData: data, lastUpdated: new Date().toISOString() });
  },

  // Load trend data
  loadTrendData: (kpiType, period) => {
    const data = dashboardService.getTrendData(kpiType, period);
    set({ trendData: data, lastUpdated: new Date().toISOString() });
  },

  // Load project profitability
  loadProjectProfitability: (projectId) => {
    const data = dashboardService.getProjectProfitability(projectId);
    set({ projectProfitability: data, lastUpdated: new Date().toISOString() });
  },

  // Load alerts
  loadAlerts: (companyId) => {
    const alerts = dashboardService.generateAlerts(companyId);
    const alertCounts = {
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      high: alerts.filter(a => a.severity === 'HIGH').length,
      medium: alerts.filter(a => a.severity === 'MEDIUM').length,
      low: alerts.filter(a => a.severity === 'LOW').length,
    };
    set({ alerts, alertCounts, lastUpdated: new Date().toISOString() });
  },

  // Acknowledge alert
  acknowledgeAlert: (alertId) => {
    const alerts = get().alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, status: 'ACKNOWLEDGED' as const, acknowledgedAt: new Date().toISOString() }
        : alert
    );
    const alertCounts = {
      critical: alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length,
      high: alerts.filter(a => a.severity === 'HIGH' && a.status === 'ACTIVE').length,
      medium: alerts.filter(a => a.severity === 'MEDIUM' && a.status === 'ACTIVE').length,
      low: alerts.filter(a => a.severity === 'LOW' && a.status === 'ACTIVE').length,
    };
    set({ alerts, alertCounts });
  },

  // Refresh all data
  refreshAll: async (companyId, roleType) => {
    set({ isRefreshing: true });
    
    // Load dashboard config
    get().loadDashboard(roleType, companyId);
    
    // Load role-specific KPIs
    switch (roleType) {
      case 'SUPER_ADMIN':
        get().loadSuperAdminKPIs(companyId);
        break;
      case 'DIRECTOR':
        get().loadDirectorKPIs(companyId);
        break;
      case 'PROJECT_MANAGER':
        get().loadProjectManagerKPIs(companyId);
        break;
      case 'SITE_ENGINEER':
        get().loadSiteEngineerKPIs(companyId);
        break;
    }
    
    // Load common data
    get().loadAlerts(companyId);
    
    // Simulate async refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({ isRefreshing: false, lastUpdated: new Date().toISOString() });
  },
}));

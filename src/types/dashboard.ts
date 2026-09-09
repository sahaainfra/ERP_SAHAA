// ============================================================
// BUILDCORE ERP - DASHBOARD & BI TYPES
// Part 05: Real-Time Management Dashboard & Business Intelligence
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. DASHBOARD CONFIGURATION
// ============================================================
export interface DashboardConfig {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  roleType: DashboardRoleType;
  userId?: string; // null = system dashboard, userId = saved dashboard
  isDefault: boolean;
  isShared: boolean;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  refreshInterval: number; // seconds
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type DashboardRoleType = 
  | 'SUPER_ADMIN'
  | 'DIRECTOR'
  | 'HEAD_OFFICE'
  | 'PROJECT_MANAGER'
  | 'SITE_ENGINEER'
  | 'COMMERCIAL'
  | 'ACCOUNTS'
  | 'PROCUREMENT'
  | 'STORE'
  | 'HR'
  | 'PLANT'
  | 'QA_QC'
  | 'SAFETY';

export interface DashboardLayout {
  columns: number;
  gap: number;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// ============================================================
// 2. DASHBOARD WIDGET
// ============================================================
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config: WidgetConfig;
  position: WidgetPosition;
  size: WidgetSize;
  dataSource: DataSource;
  permissions: string[];
  isVisible: boolean;
  refreshInterval?: number;
}

export type WidgetType = 
  | 'KPI_CARD'
  | 'CHART_LINE'
  | 'CHART_BAR'
  | 'CHART_PIE'
  | 'CHART_AREA'
  | 'CHART_GAUGE'
  | 'CHART_FUNNEL'
  | 'TABLE'
  | 'ALERT_LIST'
  | 'APPROVAL_LIST'
  | 'TASK_LIST'
  | 'ACTIVITY_FEED'
  | 'PROGRESS_BAR'
  | 'S_CURVE'
  | 'HEATMAP'
  | 'MAP'
  | 'TREND'
  | 'GAUGE'
  | 'COUNTER';

export interface WidgetConfig {
  showTitle?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animation?: boolean;
  colorScheme?: string;
  dateFormat?: string;
  numberFormat?: string;
  currency?: string;
  decimalPlaces?: number;
  aggregation?: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  groupBy?: string;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  limit?: number;
  customConfig?: Record<string, any>;
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number; // width in columns
  h: number; // height in rows
}

export interface WidgetSize {
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface DataSource {
  type: 'API' | 'QUERY' | 'KPI_ENGINE' | 'STATIC';
  endpoint?: string;
  query?: string;
  kpiType?: KPIType;
  parameters?: Record<string, any>;
  cacheDuration?: number; // seconds
}

// ============================================================
// 3. KPI ENGINE
// ============================================================
export type KPIType = 
  // Financial KPIs
  | 'TOTAL_CONTRACT_VALUE'
  | 'REVISED_CONTRACT_VALUE'
  | 'WORK_EXECUTED'
  | 'CERTIFIED_BILLING'
  | 'COLLECTIONS'
  | 'OUTSTANDING_RECEIVABLES'
  | 'PAYABLES'
  | 'CASH_BANK_BALANCE'
  | 'PROJECT_PROFITABILITY'
  | 'GROSS_MARGIN'
  | 'FORECAST_MARGIN'
  
  // Progress KPIs
  | 'PHYSICAL_PROGRESS'
  | 'FINANCIAL_PROGRESS'
  | 'BILLING_PROGRESS'
  | 'COLLECTION_PROGRESS'
  | 'COST_PROGRESS'
  
  // Variance KPIs
  | 'SCHEDULE_VARIANCE'
  | 'COST_VARIANCE'
  | 'BUDGET_VARIANCE'
  
  // Operational KPIs
  | 'PRODUCTIVITY'
  | 'PLANNED_VS_ACTUAL'
  | 'PROCUREMENT_COMMITMENTS'
  | 'STOCK_VALUE'
  | 'PLANT_UTILIZATION'
  | 'MANPOWER_COUNT'
  
  // Project Health
  | 'PROJECTS_ACTIVE'
  | 'PROJECTS_DELAYED'
  | 'PROJECTS_AT_RISK'
  | 'SAFETY_SCORE'
  | 'QUALITY_SCORE'
  
  // Alerts
  | 'CRITICAL_ALERTS'
  | 'HIGH_ALERTS'
  | 'MEDIUM_ALERTS'
  | 'LOW_ALERTS'
  | 'TOTAL_ALERTS';

export interface KPICalculation {
  id: string;
  kpiType: KPIType;
  name: string;
  description?: string;
  formula: string;
  unit?: string;
  currency?: string;
  decimalPlaces: number;
  targetValue?: number;
  thresholdWarning?: number;
  thresholdCritical?: number;
  calculationMethod: 'DIRECT' | 'FORMULA' | 'AGGREGATION' | 'RATIO';
  sourceTables: string[];
  sourceFields: string[];
  filters?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KPIResult {
  kpiType: KPIType;
  value: number;
  unit?: string;
  currency?: string;
  targetValue?: number;
  variance?: number;
  variancePercent?: number;
  status: 'ON_TRACK' | 'WARNING' | 'CRITICAL' | 'EXCELLENT';
  trend?: 'UP' | 'DOWN' | 'STABLE';
  trendValue?: number;
  calculatedAt: string;
  period?: string;
}

// ============================================================
// 4. DASHBOARD FILTER
// ============================================================
export interface DashboardFilter {
  id: string;
  type: FilterType;
  label: string;
  field: string;
  operator: FilterOperator;
  value: any;
  isVisible: boolean;
  isRequired: boolean;
}

export type FilterType = 'DATE_RANGE' | 'PROJECT' | 'SITE' | 'DEPARTMENT' | 'STATUS' | 'AMOUNT_RANGE' | 'TEXT' | 'MULTI_SELECT';

export type FilterOperator = 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN' | 'CONTAINS';

// ============================================================
// 5. ALERT SYSTEM
// ============================================================
export interface DashboardAlert {
  id: string;
  companyId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  entityNumber?: string;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
  metadata?: Record<string, any>;
}

export type AlertType = 
  | 'BUDGET_OVERRUN'
  | 'NEGATIVE_STOCK'
  | 'BOQ_EXCESS'
  | 'BILLING_OVERDUE'
  | 'PAYMENT_OVERDUE'
  | 'PO_OVERDUE'
  | 'CONTRACT_EXPIRY'
  | 'EOT_EXPIRY'
  | 'DOCUMENT_EXPIRY'
  | 'NCR_OVERDUE'
  | 'SAFETY_ISSUE'
  | 'PLANT_BREAKDOWN'
  | 'SLA_BREACH'
  | 'APPROVAL_OVERDUE'
  | 'COST_VARIANCE'
  | 'SCHEDULE_DELAY'
  | 'QUALITY_FAILURE'
  | 'COMPLIANCE_BREACH';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

// ============================================================
// 6. S-CURVE DATA
// ============================================================
export interface SCurveData {
  projectId: string;
  projectName: string;
  dates: string[];
  planned: number[];
  actual: number[];
  forecast: number[];
  variance: number[];
}

// ============================================================
// 7. TREND DATA
// ============================================================
export interface TrendData {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  dataPoints: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  value: number;
  target?: number;
  label?: string;
}

// ============================================================
// 8. PROJECT PROFITABILITY
// ============================================================
export interface ProjectProfitability {
  projectId: string;
  projectName: string;
  contractRevenue: number;
  certifiedRevenue: number;
  expectedRevenue: number;
  directCost: number;
  materialCost: number;
  labourCost: number;
  plantCost: number;
  subcontractCost: number;
  overheads: number;
  otherCost: number;
  totalCost: number;
  grossMargin: number;
  grossMarginPercent: number;
  forecastMargin: number;
  forecastMarginPercent: number;
  status: 'PROFITABLE' | 'BREAKEVEN' | 'LOSS';
}

// ============================================================
// 9. DRILL-DOWN CONFIGURATION
// ============================================================
export interface DrillDownConfig {
  sourceKPI: KPIType;
  levels: DrillDownLevel[];
}

export interface DrillDownLevel {
  level: number;
  entityType: 'COMPANY' | 'PROJECT' | 'WBS' | 'BOQ' | 'TRANSACTION';
  entityField: string;
  displayField: string;
  filterField?: string;
}

// ============================================================
// 10. DASHBOARD KPIs BY ROLE
// ============================================================
export interface SuperAdminDashboardKPIs {
  totalCompanies: number;
  totalBranches: number;
  totalDepartments: number;
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeSites: number;
  pendingApprovals: number;
  securityAlerts: number;
  failedLoginsToday: number;
  workflowBottlenecks: number;
  masterDataIssues: number;
  systemHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface DirectorDashboardKPIs {
  totalContractValue: number;
  revisedContractValue: number;
  workExecuted: number;
  certifiedBilling: number;
  collections: number;
  outstandingReceivables: number;
  payables: number;
  cashBankBalance: number;
  projectProfitability: number;
  budgetVsActual: number;
  costVariance: number;
  physicalProgress: number;
  financialProgress: number;
  schedulePerformance: number;
  procurementCommitments: number;
  stockValue: number;
  plantUtilization: number;
  manpower: number;
  safetyScore: number;
  qualityScore: number;
  majorRisks: number;
  claims: number;
  eot: number;
  delayedProjects: number;
}

export interface ProjectManagerDashboardKPIs {
  projectProgress: number;
  contractValue: number;
  boqExecution: number;
  billing: number;
  receivables: number;
  procurement: number;
  materials: number;
  stock: number;
  manpower: number;
  attendance: number;
  plant: number;
  planning: number;
  quality: number;
  safety: number;
  issues: number;
  risks: number;
  approvals: number;
  correspondence: number;
}

export interface SiteEngineerDashboardKPIs {
  todaysActivities: number;
  plannedQuantity: number;
  executedQuantity: number;
  productivity: number;
  labourStrength: number;
  attendance: number;
  materialAvailability: number;
  plantAvailability: number;
  inspections: number;
  wirMir: number;
  photos: number;
  safetyObservations: number;
  pendingInstructions: number;
}

// ============================================================
// 11. REAL-TIME UPDATE
// ============================================================
export interface DashboardUpdate {
  widgetId: string;
  timestamp: string;
  data: any;
  type: 'FULL_REFRESH' | 'INCREMENTAL' | 'ALERT';
}

// ============================================================
// 12. SAVED DASHBOARD
// ============================================================
export interface SavedDashboard {
  id: string;
  userId: string;
  name: string;
  config: DashboardConfig;
  isDefault: boolean;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

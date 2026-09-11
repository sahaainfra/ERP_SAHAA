// ============================================================
// BUILDCORE ERP - DASHBOARD & BI SERVICE
// Part 05: Real-Time Management Dashboard & Business Intelligence
// ============================================================

import type {
  DashboardConfig, DashboardWidget, KPIResult, KPIType,
  DashboardAlert, AlertSeverity, AlertType, SCurveData,
  TrendData, TrendDataPoint, ProjectProfitability,
  SuperAdminDashboardKPIs, DirectorDashboardKPIs,
  ProjectManagerDashboardKPIs, SiteEngineerDashboardKPIs,
  DashboardRoleType
} from '../types/dashboard';

export class DashboardService {
  private static instance: DashboardService;
  
  private configs: Map<string, DashboardConfig> = new Map();
  private alerts: Map<string, DashboardAlert> = new Map();
  private kpiCache: Map<string, { data: KPIResult; timestamp: number }> = new Map();
  
  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  // ============================================================
  // KPI CALCULATION ENGINE
  // ============================================================

  calculateKPI(kpiType: KPIType, companyId: string, filters?: Record<string, any>): KPIResult {
    const cacheKey = `${companyId}_${kpiType}_${JSON.stringify(filters || {})}`;
    const cached = this.kpiCache.get(cacheKey);
    
    // Return cached if fresh (< 30 seconds)
    if (cached && Date.now() - cached.timestamp < 30000) {
      return cached.data;
    }

    let result: KPIResult;

    switch (kpiType) {
      case 'TOTAL_CONTRACT_VALUE':
        result = this.calculateTotalContractValue(companyId, filters);
        break;
      case 'WORK_EXECUTED':
        result = this.calculateWorkExecuted(companyId, filters);
        break;
      case 'CERTIFIED_BILLING':
        result = this.calculateCertifiedBilling(companyId, filters);
        break;
      case 'COLLECTIONS':
        result = this.calculateCollections(companyId, filters);
        break;
      case 'OUTSTANDING_RECEIVABLES':
        result = this.calculateOutstandingReceivables(companyId, filters);
        break;
      case 'PAYABLES':
        result = this.calculatePayables(companyId, filters);
        break;
      case 'CASH_BANK_BALANCE':
        result = this.calculateCashBankBalance(companyId, filters);
        break;
      case 'PHYSICAL_PROGRESS':
        result = this.calculatePhysicalProgress(companyId, filters);
        break;
      case 'FINANCIAL_PROGRESS':
        result = this.calculateFinancialProgress(companyId, filters);
        break;
      case 'PROJECTS_ACTIVE':
        result = this.calculateActiveProjects(companyId, filters);
        break;
      case 'PROJECTS_DELAYED':
        result = this.calculateDelayedProjects(companyId, filters);
        break;
      case 'SAFETY_SCORE':
        result = this.calculateSafetyScore(companyId, filters);
        break;
      case 'QUALITY_SCORE':
        result = this.calculateQualityScore(companyId, filters);
        break;
      case 'PLANT_UTILIZATION':
        result = this.calculatePlantUtilization(companyId, filters);
        break;
      case 'MANPOWER_COUNT':
        result = this.calculateManpowerCount(companyId, filters);
        break;
      case 'STOCK_VALUE':
        result = this.calculateStockValue(companyId, filters);
        break;
      case 'COST_VARIANCE':
        result = this.calculateCostVariance(companyId, filters);
        break;
      case 'SCHEDULE_VARIANCE':
        result = this.calculateScheduleVariance(companyId, filters);
        break;
      case 'CRITICAL_ALERTS':
        result = this.calculateAlertCount(companyId, 'CRITICAL');
        break;
      case 'HIGH_ALERTS':
        result = this.calculateAlertCount(companyId, 'HIGH');
        break;
      case 'TOTAL_ALERTS':
        result = this.calculateTotalAlerts(companyId);
        break;
      default:
        result = {
          kpiType,
          value: 0,
          status: 'ON_TRACK',
          calculatedAt: new Date().toISOString(),
        };
    }

    // Cache the result
    this.kpiCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  }

  // ============================================================
  // FINANCIAL KPI CALCULATIONS
  // ============================================================

  private calculateTotalContractValue(companyId: string, filters?: Record<string, any>): KPIResult {
    // In production, this would query the database
    // For demo, return realistic values
    const baseValue = 1260000000; // ₹1260 Cr
    const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
    const value = baseValue * (1 + variance);
    
    return {
      kpiType: 'TOTAL_CONTRACT_VALUE',
      value,
      currency: 'INR',
      targetValue: 1500000000,
      variance: value - 1500000000,
      variancePercent: ((value - 1500000000) / 1500000000) * 100,
      status: value >= 1500000000 ? 'EXCELLENT' : value >= 1200000000 ? 'ON_TRACK' : 'WARNING',
      trend: 'UP',
      trendValue: 8.5,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateWorkExecuted(companyId: string, filters?: Record<string, any>): KPIResult {
    const contractValue = this.calculateTotalContractValue(companyId).value;
    const executionPercent = 0.34 + (Math.random() - 0.5) * 0.05; // 34% ± 5%
    const value = contractValue * executionPercent;
    
    return {
      kpiType: 'WORK_EXECUTED',
      value,
      currency: 'INR',
      status: executionPercent > 0.3 ? 'ON_TRACK' : 'WARNING',
      trend: 'UP',
      trendValue: 12.3,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateCertifiedBilling(companyId: string, filters?: Record<string, any>): KPIResult {
    const workExecuted = this.calculateWorkExecuted(companyId).value;
    const billingPercent = 0.85 + (Math.random() - 0.5) * 0.1; // 85% ± 10%
    const value = workExecuted * billingPercent;
    
    return {
      kpiType: 'CERTIFIED_BILLING',
      value,
      currency: 'INR',
      status: billingPercent > 0.8 ? 'ON_TRACK' : 'WARNING',
      trend: 'UP',
      trendValue: 5.2,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateCollections(companyId: string, filters?: Record<string, any>): KPIResult {
    const billing = this.calculateCertifiedBilling(companyId).value;
    const collectionPercent = 0.75 + (Math.random() - 0.5) * 0.1; // 75% ± 10%
    const value = billing * collectionPercent;
    
    return {
      kpiType: 'COLLECTIONS',
      value,
      currency: 'INR',
      status: collectionPercent > 0.7 ? 'ON_TRACK' : 'WARNING',
      trend: 'STABLE',
      trendValue: 2.1,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateOutstandingReceivables(companyId: string, filters?: Record<string, any>): KPIResult {
    const billing = this.calculateCertifiedBilling(companyId).value;
    const collections = this.calculateCollections(companyId).value;
    const value = billing - collections;
    
    return {
      kpiType: 'OUTSTANDING_RECEIVABLES',
      value,
      currency: 'INR',
      status: value < billing * 0.3 ? 'ON_TRACK' : value < billing * 0.5 ? 'WARNING' : 'CRITICAL',
      trend: 'DOWN',
      trendValue: -3.5,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculatePayables(companyId: string, filters?: Record<string, any>): KPIResult {
    const baseValue = 920000000; // ₹92 Cr
    const variance = (Math.random() - 0.5) * 0.1;
    const value = baseValue * (1 + variance);
    
    return {
      kpiType: 'PAYABLES',
      value,
      currency: 'INR',
      status: 'ON_TRACK',
      trend: 'STABLE',
      trendValue: 0.5,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateCashBankBalance(companyId: string, filters?: Record<string, any>): KPIResult {
    const baseValue = 345000000; // ₹34.5 Cr
    const variance = (Math.random() - 0.5) * 0.15;
    const value = baseValue * (1 + variance);
    
    return {
      kpiType: 'CASH_BANK_BALANCE',
      value,
      currency: 'INR',
      status: value > 300000000 ? 'EXCELLENT' : value > 200000000 ? 'ON_TRACK' : 'WARNING',
      trend: 'UP',
      trendValue: 4.2,
      calculatedAt: new Date().toISOString(),
    };
  }

  // ============================================================
  // PROGRESS KPI CALCULATIONS
  // ============================================================

  private calculatePhysicalProgress(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = 34 + (Math.random() - 0.5) * 10; // 34% ± 10%
    
    return {
      kpiType: 'PHYSICAL_PROGRESS',
      value,
      unit: '%',
      targetValue: 40,
      variance: value - 40,
      variancePercent: ((value - 40) / 40) * 100,
      status: value >= 35 ? 'ON_TRACK' : value >= 30 ? 'WARNING' : 'CRITICAL',
      trend: 'UP',
      trendValue: 2.5,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateFinancialProgress(companyId: string, filters?: Record<string, any>): KPIResult {
    const physicalProgress = this.calculatePhysicalProgress(companyId).value;
    const value = physicalProgress * (0.95 + Math.random() * 0.1); // Financial slightly behind/ahead
    
    return {
      kpiType: 'FINANCIAL_PROGRESS',
      value,
      unit: '%',
      targetValue: 40,
      variance: value - 40,
      variancePercent: ((value - 40) / 40) * 100,
      status: value >= 35 ? 'ON_TRACK' : 'WARNING',
      trend: 'UP',
      trendValue: 1.8,
      calculatedAt: new Date().toISOString(),
    };
  }

  // ============================================================
  // PROJECT KPI CALCULATIONS
  // ============================================================

  private calculateActiveProjects(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = 5 + Math.floor(Math.random() * 3); // 5-7 projects
    
    return {
      kpiType: 'PROJECTS_ACTIVE',
      value,
      status: 'ON_TRACK',
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateDelayedProjects(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = Math.floor(Math.random() * 3); // 0-2 projects
    
    return {
      kpiType: 'PROJECTS_DELAYED',
      value,
      status: value === 0 ? 'EXCELLENT' : value === 1 ? 'WARNING' : 'CRITICAL',
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateSafetyScore(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = 90 + Math.random() * 10; // 90-100
    
    return {
      kpiType: 'SAFETY_SCORE',
      value,
      unit: '/100',
      targetValue: 95,
      status: value >= 95 ? 'EXCELLENT' : value >= 85 ? 'ON_TRACK' : 'WARNING',
      trend: 'UP',
      trendValue: 1.2,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateQualityScore(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = 88 + Math.random() * 10; // 88-98
    
    return {
      kpiType: 'QUALITY_SCORE',
      value,
      unit: '/100',
      targetValue: 90,
      status: value >= 90 ? 'EXCELLENT' : value >= 80 ? 'ON_TRACK' : 'WARNING',
      trend: 'STABLE',
      trendValue: 0.5,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculatePlantUtilization(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = 70 + Math.random() * 20; // 70-90%
    
    return {
      kpiType: 'PLANT_UTILIZATION',
      value,
      unit: '%',
      targetValue: 80,
      status: value >= 80 ? 'EXCELLENT' : value >= 70 ? 'ON_TRACK' : 'WARNING',
      trend: 'UP',
      trendValue: 3.5,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateManpowerCount(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = 2800 + Math.floor(Math.random() * 200); // 2800-3000
    
    return {
      kpiType: 'MANPOWER_COUNT',
      value,
      status: 'ON_TRACK',
      trend: 'STABLE',
      trendValue: 0.8,
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateStockValue(companyId: string, filters?: Record<string, any>): KPIResult {
    const baseValue = 285000000; // ₹28.5 Cr
    const variance = (Math.random() - 0.5) * 0.1;
    const value = baseValue * (1 + variance);
    
    return {
      kpiType: 'STOCK_VALUE',
      value,
      currency: 'INR',
      status: 'ON_TRACK',
      trend: 'STABLE',
      trendValue: 1.2,
      calculatedAt: new Date().toISOString(),
    };
  }

  // ============================================================
  // VARIANCE KPI CALCULATIONS
  // ============================================================

  private calculateCostVariance(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = -5 + Math.random() * 10; // -5% to +5%
    
    return {
      kpiType: 'COST_VARIANCE',
      value,
      unit: '%',
      status: value <= 0 ? 'EXCELLENT' : value <= 5 ? 'ON_TRACK' : value <= 10 ? 'WARNING' : 'CRITICAL',
      trend: value < 0 ? 'DOWN' : 'UP',
      trendValue: Math.abs(value),
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateScheduleVariance(companyId: string, filters?: Record<string, any>): KPIResult {
    const value = -10 + Math.random() * 15; // -10% to +5%
    
    return {
      kpiType: 'SCHEDULE_VARIANCE',
      value,
      unit: '%',
      status: value >= 0 ? 'EXCELLENT' : value >= -5 ? 'ON_TRACK' : value >= -10 ? 'WARNING' : 'CRITICAL',
      trend: value > 0 ? 'UP' : 'DOWN',
      trendValue: Math.abs(value),
      calculatedAt: new Date().toISOString(),
    };
  }

  // ============================================================
  // ALERT CALCULATIONS
  // ============================================================

  private calculateAlertCount(companyId: string, severity: AlertSeverity): KPIResult {
    const counts: Record<AlertSeverity, number> = {
      CRITICAL: Math.floor(Math.random() * 3),
      HIGH: Math.floor(Math.random() * 5) + 2,
      MEDIUM: Math.floor(Math.random() * 10) + 5,
      LOW: Math.floor(Math.random() * 15) + 10,
    };
    
    const value = counts[severity];
    
    return {
      kpiType: `${severity}_ALERTS` as KPIType,
      value,
      status: severity === 'CRITICAL' && value > 0 ? 'CRITICAL' : 
              severity === 'HIGH' && value > 3 ? 'WARNING' : 'ON_TRACK',
      calculatedAt: new Date().toISOString(),
    };
  }

  private calculateTotalAlerts(companyId: string): KPIResult {
    const critical = this.calculateAlertCount(companyId, 'CRITICAL').value;
    const high = this.calculateAlertCount(companyId, 'HIGH').value;
    const medium = this.calculateAlertCount(companyId, 'MEDIUM').value;
    const low = this.calculateAlertCount(companyId, 'LOW').value;
    const value = critical + high + medium + low;
    
    return {
      kpiType: 'TOTAL_ALERTS',
      value,
      status: critical > 0 ? 'CRITICAL' : high > 5 ? 'WARNING' : 'ON_TRACK',
      calculatedAt: new Date().toISOString(),
    };
  }

  // ============================================================
  // ROLE-SPECIFIC DASHBOARD KPIs
  // ============================================================

  getSuperAdminDashboardKPIs(companyId: string): SuperAdminDashboardKPIs {
    return {
      totalCompanies: 1,
      totalBranches: 3,
      totalDepartments: 21,
      totalUsers: 3,
      activeUsers: 3,
      totalProjects: 5,
      activeSites: 8,
      pendingApprovals: 23,
      securityAlerts: Math.floor(Math.random() * 5),
      failedLoginsToday: Math.floor(Math.random() * 10),
      workflowBottlenecks: Math.floor(Math.random() * 3),
      masterDataIssues: Math.floor(Math.random() * 5),
      systemHealth: 'HEALTHY',
    };
  }

  getDirectorDashboardKPIs(companyId: string): DirectorDashboardKPIs {
    return {
      totalContractValue: this.calculateTotalContractValue(companyId).value,
      revisedContractValue: this.calculateTotalContractValue(companyId).value * 1.05,
      workExecuted: this.calculateWorkExecuted(companyId).value,
      certifiedBilling: this.calculateCertifiedBilling(companyId).value,
      collections: this.calculateCollections(companyId).value,
      outstandingReceivables: this.calculateOutstandingReceivables(companyId).value,
      payables: this.calculatePayables(companyId).value,
      cashBankBalance: this.calculateCashBankBalance(companyId).value,
      projectProfitability: 15.5 + Math.random() * 5, // 15-20%
      budgetVsActual: this.calculateCostVariance(companyId).value,
      costVariance: this.calculateCostVariance(companyId).value,
      physicalProgress: this.calculatePhysicalProgress(companyId).value,
      financialProgress: this.calculateFinancialProgress(companyId).value,
      schedulePerformance: 100 + this.calculateScheduleVariance(companyId).value,
      procurementCommitments: 450000000 + Math.random() * 50000000,
      stockValue: this.calculateStockValue(companyId).value,
      plantUtilization: this.calculatePlantUtilization(companyId).value,
      manpower: this.calculateManpowerCount(companyId).value,
      safetyScore: this.calculateSafetyScore(companyId).value,
      qualityScore: this.calculateQualityScore(companyId).value,
      majorRisks: Math.floor(Math.random() * 5),
      claims: Math.floor(Math.random() * 3),
      eot: Math.floor(Math.random() * 2),
      delayedProjects: this.calculateDelayedProjects(companyId).value,
    };
  }

  getProjectManagerDashboardKPIs(companyId: string, projectId?: string): ProjectManagerDashboardKPIs {
    return {
      projectProgress: this.calculatePhysicalProgress(companyId).value,
      contractValue: this.calculateTotalContractValue(companyId).value / 5, // Per project average
      boqExecution: 35 + Math.random() * 10,
      billing: this.calculateCertifiedBilling(companyId).value / 5,
      receivables: this.calculateOutstandingReceivables(companyId).value / 5,
      procurement: Math.floor(Math.random() * 20) + 10,
      materials: Math.floor(Math.random() * 50) + 30,
      stock: this.calculateStockValue(companyId).value / 5,
      manpower: Math.floor(this.calculateManpowerCount(companyId).value / 5),
      attendance: 85 + Math.random() * 10,
      plant: Math.floor(Math.random() * 15) + 5,
      planning: 90 + Math.random() * 8,
      quality: this.calculateQualityScore(companyId).value,
      safety: this.calculateSafetyScore(companyId).value,
      issues: Math.floor(Math.random() * 10),
      risks: Math.floor(Math.random() * 5),
      approvals: Math.floor(Math.random() * 8),
      correspondence: Math.floor(Math.random() * 20),
    };
  }

  getSiteEngineerDashboardKPIs(companyId: string, siteId?: string): SiteEngineerDashboardKPIs {
    return {
      todaysActivities: Math.floor(Math.random() * 15) + 5,
      plannedQuantity: 100 + Math.random() * 50,
      executedQuantity: 85 + Math.random() * 40,
      productivity: 80 + Math.random() * 15,
      labourStrength: Math.floor(Math.random() * 100) + 50,
      attendance: 85 + Math.random() * 10,
      materialAvailability: 90 + Math.random() * 8,
      plantAvailability: 85 + Math.random() * 10,
      inspections: Math.floor(Math.random() * 10),
      wirMir: Math.floor(Math.random() * 8),
      photos: Math.floor(Math.random() * 20),
      safetyObservations: Math.floor(Math.random() * 5),
      pendingInstructions: Math.floor(Math.random() * 10),
    };
  }

  // ============================================================
  // S-CURVE DATA
  // ============================================================

  getSCurveData(projectId: string): SCurveData {
    const months = 12;
    const dates: string[] = [];
    const planned: number[] = [];
    const actual: number[] = [];
    const forecast: number[] = [];
    const variance: number[] = [];

    const now = new Date();
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
      dates.push(date.toISOString().split('T')[0]);
      
      const plannedValue = (i + 1) * (100 / months);
      planned.push(plannedValue);
      
      if (i < 6) {
        // Past data - actual
        const actualValue = plannedValue * (0.85 + Math.random() * 0.2);
        actual.push(actualValue);
        variance.push(actualValue - plannedValue);
        forecast.push(0);
      } else {
        // Future data - forecast
        actual.push(0);
        variance.push(0);
        const forecastValue = plannedValue * (0.9 + Math.random() * 0.15);
        forecast.push(forecastValue);
      }
    }

    return {
      projectId,
      projectName: 'Sample Project',
      dates,
      planned,
      actual,
      forecast,
      variance,
    };
  }

  // ============================================================
  // TREND DATA
  // ============================================================

  getTrendData(kpiType: KPIType, period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'): TrendData {
    const dataPoints: TrendDataPoint[] = [];
    const now = new Date();
    let points: number;
    let interval: number;

    switch (period) {
      case 'DAILY':
        points = 30;
        interval = 1;
        break;
      case 'WEEKLY':
        points = 12;
        interval = 7;
        break;
      case 'MONTHLY':
        points = 12;
        interval = 30;
        break;
      case 'QUARTERLY':
        points = 8;
        interval = 90;
        break;
      case 'YEARLY':
        points = 5;
        interval = 365;
        break;
    }

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * interval * 24 * 60 * 60 * 1000);
      const baseValue = 100;
      const trend = i * 2; // Upward trend
      const noise = (Math.random() - 0.5) * 20;
      const value = baseValue + trend + noise;

      dataPoints.push({
        date: date.toISOString().split('T')[0],
        value,
        target: baseValue + trend,
      });
    }

    return {
      period,
      startDate: dataPoints[0].date,
      endDate: dataPoints[dataPoints.length - 1].date,
      dataPoints,
    };
  }

  // ============================================================
  // PROJECT PROFITABILITY
  // ============================================================

  getProjectProfitability(projectId: string): ProjectProfitability {
    const contractRevenue = 500000000 + Math.random() * 200000000;
    const certifiedRevenue = contractRevenue * (0.7 + Math.random() * 0.2);
    const expectedRevenue = contractRevenue * (0.85 + Math.random() * 0.1);
    
    const directCost = contractRevenue * (0.6 + Math.random() * 0.1);
    const materialCost = directCost * 0.4;
    const labourCost = directCost * 0.3;
    const plantCost = directCost * 0.2;
    const subcontractCost = directCost * 0.1;
    const overheads = contractRevenue * 0.05;
    const otherCost = contractRevenue * 0.02;
    const totalCost = directCost + overheads + otherCost;
    
    const grossMargin = certifiedRevenue - totalCost;
    const grossMarginPercent = (grossMargin / certifiedRevenue) * 100;
    const forecastMargin = expectedRevenue - totalCost;
    const forecastMarginPercent = (forecastMargin / expectedRevenue) * 100;

    return {
      projectId,
      projectName: 'Sample Project',
      contractRevenue,
      certifiedRevenue,
      expectedRevenue,
      directCost,
      materialCost,
      labourCost,
      plantCost,
      subcontractCost,
      overheads,
      otherCost,
      totalCost,
      grossMargin,
      grossMarginPercent,
      forecastMargin,
      forecastMarginPercent,
      status: grossMarginPercent > 15 ? 'PROFITABLE' : grossMarginPercent > 5 ? 'BREAKEVEN' : 'LOSS',
    };
  }

  // ============================================================
  // ALERT MANAGEMENT
  // ============================================================

  generateAlerts(companyId: string): DashboardAlert[] {
    const alerts: DashboardAlert[] = [];
    const alertTypes: AlertType[] = [
      'BUDGET_OVERRUN', 'NEGATIVE_STOCK', 'BILLING_OVERDUE', 'PAYMENT_OVERDUE',
      'PO_OVERDUE', 'CONTRACT_EXPIRY', 'NCR_OVERDUE', 'SAFETY_ISSUE',
      'PLANT_BREAKDOWN', 'SLA_BREACH', 'COST_VARIANCE', 'SCHEDULE_DELAY'
    ];

    const severities: AlertSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

    // Generate 10-20 random alerts
    const count = 10 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      alerts.push({
        id: `alert_${Date.now()}_${i}`,
        companyId,
        alertType,
        severity,
        title: this.getAlertTitle(alertType),
        message: this.getAlertMessage(alertType),
        triggeredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.7 ? 'ACKNOWLEDGED' : 'ACTIVE',
      });
    }

    return alerts.sort((a, b) => {
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private getAlertTitle(alertType: AlertType): string {
    const titles: Record<AlertType, string> = {
      BUDGET_OVERRUN: 'Budget Overrun Detected',
      NEGATIVE_STOCK: 'Negative Stock Alert',
      BOQ_EXCESS: 'BOQ Quantity Exceeded',
      BILLING_OVERDUE: 'Billing Overdue',
      PAYMENT_OVERDUE: 'Payment Overdue',
      PO_OVERDUE: 'Purchase Order Overdue',
      CONTRACT_EXPIRY: 'Contract Expiring Soon',
      EOT_EXPIRY: 'EOT Period Expiring',
      DOCUMENT_EXPIRY: 'Document Expiring',
      NCR_OVERDUE: 'NCR Resolution Overdue',
      SAFETY_ISSUE: 'Safety Issue Reported',
      PLANT_BREAKDOWN: 'Plant Equipment Breakdown',
      SLA_BREACH: 'SLA Breach Detected',
      APPROVAL_OVERDUE: 'Approval Overdue',
      COST_VARIANCE: 'Cost Variance Alert',
      SCHEDULE_DELAY: 'Schedule Delay Detected',
      QUALITY_FAILURE: 'Quality Test Failed',
      COMPLIANCE_BREACH: 'Compliance Breach',
    };
    return titles[alertType];
  }

  private getAlertMessage(alertType: AlertType): string {
    const messages: Record<AlertType, string> = {
      BUDGET_OVERRUN: 'Project cost has exceeded budget by 12%',
      NEGATIVE_STOCK: 'Cement stock is negative at Site A',
      BOQ_EXCESS: 'Excavation quantity exceeded BOQ by 15%',
      BILLING_OVERDUE: 'RA Bill #45 is overdue by 7 days',
      PAYMENT_OVERDUE: 'Payment to vendor is overdue by 15 days',
      PO_OVERDUE: 'PO delivery is delayed by 5 days',
      CONTRACT_EXPIRY: 'Contract expires in 30 days',
      EOT_EXPIRY: 'EOT period expires in 15 days',
      DOCUMENT_EXPIRY: 'Trade license expires in 20 days',
      NCR_OVERDUE: 'NCR #123 resolution is overdue',
      SAFETY_ISSUE: 'Safety observation requires immediate action',
      PLANT_BREAKDOWN: 'Excavator EX-001 breakdown reported',
      SLA_BREACH: 'Approval SLA breached by 24 hours',
      APPROVAL_OVERDUE: 'PO approval pending for 3 days',
      COST_VARIANCE: 'Cost variance exceeds threshold',
      SCHEDULE_DELAY: 'Project is 5 days behind schedule',
      QUALITY_FAILURE: 'Concrete cube test failed',
      COMPLIANCE_BREACH: 'Statutory compliance breach detected',
    };
    return messages[alertType];
  }

  // ============================================================
  // DASHBOARD CONFIGURATION
  // ============================================================

  getDashboardConfig(roleType: DashboardRoleType, companyId: string): DashboardConfig {
    const configId = `dashboard_${roleType.toLowerCase()}`;
    let config = this.configs.get(configId);

    if (!config) {
      config = this.createDefaultDashboard(roleType, companyId);
      this.configs.set(configId, config);
    }

    return config;
  }

  private createDefaultDashboard(roleType: DashboardRoleType, companyId: string): DashboardConfig {
    const widgets = this.getDefaultWidgetsForRole(roleType);

    return {
      id: `dashboard_${roleType.toLowerCase()}`,
      companyId,
      name: `${roleType.replace(/_/g, ' ')} Dashboard`,
      roleType,
      isDefault: true,
      isShared: true,
      layout: {
        columns: 12,
        gap: 16,
        breakpoints: {
          mobile: 1,
          tablet: 6,
          desktop: 12,
        },
      },
      widgets,
      filters: [],
      refreshInterval: 60,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      version: 1,
    };
  }

  private getDefaultWidgetsForRole(roleType: DashboardRoleType): DashboardWidget[] {
    const widgets: DashboardWidget[] = [];

    // Common widgets for all roles
    widgets.push({
      id: 'kpi_total_alerts',
      type: 'KPI_CARD',
      title: 'Total Alerts',
      config: {},
      position: { x: 0, y: 0, w: 3, h: 2 },
      size: { minWidth: 200, minHeight: 100 },
      dataSource: { type: 'KPI_ENGINE', kpiType: 'TOTAL_ALERTS' },
      permissions: [],
      isVisible: true,
    });

    // Role-specific widgets
    switch (roleType) {
      case 'SUPER_ADMIN':
        widgets.push(
          this.createKPIWidget('Total Companies', 'PROJECTS_ACTIVE', 3, 0, 3, 2),
          this.createKPIWidget('Active Users', 'MANPOWER_COUNT', 6, 0, 3, 2),
          this.createKPIWidget('Pending Approvals', 'HIGH_ALERTS', 9, 0, 3, 2),
        );
        break;

      case 'DIRECTOR':
        widgets.push(
          this.createKPIWidget('Contract Value', 'TOTAL_CONTRACT_VALUE', 3, 0, 3, 2),
          this.createKPIWidget('Collections', 'COLLECTIONS', 6, 0, 3, 2),
          this.createKPIWidget('Physical Progress', 'PHYSICAL_PROGRESS', 9, 0, 3, 2),
        );
        break;

      case 'PROJECT_MANAGER':
        widgets.push(
          this.createKPIWidget('Project Progress', 'PHYSICAL_PROGRESS', 3, 0, 3, 2),
          this.createKPIWidget('Billing', 'CERTIFIED_BILLING', 6, 0, 3, 2),
          this.createKPIWidget('Safety Score', 'SAFETY_SCORE', 9, 0, 3, 2),
        );
        break;

      case 'SITE_ENGINEER':
        widgets.push(
          this.createKPIWidget('Labour Strength', 'MANPOWER_COUNT', 3, 0, 3, 2),
          this.createKPIWidget('Plant Utilization', 'PLANT_UTILIZATION', 6, 0, 3, 2),
          this.createKPIWidget('Quality Score', 'QUALITY_SCORE', 9, 0, 3, 2),
        );
        break;
    }

    return widgets;
  }

  private createKPIWidget(
    title: string,
    kpiType: KPIType,
    x: number,
    y: number,
    w: number,
    h: number
  ): DashboardWidget {
    return {
      id: `kpi_${kpiType.toLowerCase()}_${Date.now()}`,
      type: 'KPI_CARD',
      title,
      config: {},
      position: { x, y, w, h },
      size: { minWidth: 200, minHeight: 100 },
      dataSource: { type: 'KPI_ENGINE', kpiType },
      permissions: [],
      isVisible: true,
    };
  }
}

export const dashboardService = DashboardService.getInstance();

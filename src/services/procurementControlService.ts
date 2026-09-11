// ============================================================
// BUILDCORE ERP - INTEGRATED PROCUREMENT & MATERIAL CONTROL SERVICE
// Part 20: Integrated Procurement and Material Control Center
// ============================================================

import type {
  ProcurementControlKPIs,
  MaterialControlKPIs,
  ProjectProcurementCoverage,
  ProcurementRisk,
  PurchaseCommitment,
  BudgetControl,
  MaterialCashForecast,
  IntegratedVendorPerformance,
  IntegratedProcurementSavings,
  PODeliveryPerformance,
  MaterialQualityPerformance,
  MaterialCostControl,
  Exception,
  ApprovalQueueItem,
  MaterialDrillDown,
  ProjectDrillDown,
  ProcurementCockpitKPIs,
  ProcurementSearchResult,
  ProcurementReport,
  CrossModuleAudit,
  ProcurementRiskType,
  ExceptionType,
  ApprovalType,
  SearchResultType,
  ProcurementReportType
} from '../types/procurementControl';

export class ProcurementControlService {
  private static instance: ProcurementControlService;
  
  // In-memory storage for demo purposes
  private exceptions: Map<string, Exception> = new Map();
  private risks: Map<string, ProcurementRisk> = new Map();
  private audits: Map<string, CrossModuleAudit> = new Map();

  private constructor() {}

  static getInstance(): ProcurementControlService {
    if (!ProcurementControlService.instance) {
      ProcurementControlService.instance = new ProcurementControlService();
    }
    return ProcurementControlService.instance;
  }

  // ============================================================
  // 1. PROCUREMENT CONTROL CENTER KPIs
  // ============================================================
  getProcurementControlKPIs(companyId: string): ProcurementControlKPIs {
    // In real implementation, this would query multiple services
    // For demo, return mock data
    return {
      openMR: 15,
      openPR: 23,
      rfqPending: 8,
      quotationPending: 12,
      comparativePending: 5,
      approvalPending: 18,
      poPending: 25,
      poValue: 125000000,
      deliveryDue: 12,
      deliveryOverdue: 3,
      grnPending: 18,
      qcPending: 8,
      invoicePending: 15,
      mismatch: 2,
      paymentPending: 22
    };
  }

  // ============================================================
  // 2. MATERIAL CONTROL CENTER KPIs
  // ============================================================
  getMaterialControlKPIs(companyId: string): MaterialControlKPIs {
    return {
      materialDemand: 45000000,
      availableStock: 28000000,
      reservedStock: 12000000,
      incomingPO: 18000000,
      shortage: 7000000,
      reorder: 15,
      excess: 8,
      deadStock: 5,
      consumptionVariance: 5.2,
      wastage: 3.8,
      priceVariance: 2.5
    };
  }

  // ============================================================
  // 3. PROJECT PROCUREMENT COVERAGE
  // ============================================================
  getProjectProcurementCoverage(projectId: string): ProjectProcurementCoverage {
    return {
      projectId,
      projectName: 'Mumbai-Pune Expressway',
      materials: [
        {
          materialId: 'MAT001',
          materialCode: 'CEM-OPC53',
          materialName: 'Cement OPC 53 Grade',
          required: 5000,
          available: 1200,
          reserved: 800,
          ordered: 2000,
          delivered: 1500,
          consumed: 1200,
          balance: 3800,
          forecast: 4200,
          uom: 'MT'
        },
        {
          materialId: 'MAT002',
          materialCode: 'STL-TMT500',
          materialName: 'TMT Steel Fe500',
          required: 800,
          available: 250,
          reserved: 150,
          ordered: 400,
          delivered: 350,
          consumed: 280,
          balance: 520,
          forecast: 600,
          uom: 'MT'
        }
      ],
      totalRequired: 5800,
      totalAvailable: 1450,
      totalReserved: 950,
      totalOrdered: 2400,
      totalDelivered: 1850,
      totalConsumed: 1480,
      totalBalance: 4320,
      totalForecast: 4800
    };
  }

  // ============================================================
  // 4. PROCUREMENT RISK
  // ============================================================
  getProcurementRisks(companyId: string): ProcurementRisk[] {
    return Array.from(this.risks.values());
  }

  createProcurementRisk(risk: Omit<ProcurementRisk, 'id' | 'createdAt' | 'updatedAt'>): ProcurementRisk {
    const id = `RISK-${Date.now()}`;
    const newRisk: ProcurementRisk = {
      ...risk,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.risks.set(id, newRisk);
    return newRisk;
  }

  // ============================================================
  // 5. PURCHASE COMMITMENT
  // ============================================================
  getPurchaseCommitment(projectId: string): PurchaseCommitment {
    return {
      projectId,
      projectName: 'Mumbai-Pune Expressway',
      approvedPOValue: 85000000,
      approvedSubcontractCommitments: 25000000,
      otherCommittedProcurement: 5000000,
      totalCommitment: 115000000,
      budget: 125000000,
      variance: 10000000,
      variancePercent: 8.0
    };
  }

  // ============================================================
  // 6. BUDGET CONTROL
  // ============================================================
  checkBudgetControl(projectId: string, materialId: string, newPRValue: number): BudgetControl {
    // Mock implementation
    const budget = 5000000;
    const existingCommitment = 3500000;
    const availableBudget = budget - existingCommitment;
    
    let status: 'WITHIN_BUDGET' | 'WARNING' | 'EXCEEDED' | 'BLOCKED';
    let policyAction: 'WARN' | 'BLOCK' | 'APPROVE_WITH_CONDITION';
    
    if (newPRValue > availableBudget) {
      status = 'EXCEEDED';
      policyAction = 'BLOCK';
    } else if (newPRValue > availableBudget * 0.9) {
      status = 'WARNING';
      policyAction = 'WARN';
    } else {
      status = 'WITHIN_BUDGET';
      policyAction = 'APPROVE_WITH_CONDITION';
    }

    return {
      projectId,
      materialId,
      budget,
      existingCommitment,
      newPR: newPRValue,
      availableBudget,
      status,
      policyAction
    };
  }

  // ============================================================
  // 7. PROJECT MATERIAL CASH FORECAST
  // ============================================================
  getMaterialCashForecast(projectId: string, period: string): MaterialCashForecast {
    return {
      projectId,
      projectName: 'Mumbai-Pune Expressway',
      period,
      upcomingPO: 15000000,
      expectedInvoices: 12000000,
      expectedPayments: 10000000,
      materialDemand: 18000000,
      netCashFlow: -3000000
    };
  }

  // ============================================================
  // 8. VENDOR PERFORMANCE
  // ============================================================
  getVendorPerformance(companyId: string): IntegratedVendorPerformance[] {
    return [
      {
        vendorId: 'VEN001',
        vendorName: 'Tata Steel Ltd',
        spend: 45000000,
        poCount: 25,
        deliveryOnTime: 22,
        deliveryDelayed: 3,
        deliveryPerformance: 88.0,
        qualityAccepted: 24,
        qualityRejected: 1,
        qualityPerformance: 96.0,
        rejectionRate: 4.0,
        priceVariance: 2.5,
        paymentOnTime: 20,
        paymentDelayed: 5,
        outstanding: 5000000
      },
      {
        vendorId: 'VEN002',
        vendorName: 'UltraTech Cement',
        spend: 32000000,
        poCount: 18,
        deliveryOnTime: 16,
        deliveryDelayed: 2,
        deliveryPerformance: 88.9,
        qualityAccepted: 18,
        qualityRejected: 0,
        qualityPerformance: 100.0,
        rejectionRate: 0.0,
        priceVariance: 1.8,
        paymentOnTime: 15,
        paymentDelayed: 3,
        outstanding: 3200000
      }
    ];
  }

  // ============================================================
  // 9. PROCUREMENT SAVINGS
  // ============================================================
  getProcurementSavings(projectId: string): IntegratedProcurementSavings[] {
    return [
      {
        projectId,
        projectName: 'Mumbai-Pune Expressway',
        materialId: 'MAT001',
        materialName: 'Cement OPC 53 Grade',
        budget: 450,
        quoted: 435,
        negotiated: 420,
        final: 420,
        savings: 30,
        savingsPercent: 6.67
      },
      {
        projectId,
        projectName: 'Mumbai-Pune Expressway',
        materialId: 'MAT002',
        materialName: 'TMT Steel Fe500',
        budget: 65000,
        quoted: 63000,
        negotiated: 61500,
        final: 61500,
        savings: 3500,
        savingsPercent: 5.38
      }
    ];
  }

  // ============================================================
  // 10. PO DELIVERY PERFORMANCE
  // ============================================================
  getPODeliveryPerformance(companyId: string): PODeliveryPerformance[] {
    return [
      {
        poId: 'PO001',
        poNumber: 'PO-2024-001',
        vendorId: 'VEN001',
        vendorName: 'Tata Steel Ltd',
        promisedDate: '2024-03-15',
        actualDate: '2024-03-15',
        delayDays: 0,
        status: 'ON_TIME'
      },
      {
        poId: 'PO002',
        poNumber: 'PO-2024-002',
        vendorId: 'VEN002',
        vendorName: 'UltraTech Cement',
        promisedDate: '2024-03-20',
        actualDate: '2024-03-22',
        delayDays: 2,
        status: 'DELAYED'
      }
    ];
  }

  // ============================================================
  // 11. MATERIAL QUALITY PERFORMANCE
  // ============================================================
  getMaterialQualityPerformance(companyId: string): MaterialQualityPerformance[] {
    return [
      {
        materialId: 'MAT001',
        materialName: 'Cement OPC 53 Grade',
        grnCount: 25,
        accepted: 24,
        rejected: 1,
        conditional: 0,
        ncrCount: 1,
        acceptanceRate: 96.0
      },
      {
        materialId: 'MAT002',
        materialName: 'TMT Steel Fe500',
        grnCount: 18,
        accepted: 18,
        rejected: 0,
        conditional: 0,
        ncrCount: 0,
        acceptanceRate: 100.0
      }
    ];
  }

  // ============================================================
  // 12. MATERIAL COST CONTROL
  // ============================================================
  getMaterialCostControl(companyId: string): MaterialCostControl[] {
    return [
      {
        materialId: 'MAT001',
        materialName: 'Cement OPC 53 Grade',
        budgetRate: 450,
        poRate: 420,
        actualRate: 425,
        poVariance: -30,
        poVariancePercent: -6.67,
        actualVariance: -25,
        actualVariancePercent: -5.56
      },
      {
        materialId: 'MAT002',
        materialName: 'TMT Steel Fe500',
        budgetRate: 65000,
        poRate: 61500,
        actualRate: 62000,
        poVariance: -3500,
        poVariancePercent: -5.38,
        actualVariance: -3000,
        actualVariancePercent: -4.62
      }
    ];
  }

  // ============================================================
  // 13. EXCEPTION CENTER
  // ============================================================
  getExceptions(companyId: string): Exception[] {
    return Array.from(this.exceptions.values());
  }

  createException(exception: Omit<Exception, 'id' | 'createdAt' | 'updatedAt'>): Exception {
    const id = `EXC-${Date.now()}`;
    const newException: Exception = {
      ...exception,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.exceptions.set(id, newException);
    return newException;
  }

  updateException(id: string, updates: Partial<Exception>): Exception | null {
    const exception = this.exceptions.get(id);
    if (!exception) return null;

    const updated = { ...exception, ...updates, updatedAt: new Date().toISOString() };
    this.exceptions.set(id, updated);
    return updated;
  }

  // ============================================================
  // 14. MANAGEMENT APPROVAL QUEUE
  // ============================================================
  getApprovalQueue(companyId: string, userId: string): ApprovalQueueItem[] {
    // Mock implementation - would query actual approval workflows
    return [
      {
        id: 'APP001',
        approvalType: 'PR',
        transactionId: 'PR001',
        transactionNumber: 'PR-2024-001',
        projectId: 'PROJ001',
        projectName: 'Mumbai-Pune Expressway',
        value: 2500000,
        requestedBy: 'USR001',
        requestedByName: 'John Doe',
        requestedAt: '2024-03-10T10:00:00Z',
        priority: 'HIGH',
        status: 'PENDING'
      },
      {
        id: 'APP002',
        approvalType: 'PO',
        transactionId: 'PO002',
        transactionNumber: 'PO-2024-002',
        projectId: 'PROJ001',
        projectName: 'Mumbai-Pune Expressway',
        vendorId: 'VEN001',
        vendorName: 'Tata Steel Ltd',
        value: 5000000,
        requestedBy: 'USR002',
        requestedByName: 'Jane Smith',
        requestedAt: '2024-03-11T14:30:00Z',
        priority: 'URGENT',
        status: 'PENDING'
      }
    ];
  }

  // ============================================================
  // 15. CROSS-MODULE DRILL-DOWN (Material)
  // ============================================================
  getMaterialDrillDown(materialId: string): MaterialDrillDown {
    return {
      materialId,
      materialCode: 'CEM-OPC53',
      materialName: 'Cement OPC 53 Grade',
      vendors: [
        {
          vendorId: 'VEN001',
          vendorName: 'UltraTech Cement',
          totalSpend: 32000000,
          poCount: 18
        }
      ],
      rfqs: [
        {
          rfqId: 'RFQ001',
          rfqNumber: 'RFQ-2024-001',
          date: '2024-02-15',
          status: 'CLOSED'
        }
      ],
      quotations: [
        {
          quotationId: 'QUOT001',
          vendorId: 'VEN001',
          vendorName: 'UltraTech Cement',
          date: '2024-02-20',
          amount: 435
        }
      ],
      pos: [
        {
          poId: 'PO001',
          poNumber: 'PO-2024-001',
          vendorId: 'VEN001',
          vendorName: 'UltraTech Cement',
          date: '2024-02-25',
          amount: 2500000,
          status: 'DELIVERED'
        }
      ],
      grns: [
        {
          grnId: 'GRN001',
          grnNumber: 'GRN-2024-001',
          poId: 'PO001',
          date: '2024-03-05',
          quantity: 500,
          status: 'ACCEPTED'
        }
      ],
      qcRecords: [
        {
          qcId: 'QC001',
          grnId: 'GRN001',
          date: '2024-03-06',
          status: 'PASSED'
        }
      ],
      stock: [
        {
          storeId: 'STORE001',
          storeName: 'Main Store',
          quantity: 1200,
          value: 504000
        }
      ],
      issues: [
        {
          issueId: 'ISS001',
          issueNumber: 'ISS-2024-001',
          projectId: 'PROJ001',
          date: '2024-03-10',
          quantity: 200
        }
      ],
      consumption: [
        {
          consumptionId: 'CON001',
          projectId: 'PROJ001',
          date: '2024-03-15',
          quantity: 180,
          variance: 2.5
        }
      ],
      cost: {
        budgetRate: 450,
        poRate: 420,
        actualRate: 425,
        totalCost: 76500,
        variance: -4500
      }
    };
  }

  // ============================================================
  // 16. PROJECT DRILL-DOWN
  // ============================================================
  getProjectDrillDown(projectId: string): ProjectDrillDown {
    return {
      projectId,
      projectName: 'Mumbai-Pune Expressway',
      boq: [
        {
          boqItemId: 'BOQ001',
          description: 'Cement Concrete M25',
          quantity: 5000,
          rate: 6500,
          amount: 32500000
        }
      ],
      materialDemand: [
        {
          materialId: 'MAT001',
          materialName: 'Cement OPC 53 Grade',
          required: 5000,
          uom: 'MT'
        }
      ],
      procurement: [
        {
          poId: 'PO001',
          poNumber: 'PO-2024-001',
          vendorName: 'UltraTech Cement',
          amount: 2500000,
          status: 'DELIVERED'
        }
      ],
      store: [
        {
          storeId: 'STORE001',
          storeName: 'Main Store',
          stock: 1200,
          value: 504000
        }
      ],
      consumption: [
        {
          materialId: 'MAT001',
          materialName: 'Cement OPC 53 Grade',
          consumed: 1200,
          cost: 504000
        }
      ],
      cost: {
        budget: 125000000,
        committed: 115000000,
        consumed: 85000000,
        variance: 10000000
      }
    };
  }

  // ============================================================
  // 17. PROCUREMENT COCKPIT KPIs
  // ============================================================
  getProcurementCockpitKPIs(companyId: string): ProcurementCockpitKPIs {
    return {
      pipelineStages: [
        { stage: 'MR', count: 15, value: 15000000 },
        { stage: 'PR', count: 23, value: 23000000 },
        { stage: 'RFQ', count: 8, value: 8000000 },
        { stage: 'Quotation', count: 12, value: 12000000 },
        { stage: 'Comparative', count: 5, value: 5000000 },
        { stage: 'PO', count: 25, value: 125000000 }
      ],
      deliveryOnTime: 85,
      deliveryDelayed: 15,
      averageDelayDays: 2.5,
      stockHealth: {
        critical: 5,
        low: 15,
        normal: 120,
        excess: 8,
        dead: 5
      },
      priceVariance: 2500000,
      priceVariancePercent: 2.5,
      totalSavings: 3500000,
      savingsPercent: 3.5,
      topVendors: this.getVendorPerformance(companyId).slice(0, 5),
      criticalExceptions: 2,
      highExceptions: 5,
      pendingApprovals: 18,
      urgentApprovals: 3
    };
  }

  // ============================================================
  // 18. SEARCH
  // ============================================================
  search(companyId: string, query: string, type?: SearchResultType): ProcurementSearchResult[] {
    // Mock implementation - would search across all modules
    const results: ProcurementSearchResult[] = [
      {
        id: 'MR001',
        type: 'MR',
        number: 'MR-2024-001',
        description: 'Cement requirement for foundation work',
        projectId: 'PROJ001',
        projectName: 'Mumbai-Pune Expressway',
        date: '2024-03-10',
        status: 'APPROVED',
        value: 2500000
      },
      {
        id: 'PO001',
        type: 'PO',
        number: 'PO-2024-001',
        description: 'Cement supply order',
        projectId: 'PROJ001',
        projectName: 'Mumbai-Pune Expressway',
        vendorId: 'VEN001',
        vendorName: 'UltraTech Cement',
        date: '2024-03-15',
        status: 'DELIVERED',
        value: 2500000
      }
    ];

    if (type) {
      return results.filter(r => r.type === type);
    }

    return results.filter(r => 
      r.number.toLowerCase().includes(query.toLowerCase()) ||
      r.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // ============================================================
  // 19. REPORT CENTER
  // ============================================================
  generateReport(companyId: string, reportType: ProcurementReportType, filters: any[]): ProcurementReport {
    const reportId = `RPT-${Date.now()}`;
    
    // Mock implementation - would generate actual report data
    const report: ProcurementReport = {
      id: reportId,
      reportType,
      title: this.getReportTitle(reportType),
      description: this.getReportDescription(reportType),
      filters,
      generatedAt: new Date().toISOString(),
      generatedBy: 'USR001',
      data: this.getReportData(reportType, filters)
    };

    return report;
  }

  private getReportTitle(reportType: ProcurementReportType): string {
    const titles: Record<ProcurementReportType, string> = {
      PROCUREMENT_DASHBOARD: 'Procurement Dashboard Report',
      MATERIAL_DASHBOARD: 'Material Dashboard Report',
      PO_ANALYSIS: 'Purchase Order Analysis Report',
      VENDOR_PERFORMANCE: 'Vendor Performance Report',
      DELIVERY_PERFORMANCE: 'Delivery Performance Report',
      PURCHASE_SAVINGS: 'Purchase Savings Report',
      MATERIAL_RECONCILIATION: 'Material Reconciliation Report',
      CONSUMPTION: 'Consumption Analysis Report',
      PRICE_VARIANCE: 'Price Variance Report',
      BUDGET_VS_COMMITMENT: 'Budget vs Commitment Report',
      EXCEPTION_REPORT: 'Exception Report'
    };
    return titles[reportType];
  }

  private getReportDescription(reportType: ProcurementReportType): string {
    const descriptions: Record<ProcurementReportType, string> = {
      PROCUREMENT_DASHBOARD: 'Comprehensive procurement dashboard with KPIs and metrics',
      MATERIAL_DASHBOARD: 'Material control dashboard with stock and consumption metrics',
      PO_ANALYSIS: 'Detailed analysis of purchase orders and delivery performance',
      VENDOR_PERFORMANCE: 'Vendor performance metrics including delivery, quality, and pricing',
      DELIVERY_PERFORMANCE: 'Analysis of delivery performance across all purchase orders',
      PURCHASE_SAVINGS: 'Analysis of procurement savings achieved through negotiation',
      MATERIAL_RECONCILIATION: 'Material reconciliation report showing stock movements',
      CONSUMPTION: 'Material consumption analysis with variance tracking',
      PRICE_VARIANCE: 'Price variance analysis comparing budget, PO, and actual rates',
      BUDGET_VS_COMMITMENT: 'Comparison of budget vs committed procurement',
      EXCEPTION_REPORT: 'Report of all exceptions requiring attention'
    };
    return descriptions[reportType];
  }

  private getReportData(reportType: ProcurementReportType, filters: any[]): any {
    // Mock implementation - would generate actual report data
    return {
      summary: 'Report data would be generated here based on filters',
      filters,
      generatedAt: new Date().toISOString()
    };
  }

  // ============================================================
  // 20. AUDIT TRAIL
  // ============================================================
  logCrossModuleEvent(audit: Omit<CrossModuleAudit, 'id'>): CrossModuleAudit {
    const id = `AUD-${Date.now()}`;
    const newAudit: CrossModuleAudit = {
      ...audit,
      id
    };
    this.audits.set(id, newAudit);
    return newAudit;
  }

  getAuditTrail(transactionId: string): CrossModuleAudit[] {
    return Array.from(this.audits.values())
      .filter(a => a.transactionId === transactionId)
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
  }

  // ============================================================
  // 21. EXPORT FUNCTIONALITY
  // ============================================================
  exportToExcel(reportId: string): Promise<Blob> {
    // Mock implementation - would generate actual Excel file
    return Promise.resolve(new Blob(['Mock Excel data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  }

  exportToPDF(reportId: string): Promise<Blob> {
    // Mock implementation - would generate actual PDF file
    return Promise.resolve(new Blob(['Mock PDF data'], { type: 'application/pdf' }));
  }

  // ============================================================
  // 22. SECURITY ENFORCEMENT
  // ============================================================
  checkAccess(companyId: string, userId: string, projectId?: string, siteId?: string): boolean {
    // Mock implementation - would check actual permissions
    return true;
  }

  checkFinancialAuthority(userId: string, amount: number, projectId?: string): boolean {
    // Mock implementation - would check actual financial authority
    return true;
  }
}

export const procurementControlService = ProcurementControlService.getInstance();

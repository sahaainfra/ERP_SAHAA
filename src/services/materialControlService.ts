// ============================================================
// BUILDCORE ERP - MATERIAL CONTROL & COST ANALYTICS SERVICE
// Part 19: Advanced Material Control and Cost-Analytics Engine
// ============================================================

import type {
  MaterialConsumption, TheoreticalConsumption, ConsumptionVariance,
  MaterialWastage, ConsumptionReconciliation, BOQReconciliation,
  ProjectMaterialCost, MaterialPriceVariance, PurchasePriceVariance,
  RateTrend, VendorPriceComparison, ProjectComparison, MaterialForecast,
  ProcurementPlan, StockHealth, MaterialAgeing, MaterialLoss, MaterialDamage,
  TransferAnalytics, ProjectMaterialDashboardKPIs, MaterialControlAlert,
  CostCodeLink, MaterialTrace, MaterialControlAlertType
} from '../types/materialControl';

export class MaterialControlService {
  private static instance: MaterialControlService;
  
  private consumptions: Map<string, MaterialConsumption> = new Map();
  private theoreticalConsumptions: Map<string, TheoreticalConsumption> = new Map();
  variances: Map<string, ConsumptionVariance> = new Map();
  private wastages: Map<string, MaterialWastage> = new Map();
  private reconciliations: Map<string, ConsumptionReconciliation> = new Map();
  private boqReconciliations: Map<string, BOQReconciliation> = new Map();
  private projectCosts: Map<string, ProjectMaterialCost> = new Map();
  private priceVariances: Map<string, MaterialPriceVariance> = new Map();
  private purchaseVariances: Map<string, PurchasePriceVariance> = new Map();
  private forecasts: Map<string, MaterialForecast> = new Map();
  private procurementPlans: Map<string, ProcurementPlan> = new Map();
  private losses: Map<string, MaterialLoss> = new Map();
  private damages: Map<string, MaterialDamage> = new Map();
  private alerts: Map<string, MaterialControlAlert> = new Map();
  private costCodeLinks: Map<string, CostCodeLink> = new Map();

  private constructor() {}

  static getInstance(): MaterialControlService {
    if (!MaterialControlService.instance) {
      MaterialControlService.instance = new MaterialControlService();
    }
    return MaterialControlService.instance;
  }

  // ============================================================
  // THEORETICAL CONSUMPTION CALCULATION
  // ============================================================

  calculateTheoreticalConsumption(
    companyId: string,
    projectId: string,
    boqItemId: string,
    materialId: string,
    executedQuantity: number,
    materialCoefficient: number,
    calculatedBy: string
  ): TheoreticalConsumption {
    const theoreticalQuantity = executedQuantity * materialCoefficient;

    const theoretical: TheoreticalConsumption = {
      id: `TC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      boqItemId,
      materialId,
      materialCode: '', // Will be populated from material master
      materialName: '', // Will be populated from material master
      executedQuantity,
      materialCoefficient,
      theoreticalQuantity,
      uom: '', // Will be populated from material master
      calculatedAt: new Date().toISOString(),
      calculatedBy
    };

    this.theoreticalConsumptions.set(theoretical.id, theoretical);
    return theoretical;
  }

  // ============================================================
  // MATERIAL CONSUMPTION TRACKING
  // ============================================================

  recordConsumption(
    companyId: string,
    projectId: string,
    materialId: string,
    issuedQuantity: number,
    returnedQuantity: number,
    theoreticalConsumption: number,
    consumptionDate: string,
    siteId?: string,
    wbsId?: string,
    activityId?: string,
    boqItemId?: string,
    issueId?: string,
    costCodeId?: string,
    createdBy?: string
  ): MaterialConsumption {
    const netConsumption = issuedQuantity - returnedQuantity;
    const variance = netConsumption - theoreticalConsumption;
    const variancePercent = theoreticalConsumption > 0 
      ? (variance / theoreticalConsumption) * 100 
      : 0;

    const consumption: MaterialConsumption = {
      id: `MC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      projectName: '', // Will be populated
      siteId,
      siteName: '', // Will be populated
      wbsId,
      wbsName: '', // Will be populated
      activityId,
      activityName: '', // Will be populated
      boqItemId,
      boqItemDescription: '', // Will be populated
      materialId,
      materialCode: '', // Will be populated from material master
      materialName: '', // Will be populated from material master
      consumptionDate,
      issuedQuantity,
      returnedQuantity,
      netConsumption,
      theoreticalConsumption,
      variance,
      variancePercent,
      uom: '', // Will be populated from material master
      costCodeId,
      costCodeName: '', // Will be populated
      issueId,
      issueNumber: '', // Will be populated
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: createdBy || 'system',
      updatedBy: createdBy || 'system'
    };

    this.consumptions.set(consumption.id, consumption);

    // Check for alerts
    this.checkConsumptionAlerts(consumption);

    return consumption;
  }

  private checkConsumptionAlerts(consumption: MaterialConsumption): void {
    // Excess consumption alert
    if (consumption.variancePercent > 10) {
      this.createAlert(
        consumption.companyId,
        'EXCESS_CONSUMPTION',
        'Excess Material Consumption',
        `Material ${consumption.materialCode} consumed ${consumption.variancePercent.toFixed(2)}% more than theoretical`,
        consumption.variancePercent > 25 ? 'CRITICAL' : consumption.variancePercent > 15 ? 'HIGH' : 'MEDIUM',
        consumption.projectId,
        consumption.materialId,
        undefined,
        consumption.variance
      );
    }
  }

  // ============================================================
  // WASTAGE TRACKING
  // ============================================================

  recordWastage(
    companyId: string,
    projectId: string,
    materialId: string,
    period: string,
    theoreticalQuantity: number,
    allowedWastagePercent: number,
    actualWastageQuantity: number,
    uom: string,
    reason: string,
    createdBy: string
  ): MaterialWastage {
    const allowedWastageQuantity = theoreticalQuantity * (allowedWastagePercent / 100);
    const excessWastageQuantity = Math.max(0, actualWastageQuantity - allowedWastageQuantity);
    const excessWastagePercent = theoreticalQuantity > 0
      ? (excessWastageQuantity / theoreticalQuantity) * 100
      : 0;

    const status = excessWastageQuantity > 0 ? 'EXCESS' : 'NORMAL';

    const wastage: MaterialWastage = {
      id: `MW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      period,
      theoreticalQuantity,
      allowedWastagePercent,
      allowedWastageQuantity,
      actualWastageQuantity,
      excessWastageQuantity,
      excessWastagePercent,
      uom,
      reason,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      updatedBy: createdBy
    };

    this.wastages.set(wastage.id, wastage);

    // Check for high wastage alert
    if (excessWastagePercent > 5) {
      this.createAlert(
        companyId,
        'HIGH_WASTAGE',
        'High Material Wastage',
        `Material ${wastage.materialCode} has ${excessWastagePercent.toFixed(2)}% excess wastage`,
        excessWastagePercent > 10 ? 'HIGH' : 'MEDIUM',
        projectId,
        materialId
      );
    }

    return wastage;
  }

  // ============================================================
  // MATERIAL RECONCILIATION
  // ============================================================

  performMaterialReconciliation(
    companyId: string,
    projectId: string,
    materialId: string,
    reconciliationDate: string,
    openingStock: number,
    receipts: number,
    transfersIn: number,
    issues: number,
    transfersOut: number,
    returns: number,
    adjustments: number,
    physicalStock: number,
    reconciledBy: string,
    remarks?: string
  ): ConsumptionReconciliation {
    const systemClosing = openingStock + receipts + transfersIn - issues - transfersOut + returns + adjustments;
    const variance = physicalStock - systemClosing;
    const variancePercent = systemClosing > 0 ? (variance / systemClosing) * 100 : 0;

    let status: 'PENDING' | 'RECONCILED' | 'DISCREPANCY' = 'RECONCILED';
    if (Math.abs(variancePercent) > 2) {
      status = 'DISCREPANCY';
    }

    const reconciliation: ConsumptionReconciliation = {
      id: `MR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      reconciliationDate,
      openingStock,
      receipts,
      transfersIn,
      issues,
      transfersOut,
      returns,
      adjustments,
      systemClosing,
      physicalStock,
      variance,
      variancePercent,
      uom: '', // Will be populated
      remarks,
      reconciledBy,
      reconciledByName: '', // Will be populated
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.reconciliations.set(reconciliation.id, reconciliation);

    // Check for negative stock alert
    if (physicalStock < 0) {
      this.createAlert(
        companyId,
        'NEGATIVE_STOCK',
        'Negative Stock Detected',
        `Material ${reconciliation.materialCode} has negative stock: ${physicalStock}`,
        'CRITICAL',
        projectId,
        materialId
      );
    }

    return reconciliation;
  }

  // ============================================================
  // BOQ RECONCILIATION
  // ============================================================

  performBOQReconciliation(
    companyId: string,
    projectId: string,
    boqItemId: string,
    materialId: string,
    boqQuantity: number,
    executedQuantity: number,
    expectedMaterial: number,
    actualMaterial: number,
    reconciliationDate: string,
    reconciledBy: string
  ): BOQReconciliation {
    const balance = boqQuantity - executedQuantity;
    const variance = actualMaterial - expectedMaterial;
    const variancePercent = expectedMaterial > 0 ? (variance / expectedMaterial) * 100 : 0;

    let status: 'WITHIN_LIMIT' | 'EXCESS' | 'SHORTAGE' = 'WITHIN_LIMIT';
    if (variancePercent > 5) {
      status = 'EXCESS';
    } else if (variancePercent < -5) {
      status = 'SHORTAGE';
    }

    const reconciliation: BOQReconciliation = {
      id: `BR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      boqItemId,
      boqItemDescription: '', // Will be populated
      boqQuantity,
      executedQuantity,
      expectedMaterial,
      actualMaterial,
      balance,
      variance,
      variancePercent,
      uom: '', // Will be populated
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      reconciliationDate,
      reconciledBy,
      reconciledByName: '', // Will be populated
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.boqReconciliations.set(reconciliation.id, reconciliation);

    // Check for BOQ over-consumption alert
    if (status === 'EXCESS' && variancePercent > 10) {
      this.createAlert(
        companyId,
        'BOQ_OVER_CONSUMPTION',
        'BOQ Over-Consumption',
        `Material ${reconciliation.materialCode} consumed ${variancePercent.toFixed(2)}% more than expected`,
        variancePercent > 20 ? 'HIGH' : 'MEDIUM',
        projectId,
        materialId
      );
    }

    return reconciliation;
  }

  // ============================================================
  // PRICE VARIANCE ANALYSIS
  // ============================================================

  calculateMaterialPriceVariance(
    companyId: string,
    materialId: string,
    period: string,
    tenderRate: number,
    budgetRate: number,
    poRate: number,
    actualRate: number,
    uom: string
  ): MaterialPriceVariance {
    const tenderVariance = actualRate - tenderRate;
    const tenderVariancePercent = tenderRate > 0 ? (tenderVariance / tenderRate) * 100 : 0;

    const budgetVariance = actualRate - budgetRate;
    const budgetVariancePercent = budgetRate > 0 ? (budgetVariance / budgetRate) * 100 : 0;

    const poVariance = actualRate - poRate;
    const poVariancePercent = poRate > 0 ? (poVariance / poRate) * 100 : 0;

    const variance: MaterialPriceVariance = {
      id: `MPV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      period,
      tenderRate,
      budgetRate,
      poRate,
      actualRate,
      tenderVariance,
      tenderVariancePercent,
      budgetVariance,
      budgetVariancePercent,
      poVariance,
      poVariancePercent,
      uom,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.priceVariances.set(variance.id, variance);

    // Check for unusual price alert
    if (Math.abs(budgetVariancePercent) > 15) {
      this.createAlert(
        companyId,
        'UNUSUAL_PRICE',
        'Unusual Material Price',
        `Material ${variance.materialCode} price variance: ${budgetVariancePercent.toFixed(2)}%`,
        Math.abs(budgetVariancePercent) > 25 ? 'HIGH' : 'MEDIUM',
        undefined,
        materialId
      );
    }

    return variance;
  }

  calculatePurchasePriceVariance(
    companyId: string,
    projectId: string,
    materialId: string,
    poId: string,
    poNumber: string,
    poDate: string,
    approvedBudgetRate: number,
    actualPurchaseRate: number,
    quantity: number,
    uom: string
  ): PurchasePriceVariance {
    const variance = actualPurchaseRate - approvedBudgetRate;
    const variancePercent = approvedBudgetRate > 0 ? (variance / approvedBudgetRate) * 100 : 0;
    const totalVariance = variance * quantity;

    const purchaseVariance: PurchasePriceVariance = {
      id: `PPV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      poId,
      poNumber,
      poDate,
      approvedBudgetRate,
      actualPurchaseRate,
      variance,
      variancePercent,
      quantity,
      totalVariance,
      uom,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.purchaseVariances.set(purchaseVariance.id, purchaseVariance);
    return purchaseVariance;
  }

  // ============================================================
  // MATERIAL FORECAST
  // ============================================================

  generateMaterialForecast(
    companyId: string,
    projectId: string,
    materialId: string,
    plannedActivities: number,
    remainingBOQ: number,
    productivity: number,
    historicalConsumption: number,
    currentStock: number,
    incomingQuantity: number,
    uom: string
  ): MaterialForecast {
    // Calculate required quantity based on remaining BOQ and historical consumption
    const requiredQuantity = remainingBOQ * (historicalConsumption / (remainingBOQ || 1));
    
    // Calculate expected date based on productivity
    const daysRequired = productivity > 0 ? Math.ceil(requiredQuantity / productivity) : 0;
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + daysRequired);

    // Calculate potential shortage
    const availableQuantity = currentStock + incomingQuantity;
    const potentialShortage = Math.max(0, requiredQuantity - availableQuantity);
    const shortageFlag = potentialShortage > 0;

    const forecast: MaterialForecast = {
      id: `MF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      forecastDate: new Date().toISOString(),
      plannedActivities,
      remainingBOQ,
      productivity,
      historicalConsumption,
      requiredQuantity,
      expectedDate: expectedDate.toISOString(),
      currentStock,
      incomingQuantity,
      potentialShortage,
      shortageFlag,
      uom,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.forecasts.set(forecast.id, forecast);

    // Check for delayed material alert
    if (shortageFlag) {
      this.createAlert(
        companyId,
        'DELAYED_MATERIAL',
        'Potential Material Shortage',
        `Material ${forecast.materialCode} may face shortage of ${potentialShortage} ${uom}`,
        potentialShortage > requiredQuantity * 0.2 ? 'HIGH' : 'MEDIUM',
        projectId,
        materialId
      );
    }

    return forecast;
  }

  // ============================================================
  // PROCUREMENT PLANNING
  // ============================================================

  generateProcurementPlan(
    companyId: string,
    projectId: string,
    materialId: string,
    requiredForRemainingWork: number,
    availableStock: number,
    incomingApprovedQuantity: number,
    uom: string,
    createdBy: string
  ): ProcurementPlan {
    const suggestedProcurement = Math.max(0, requiredForRemainingWork - availableStock - incomingApprovedQuantity);

    // Determine priority based on shortage
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    const shortagePercent = requiredForRemainingWork > 0 
      ? (suggestedProcurement / requiredForRemainingWork) * 100 
      : 0;

    if (shortagePercent > 50) {
      priority = 'CRITICAL';
    } else if (shortagePercent > 30) {
      priority = 'HIGH';
    } else if (shortagePercent > 10) {
      priority = 'MEDIUM';
    }

    const plan: ProcurementPlan = {
      id: `PP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      planDate: new Date().toISOString(),
      requiredForRemainingWork,
      availableStock,
      incomingApprovedQuantity,
      suggestedProcurement,
      priority,
      uom,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      updatedBy: createdBy
    };

    this.procurementPlans.set(plan.id, plan);

    // Check for low stock alert
    if (availableStock < requiredForRemainingWork * 0.2) {
      this.createAlert(
        companyId,
        'LOW_STOCK',
        'Low Stock Alert',
        `Material ${plan.materialCode} stock is critically low`,
        priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        projectId,
        materialId
      );
    }

    return plan;
  }

  // ============================================================
  // STOCK HEALTH ANALYSIS
  // ============================================================

  analyzeStockHealth(
    materialId: string,
    storeId: string,
    currentStock: number,
    minStock: number,
    maxStock: number,
    reorderLevel: number,
    safetyStock: number,
    lastMovementDate: string,
    uom: string
  ): StockHealth {
    let healthStatus: 'CRITICAL' | 'LOW' | 'NORMAL' | 'HIGH' | 'EXCESS' | 'DEAD';
    let daysOfStock = 0;

    // Calculate days of stock (simplified - would need consumption rate)
    const daysSinceLastMovement = Math.floor(
      (new Date().getTime() - new Date(lastMovementDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (currentStock <= 0) {
      healthStatus = 'CRITICAL';
      daysOfStock = 0;
    } else if (currentStock <= safetyStock) {
      healthStatus = 'CRITICAL';
      daysOfStock = 7;
    } else if (currentStock <= reorderLevel) {
      healthStatus = 'LOW';
      daysOfStock = 14;
    } else if (currentStock >= maxStock) {
      healthStatus = 'EXCESS';
      daysOfStock = 90;
    } else if (daysSinceLastMovement > 180) {
      healthStatus = 'DEAD';
      daysOfStock = 180;
    } else if (currentStock > maxStock * 0.8) {
      healthStatus = 'HIGH';
      daysOfStock = 60;
    } else {
      healthStatus = 'NORMAL';
      daysOfStock = 30;
    }

    const health: StockHealth = {
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      storeId,
      storeName: '', // Will be populated
      currentStock,
      minStock,
      maxStock,
      reorderLevel,
      safetyStock,
      healthStatus,
      daysOfStock,
      lastMovementDate,
      uom
    };

    // Generate alerts based on health status
    if (healthStatus === 'CRITICAL') {
      this.createAlert(
        '', // Company ID will be populated
        'LOW_STOCK',
        'Critical Stock Level',
        `Material ${health.materialCode} is at critical level`,
        'CRITICAL',
        undefined,
        materialId,
        storeId
      );
    } else if (healthStatus === 'DEAD') {
      this.createAlert(
        '',
        'DEAD_STOCK',
        'Dead Stock Detected',
        `Material ${health.materialCode} has not moved for ${daysSinceLastMovement} days`,
        'HIGH',
        undefined,
        materialId,
        storeId
      );
    } else if (healthStatus === 'EXCESS') {
      this.createAlert(
        '',
        'EXCESS_STOCK',
        'Excess Stock Detected',
        `Material ${health.materialCode} exceeds maximum stock level`,
        'MEDIUM',
        undefined,
        materialId,
        storeId
      );
    }

    return health;
  }

  // ============================================================
  // MATERIAL AGEING ANALYSIS
  // ============================================================

  analyzeMaterialAgeing(
    materialId: string,
    storeId: string,
    batchNumber: string | undefined,
    receiptDate: string,
    quantity: number,
    value: number,
    uom: string
  ): MaterialAgeing {
    const ageDays = Math.floor(
      (new Date().getTime() - new Date(receiptDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    let ageBucket: '0-30' | '31-60' | '61-90' | '91-180' | '180+';
    if (ageDays <= 30) {
      ageBucket = '0-30';
    } else if (ageDays <= 60) {
      ageBucket = '31-60';
    } else if (ageDays <= 90) {
      ageBucket = '61-90';
    } else if (ageDays <= 180) {
      ageBucket = '91-180';
    } else {
      ageBucket = '180+';
    }

    const ageing: MaterialAgeing = {
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      storeId,
      storeName: '', // Will be populated
      batchNumber,
      receiptDate,
      quantity,
      ageDays,
      ageBucket,
      value,
      uom
    };

    return ageing;
  }

  // ============================================================
  // MATERIAL LOSS & DAMAGE
  // ============================================================

  recordMaterialLoss(
    companyId: string,
    projectId: string,
    siteId: string | undefined,
    activityId: string | undefined,
    materialId: string,
    lossDate: string,
    quantity: number,
    uom: string,
    reason: 'THEFT' | 'MISHANDLING' | 'NATURAL_DISASTER' | 'EXPIRY' | 'UNKNOWN' | 'OTHER',
    responsibleArea: string,
    estimatedValue: number,
    evidence: string | undefined,
    createdBy: string
  ): MaterialLoss {
    const loss: MaterialLoss = {
      id: `ML-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      projectName: '', // Will be populated
      siteId,
      siteName: '', // Will be populated
      activityId,
      activityName: '', // Will be populated
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      lossDate,
      quantity,
      uom,
      reason,
      responsibleArea,
      evidence,
      estimatedValue,
      status: 'REPORTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      updatedBy: createdBy
    };

    this.losses.set(loss.id, loss);
    return loss;
  }

  recordMaterialDamage(
    companyId: string,
    projectId: string,
    siteId: string | undefined,
    materialId: string,
    damageDate: string,
    damageType: 'DAMAGED' | 'EXPIRED' | 'REJECTED' | 'LOST',
    quantity: number,
    uom: string,
    cause: string,
    estimatedValue: number,
    disposition: 'REPAIR' | 'DISPOSE' | 'RETURN' | 'USE_AS_IS',
    evidence: string | undefined,
    createdBy: string
  ): MaterialDamage {
    const damage: MaterialDamage = {
      id: `MD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      projectId,
      projectName: '', // Will be populated
      siteId,
      siteName: '', // Will be populated
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      damageDate,
      damageType,
      quantity,
      uom,
      cause,
      evidence,
      estimatedValue,
      disposition,
      status: 'REPORTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      updatedBy: createdBy
    };

    this.damages.set(damage.id, damage);
    return damage;
  }

  // ============================================================
  // ALERT MANAGEMENT
  // ============================================================

  createAlert(
    companyId: string,
    alertType: MaterialControlAlertType,
    title: string,
    message: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    projectId?: string,
    materialId?: string,
    storeId?: string,
    value?: number
  ): MaterialControlAlert {
    const alert: MaterialControlAlert = {
      id: `AL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      alertType,
      title,
      message,
      severity,
      projectId,
      materialId,
      storeId,
      value,
      isAcknowledged: false,
      createdAt: new Date().toISOString()
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.isAcknowledged = true;
      alert.acknowledgedAt = new Date().toISOString();
      alert.acknowledgedBy = acknowledgedBy;
    }
  }

  // ============================================================
  // COST-CODE LINK
  // ============================================================

  linkCostCode(
    issueId: string,
    issueNumber: string,
    materialId: string,
    wbsId: string | undefined,
    costCodeId: string | undefined,
    activityId: string | undefined,
    quantity: number,
    value: number,
    uom: string,
    linkedBy: string
  ): CostCodeLink {
    const link: CostCodeLink = {
      id: `CL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      issueId,
      issueNumber,
      materialId,
      materialCode: '', // Will be populated
      materialName: '', // Will be populated
      wbsId,
      wbsName: '', // Will be populated
      costCodeId,
      costCodeName: '', // Will be populated
      activityId,
      activityName: '', // Will be populated
      quantity,
      value,
      uom,
      linkedAt: new Date().toISOString(),
      linkedBy
    };

    this.costCodeLinks.set(link.id, link);
    return link;
  }

  // ============================================================
  // COMPLETE TRACE
  // ============================================================

  getMaterialTrace(materialId: string): MaterialTrace {
    const trace: MaterialTrace = {
      materialId,
      materialCode: '', // Will be populated
      materialName: '' // Will be populated
    };

    // Populate from various sources
    // This would aggregate data from tender, BOQ, procurement, GRN, stock, issue, consumption, reconciliation

    return trace;
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getProjectMaterialDashboardKPIs(companyId: string, projectId: string): ProjectMaterialDashboardKPIs {
    // Calculate KPIs from various sources
    const kpis: ProjectMaterialDashboardKPIs = {
      materialBudget: 0,
      procuredValue: 0,
      receivedValue: 0,
      issuedValue: 0,
      consumedValue: 0,
      stockValue: 0,
      forecastValue: 0,
      varianceValue: 0,
      variancePercent: 0,
      wastageValue: 0,
      wastagePercent: 0,
      totalMaterials: 0,
      criticalStock: 0,
      lowStock: 0,
      excessStock: 0,
      deadStock: 0
    };

    // This would aggregate data from various sources
    // For now, return empty KPIs

    return kpis;
  }

  // ============================================================
  // GETTERS
  // ============================================================

  getConsumptions(projectId?: string, materialId?: string): MaterialConsumption[] {
    let consumptions = Array.from(this.consumptions.values());
    if (projectId) {
      consumptions = consumptions.filter(c => c.projectId === projectId);
    }
    if (materialId) {
      consumptions = consumptions.filter(c => c.materialId === materialId);
    }
    return consumptions;
  }

  getVariances(projectId?: string, materialId?: string): ConsumptionVariance[] {
    let variances = Array.from(this.variances.values());
    if (projectId) {
      variances = variances.filter(v => v.projectId === projectId);
    }
    if (materialId) {
      variances = variances.filter(v => v.materialId === materialId);
    }
    return variances;
  }

  getWastages(projectId?: string, materialId?: string): MaterialWastage[] {
    let wastages = Array.from(this.wastages.values());
    if (projectId) {
      wastages = wastages.filter(w => w.projectId === projectId);
    }
    if (materialId) {
      wastages = wastages.filter(w => w.materialId === materialId);
    }
    return wastages;
  }

  getReconciliations(projectId?: string, materialId?: string): ConsumptionReconciliation[] {
    let reconciliations = Array.from(this.reconciliations.values());
    if (projectId) {
      reconciliations = reconciliations.filter(r => r.projectId === projectId);
    }
    if (materialId) {
      reconciliations = reconciliations.filter(r => r.materialId === materialId);
    }
    return reconciliations;
  }

  getBOQReconciliations(projectId?: string, materialId?: string): BOQReconciliation[] {
    let reconciliations = Array.from(this.boqReconciliations.values());
    if (projectId) {
      reconciliations = reconciliations.filter(r => r.projectId === projectId);
    }
    if (materialId) {
      reconciliations = reconciliations.filter(r => r.materialId === materialId);
    }
    return reconciliations;
  }

  getForecasts(projectId?: string, materialId?: string): MaterialForecast[] {
    let forecasts = Array.from(this.forecasts.values());
    if (projectId) {
      forecasts = forecasts.filter(f => f.projectId === projectId);
    }
    if (materialId) {
      forecasts = forecasts.filter(f => f.materialId === materialId);
    }
    return forecasts;
  }

  getProcurementPlans(projectId?: string, materialId?: string): ProcurementPlan[] {
    let plans = Array.from(this.procurementPlans.values());
    if (projectId) {
      plans = plans.filter(p => p.projectId === projectId);
    }
    if (materialId) {
      plans = plans.filter(p => p.materialId === materialId);
    }
    return plans;
  }

  getLosses(projectId?: string, materialId?: string): MaterialLoss[] {
    let losses = Array.from(this.losses.values());
    if (projectId) {
      losses = losses.filter(l => l.projectId === projectId);
    }
    if (materialId) {
      losses = losses.filter(l => l.materialId === materialId);
    }
    return losses;
  }

  getDamages(projectId?: string, materialId?: string): MaterialDamage[] {
    let damages = Array.from(this.damages.values());
    if (projectId) {
      damages = damages.filter(d => d.projectId === projectId);
    }
    if (materialId) {
      damages = damages.filter(d => d.materialId === materialId);
    }
    return damages;
  }

  getAlerts(companyId: string, acknowledged?: boolean): MaterialControlAlert[] {
    let alerts = Array.from(this.alerts.values()).filter(a => a.companyId === companyId);
    if (acknowledged !== undefined) {
      alerts = alerts.filter(a => a.isAcknowledged === acknowledged);
    }
    return alerts;
  }
}

export const materialControlService = MaterialControlService.getInstance();

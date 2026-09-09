// ============================================================
// BUILDCORE ERP - PROCUREMENT SERVICE
// Part 15: Complete End-to-End Procurement Module
// ============================================================

import type {
  MaterialRequisition, PurchaseRequisition, RFQ, VendorQuotation,
  TechnicalEvaluation, CommercialEvaluation, ComparativeStatement,
  ProcurementNegotiation, ProcurementSavings, PurchaseOrder,
  ProcurementDashboardKPIs, ProcurementAlert, StockAvailability,
  MRStatus, PRStatus, RFQStatus, QuotationStatus, POStatus
} from '../types/procurement';

export class ProcurementService {
  private static instance: ProcurementService;

  private materialRequisitions: Map<string, MaterialRequisition> = new Map();
  private purchaseRequisitions: Map<string, PurchaseRequisition> = new Map();
  private rfqs: Map<string, RFQ> = new Map();
  private quotations: Map<string, VendorQuotation> = new Map();
  private technicalEvaluations: Map<string, TechnicalEvaluation> = new Map();
  private commercialEvaluations: Map<string, CommercialEvaluation> = new Map();
  private comparativeStatements: Map<string, ComparativeStatement> = new Map();
  private negotiations: Map<string, ProcurementNegotiation> = new Map();
  private savings: Map<string, ProcurementSavings> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();
  private alerts: Map<string, ProcurementAlert> = new Map();

  private constructor() {}

  static getInstance(): ProcurementService {
    if (!ProcurementService.instance) {
      ProcurementService.instance = new ProcurementService();
    }
    return ProcurementService.instance;
  }

  // ============================================================
  // MATERIAL REQUISITION
  // ============================================================

  createMaterialRequisition(data: Omit<MaterialRequisition, 'id' | 'createdAt' | 'updatedAt' | 'version'>): MaterialRequisition {
    const now = new Date().toISOString();
    const mr: MaterialRequisition = {
      ...data,
      id: `mr_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.materialRequisitions.set(mr.id, mr);
    return mr;
  }

  getMaterialRequisition(id: string): MaterialRequisition | undefined {
    return this.materialRequisitions.get(id);
  }

  getMaterialRequisitions(companyId: string, projectId?: string, status?: MRStatus): MaterialRequisition[] {
    let mrs = Array.from(this.materialRequisitions.values()).filter(mr => mr.companyId === companyId);
    if (projectId) mrs = mrs.filter(mr => mr.projectId === projectId);
    if (status) mrs = mrs.filter(mr => mr.status === status);
    return mrs;
  }

  updateMaterialRequisition(id: string, updates: Partial<MaterialRequisition>): MaterialRequisition | null {
    const mr = this.materialRequisitions.get(id);
    if (!mr) return null;

    const updated = { ...mr, ...updates, updatedAt: new Date().toISOString(), version: mr.version + 1 };
    this.materialRequisitions.set(id, updated);
    return updated;
  }

  checkStockAvailability(materialId: string, requiredQuantity: number, projectId: string): StockAvailability {
    // Mock stock check - in real implementation, would integrate with inventory module
    const availableStock = Math.floor(Math.random() * requiredQuantity * 0.5);
    const reservedStock = Math.floor(availableStock * 0.3);
    const incomingStock = Math.floor(Math.random() * requiredQuantity * 0.2);
    const netAvailable = availableStock - reservedStock + incomingStock;
    const shortage = Math.max(0, requiredQuantity - netAvailable);
    const requiredPurchase = shortage;

    return {
      availableStock,
      reservedStock,
      incomingStock,
      netAvailable,
      shortage,
      requiredPurchase,
    };
  }

  // ============================================================
  // PURCHASE REQUISITION
  // ============================================================

  createPurchaseRequisition(data: Omit<PurchaseRequisition, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'estimatedAmount'>): PurchaseRequisition {
    const now = new Date().toISOString();
    const estimatedAmount = data.quantity * data.estimatedRate;
    
    const pr: PurchaseRequisition = {
      ...data,
      id: `pr_${this.generateId()}`,
      estimatedAmount,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.purchaseRequisitions.set(pr.id, pr);
    return pr;
  }

  getPurchaseRequisition(id: string): PurchaseRequisition | undefined {
    return this.purchaseRequisitions.get(id);
  }

  getPurchaseRequisitions(companyId: string, projectId?: string, status?: PRStatus): PurchaseRequisition[] {
    let prs = Array.from(this.purchaseRequisitions.values()).filter(pr => pr.companyId === companyId);
    if (projectId) prs = prs.filter(pr => pr.projectId === projectId);
    if (status) prs = prs.filter(pr => pr.status === status);
    return prs;
  }

  updatePurchaseRequisition(id: string, updates: Partial<PurchaseRequisition>): PurchaseRequisition | null {
    const pr = this.purchaseRequisitions.get(id);
    if (!pr) return null;

    const updated = { ...pr, ...updates, updatedAt: new Date().toISOString(), version: pr.version + 1 };
    this.purchaseRequisitions.set(id, updated);
    return updated;
  }

  validatePurchaseRequisition(pr: PurchaseRequisition): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (pr.quantity <= 0) errors.push('Quantity must be greater than 0');
    if (!pr.requiredDate) errors.push('Required date is mandatory');
    if (pr.estimatedAmount > pr.budget) errors.push('Estimated amount exceeds budget');
    
    // Check for duplicate requests
    const existingPRs = this.getPurchaseRequisitions(pr.companyId, pr.projectId);
    const duplicate = existingPRs.find(existing => 
      existing.id !== pr.id &&
      existing.materialId === pr.materialId &&
      existing.requiredDate === pr.requiredDate &&
      existing.status !== 'CANCELLED' &&
      existing.status !== 'REJECTED'
    );
    if (duplicate) errors.push('Duplicate request exists for same material and date');

    return { isValid: errors.length === 0, errors };
  }

  // ============================================================
  // RFQ (REQUEST FOR QUOTATION)
  // ============================================================

  createRFQ(data: Omit<RFQ, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'issuedAt'>): RFQ {
    const now = new Date().toISOString();
    const rfq: RFQ = {
      ...data,
      id: `rfq_${this.generateId()}`,
      issuedAt: now,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.rfqs.set(rfq.id, rfq);
    return rfq;
  }

  getRFQ(id: string): RFQ | undefined {
    return this.rfqs.get(id);
  }

  getRFQs(companyId: string, projectId?: string, status?: RFQStatus): RFQ[] {
    let rfqs = Array.from(this.rfqs.values()).filter(rfq => rfq.companyId === companyId);
    if (projectId) rfqs = rfqs.filter(rfq => rfq.projectId === projectId);
    if (status) rfqs = rfqs.filter(rfq => rfq.status === status);
    return rfqs;
  }

  updateRFQ(id: string, updates: Partial<RFQ>): RFQ | null {
    const rfq = this.rfqs.get(id);
    if (!rfq) return null;

    const updated = { ...rfq, ...updates, updatedAt: new Date().toISOString(), version: rfq.version + 1 };
    this.rfqs.set(id, updated);
    return updated;
  }

  // ============================================================
  // VENDOR QUOTATION
  // ============================================================

  createVendorQuotation(data: Omit<VendorQuotation, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'receivedAt' | 'basicTotal' | 'netTotal'>): VendorQuotation {
    const now = new Date().toISOString();
    
    const basicTotal = data.items.reduce((sum, item) => sum + item.basicAmount, 0);
    const subtotal = basicTotal - data.discount + data.freight + data.loading;
    const netTotal = subtotal + data.taxes.totalTax + data.otherCharges;

    const quotation: VendorQuotation = {
      ...data,
      id: `quot_${this.generateId()}`,
      basicTotal,
      netTotal,
      receivedAt: now,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.quotations.set(quotation.id, quotation);
    return quotation;
  }

  getVendorQuotation(id: string): VendorQuotation | undefined {
    return this.quotations.get(id);
  }

  getVendorQuotations(rfqId: string, vendorId?: string): VendorQuotation[] {
    let quotations = Array.from(this.quotations.values()).filter(q => q.rfqId === rfqId);
    if (vendorId) quotations = quotations.filter(q => q.vendorId === vendorId);
    return quotations;
  }

  updateVendorQuotation(id: string, updates: Partial<VendorQuotation>): VendorQuotation | null {
    const quotation = this.quotations.get(id);
    if (!quotation) return null;

    const updated = { ...quotation, ...updates, updatedAt: new Date().toISOString(), version: quotation.version + 1 };
    this.quotations.set(id, updated);
    return updated;
  }

  // ============================================================
  // TECHNICAL EVALUATION
  // ============================================================

  createTechnicalEvaluation(data: Omit<TechnicalEvaluation, 'id' | 'createdAt' | 'updatedAt' | 'overallScore'>): TechnicalEvaluation {
    const now = new Date().toISOString();
    const overallScore = data.criteria.reduce((sum, c) => sum + c.score, 0) / data.criteria.length;

    const evaluation: TechnicalEvaluation = {
      ...data,
      id: `tech_eval_${this.generateId()}`,
      overallScore,
      createdAt: now,
      updatedAt: now,
    };

    this.technicalEvaluations.set(evaluation.id, evaluation);
    return evaluation;
  }

  getTechnicalEvaluation(quotationId: string): TechnicalEvaluation | undefined {
    return Array.from(this.technicalEvaluations.values()).find(e => e.quotationId === quotationId);
  }

  // ============================================================
  // COMMERCIAL EVALUATION
  // ============================================================

  createCommercialEvaluation(data: Omit<CommercialEvaluation, 'id' | 'createdAt' | 'updatedAt' | 'totalLandedCost' | 'effectiveRate' | 'overallScore'>): CommercialEvaluation {
    const now = new Date().toISOString();
    const totalLandedCost = data.basicTotal + data.freight + data.taxes - data.discount;
    const effectiveRate = totalLandedCost; // Simplified - would need quantity context
    const overallScore = (data.deliveryDays <= 7 ? 10 : data.deliveryDays <= 14 ? 7 : 5) * 0.3 +
                        (data.paymentTerms?.includes('Credit') ? 8 : 6) * 0.3 +
                        (data.warranty ? 9 : 5) * 0.4;

    const evaluation: CommercialEvaluation = {
      ...data,
      id: `comm_eval_${this.generateId()}`,
      totalLandedCost,
      effectiveRate,
      overallScore,
      createdAt: now,
      updatedAt: now,
    };

    this.commercialEvaluations.set(evaluation.id, evaluation);
    return evaluation;
  }

  getCommercialEvaluation(quotationId: string): CommercialEvaluation | undefined {
    return Array.from(this.commercialEvaluations.values()).find(e => e.quotationId === quotationId);
  }

  // ============================================================
  // COMPARATIVE STATEMENT
  // ============================================================

  generateComparativeStatement(rfqId: string, preparedBy: string, preparedByName: string): ComparativeStatement {
    const rfq = this.rfqs.get(rfqId);
    if (!rfq) throw new Error('RFQ not found');

    const quotations = this.getVendorQuotations(rfqId);
    const now = new Date().toISOString();

    const items = rfq.items.map(rfqItem => {
      const vendorQuotes = quotations.map(quotation => {
        const item = quotation.items.find(i => i.materialId === rfqItem.materialId);
        if (!item) return null;

        const techEval = this.getTechnicalEvaluation(quotation.id);
        const commEval = this.getCommercialEvaluation(quotation.id);

        return {
          vendorId: quotation.vendorId,
          vendorName: quotation.vendorName,
          quotationId: quotation.id,
          basicRate: item.basicRate,
          netRate: item.netRate,
          effectiveRate: commEval?.effectiveRate || item.netRate,
          deliveryDays: quotation.deliveryDays,
          technicalStatus: techEval?.overallStatus || 'COMPLIANT',
          technicalScore: techEval?.overallScore || 0,
          commercialScore: commEval?.overallScore || 0,
          overallScore: ((techEval?.overallScore || 0) * 0.5 + (commEval?.overallScore || 0) * 0.5),
          isLowest: false,
          isRecommended: false,
        };
      }).filter(q => q !== null);

      // Find lowest compliant vendor
      const compliantQuotes = vendorQuotes.filter(q => q.technicalStatus === 'COMPLIANT');
      const lowestQuote = compliantQuotes.length > 0 
        ? compliantQuotes.reduce((min, q) => q.effectiveRate < min.effectiveRate ? q : min)
        : null;

      if (lowestQuote) {
        lowestQuote.isLowest = true;
        lowestQuote.isRecommended = true;
      }

      return {
        id: `comp_item_${this.generateId()}`,
        comparativeId: '',
        materialId: rfqItem.materialId,
        materialName: rfqItem.materialName,
        specification: rfqItem.specification,
        quantity: rfqItem.quantity,
        uom: rfqItem.uom,
        vendorQuotes,
        lowestVendorId: lowestQuote?.vendorId,
        lowestVendorName: lowestQuote?.vendorName,
        lowestRate: lowestQuote?.effectiveRate,
        recommendedVendorId: lowestQuote?.vendorId,
        recommendedVendorName: lowestQuote?.vendorName,
      };
    });

    const statement: ComparativeStatement = {
      id: `comp_${this.generateId()}`,
      companyId: rfq.companyId,
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
      projectId: rfq.projectId,
      projectName: rfq.projectName,
      statementDate: now,
      preparedBy,
      preparedByName,
      items,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };

    // Update item references
    statement.items.forEach(item => item.comparativeId = statement.id);

    this.comparativeStatements.set(statement.id, statement);
    return statement;
  }

  getComparativeStatement(id: string): ComparativeStatement | undefined {
    return this.comparativeStatements.get(id);
  }

  getComparativeStatements(rfqId: string): ComparativeStatement[] {
    return Array.from(this.comparativeStatements.values()).filter(cs => cs.rfqId === rfqId);
  }

  // ============================================================
  // NEGOTIATION
  // ============================================================

  createNegotiation(data: Omit<ProcurementNegotiation, 'id' | 'createdAt' | 'updatedAt' | 'savings' | 'savingsPercent'>): ProcurementNegotiation {
    const now = new Date().toISOString();
    const savings = data.originalRate - data.negotiatedRate;
    const savingsPercent = (savings / data.originalRate) * 100;

    const negotiation: ProcurementNegotiation = {
      ...data,
      id: `neg_${this.generateId()}`,
      savings,
      savingsPercent,
      createdAt: now,
      updatedAt: now,
    };

    this.negotiations.set(negotiation.id, negotiation);
    return negotiation;
  }

  getNegotiations(quotationId: string): ProcurementNegotiation[] {
    return Array.from(this.negotiations.values()).filter(n => n.quotationId === quotationId);
  }

  // ============================================================
  // PROCUREMENT SAVINGS
  // ============================================================

  calculateProcurementSavings(prId: string, budgetEstimate: number, originalQuotation: number, finalNegotiated: number, calculatedBy: string): ProcurementSavings {
    const savings = originalQuotation - finalNegotiated;
    const savingsPercent = (savings / originalQuotation) * 100;

    const procurementSavings: ProcurementSavings = {
      id: `sav_${this.generateId()}`,
      companyId: '', // Would get from PR
      projectId: '', // Would get from PR
      prId,
      budgetEstimate,
      originalQuotation,
      finalNegotiated,
      savings,
      savingsPercent,
      calculatedAt: new Date().toISOString(),
      calculatedBy,
    };

    this.savings.set(procurementSavings.id, procurementSavings);
    return procurementSavings;
  }

  // ============================================================
  // PURCHASE ORDER
  // ============================================================

  createPurchaseOrder(data: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'basicTotal' | 'grandTotal'>): PurchaseOrder {
    const now = new Date().toISOString();
    
    const basicTotal = data.items.reduce((sum, item) => sum + item.amount, 0);
    const subtotal = basicTotal - data.discount + data.freight;
    const grandTotal = subtotal + data.taxes.totalTax + data.otherCharges;

    const po: PurchaseOrder = {
      ...data,
      id: `po_${this.generateId()}`,
      basicTotal,
      grandTotal,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.purchaseOrders.set(po.id, po);
    return po;
  }

  createPOFromQuotation(quotationId: string, projectId: string, createdBy: string): PurchaseOrder {
    const quotation = this.quotations.get(quotationId);
    if (!quotation) throw new Error('Quotation not found');

    const rfq = this.rfqs.get(quotation.rfqId);
    if (!rfq) throw new Error('RFQ not found');

    const poItems = quotation.items.map(item => ({
      id: `po_item_${this.generateId()}`,
      poId: '', // Will be set after PO creation
      quotationItemId: item.id,
      materialId: item.materialId,
      materialName: item.materialName,
      quantity: item.quantity,
      uom: item.uom,
      rate: item.netRate,
      amount: item.netAmount,
    }));

    const poData = {
      companyId: quotation.companyId,
      poNumber: `PO-${Date.now()}`,
      prId: undefined,
      prNumber: undefined,
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
      quotationId: quotation.id,
      quotationNumber: quotation.quotationNumber,
      projectId,
      projectName: rfq.projectName,
      vendorId: quotation.vendorId,
      vendorName: quotation.vendorName,
      poDate: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + quotation.deliveryDays * 24 * 60 * 60 * 1000).toISOString(),
      items: poItems,
      discount: quotation.discount,
      freight: quotation.freight,
      taxes: quotation.taxes,
      otherCharges: quotation.otherCharges,
      paymentTerms: quotation.paymentTerms,
      deliveryTerms: '',
      warranty: quotation.warranty,
      status: 'DRAFT' as const,
      workflowInstanceId: undefined,
      approvedBy: undefined,
      approvedAt: undefined,
      createdBy,
      updatedBy: createdBy,
    };

    const po = this.createPurchaseOrder(poData);

    // Update PO item references
    po.items.forEach(item => item.poId = po.id);

    return po;
  }

  getPurchaseOrder(id: string): PurchaseOrder | undefined {
    return this.purchaseOrders.get(id);
  }

  getPurchaseOrders(companyId: string, projectId?: string, vendorId?: string, status?: POStatus): PurchaseOrder[] {
    let pos = Array.from(this.purchaseOrders.values()).filter(po => po.companyId === companyId);
    if (projectId) pos = pos.filter(po => po.projectId === projectId);
    if (vendorId) pos = pos.filter(po => po.vendorId === vendorId);
    if (status) pos = pos.filter(po => po.status === status);
    return pos;
  }

  updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | null {
    const po = this.purchaseOrders.get(id);
    if (!po) return null;

    const updated = { ...po, ...updates, updatedAt: new Date().toISOString(), version: po.version + 1 };
    this.purchaseOrders.set(id, updated);
    return updated;
  }

  // ============================================================
  // ALERTS
  // ============================================================

  createAlert(data: Omit<ProcurementAlert, 'id' | 'createdAt' | 'isAcknowledged'>): ProcurementAlert {
    const alert: ProcurementAlert = {
      ...data,
      id: `alert_${this.generateId()}`,
      isAcknowledged: false,
      createdAt: new Date().toISOString(),
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  getAlerts(isAcknowledged?: boolean): ProcurementAlert[] {
    let alerts = Array.from(this.alerts.values());
    if (isAcknowledged !== undefined) {
      alerts = alerts.filter(a => a.isAcknowledged === isAcknowledged);
    }
    return alerts;
  }

  acknowledgeAlert(alertId: string, acknowledgedBy: string): ProcurementAlert | null {
    const alert = this.alerts.get(alertId);
    if (!alert) return null;

    alert.isAcknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = acknowledgedBy;

    return alert;
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getProcurementDashboardKPIs(companyId: string): ProcurementDashboardKPIs {
    const mrs = this.getMaterialRequisitions(companyId);
    const prs = this.getPurchaseRequisitions(companyId);
    const rfqs = this.getRFQs(companyId);
    const quotations = Array.from(this.quotations.values()).filter(q => {
      const rfq = this.rfqs.get(q.rfqId);
      return rfq?.companyId === companyId;
    });
    const pos = this.getPurchaseOrders(companyId);

    const openMR = mrs.filter(mr => mr.status === 'SUBMITTED').length;
    const openPR = prs.filter(pr => pr.status === 'SUBMITTED' || pr.status === 'UNDER_REVIEW').length;
    const activeRFQ = rfqs.filter(rfq => rfq.status === 'ISSUED' || rfq.status === 'QUOTATION_RECEIVED').length;
    const quotationPending = quotations.filter(q => q.status === 'RECEIVED').length;
    const comparativePending = this.comparativeStatements.size;
    const approvalPending = prs.filter(pr => pr.status === 'UNDER_REVIEW').length + 
                           pos.filter(po => po.status === 'PENDING_APPROVAL').length;
    const poPending = pos.filter(po => po.status === 'APPROVED' || po.status === 'ISSUED').length;
    
    // Calculate delayed procurement (required date passed but not received)
    const now = new Date();
    const delayedProcurement = pos.filter(po => {
      const deliveryDate = new Date(po.deliveryDate);
      return deliveryDate < now && po.status !== 'RECEIVED' && po.status !== 'CLOSED';
    }).length;

    // Calculate total savings
    const totalSavings = Array.from(this.savings.values()).reduce((sum, s) => sum + s.savings, 0);

    // Calculate total procurement value
    const totalProcurementValue = pos.reduce((sum, po) => sum + po.grandTotal, 0);

    // Calculate average procurement time (simplified)
    const averageProcurementTime = 15; // days - would calculate from actual data

    // Calculate on-time delivery percentage
    const receivedPOs = pos.filter(po => po.status === 'RECEIVED' || po.status === 'CLOSED');
    const onTimeDeliveries = receivedPOs.filter(po => {
      const deliveryDate = new Date(po.deliveryDate);
      return deliveryDate >= now || po.status === 'RECEIVED';
    }).length;
    const onTimeDeliveryPercent = receivedPOs.length > 0 ? (onTimeDeliveries / receivedPOs.length) * 100 : 100;

    return {
      openMR,
      openPR,
      activeRFQ,
      quotationPending,
      comparativePending,
      approvalPending,
      poPending,
      delayedProcurement,
      totalSavings,
      totalProcurementValue,
      averageProcurementTime,
      onTimeDeliveryPercent,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getMRByNumber(companyId: string, mrNumber: string): MaterialRequisition | undefined {
    return Array.from(this.materialRequisitions.values()).find(
      mr => mr.companyId === companyId && mr.mrNumber === mrNumber
    );
  }

  getPRByNumber(companyId: string, prNumber: string): PurchaseRequisition | undefined {
    return Array.from(this.purchaseRequisitions.values()).find(
      pr => pr.companyId === companyId && pr.prNumber === prNumber
    );
  }

  getRFQByNumber(companyId: string, rfqNumber: string): RFQ | undefined {
    return Array.from(this.rfqs.values()).find(
      rfq => rfq.companyId === companyId && rfq.rfqNumber === rfqNumber
    );
  }

  getPOByNumber(companyId: string, poNumber: string): PurchaseOrder | undefined {
    return Array.from(this.purchaseOrders.values()).find(
      po => po.companyId === companyId && po.poNumber === poNumber
    );
  }
}

export const procurementService = ProcurementService.getInstance();

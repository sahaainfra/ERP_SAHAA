// ============================================================
// BUILDCORE ERP - PURCHASE ORDER SERVICE
// Part 16: Complete Purchase Order and Supplier Delivery Lifecycle
// ============================================================

import type {
  PurchaseOrderMaster, PurchaseOrderItem, POTerms, PurchaseOrderTaxes, POAmendment,
  DeliverySchedule, GateEntry, GoodsReceiptNote, GRNItem,
  SupplierInvoice, ThreeWayMatch, ThreeWayMatchItem, MatchException,
  MatchToleranceConfig, POClosure, PODashboardKPIs, POAlert,
  DeliveryChallan, PODocument, PurchaseOrderStatus, POApprovalStatus,
  DeliveryStatus, GRNStatus, QCStatus, InvoiceStatus,
  ThreeWayMatchStatus
} from '../types/po';

export class POService {
  private static instance: POService;

  private purchaseOrders: Map<string, PurchaseOrderMaster> = new Map();
  private gateEntries: Map<string, GateEntry> = new Map();
  private grns: Map<string, GoodsReceiptNote> = new Map();
  private invoices: Map<string, SupplierInvoice> = new Map();
  private threeWayMatches: Map<string, ThreeWayMatch> = new Map();
  private toleranceConfigs: Map<string, MatchToleranceConfig> = new Map();
  private closures: Map<string, POClosure> = new Map();
  private alerts: Map<string, POAlert> = new Map();
  private deliveryChallans: Map<string, DeliveryChallan> = new Map();
  private poDocuments: Map<string, PODocument> = new Map();

  private constructor() {}

  static getInstance(): POService {
    if (!POService.instance) {
      POService.instance = new POService();
    }
    return POService.instance;
  }

  // ============================================================
  // PURCHASE ORDER MANAGEMENT
  // ============================================================

  createPurchaseOrder(data: Omit<PurchaseOrderMaster, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'basicTotal' | 'grandTotal' | 'amendments' | 'deliveryScheduleItems'>): PurchaseOrderMaster {
    const now = new Date().toISOString();
    const basicTotal = data.items.reduce((sum: number, item: PurchaseOrderItem) => sum + item.netAmount, 0);
    const grandTotal = basicTotal - data.discount + data.freight + data.taxes.totalTax + data.otherCharges;

    const po: PurchaseOrderMaster = {
      ...data,
      id: `po_${this.generateId()}`,
      basicTotal,
      grandTotal,
      amendments: [],
      deliveryScheduleItems: [],
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    // Create delivery schedule for each item
    po.items.forEach((item: PurchaseOrderItem) => {
      const schedule: DeliverySchedule = {
        id: `ds_${this.generateId()}`,
        poId: po.id,
        poItemId: item.id,
        scheduledQuantity: item.quantity,
        scheduledDate: item.deliveryDate,
        deliveredQuantity: 0,
        balanceQuantity: item.quantity,
        status: 'SCHEDULED',
      };
      po.deliveryScheduleItems.push(schedule);
    });

    this.purchaseOrders.set(po.id, po);
    return po;
  }

  getPurchaseOrder(id: string): PurchaseOrderMaster | undefined {
    return this.purchaseOrders.get(id);
  }

  getPurchaseOrders(companyId: string, projectId?: string, vendorId?: string, status?: PurchaseOrderStatus): PurchaseOrderMaster[] {
    let pos = Array.from(this.purchaseOrders.values()).filter(po => po.companyId === companyId);
    if (projectId) pos = pos.filter(po => po.projectId === projectId);
    if (vendorId) pos = pos.filter(po => po.vendorId === vendorId);
    if (status) pos = pos.filter(po => po.status === status);
    return pos;
  }

  updatePurchaseOrder(id: string, updates: Partial<PurchaseOrderMaster>): PurchaseOrderMaster | null {
    const po = this.purchaseOrders.get(id);
    if (!po) return null;

    const updated = { ...po, ...updates, updatedAt: new Date().toISOString(), version: po.version + 1 };
    this.purchaseOrders.set(id, updated);
    return updated;
  }

  approvePurchaseOrder(id: string, approvedBy: string): PurchaseOrderMaster | null {
    const po = this.purchaseOrders.get(id);
    if (!po) return null;

    po.approvalStatus = 'APPROVED';
    po.approvedBy = approvedBy;
    po.approvedAt = new Date().toISOString();
    po.status = 'APPROVED';
    po.updatedAt = new Date().toISOString();

    return po;
  }

  // ============================================================
  // GOODS RECEIPT NOTE (GRN)
  // ============================================================

  createGRN(data: Omit<GoodsReceiptNote, 'id' | 'createdAt' | 'updatedAt' | 'version'>): GoodsReceiptNote {
    const now = new Date().toISOString();
    const grn: GoodsReceiptNote = {
      ...data,
      id: `grn_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.grns.set(grn.id, grn);

    // Update PO delivery schedule
    grn.items.forEach(grnItem => {
      const po = this.purchaseOrders.get(grn.poId);
      if (po) {
        const poItem = po.items.find(i => i.id === grnItem.poItemId);
        if (poItem) {
          poItem.receivedQuantity += grnItem.acceptedQuantity;
          poItem.balanceQuantity = poItem.quantity - poItem.receivedQuantity;

          if (poItem.balanceQuantity === 0) {
            poItem.status = 'RECEIVED';
          } else if (poItem.receivedQuantity > 0) {
            poItem.status = 'PARTIALLY_RECEIVED';
          }
        }
        po.updatedAt = now;
      }
    });

    return grn;
  }

  getGRN(id: string): GoodsReceiptNote | undefined {
    return this.grns.get(id);
  }

  getGRNs(companyId: string, poId?: string, status?: GRNStatus): GoodsReceiptNote[] {
    let grns = Array.from(this.grns.values()).filter(grn => grn.companyId === companyId);
    if (poId) grns = grns.filter(grn => grn.poId === poId);
    if (status) grns = grns.filter(grn => grn.status === status);
    return grns;
  }

  // ============================================================
  // INVOICE MANAGEMENT
  // ============================================================

  createInvoice(data: Omit<SupplierInvoice, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'paidAmount' | 'outstandingAmount'>): SupplierInvoice {
    const now = new Date().toISOString();
    const invoice: SupplierInvoice = {
      ...data,
      id: `inv_${this.generateId()}`,
      paidAmount: 0,
      outstandingAmount: data.totalAmount,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  getInvoice(id: string): SupplierInvoice | undefined {
    return this.invoices.get(id);
  }

  getInvoices(companyId: string, poId?: string, vendorId?: string, status?: InvoiceStatus): SupplierInvoice[] {
    let invoices = Array.from(this.invoices.values()).filter(inv => inv.companyId === companyId);
    if (poId) invoices = invoices.filter(inv => inv.poId === poId);
    if (vendorId) invoices = invoices.filter(inv => inv.vendorId === vendorId);
    if (status) invoices = invoices.filter(inv => inv.status === status);
    return invoices;
  }

  // ============================================================
  // 3-WAY MATCH
  // ============================================================

  performThreeWayMatch(invoiceId: string, performedBy: string, performedByName: string): ThreeWayMatch | null {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) return null;

    const po = this.purchaseOrders.get(invoice.poId);
    if (!po) return null;

    const grn = Array.from(this.grns.values()).find(g => g.poId === invoice.poId);
    if (!grn) return null;

    const now = new Date().toISOString();
    const matchItems: ThreeWayMatchItem[] = [];
    const exceptions: MatchException[] = [];

    const tolerance = this.getToleranceConfig(invoice.companyId);

    po.items.forEach(poItem => {
      const grnItem = grn.items.find(g => g.poItemId === poItem.id);
      
      const poQuantity = poItem.quantity;
      const grnQuantity = grnItem?.acceptedQuantity || 0;
      const invoiceQuantity = poItem.quantity;

      const poRate = poItem.rate;
      const invoiceRate = invoice.totalAmount / poItem.quantity;

      const quantityVariance = Math.abs(grnQuantity - poQuantity);
      const rateVariance = Math.abs(invoiceRate - poRate);
      const amountVariance = Math.abs((invoiceRate * grnQuantity) - (poRate * poQuantity));

      const quantityMatch = quantityVariance <= (poQuantity * tolerance.quantityTolerancePercent / 100);
      const rateMatch = rateVariance <= (poRate * tolerance.rateTolerancePercent / 100);

      const itemStatus = quantityMatch && rateMatch ? 'MATCHED' : 'MISMATCH';

      matchItems.push({
        id: `tmi_${this.generateId()}`,
        matchId: '',
        materialId: poItem.materialId,
        materialName: poItem.materialName,
        poQuantity,
        grnQuantity,
        invoiceQuantity,
        poRate,
        invoiceRate,
        quantityVariance,
        rateVariance,
        amountVariance,
        status: itemStatus,
      });

      if (itemStatus === 'MISMATCH') {
        if (!quantityMatch) {
          exceptions.push({
            id: `exc_${this.generateId()}`,
            matchId: '',
            exceptionType: 'QUANTITY',
            description: `Quantity mismatch: PO ${poQuantity}, GRN ${grnQuantity}`,
            toleranceExceeded: true,
            status: 'OPEN',
          });
        }
        if (!rateMatch) {
          exceptions.push({
            id: `exc_${this.generateId()}`,
            matchId: '',
            exceptionType: 'RATE',
            description: `Rate mismatch: PO ${poRate}, Invoice ${invoiceRate}`,
            toleranceExceeded: true,
            status: 'OPEN',
          });
        }
      }
    });

    const overallStatus = exceptions.length === 0 ? 'MATCHED' : 'MISMATCH';

    const match: ThreeWayMatch = {
      id: `twm_${this.generateId()}`,
      companyId: invoice.companyId,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      poId: po.id,
      poNumber: po.poNumber,
      grnId: grn.id,
      grnNumber: grn.grnNumber,
      matchDate: now,
      performedBy,
      performedByName,
      items: matchItems,
      overallStatus,
      exceptions,
      createdAt: now,
      updatedAt: now,
    };

    match.items.forEach(item => item.matchId = match.id);
    match.exceptions.forEach(exc => exc.matchId = match.id);

    this.threeWayMatches.set(match.id, match);
    invoice.threeWayMatchStatus = overallStatus;
    invoice.updatedAt = now;

    return match;
  }

  getThreeWayMatch(id: string): ThreeWayMatch | undefined {
    return this.threeWayMatches.get(id);
  }

  // ============================================================
  // TOLERANCE CONFIGURATION
  // ============================================================

  getToleranceConfig(companyId: string): MatchToleranceConfig {
    const config = Array.from(this.toleranceConfigs.values()).find(c => c.companyId === companyId);
    if (config) return config;

    return {
      id: `mtc_${this.generateId()}`,
      companyId,
      quantityTolerancePercent: 5,
      rateTolerancePercent: 2,
      taxTolerancePercent: 1,
      amountTolerancePercent: 3,
      requireApprovalForExcess: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
    };
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getPODashboardKPIs(companyId: string): PODashboardKPIs {
    const pos = this.getPurchaseOrders(companyId);
    const grns = this.getGRNs(companyId);
    const invoices = this.getInvoices(companyId);
    const matches = Array.from(this.threeWayMatches.values()).filter(m => m.companyId === companyId);

    const openPO = pos.filter(po => po.status === 'APPROVED' || po.status === 'ISSUED' || po.status === 'PARTIALLY_RECEIVED').length;
    const openPOValue = pos
      .filter(po => po.status === 'APPROVED' || po.status === 'ISSUED' || po.status === 'PARTIALLY_RECEIVED')
      .reduce((sum, po) => sum + po.grandTotal, 0);

    const deliveredValue = pos.reduce((sum, po) => {
      const deliveredItems = po.items.reduce((itemSum, item) => itemSum + (item.receivedQuantity * item.rate), 0);
      return sum + deliveredItems;
    }, 0);

    const balanceValue = openPOValue - deliveredValue;
    const overdueDeliveries = 0; // Would calculate from delivery schedules
    const pendingGRN = grns.filter(grn => grn.status === 'DRAFT' || grn.status === 'SUBMITTED').length;
    const pendingQC = grns.filter(grn => grn.qcStatus === 'PENDING').length;
    const invoicePending = invoices.filter(inv => inv.status === 'SUBMITTED' || inv.status === 'UNDER_REVIEW').length;
    const threeWayMismatch = matches.filter(m => m.overallStatus === 'MISMATCH').length;
    const totalPOValue = pos.reduce((sum, po) => sum + po.grandTotal, 0);

    return {
      openPO,
      openPOValue,
      deliveredValue,
      balanceValue,
      overdueDeliveries,
      pendingGRN,
      pendingQC,
      invoicePending,
      threeWayMismatch,
      totalPOValue,
      averageDeliveryTime: 15,
      vendorPerformanceScore: 85,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getPOByNumber(companyId: string, poNumber: string): PurchaseOrderMaster | undefined {
    return Array.from(this.purchaseOrders.values()).find(
      po => po.companyId === companyId && po.poNumber === poNumber
    );
  }

  getGRNByNumber(companyId: string, grnNumber: string): GoodsReceiptNote | undefined {
    return Array.from(this.grns.values()).find(
      grn => grn.companyId === companyId && grn.grnNumber === grnNumber
    );
  }

  getInvoiceByNumber(companyId: string, invoiceNumber: string): SupplierInvoice | undefined {
    return Array.from(this.invoices.values()).find(
      inv => inv.companyId === companyId && inv.invoiceNumber === invoiceNumber
    );
  }
}

export const poService = POService.getInstance();

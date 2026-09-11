// ============================================================
// BUILDCORE ERP - BILLING SERVICE
// Part 22: RA Bill / Client Billing / Subcontractor Billing
// ============================================================

import type {
  Bill,
  BillItem,
  BillDeduction,
  BillTax,
  BillCertification,
  BillPayment,
  EscalationConfig,
  EscalationCalculation,
  SubcontractorBill,
  DLPTracking,
  RetentionRelease,
  BillDashboardKPIs,
  BillType,
  BillItemCategory,
  DeductionType
} from '../types/billing';

export class BillingService {
  private static instance: BillingService;
  private bills: Map<string, Bill> = new Map();
  private escalationConfigs: Map<string, EscalationConfig> = new Map();
  private dlpTrackings: Map<string, DLPTracking> = new Map();

  private constructor() {}

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  // ============================================================
  // BILL CREATION
  // ============================================================

  public createBill(
    companyId: string,
    billType: BillType,
    projectId: string,
    billingPeriod: string,
    createdBy: string
  ): Bill {
    const billNumber = this.generateBillNumber(companyId, billType);
    const bill: Bill = {
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyId,
      billNumber,
      billType,
      projectId,
      billingPeriod,
      billDate: new Date().toISOString(),
      dueDate: this.calculateDueDate(billingPeriod),
      grossAmount: 0,
      deductions: [],
      taxes: [],
      netAmount: 0,
      certificationStatus: 'NOT_SUBMITTED',
      paymentStatus: 'NOT_DUE',
      items: [],
      createdBy,
      createdAt: new Date().toISOString(),
      updatedBy: createdBy,
      updatedAt: new Date().toISOString(),
      version: 1,
      status: 'DRAFT'
    };

    this.bills.set(bill.id, bill);
    return bill;
  }

  // ============================================================
  // BILL ITEM MANAGEMENT
  // ============================================================

  public addBillItemFromMB(
    billId: string,
    mbItemId: string,
    itemCategory: BillItemCategory,
    updatedBy: string
  ): BillItem | null {
    const bill = this.bills.get(billId);
    if (!bill) return null;

    // In real implementation, fetch MB item data
    // For now, create a mock item
    const billItem: BillItem = {
      id: `bi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      billId,
      itemCategory,
      itemId: mbItemId,
      itemCode: `ITEM-${Math.floor(Math.random() * 1000)}`,
      description: 'Sample Item from MB',
      unit: 'CUM',
      rate: 1000,
      previousQuantity: 100,
      currentQuantity: 50,
      cumulativeQuantity: 150,
      previousAmount: 100000,
      currentAmount: 50000,
      cumulativeAmount: 150000,
      remarks: ''
    };

    bill.items.push(billItem);
    this.recalculateBillAmounts(billId);
    bill.updatedBy = updatedBy;
    bill.updatedAt = new Date().toISOString();

    return billItem;
  }

  public updateBillItem(
    billId: string,
    billItemId: string,
    updates: Partial<BillItem>,
    updatedBy: string
  ): BillItem | null {
    const bill = this.bills.get(billId);
    if (!bill) return null;

    const itemIndex = bill.items.findIndex(item => item.id === billItemId);
    if (itemIndex === -1) return null;

    const item = bill.items[itemIndex];
    const updatedItem = { ...item, ...updates };

    // Recalculate amounts
    updatedItem.currentAmount = updatedItem.currentQuantity * updatedItem.rate;
    updatedItem.cumulativeAmount = updatedItem.previousAmount + updatedItem.currentAmount;
    updatedItem.cumulativeQuantity = updatedItem.previousQuantity + updatedItem.currentQuantity;

    bill.items[itemIndex] = updatedItem;
    this.recalculateBillAmounts(billId);
    bill.updatedBy = updatedBy;
    bill.updatedAt = new Date().toISOString();

    return updatedItem;
  }

  // ============================================================
  // DEDUCTION MANAGEMENT
  // ============================================================

  public addDeduction(
    billId: string,
    deductionType: DeductionType,
    description: string,
    amount: number,
    reference: string | undefined,
    updatedBy: string
  ): BillDeduction | null {
    const bill = this.bills.get(billId);
    if (!bill) return null;

    const deduction: BillDeduction = {
      id: `ded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      billId,
      deductionType,
      description,
      amount,
      reference
    };

    bill.deductions.push(deduction);
    this.recalculateBillAmounts(billId);
    bill.updatedBy = updatedBy;
    bill.updatedAt = new Date().toISOString();

    return deduction;
  }

  public removeDeduction(billId: string, deductionId: string, updatedBy: string): boolean {
    const bill = this.bills.get(billId);
    if (!bill) return false;

    const deductionIndex = bill.deductions.findIndex(d => d.id === deductionId);
    if (deductionIndex === -1) return false;

    bill.deductions.splice(deductionIndex, 1);
    this.recalculateBillAmounts(billId);
    bill.updatedBy = updatedBy;
    bill.updatedAt = new Date().toISOString();

    return true;
  }

  // ============================================================
  // TAX CALCULATION
  // ============================================================

  public calculateTaxes(billId: string, taxRate: number, updatedBy: string): BillTax[] {
    const bill = this.bills.get(billId);
    if (!bill) return [];

    const taxableAmount = bill.grossAmount - bill.deductions.reduce((sum, d) => sum + d.amount, 0);
    
    // Calculate GST (assuming 18% GST split into CGST 9% + SGST 9%)
    const cgstRate = taxRate / 2;
    const sgstRate = taxRate / 2;
    
    const cgstAmount = taxableAmount * (cgstRate / 100);
    const sgstAmount = taxableAmount * (sgstRate / 100);

    const taxes: BillTax[] = [
      {
        id: `tax_${Date.now()}_cgst`,
        billId,
        taxType: 'CGST',
        taxRate: cgstRate,
        taxableAmount,
        taxAmount: cgstAmount
      },
      {
        id: `tax_${Date.now()}_sgst`,
        billId,
        taxType: 'SGST',
        taxRate: sgstRate,
        taxableAmount,
        taxAmount: sgstAmount
      }
    ];

    bill.taxes = taxes;
    this.recalculateBillAmounts(billId);
    bill.updatedBy = updatedBy;
    bill.updatedAt = new Date().toISOString();

    return taxes;
  }

  // ============================================================
  // ESCALATION CALCULATION
  // ============================================================

  public calculateEscalation(
    billItemId: string,
    escalationConfigId: string
  ): EscalationCalculation | null {
    const config = this.escalationConfigs.get(escalationConfigId);
    if (!config) return null;

    // In real implementation, fetch bill item data
    const baseRate = 1000; // Mock base rate

    // Calculate escalation based on indices
    let totalEscalationFactor = 1;
    const indexSnapshots = config.currentIndices.map(index => {
      const escalationFactor = index.currentValue / index.baseValue;
      totalEscalationFactor *= escalationFactor;
      
      return {
        indexType: index.indexType,
        indexName: index.indexName,
        baseValue: index.baseValue,
        currentValue: index.currentValue,
        escalationFactor
      };
    });

    const escalatedRate = baseRate * totalEscalationFactor;
    const escalationAmount = escalatedRate - baseRate;

    const calculation: EscalationCalculation = {
      id: `esc_calc_${Date.now()}`,
      billItemId,
      escalationConfigId,
      baseRate,
      escalatedRate,
      escalationAmount,
      calculationDate: new Date().toISOString(),
      indices: indexSnapshots
    };

    return calculation;
  }

  // ============================================================
  // BILL AMOUNT RECALCULATION
  // ============================================================

  private recalculateBillAmounts(billId: string): void {
    const bill = this.bills.get(billId);
    if (!bill) return;

    // Calculate gross amount
    bill.grossAmount = bill.items.reduce((sum, item) => sum + item.currentAmount, 0);

    // Calculate total deductions
    const totalDeductions = bill.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);

    // Calculate total taxes
    const totalTaxes = bill.taxes.reduce((sum, tax) => sum + tax.taxAmount, 0);

    // Calculate net amount
    bill.netAmount = bill.grossAmount - totalDeductions + totalTaxes;
  }

  // ============================================================
  // BILL WORKFLOW
  // ============================================================

  public submitBill(billId: string, submittedBy: string): boolean {
    const bill = this.bills.get(billId);
    if (!bill) return false;

    bill.status = 'SUBMITTED';
    bill.updatedBy = submittedBy;
    bill.updatedAt = new Date().toISOString();
    bill.version += 1;

    return true;
  }

  public certifyBill(
    billId: string,
    certifiedAmount: number,
    deductedAmount: number,
    rejectedAmount: number,
    certificationReference: string,
    clientRemarks: string | undefined,
    certifiedBy: string
  ): BillCertification | null {
    const bill = this.bills.get(billId);
    if (!bill) return null;

    const certification: BillCertification = {
      id: `cert_${Date.now()}`,
      billId,
      submittedAmount: bill.grossAmount,
      certifiedAmount,
      deductedAmount,
      rejectedAmount,
      certificationDate: new Date().toISOString(),
      certificationReference,
      clientRemarks,
      certifiedBy
    };

    bill.certificationStatus = certifiedAmount === bill.grossAmount ? 'FULLY_CERTIFIED' : 'PARTIALLY_CERTIFIED';
    bill.status = 'CERTIFIED';
    bill.updatedBy = certifiedBy;
    bill.updatedAt = new Date().toISOString();
    bill.version += 1;

    return certification;
  }

  public recordPayment(
    billId: string,
    paymentAmount: number,
    paymentMode: string,
    transactionReference: string,
    remarks: string | undefined,
    processedBy: string
  ): BillPayment | null {
    const bill = this.bills.get(billId);
    if (!bill) return null;

    const payment: BillPayment = {
      id: `pay_${Date.now()}`,
      billId,
      paymentDate: new Date().toISOString(),
      paymentAmount,
      paymentMode,
      transactionReference,
      remarks,
      processedBy
    };

    // Update payment status
    // In real implementation, track cumulative payments
    bill.paymentStatus = paymentAmount >= bill.netAmount ? 'PAID' : 'PARTIALLY_PAID';
    bill.status = 'PAID';
    bill.updatedBy = processedBy;
    bill.updatedAt = new Date().toISOString();
    bill.version += 1;

    return payment;
  }

  // ============================================================
  // DLP / RETENTION MANAGEMENT
  // ============================================================

  public createDLPTracking(
    projectId: string,
    contractId: string,
    dlpStartDate: string,
    dlpEndDate: string,
    retentionAmount: number
  ): DLPTracking {
    const tracking: DLPTracking = {
      id: `dlp_${Date.now()}`,
      projectId,
      contractId,
      dlpStartDate,
      dlpEndDate,
      retentionAmount,
      retentionReleased: 0,
      retentionBalance: retentionAmount,
      defects: [],
      status: 'ACTIVE'
    };

    this.dlpTrackings.set(tracking.id, tracking);
    return tracking;
  }

  public releaseRetention(
    dlpTrackingId: string,
    releaseAmount: number,
    approvalReference: string,
    approvedBy: string,
    remarks: string | undefined
  ): RetentionRelease | null {
    const tracking = this.dlpTrackings.get(dlpTrackingId);
    if (!tracking) return null;

    if (releaseAmount > tracking.retentionBalance) {
      return null; // Cannot release more than balance
    }

    const release: RetentionRelease = {
      id: `rel_${Date.now()}`,
      dlpTrackingId,
      releaseDate: new Date().toISOString(),
      releaseAmount,
      approvalReference,
      approvedBy,
      remarks
    };

    tracking.retentionReleased += releaseAmount;
    tracking.retentionBalance -= releaseAmount;

    if (tracking.retentionBalance === 0) {
      tracking.status = 'COMPLETED';
    }

    return release;
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  public getDashboardKPIs(companyId: string): BillDashboardKPIs {
    const companyBills = Array.from(this.bills.values()).filter(b => b.companyId === companyId);

    const billsPrepared = companyBills.length;
    const pendingApproval = companyBills.filter(b => 
      ['SUBMITTED', 'UNDER_QS_REVIEW', 'UNDER_PM_REVIEW', 'UNDER_COMMERCIAL_REVIEW'].includes(b.status)
    ).length;
    const pendingCertification = companyBills.filter(b => 
      ['UNDER_CONSULTANT_REVIEW', 'UNDER_CLIENT_REVIEW'].includes(b.status)
    ).length;
    const certified = companyBills.filter(b => b.status === 'CERTIFIED').length;
    const paid = companyBills.filter(b => b.status === 'PAID').length;
    const outstanding = companyBills
      .filter(b => ['CERTIFIED', 'APPROVED_FOR_PAYMENT'].includes(b.status))
      .reduce((sum, b) => sum + b.netAmount, 0);

    // Calculate retention and advance from DLP trackings
    const companyDLPs = Array.from(this.dlpTrackings.values()).filter(d => 
      companyBills.some(b => b.contractId === d.contractId)
    );
    const retention = companyDLPs.reduce((sum, d) => sum + d.retentionBalance, 0);
    const advance = 0; // Would need to track advances separately

    // Calculate monthly and cumulative billing
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyBilling = companyBills
      .filter(b => {
        const billDate = new Date(b.billDate);
        return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
      })
      .reduce((sum, b) => sum + b.netAmount, 0);

    const cumulativeBilling = companyBills.reduce((sum, b) => sum + b.netAmount, 0);

    return {
      billsPrepared,
      pendingApproval,
      pendingCertification,
      certified,
      paid,
      outstanding,
      retention,
      advance,
      monthlyBilling,
      cumulativeBilling
    };
  }

  // ============================================================
  // HELPER METHODS
  // ============================================================

  private generateBillNumber(companyId: string, billType: BillType): string {
    const prefix = this.getBillTypePrefix(billType);
    const year = new Date().getFullYear();
    const count = Array.from(this.bills.values()).filter(b => 
      b.companyId === companyId && b.billNumber.startsWith(`${prefix}-${year}`)
    ).length + 1;
    
    return `${prefix}-${year}-${String(count).padStart(6, '0')}`;
  }

  private getBillTypePrefix(billType: BillType): string {
    const prefixes: Record<BillType, string> = {
      'RA_BILL': 'RA',
      'INTERIM_BILL': 'IB',
      'CLIENT_BILL': 'CB',
      'SUBCONTRACTOR_BILL': 'SB',
      'SUPPLEMENTARY_BILL': 'SB',
      'VARIATION_BILL': 'VB',
      'EXTRA_ITEM_BILL': 'EB',
      'FINAL_BILL': 'FB'
    };
    return prefixes[billType] || 'BILL';
  }

  private calculateDueDate(billingPeriod: string): string {
    // In real implementation, calculate based on payment terms
    // For now, add 30 days to current date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    return dueDate.toISOString();
  }

  // ============================================================
  // GETTERS
  // ============================================================

  public getBill(billId: string): Bill | undefined {
    return this.bills.get(billId);
  }

  public getBillsByProject(projectId: string): Bill[] {
    return Array.from(this.bills.values()).filter(b => b.projectId === projectId);
  }

  public getBillsByStatus(companyId: string, status: string): Bill[] {
    return Array.from(this.bills.values()).filter(b => 
      b.companyId === companyId && b.status === status
    );
  }

  public getDLPTracking(dlpTrackingId: string): DLPTracking | undefined {
    return this.dlpTrackings.get(dlpTrackingId);
  }
}

export const billingService = BillingService.getInstance();

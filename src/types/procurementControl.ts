// ============================================================
// BUILDCORE ERP - INTEGRATED PROCUREMENT & MATERIAL CONTROL TYPES
// Part 20: Integrated Procurement and Material Control Center
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. PROCUREMENT CONTROL CENTER KPIs
// ============================================================
export interface ProcurementControlKPIs {
  openMR: number;
  openPR: number;
  rfqPending: number;
  quotationPending: number;
  comparativePending: number;
  approvalPending: number;
  poPending: number;
  poValue: number;
  deliveryDue: number;
  deliveryOverdue: number;
  grnPending: number;
  qcPending: number;
  invoicePending: number;
  mismatch: number;
  paymentPending: number;
}

// ============================================================
// 2. MATERIAL CONTROL CENTER KPIs
// ============================================================
export interface MaterialControlKPIs {
  materialDemand: number;
  availableStock: number;
  reservedStock: number;
  incomingPO: number;
  shortage: number;
  reorder: number;
  excess: number;
  deadStock: number;
  consumptionVariance: number;
  wastage: number;
  priceVariance: number;
}

// ============================================================
// 3. PROJECT PROCUREMENT COVERAGE
// ============================================================
export interface ProjectProcurementCoverage {
  projectId: string;
  projectName: string;
  materials: MaterialCoverage[];
  totalRequired: number;
  totalAvailable: number;
  totalReserved: number;
  totalOrdered: number;
  totalDelivered: number;
  totalConsumed: number;
  totalBalance: number;
  totalForecast: number;
}

export interface MaterialCoverage {
  materialId: string;
  materialCode: string;
  materialName: string;
  required: number;
  available: number;
  reserved: number;
  ordered: number;
  delivered: number;
  consumed: number;
  balance: number;
  forecast: number;
  uom: string;
}

// ============================================================
// 4. PROCUREMENT RISK
// ============================================================
export interface ProcurementRisk {
  id: string;
  riskType: ProcurementRiskType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  projectId?: string;
  projectName?: string;
  materialId?: string;
  materialName?: string;
  vendorId?: string;
  vendorName?: string;
  description: string;
  impact: string;
  mitigation?: string;
  status: 'OPEN' | 'MITIGATING' | 'RESOLVED' | 'ACCEPTED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type ProcurementRiskType =
  | 'SINGLE_SOURCE_DEPENDENCY'
  | 'LATE_SUPPLIER'
  | 'PRICE_INCREASE'
  | 'LOW_STOCK'
  | 'CRITICAL_MATERIAL'
  | 'QUALITY_REJECTION'
  | 'DELAYED_APPROVAL'
  | 'UNAPPROVED_VENDOR'
  | 'EXPIRED_QUOTATION';

// ============================================================
// 5. PURCHASE COMMITMENT
// ============================================================
export interface PurchaseCommitment {
  projectId: string;
  projectName: string;
  approvedPOValue: number;
  approvedSubcontractCommitments: number;
  otherCommittedProcurement: number;
  totalCommitment: number;
  budget: number;
  variance: number;
  variancePercent: number;
}

// ============================================================
// 6. BUDGET CONTROL
// ============================================================
export interface BudgetControl {
  projectId: string;
  materialId: string;
  budget: number;
  existingCommitment: number;
  newPR: number;
  availableBudget: number;
  status: 'WITHIN_BUDGET' | 'WARNING' | 'EXCEEDED' | 'BLOCKED';
  policyAction: 'WARN' | 'BLOCK' | 'APPROVE_WITH_CONDITION';
  condition?: string;
}

// ============================================================
// 7. PROJECT MATERIAL CASH FORECAST
// ============================================================
export interface MaterialCashForecast {
  projectId: string;
  projectName: string;
  period: string; // YYYY-MM
  upcomingPO: number;
  expectedInvoices: number;
  expectedPayments: number;
  materialDemand: number;
  netCashFlow: number;
}

// ============================================================
// 8. VENDOR PERFORMANCE
// ============================================================
export interface IntegratedVendorPerformance {
  vendorId: string;
  vendorName: string;
  spend: number;
  poCount: number;
  deliveryOnTime: number;
  deliveryDelayed: number;
  deliveryPerformance: number; // percentage
  qualityAccepted: number;
  qualityRejected: number;
  qualityPerformance: number; // percentage
  rejectionRate: number; // percentage
  priceVariance: number;
  paymentOnTime: number;
  paymentDelayed: number;
  outstanding: number;
}

// ============================================================
// 9. PROCUREMENT SAVINGS
// ============================================================
export interface IntegratedProcurementSavings {
  projectId: string;
  projectName: string;
  materialId: string;
  materialName: string;
  budget: number;
  quoted: number;
  negotiated: number;
  final: number;
  savings: number;
  savingsPercent: number;
}

// ============================================================
// 10. PO DELIVERY PERFORMANCE
// ============================================================
export interface PODeliveryPerformance {
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  promisedDate: string;
  actualDate?: string;
  delayDays: number;
  status: 'ON_TIME' | 'DELAYED' | 'PENDING';
}

// ============================================================
// 11. MATERIAL QUALITY PERFORMANCE
// ============================================================
export interface MaterialQualityPerformance {
  materialId: string;
  materialName: string;
  grnCount: number;
  accepted: number;
  rejected: number;
  conditional: number;
  ncrCount: number;
  acceptanceRate: number; // percentage
}

// ============================================================
// 12. MATERIAL COST CONTROL
// ============================================================
export interface MaterialCostControl {
  materialId: string;
  materialName: string;
  budgetRate: number;
  poRate: number;
  actualRate: number;
  poVariance: number;
  poVariancePercent: number;
  actualVariance: number;
  actualVariancePercent: number;
}

// ============================================================
// 13. EXCEPTION CENTER
// ============================================================
export interface Exception {
  id: string;
  exceptionType: ExceptionType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  projectId?: string;
  projectName?: string;
  transactionType?: string;
  transactionId?: string;
  transactionNumber?: string;
  owner: string;
  ownerName: string;
  dueDate: string;
  action: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type ExceptionType =
  | 'BUDGET_EXCEEDED'
  | 'RATE_MISMATCH'
  | 'QUANTITY_MISMATCH'
  | 'PO_EXCESS'
  | 'GRN_EXCESS'
  | 'QC_REJECTION'
  | 'INVOICE_MISMATCH'
  | 'NEGATIVE_STOCK'
  | 'BOQ_EXCESS'
  | 'DELAYED_DELIVERY';

// ============================================================
// 14. MANAGEMENT APPROVAL QUEUE
// ============================================================
export interface ApprovalQueueItem {
  id: string;
  approvalType: ApprovalType;
  transactionId: string;
  transactionNumber: string;
  projectId?: string;
  projectName?: string;
  vendorId?: string;
  vendorName?: string;
  value: number;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export type ApprovalType =
  | 'PR'
  | 'PO'
  | 'VARIATION'
  | 'EXTRA_ITEM'
  | 'MATERIAL_APPROVAL'
  | 'STOCK_ADJUSTMENT'
  | 'EXCESS_RECEIPT'
  | 'EXCEPTION';

// ============================================================
// 15. CROSS-MODULE DRILL-DOWN
// ============================================================
export interface MaterialDrillDown {
  materialId: string;
  materialCode: string;
  materialName: string;
  vendors: VendorLink[];
  rfqs: RFQLink[];
  quotations: QuotationLink[];
  pos: POLink[];
  grns: GRNLink[];
  qcRecords: QCLink[];
  stock: StockLink[];
  issues: IssueLink[];
  consumption: ConsumptionLink[];
  cost: CostLink;
}

export interface VendorLink {
  vendorId: string;
  vendorName: string;
  totalSpend: number;
  poCount: number;
}

export interface RFQLink {
  rfqId: string;
  rfqNumber: string;
  date: string;
  status: string;
}

export interface QuotationLink {
  quotationId: string;
  vendorId: string;
  vendorName: string;
  date: string;
  amount: number;
}

export interface POLink {
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  date: string;
  amount: number;
  status: string;
}

export interface GRNLink {
  grnId: string;
  grnNumber: string;
  poId: string;
  date: string;
  quantity: number;
  status: string;
}

export interface QCLink {
  qcId: string;
  grnId: string;
  date: string;
  status: string;
}

export interface StockLink {
  storeId: string;
  storeName: string;
  quantity: number;
  value: number;
}

export interface IssueLink {
  issueId: string;
  issueNumber: string;
  projectId: string;
  date: string;
  quantity: number;
}

export interface ConsumptionLink {
  consumptionId: string;
  projectId: string;
  date: string;
  quantity: number;
  variance: number;
}

export interface CostLink {
  budgetRate: number;
  poRate: number;
  actualRate: number;
  totalCost: number;
  variance: number;
}

// ============================================================
// 16. PROJECT DRILL-DOWN
// ============================================================
export interface ProjectDrillDown {
  projectId: string;
  projectName: string;
  boq: BOQLink[];
  materialDemand: MaterialDemandLink[];
  procurement: ProcurementLink[];
  store: StoreLink[];
  consumption: ProjectConsumptionLink[];
  cost: ProjectCostLink;
}

export interface BOQLink {
  boqItemId: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface MaterialDemandLink {
  materialId: string;
  materialName: string;
  required: number;
  uom: string;
}

export interface ProcurementLink {
  poId: string;
  poNumber: string;
  vendorName: string;
  amount: number;
  status: string;
}

export interface StoreLink {
  storeId: string;
  storeName: string;
  stock: number;
  value: number;
}

export interface ProjectConsumptionLink {
  materialId: string;
  materialName: string;
  consumed: number;
  cost: number;
}

export interface ProjectCostLink {
  budget: number;
  committed: number;
  consumed: number;
  variance: number;
}

// ============================================================
// 17. PROCUREMENT COCKPIT KPIs
// ============================================================
export interface ProcurementCockpitKPIs {
  // Purchase Pipeline
  pipelineStages: PipelineStage[];
  
  // Delivery Performance
  deliveryOnTime: number;
  deliveryDelayed: number;
  averageDelayDays: number;
  
  // Stock Health
  stockHealth: StockHealthSummary;
  
  // Price Variance
  priceVariance: number;
  priceVariancePercent: number;
  
  // Savings
  totalSavings: number;
  savingsPercent: number;
  
  // Vendor Performance
  topVendors: IntegratedVendorPerformance[];
  
  // Exceptions
  criticalExceptions: number;
  highExceptions: number;
  
  // Approvals
  pendingApprovals: number;
  urgentApprovals: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  value: number;
}

export interface StockHealthSummary {
  critical: number;
  low: number;
  normal: number;
  excess: number;
  dead: number;
}

// ============================================================
// 18. SEARCH
// ============================================================
export interface ProcurementSearchResult {
  id: string;
  type: SearchResultType;
  number: string;
  description: string;
  projectId?: string;
  projectName?: string;
  vendorId?: string;
  vendorName?: string;
  date: string;
  status: string;
  value?: number;
}

export type SearchResultType =
  | 'MR'
  | 'PR'
  | 'RFQ'
  | 'QUOTATION'
  | 'COMPARATIVE'
  | 'PO'
  | 'GRN'
  | 'MATERIAL'
  | 'VENDOR'
  | 'INVOICE'
  | 'BATCH'
  | 'ISSUE'
  | 'CONSUMPTION';

// ============================================================
// 19. REPORT CENTER
// ============================================================
export interface ProcurementReport {
  id: string;
  reportType: ProcurementReportType;
  title: string;
  description: string;
  filters: ReportFilter[];
  generatedAt: string;
  generatedBy: string;
  data: any;
}

export type ProcurementReportType =
  | 'PROCUREMENT_DASHBOARD'
  | 'MATERIAL_DASHBOARD'
  | 'PO_ANALYSIS'
  | 'VENDOR_PERFORMANCE'
  | 'DELIVERY_PERFORMANCE'
  | 'PURCHASE_SAVINGS'
  | 'MATERIAL_RECONCILIATION'
  | 'CONSUMPTION'
  | 'PRICE_VARIANCE'
  | 'BUDGET_VS_COMMITMENT'
  | 'EXCEPTION_REPORT';

export interface ReportFilter {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN';
  value: any;
}

// ============================================================
// 20. AUDIT TRAIL
// ============================================================
export interface CrossModuleAudit {
  id: string;
  eventType: string;
  transactionType: string;
  transactionId: string;
  transactionNumber: string;
  projectId?: string;
  materialId?: string;
  vendorId?: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================
// BUILDCORE ERP - MASTER DATA TYPES
// Part 02: Enterprise Organization & Financial Structure
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. COMPANY MASTER
// ============================================================
export interface CompanyMaster {
  id: string;
  companyId: string;
  companyCode: string;
  legalName: string;
  tradeName: string;
  companyType: 'PRIVATE_LIMITED' | 'PUBLIC_LIMITED' | 'LLP' | 'PARTNERSHIP' | 'PROPRIETORSHIP' | 'OTHER';
  registrationNumber: string;
  cinNumber?: string;
  panNumber: string;
  gstin: string;
  tanNumber?: string;
  msmeUdyam?: string;
  registeredAddress: Address;
  corporateAddress: Address;
  billingAddress: Address;
  contactNumber: string;
  email: string;
  website?: string;
  logo?: string;
  authorizedSignatory: string;
  financialYearId: string;
  baseCurrencyId: string;
  taxConfigId?: string;
  bankAccounts: BankAccount[];
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface Address {
  line1: string;
  line2?: string;
  state: string;
  district: string;
  city: string;
  pin: string;
  country: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'CURRENT' | 'SAVINGS' | 'OD' | 'CC';
  isDefault: boolean;
  status: EntityStatus;
}

// ============================================================
// 2. BUSINESS UNIT
// ============================================================
export interface BusinessUnitMaster {
  id: string;
  companyId: string;
  code: string;
  name: string;
  description?: string;
  headId?: string;
  headName?: string;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 3. BRANCH MASTER
// ============================================================
export interface BranchMaster {
  id: string;
  companyId: string;
  businessUnitId: string;
  branchCode: string;
  branchName: string;
  address: Address;
  gstRegistration?: string;
  branchManagerId?: string;
  branchManagerName?: string;
  contactNumber: string;
  email?: string;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 4. DEPARTMENT MASTER
// ============================================================
export interface DepartmentMaster {
  id: string;
  companyId: string;
  departmentCode: string;
  departmentName: string;
  parentId?: string;
  parentName?: string;
  headId?: string;
  headName?: string;
  isSystem: boolean;
  sortOrder: number;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 5. DESIGNATION MASTER
// ============================================================
export interface DesignationMaster {
  id: string;
  companyId: string;
  designationCode: string;
  designationName: string;
  departmentId?: string;
  departmentName?: string;
  grade?: string;
  level: number;
  approvalAuthority: ApprovalAuthority;
  financialAuthority: FinancialAuthority;
  isSystem: boolean;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface ApprovalAuthority {
  maxPOValue?: number;
  maxBillValue?: number;
  maxPaymentValue?: number;
  maxContractValue?: number;
  canApproveLeave: boolean;
  canApproveExpense: boolean;
  canApprovePurchase: boolean;
  canApproveContract: boolean;
}

export interface FinancialAuthority {
  maxLimit: number;
  currencyId: string;
  transactionTypes: string[];
}

// ============================================================
// 6. LOCATION MASTER
// ============================================================
export interface LocationMaster {
  id: string;
  companyId: string;
  locationCode: string;
  locationName: string;
  locationType: 'COUNTRY' | 'STATE' | 'DISTRICT' | 'CITY' | 'PIN' | 'BRANCH' | 'PROJECT' | 'SITE' | 'WAREHOUSE' | 'STORE' | 'PLANT' | 'OFFICE';
  parentId?: string;
  parentName?: string;
  pin?: string;
  latitude?: number;
  longitude?: number;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 7. FINANCIAL YEAR
// ============================================================
export interface FinancialYear {
  id: string;
  companyId: string;
  fyName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isClosed: boolean;
  closedDate?: string;
  closedBy?: string;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 8. PERIOD CONTROL
// ============================================================
export interface AccountingPeriod {
  id: string;
  companyId: string;
  financialYearId: string;
  fyName: string;
  periodNumber: number;
  periodName: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED' | 'LOCKED';
  closedDate?: string;
  closedBy?: string;
  reopenedDate?: string;
  reopenedBy?: string;
  reopenReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 9. CURRENCY MASTER
// ============================================================
export interface CurrencyMaster {
  id: string;
  companyId: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  decimalPlaces: number;
  isBase: boolean;
  exchangeRates: ExchangeRate[];
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface ExchangeRate {
  id: string;
  fromCurrencyId: string;
  toCurrencyId: string;
  rate: number;
  effectiveDate: string;
  endDate?: string;
}

// ============================================================
// 10. TAX MASTER
// ============================================================
export interface TaxMaster {
  id: string;
  companyId: string;
  taxCode: string;
  taxName: string;
  taxType: 'GST' | 'CGST' | 'SGST' | 'IGST' | 'CESS' | 'TDS' | 'TCS' | 'VAT' | 'ENTRY_TAX' | 'LBT' | 'OTHER';
  rate: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isCompound: boolean;
  parentTaxId?: string;
  description?: string;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 11. UOM MASTER
// ============================================================
export interface UOMMaster {
  id: string;
  companyId: string;
  uomCode: string;
  uomName: string;
  uomCategory: 'QUANTITY' | 'WEIGHT' | 'VOLUME' | 'LENGTH' | 'AREA' | 'TIME' | 'COUNT' | 'OTHER';
  decimalPlaces: number;
  isSystem: boolean;
  conversions: UOMConversion[];
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface UOMConversion {
  id: string;
  fromUOMId: string;
  toUOMId: string;
  conversionFactor: number;
  isBidirectional: boolean;
}

// ============================================================
// 12. PAYMENT TERMS
// ============================================================
export interface PaymentTermsMaster {
  id: string;
  companyId: string;
  termsCode: string;
  termsName: string;
  creditDays: number;
  paymentType: 'IMMEDIATE' | 'CREDIT_DAYS' | 'MILESTONE' | 'RETENTION' | 'ADVANCE' | 'PARTIAL' | 'CUSTOM';
  description?: string;
  milestones?: PaymentMilestone[];
  retentionPercent?: number;
  advancePercent?: number;
  isSystem: boolean;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface PaymentMilestone {
  id: string;
  sequence: number;
  description: string;
  percent: number;
  linkedToActivity?: string;
}

// ============================================================
// 13. COST CODE MASTER
// ============================================================
export interface CostCodeMaster {
  id: string;
  companyId: string;
  projectId?: string;
  costCode: string;
  costCodeName: string;
  parentId?: string;
  parentName?: string;
  level: number;
  fullPath: string;
  category: 'LABOUR' | 'MATERIAL' | 'PLANT' | 'OVERHEAD' | 'SUBCONTRACT' | 'OTHER';
  isProjectSpecific: boolean;
  budget?: number;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 14. WBS MASTER (Extended)
// ============================================================
export interface WBSMaster {
  id: string;
  companyId: string;
  projectId: string;
  wbsCode: string;
  wbsName: string;
  parentId?: string;
  parentName?: string;
  level: number;
  fullPath: string;
  budget: number;
  actual: number;
  responsibleId?: string;
  responsibleName?: string;
  startDate?: string;
  endDate?: string;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 15. DOCUMENT TYPE MASTER
// ============================================================
export interface DocumentTypeMaster {
  id: string;
  companyId: string;
  docTypeCode: string;
  docTypeName: string;
  module: string;
  numberSeriesId?: string;
  workflowId?: string;
  requiredAttachments: number;
  mandatoryFields: string[];
  printTemplateId?: string;
  financialPosting: boolean;
  postingType?: 'DEBIT' | 'CREDIT' | 'BOTH' | 'NONE';
  isSystem: boolean;
  sortOrder: number;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 16. STATUS MASTER
// ============================================================
export interface StatusMaster {
  id: string;
  companyId: string;
  statusCode: string;
  statusName: string;
  module: string;
  category: 'TRANSACTION' | 'MASTER' | 'SYSTEM';
  color: string;
  icon?: string;
  isSystem: boolean;
  allowTransitionTo: string[];
  sortOrder: number;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 17. APPROVAL AUTHORITY MASTER
// ============================================================
export interface ApprovalAuthorityMaster {
  id: string;
  companyId: string;
  userId?: string;
  userName?: string;
  roleId?: string;
  roleName?: string;
  departmentId?: string;
  departmentName?: string;
  projectId?: string;
  projectName?: string;
  siteId?: string;
  siteName?: string;
  transactionType: string;
  approvalLevel: number;
  financialLimit: number;
  currencyId: string;
  isDelegation: boolean;
  delegatedFrom?: string;
  delegationFrom?: string;
  delegationTo?: string;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 18-20. MASTER DATA GOVERNANCE
// ============================================================
export type MasterStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'ARCHIVED';

export interface MasterDataChangeLog {
  id: string;
  companyId: string;
  entityType: string;
  entityId: string;
  entityName: string;
  fieldName: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  changedByName: string;
  changedAt: string;
  reason: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// ============================================================
// 23. COMPANY DASHBOARD KPIs
// ============================================================
export interface CompanyDashboardKPIs {
  activeProjects: number;
  totalContractValue: number;
  totalBilling: number;
  totalReceivables: number;
  totalPayables: number;
  cashBankBalance: number;
  openPOs: number;
  stockValue: number;
  totalManpower: number;
  activePlant: number;
  openRisks: number;
  pendingApprovals: number;
  fyTarget: number;
  fyAchieved: number;
}

// ============================================================
// NUMBER SERIES (for document types)
// ============================================================
export interface NumberSeriesMaster {
  id: string;
  companyId: string;
  seriesCode: string;
  seriesName: string;
  prefix: string;
  includeYear: boolean;
  includeProject: boolean;
  includeBranch: boolean;
  sequenceLength: number;
  currentSequence: number;
  resetFrequency: 'NEVER' | 'YEARLY' | 'MONTHLY' | 'DAILY';
  lastResetAt?: string;
  separator: string;
  status: MasterStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

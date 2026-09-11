// ============================================================
// BUILDCORE ERP - FINANCE & ACCOUNTS TYPES
// Part 24: Complete Finance & Accounts Module
// ============================================================

// ============================================================
// 1. CHART OF ACCOUNTS
// ============================================================
export interface ChartOfAccount {
  id: string;
  companyId: string;
  accountCode: string;
  accountName: string;
  parentId?: string;
  accountType: AccountType;
  isControlAccount: boolean;
  projectId?: string;
  costCenterId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = 
  | 'ASSET'
  | 'LIABILITY'
  | 'EQUITY'
  | 'REVENUE'
  | 'DIRECT_COST'
  | 'INDIRECT_COST'
  | 'EXPENSE'
  | 'TAX';

// ============================================================
// 2. JOURNAL ENGINE
// ============================================================
export interface JournalEntry {
  id: string;
  companyId: string;
  journalNumber: string;
  journalType: JournalType;
  journalDate: string;
  reference?: string;
  description: string;
  projectId?: string;
  costCenterId?: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: JournalStatus;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  postedBy?: string;
  postedAt?: string;
}

export type JournalType =
  | 'JOURNAL'
  | 'PAYMENT'
  | 'RECEIPT'
  | 'CONTRA'
  | 'PURCHASE'
  | 'SALES'
  | 'DEBIT_NOTE'
  | 'CREDIT_NOTE'
  | 'PAYROLL'
  | 'ADVANCE'
  | 'ADJUSTMENT'
  | 'REVERSAL';

export interface JournalLine {
  id: string;
  journalId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  projectId?: string;
  costCenterId?: string;
  debit: number;
  credit: number;
  description?: string;
}

export type JournalStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED' | 'CANCELLED';

// ============================================================
// 3. ACCOUNTS PAYABLE
// ============================================================
export interface AccountsPayable {
  id: string;
  companyId: string;
  vendorId: string;
  vendorName: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  advanceAmount: number;
  creditNoteAmount: number;
  debitNoteAmount: number;
  projectId?: string;
  poId?: string;
  grnId?: string;
  threeWayMatchStatus: FinanceThreeWayMatchStatus;
  status: APStatus;
  createdAt: string;
  updatedAt: string;
}

export type FinanceThreeWayMatchStatus = 'PENDING' | 'MATCHED' | 'MISMATCH';
export type APStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';

// ============================================================
// 4. ACCOUNTS RECEIVABLE
// ============================================================
export interface AccountsReceivable {
  id: string;
  companyId: string;
  clientId: string;
  clientName: string;
  billId: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  billAmount: number;
  certifiedAmount: number;
  receivedAmount: number;
  outstandingAmount: number;
  projectId: string;
  contractId?: string;
  status: ARStatus;
  createdAt: string;
  updatedAt: string;
}

export type ARStatus = 'DRAFT' | 'SUBMITTED' | 'CERTIFIED' | 'INVOICED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'OVERDUE' | 'CANCELLED';

// ============================================================
// 5. BANK MANAGEMENT
// ============================================================
export interface FinanceBankAccount {
  id: string;
  companyId: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: BankAccountType;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BankAccountType = 'CURRENT' | 'SAVINGS' | 'OVERDRAFT' | 'CASH' | 'PETTY_CASH';

export interface BankTransaction {
  id: string;
  companyId: string;
  bankAccountId: string;
  transactionDate: string;
  transactionType: BankTransactionType;
  amount: number;
  reference?: string;
  description: string;
  partyName?: string;
  journalEntryId?: string;
  isReconciled: boolean;
  reconciliationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type BankTransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'RECEIPT' | 'CHARGE' | 'INTEREST';

export interface BankReconciliation {
  id: string;
  companyId: string;
  bankAccountId: string;
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  statementTransactions: BankStatementTransaction[];
  matchedTransactions: string[];
  unmatchedTransactions: string[];
  bankCharges: number;
  interest: number;
  reconciledBalance: number;
  status: 'DRAFT' | 'RECONCILED';
  createdAt: string;
  updatedAt: string;
}

export interface BankStatementTransaction {
  id: string;
  reconciliationId: string;
  transactionDate: string;
  description: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL';
  isMatched: boolean;
  matchedTransactionId?: string;
}

// ============================================================
// 6. TAX ENGINE
// ============================================================
export interface TaxRule {
  id: string;
  companyId: string;
  taxCode: string;
  taxName: string;
  taxType: TaxType;
  rate: number;
  effectiveFrom: string;
  effectiveTo?: string;
  applicability: TaxApplicability;
  debitAccountId?: string;
  creditAccountId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaxType = 'GST' | 'CGST' | 'SGST' | 'IGST' | 'TDS' | 'TCS' | 'CESS' | 'OTHER';
export type TaxApplicability = 'ALL' | 'GOODS' | 'SERVICES' | 'SPECIFIC';

// ============================================================
// 7. PROJECT COSTING
// ============================================================
export interface ProjectCost {
  id: string;
  companyId: string;
  projectId: string;
  wbsId?: string;
  costCodeId?: string;
  costCategory: CostCategory;
  costDate: string;
  amount: number;
  description: string;
  referenceType?: string;
  referenceId?: string;
  journalEntryId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CostCategory = 
  | 'MATERIAL'
  | 'LABOUR'
  | 'PLANT'
  | 'SUBCONTRACT'
  | 'TRANSPORT'
  | 'SITE_OVERHEAD'
  | 'HO_OVERHEAD'
  | 'OTHER';

// ============================================================
// 8. BUDGET
// ============================================================
export interface FinanceProjectBudget {
  id: string;
  companyId: string;
  projectId: string;
  budgetType: BudgetType;
  budgetAmount: number;
  commitmentAmount: number;
  actualAmount: number;
  forecastAmount: number;
  varianceAmount: number;
  variancePercent: number;
  warningThreshold: number;
  hardStopThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export type BudgetType = 'ORIGINAL' | 'REVISED' | 'FORECAST';

// ============================================================
// 9. PROJECT PROFITABILITY
// ============================================================
export interface FinanceProjectProfitability {
  id: string;
  companyId: string;
  projectId: string;
  period: string;
  revenue: number;
  directCosts: number;
  indirectCosts: number;
  grossProfit: number;
  grossProfitMargin: number;
  netProfit: number;
  netProfitMargin: number;
  costVariance: number;
  costVariancePercent: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 10. CASH FLOW
// ============================================================
export interface CashFlow {
  id: string;
  companyId: string;
  period: string;
  openingCash: number;
  expectedReceipts: number;
  expectedPayments: number;
  payroll: number;
  tax: number;
  vendorDues: number;
  projectExpenses: number;
  closingCash: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 11. PERIOD CLOSE
// ============================================================
export interface FinancialPeriod {
  id: string;
  companyId: string;
  periodName: string;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
  closedBy?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PeriodStatus = 'OPEN' | 'CLOSING' | 'CLOSED';

// ============================================================
// 12. FINANCIAL REPORTS
// ============================================================
export interface TrialBalance {
  id: string;
  companyId: string;
  asOfDate: string;
  accounts: TrialBalanceLine[];
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
}

export interface TrialBalanceLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface ProfitAndLoss {
  id: string;
  companyId: string;
  period: string;
  revenue: number;
  directCosts: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  otherIncome: number;
  otherExpenses: number;
  profitBeforeTax: number;
  tax: number;
  netProfit: number;
  createdAt: string;
}

export interface BalanceSheet {
  id: string;
  companyId: string;
  asOfDate: string;
  assets: BalanceSheetLine[];
  liabilities: BalanceSheetLine[];
  equity: BalanceSheetLine[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  createdAt: string;
}

export interface BalanceSheetLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
}

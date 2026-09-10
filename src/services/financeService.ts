// ============================================================
// BUILDCORE ERP - FINANCE & ACCOUNTS SERVICE
// Part 24: Complete Finance & Accounts Module
// ============================================================

import type {
  ChartOfAccount,
  JournalEntry,
  AccountsPayable,
  AccountsReceivable,
  FinanceBankAccount,
  BankTransaction,
  BankReconciliation,
  TaxRule,
  ProjectCost,
  FinanceProjectBudget,
  FinanceProjectProfitability,
  CashFlow,
  FinancialPeriod
} from '../types/finance';

export class FinanceService {
  private static instance: FinanceService;
  
  private chartOfAccounts: Map<string, ChartOfAccount> = new Map();
  private journalEntries: Map<string, JournalEntry> = new Map();
  private accountsPayable: Map<string, AccountsPayable> = new Map();
  private accountsReceivable: Map<string, AccountsReceivable> = new Map();
  private bankAccounts: Map<string, FinanceBankAccount> = new Map();
  private bankTransactions: Map<string, BankTransaction> = new Map();
  private bankReconciliations: Map<string, BankReconciliation> = new Map();
  private taxRules: Map<string, TaxRule> = new Map();
  private projectCosts: Map<string, ProjectCost> = new Map();
  private projectBudgets: Map<string, FinanceProjectBudget> = new Map();
  private projectProfitability: Map<string, FinanceProjectProfitability> = new Map();
  private cashFlows: Map<string, CashFlow> = new Map();
  private financialPeriods: Map<string, FinancialPeriod> = new Map();

  private constructor() {}

  static getInstance(): FinanceService {
    if (!FinanceService.instance) {
      FinanceService.instance = new FinanceService();
    }
    return FinanceService.instance;
  }

  // ============================================================
  // CHART OF ACCOUNTS
  // ============================================================

  createAccount(account: Omit<ChartOfAccount, 'id' | 'createdAt' | 'updatedAt'>): ChartOfAccount {
    const id = `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAccount: ChartOfAccount = {
      ...account,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.chartOfAccounts.set(id, newAccount);
    return newAccount;
  }

  getAccount(id: string): ChartOfAccount | undefined {
    return this.chartOfAccounts.get(id);
  }

  getAccountsByType(companyId: string, accountType: string): ChartOfAccount[] {
    return Array.from(this.chartOfAccounts.values()).filter(
      acc => acc.companyId === companyId && acc.accountType === accountType
    );
  }

  getAllAccounts(companyId: string): ChartOfAccount[] {
    return Array.from(this.chartOfAccounts.values()).filter(acc => acc.companyId === companyId);
  }

  // ============================================================
  // JOURNAL ENGINE
  // ============================================================

  createJournalEntry(entry: Omit<JournalEntry, 'id' | 'totalDebit' | 'totalCredit' | 'createdAt'>): JournalEntry | null {
    // Validate double-entry
    const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return null; // Debit and credit must match
    }

    const id = `je_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const journalNumber = this.generateJournalNumber(entry.companyId, entry.journalType);

    const newEntry: JournalEntry = {
      ...entry,
      id,
      journalNumber,
      totalDebit,
      totalCredit,
      createdAt: new Date().toISOString()
    };

    this.journalEntries.set(id, newEntry);
    return newEntry;
  }

  getJournalEntry(id: string): JournalEntry | undefined {
    return this.journalEntries.get(id);
  }

  getJournalEntries(companyId: string, period?: string): JournalEntry[] {
    let entries = Array.from(this.journalEntries.values()).filter(
      je => je.companyId === companyId
    );
    if (period) {
      entries = entries.filter(je => je.journalDate.startsWith(period));
    }
    return entries;
  }

  postJournalEntry(id: string, postedBy: string): boolean {
    const entry = this.journalEntries.get(id);
    if (!entry || entry.status !== 'APPROVED') {
      return false;
    }

    entry.status = 'POSTED';
    entry.postedBy = postedBy;
    entry.postedAt = new Date().toISOString();

    return true;
  }

  private generateJournalNumber(companyId: string, journalType: string): string {
    const prefix = journalType.substring(0, 2);
    const count = Array.from(this.journalEntries.values()).filter(
      je => je.companyId === companyId && je.journalType === journalType
    ).length + 1;
    return `${prefix}-${new Date().getFullYear()}-${String(count).padStart(6, '0')}`;
  }

  // ============================================================
  // ACCOUNTS PAYABLE
  // ============================================================

  createAccountsPayable(ap: Omit<AccountsPayable, 'id' | 'outstandingAmount' | 'createdAt' | 'updatedAt'>): AccountsPayable {
    const id = `ap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const outstandingAmount = ap.invoiceAmount - ap.paidAmount - ap.creditNoteAmount + ap.debitNoteAmount;

    const newAP: AccountsPayable = {
      ...ap,
      id,
      outstandingAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.accountsPayable.set(id, newAP);
    return newAP;
  }

  getAccountsPayable(id: string): AccountsPayable | undefined {
    return this.accountsPayable.get(id);
  }

  getAccountsPayablesByVendor(companyId: string, vendorId: string): AccountsPayable[] {
    return Array.from(this.accountsPayable.values()).filter(
      ap => ap.companyId === companyId && ap.vendorId === vendorId
    );
  }

  getAllAccountsPayables(companyId: string): AccountsPayable[] {
    return Array.from(this.accountsPayable.values()).filter(ap => ap.companyId === companyId);
  }

  makePayment(apId: string, amount: number): boolean {
    const ap = this.accountsPayable.get(apId);
    if (!ap || amount > ap.outstandingAmount) {
      return false;
    }

    ap.paidAmount += amount;
    ap.outstandingAmount = ap.invoiceAmount - ap.paidAmount - ap.creditNoteAmount + ap.debitNoteAmount;
    ap.status = ap.outstandingAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';
    ap.updatedAt = new Date().toISOString();

    return true;
  }

  // ============================================================
  // ACCOUNTS RECEIVABLE
  // ============================================================

  createAccountsReceivable(ar: Omit<AccountsReceivable, 'id' | 'outstandingAmount' | 'createdAt' | 'updatedAt'>): AccountsReceivable {
    const id = `ar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const outstandingAmount = ar.billAmount - ar.receivedAmount;

    const newAR: AccountsReceivable = {
      ...ar,
      id,
      outstandingAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.accountsReceivable.set(id, newAR);
    return newAR;
  }

  getAccountsReceivable(id: string): AccountsReceivable | undefined {
    return this.accountsReceivable.get(id);
  }

  getAccountsReceivablesByClient(companyId: string, clientId: string): AccountsReceivable[] {
    return Array.from(this.accountsReceivable.values()).filter(
      ar => ar.companyId === companyId && ar.clientId === clientId
    );
  }

  getAllAccountsReceivables(companyId: string): AccountsReceivable[] {
    return Array.from(this.accountsReceivable.values()).filter(ar => ar.companyId === companyId);
  }

  receivePayment(arId: string, amount: number): boolean {
    const ar = this.accountsReceivable.get(arId);
    if (!ar || amount > ar.outstandingAmount) {
      return false;
    }

    ar.receivedAmount += amount;
    ar.outstandingAmount = ar.billAmount - ar.receivedAmount;
    ar.status = ar.outstandingAmount === 0 ? 'RECEIVED' : 'PARTIALLY_RECEIVED';
    ar.updatedAt = new Date().toISOString();

    return true;
  }

  // ============================================================
  // BANK MANAGEMENT
  // ============================================================

  createBankAccount(account: Omit<FinanceBankAccount, 'id' | 'createdAt' | 'updatedAt'>): FinanceBankAccount {
    const id = `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAccount: FinanceBankAccount = {
      ...account,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.bankAccounts.set(id, newAccount);
    return newAccount;
  }

  getBankAccount(id: string): FinanceBankAccount | undefined {
    return this.bankAccounts.get(id);
  }

  getAllBankAccounts(companyId: string): FinanceBankAccount[] {
    return Array.from(this.bankAccounts.values()).filter(ba => ba.companyId === companyId);
  }

  createBankTransaction(transaction: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>): BankTransaction {
    const id = `bt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTransaction: BankTransaction = {
      ...transaction,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update bank account balance
    const bankAccount = this.bankAccounts.get(transaction.bankAccountId);
    if (bankAccount) {
      if (transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'RECEIPT') {
        bankAccount.balance += transaction.amount;
      } else if (transaction.transactionType === 'WITHDRAWAL' || transaction.transactionType === 'PAYMENT') {
        bankAccount.balance -= transaction.amount;
      }
      bankAccount.updatedAt = new Date().toISOString();
    }

    this.bankTransactions.set(id, newTransaction);
    return newTransaction;
  }

  getBankTransactions(bankAccountId: string): BankTransaction[] {
    return Array.from(this.bankTransactions.values()).filter(
      bt => bt.bankAccountId === bankAccountId
    );
  }

  // ============================================================
  // BANK RECONCILIATION
  // ============================================================

  createBankReconciliation(reconciliation: Omit<BankReconciliation, 'id' | 'reconciledBalance' | 'createdAt' | 'updatedAt'>): BankReconciliation {
    const id = `br_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const reconciledBalance = reconciliation.openingBalance + 
      reconciliation.statementTransactions
        .filter(t => t.transactionType === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0) -
      reconciliation.statementTransactions
        .filter(t => t.transactionType === 'WITHDRAWAL')
        .reduce((sum, t) => sum + t.amount, 0) +
      reconciliation.interest -
      reconciliation.bankCharges;

    const newReconciliation: BankReconciliation = {
      ...reconciliation,
      id,
      reconciledBalance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.bankReconciliations.set(id, newReconciliation);
    return newReconciliation;
  }

  getBankReconciliation(id: string): BankReconciliation | undefined {
    return this.bankReconciliations.get(id);
  }

  // ============================================================
  // TAX ENGINE
  // ============================================================

  createTaxRule(rule: Omit<TaxRule, 'id' | 'createdAt' | 'updatedAt'>): TaxRule {
    const id = `tax_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRule: TaxRule = {
      ...rule,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.taxRules.set(id, newRule);
    return newRule;
  }

  getTaxRule(id: string): TaxRule | undefined {
    return this.taxRules.get(id);
  }

  getActiveTaxRules(companyId: string, taxType?: string): TaxRule[] {
    let rules = Array.from(this.taxRules.values()).filter(
      rule => rule.companyId === companyId && rule.isActive
    );
    if (taxType) {
      rules = rules.filter(rule => rule.taxType === taxType);
    }
    return rules;
  }

  calculateTax(amount: number, taxRuleId: string): number {
    const rule = this.taxRules.get(taxRuleId);
    if (!rule) return 0;
    return amount * (rule.rate / 100);
  }

  // ============================================================
  // PROJECT COSTING
  // ============================================================

  createProjectCost(cost: Omit<ProjectCost, 'id' | 'createdAt' | 'updatedAt'>): ProjectCost {
    const id = `pc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCost: ProjectCost = {
      ...cost,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projectCosts.set(id, newCost);
    return newCost;
  }

  getProjectCosts(projectId: string, category?: string): ProjectCost[] {
    let costs = Array.from(this.projectCosts.values()).filter(
      pc => pc.projectId === projectId
    );
    if (category) {
      costs = costs.filter(pc => pc.costCategory === category);
    }
    return costs;
  }

  getTotalProjectCost(projectId: string): number {
    return this.getProjectCosts(projectId).reduce((sum, cost) => sum + cost.amount, 0);
  }

  // ============================================================
  // BUDGET MANAGEMENT
  // ============================================================

  createProjectBudget(budget: Omit<FinanceProjectBudget, 'id' | 'varianceAmount' | 'variancePercent' | 'createdAt' | 'updatedAt'>): FinanceProjectBudget {
    const id = `pb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const varianceAmount = budget.budgetAmount - budget.actualAmount;
    const variancePercent = budget.budgetAmount > 0 ? (varianceAmount / budget.budgetAmount) * 100 : 0;

    const newBudget: FinanceProjectBudget = {
      ...budget,
      id,
      varianceAmount,
      variancePercent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.projectBudgets.set(id, newBudget);
    return newBudget;
  }

  getProjectBudget(id: string): FinanceProjectBudget | undefined {
    return this.projectBudgets.get(id);
  }

  getProjectBudgets(projectId: string): FinanceProjectBudget[] {
    return Array.from(this.projectBudgets.values()).filter(pb => pb.projectId === projectId);
  }

  // ============================================================
  // PROJECT PROFITABILITY
  // ============================================================

  calculateProjectProfitability(companyId: string, projectId: string, period: string): FinanceProjectProfitability {
    // Get revenue from AR
    const revenue = this.getAllAccountsReceivables(companyId)
      .filter(ar => ar.projectId === projectId)
      .reduce((sum, ar) => sum + ar.billAmount, 0);
    
    // Get costs
    const directCosts = this.getProjectCosts(projectId, 'MATERIAL')
      .concat(this.getProjectCosts(projectId, 'LABOUR'))
      .concat(this.getProjectCosts(projectId, 'PLANT'))
      .concat(this.getProjectCosts(projectId, 'SUBCONTRACT'))
      .reduce((sum, cost) => sum + cost.amount, 0);

    const indirectCosts = this.getProjectCosts(projectId, 'SITE_OVERHEAD')
      .concat(this.getProjectCosts(projectId, 'HO_OVERHEAD'))
      .concat(this.getProjectCosts(projectId, 'OTHER'))
      .reduce((sum, cost) => sum + cost.amount, 0);

    const grossProfit = revenue - directCosts;
    const grossProfitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    
    const netProfit = grossProfit - indirectCosts;
    const netProfitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    const totalCosts = directCosts + indirectCosts;
    const budget = this.getProjectBudgets(projectId)[0];
    const costVariance = budget ? budget.budgetAmount - totalCosts : 0;
    const costVariancePercent = budget && budget.budgetAmount > 0 
      ? (costVariance / budget.budgetAmount) * 100 
      : 0;

    const id = `pp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const profitability: FinanceProjectProfitability = {
      id,
      companyId,
      projectId,
      period,
      revenue,
      directCosts,
      indirectCosts,
      grossProfit,
      grossProfitMargin,
      netProfit,
      netProfitMargin,
      costVariance,
      costVariancePercent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.projectProfitability.set(id, profitability);
    return profitability;
  }

  getProjectProfitability(id: string): FinanceProjectProfitability | undefined {
    return this.projectProfitability.get(id);
  }

  // ============================================================
  // CASH FLOW
  // ============================================================

  createCashFlow(cashFlow: Omit<CashFlow, 'id' | 'closingCash' | 'createdAt' | 'updatedAt'>): CashFlow {
    const id = `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const closingCash = cashFlow.openingCash + 
      cashFlow.expectedReceipts - 
      cashFlow.expectedPayments - 
      cashFlow.payroll - 
      cashFlow.tax - 
      cashFlow.vendorDues - 
      cashFlow.projectExpenses;

    const newCashFlow: CashFlow = {
      ...cashFlow,
      id,
      closingCash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.cashFlows.set(id, newCashFlow);
    return newCashFlow;
  }

  getCashFlow(id: string): CashFlow | undefined {
    return this.cashFlows.get(id);
  }

  getCashFlows(companyId: string, period?: string): CashFlow[] {
    let flows = Array.from(this.cashFlows.values()).filter(
      cf => cf.companyId === companyId
    );
    if (period) {
      flows = flows.filter(cf => cf.period === period);
    }
    return flows;
  }

  // ============================================================
  // FINANCIAL PERIODS
  // ============================================================

  createFinancialPeriod(period: Omit<FinancialPeriod, 'id' | 'createdAt' | 'updatedAt'>): FinancialPeriod {
    const id = `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPeriod: FinancialPeriod = {
      ...period,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.financialPeriods.set(id, newPeriod);
    return newPeriod;
  }

  getFinancialPeriod(id: string): FinancialPeriod | undefined {
    return this.financialPeriods.get(id);
  }

  getFinancialPeriods(companyId: string): FinancialPeriod[] {
    return Array.from(this.financialPeriods.values()).filter(
      fp => fp.companyId === companyId
    );
  }

  closePeriod(id: string, closedBy: string): boolean {
    const period = this.financialPeriods.get(id);
    if (!period || period.status !== 'OPEN') {
      return false;
    }

    period.status = 'CLOSED';
    period.closedBy = closedBy;
    period.closedAt = new Date().toISOString();
    period.updatedAt = new Date().toISOString();

    return true;
  }

  // ============================================================
  // FINANCIAL REPORTS
  // ============================================================

  generateTrialBalance(companyId: string, asOfDate: string) {
    const accounts = this.getAllAccounts(companyId);
    const lines = accounts.map(acc => ({
      accountId: acc.id,
      accountCode: acc.accountCode,
      accountName: acc.accountName,
      debit: 0, // Would calculate from journal entries
      credit: 0  // Would calculate from journal entries
    }));

    return {
      id: `tb_${Date.now()}`,
      companyId,
      asOfDate,
      accounts: lines,
      totalDebit: 0,
      totalCredit: 0,
      createdAt: new Date().toISOString()
    };
  }

  generateProfitAndLoss(companyId: string, period: string) {
    // This would aggregate data from journal entries
    return {
      id: `pl_${Date.now()}`,
      companyId,
      period,
      revenue: 0,
      directCosts: 0,
      grossProfit: 0,
      operatingExpenses: 0,
      operatingProfit: 0,
      otherIncome: 0,
      otherExpenses: 0,
      profitBeforeTax: 0,
      tax: 0,
      netProfit: 0,
      createdAt: new Date().toISOString()
    };
  }

  generateBalanceSheet(companyId: string, asOfDate: string) {
    // This would aggregate data from accounts
    return {
      id: `bs_${Date.now()}`,
      companyId,
      asOfDate,
      assets: [],
      liabilities: [],
      equity: [],
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
      createdAt: new Date().toISOString()
    };
  }
}

export const financeService = FinanceService.getInstance();

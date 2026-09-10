// ============================================================
// BUILDCORE ERP - FINANCE & ACCOUNTS STORE
// Part 24: Complete Finance & Accounts Module
// ============================================================

import { create } from 'zustand';
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
import { financeService } from '../services/financeService';

interface FinanceState {
  // Chart of Accounts
  chartOfAccounts: ChartOfAccount[];
  
  // Journal Entries
  journalEntries: JournalEntry[];
  
  // Accounts Payable
  accountsPayable: AccountsPayable[];
  
  // Accounts Receivable
  accountsReceivable: AccountsReceivable[];
  
  // Bank Accounts
  bankAccounts: FinanceBankAccount[];
  bankTransactions: BankTransaction[];
  bankReconciliations: BankReconciliation[];
  
  // Tax Rules
  taxRules: TaxRule[];
  
  // Project Costing
  projectCosts: ProjectCost[];
  
  // Budgets
  projectBudgets: FinanceProjectBudget[];
  
  // Project Profitability
  projectProfitability: FinanceProjectProfitability[];
  
  // Cash Flow
  cashFlows: CashFlow[];
  
  // Financial Periods
  financialPeriods: FinancialPeriod[];
  
  // Actions
  loadChartOfAccounts: (companyId: string) => void;
  createAccount: (account: Omit<ChartOfAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  loadJournalEntries: (companyId: string, period?: string) => void;
  createJournalEntry: (entry: Omit<JournalEntry, 'id' | 'totalDebit' | 'totalCredit' | 'createdAt'>) => boolean;
  postJournalEntry: (id: string, postedBy: string) => boolean;
  
  loadAccountsPayable: (companyId: string) => void;
  createAccountsPayable: (ap: Omit<AccountsPayable, 'id' | 'outstandingAmount' | 'createdAt' | 'updatedAt'>) => void;
  makePayment: (apId: string, amount: number) => boolean;
  
  loadAccountsReceivable: (companyId: string) => void;
  createAccountsReceivable: (ar: Omit<AccountsReceivable, 'id' | 'outstandingAmount' | 'createdAt' | 'updatedAt'>) => void;
  receivePayment: (arId: string, amount: number) => boolean;
  
  loadBankAccounts: (companyId: string) => void;
  createBankAccount: (account: Omit<FinanceBankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  loadBankTransactions: (bankAccountId: string) => void;
  createBankTransaction: (transaction: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  loadBankReconciliations: (companyId: string) => void;
  createBankReconciliation: (reconciliation: Omit<BankReconciliation, 'id' | 'reconciledBalance' | 'createdAt' | 'updatedAt'>) => void;
  
  loadTaxRules: (companyId: string, taxType?: string) => void;
  createTaxRule: (rule: Omit<TaxRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  loadProjectCosts: (projectId: string, category?: string) => void;
  createProjectCost: (cost: Omit<ProjectCost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  loadProjectBudgets: (projectId: string) => void;
  createProjectBudget: (budget: Omit<FinanceProjectBudget, 'id' | 'varianceAmount' | 'variancePercent' | 'createdAt' | 'updatedAt'>) => void;
  
  calculateProjectProfitability: (companyId: string, projectId: string, period: string) => void;
  
  loadCashFlows: (companyId: string, period?: string) => void;
  createCashFlow: (cashFlow: Omit<CashFlow, 'id' | 'closingCash' | 'createdAt' | 'updatedAt'>) => void;
  
  loadFinancialPeriods: (companyId: string) => void;
  createFinancialPeriod: (period: Omit<FinancialPeriod, 'id' | 'createdAt' | 'updatedAt'>) => void;
  closePeriod: (id: string, closedBy: string) => boolean;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  // Initial state
  chartOfAccounts: [],
  journalEntries: [],
  accountsPayable: [],
  accountsReceivable: [],
  bankAccounts: [],
  bankTransactions: [],
  bankReconciliations: [],
  taxRules: [],
  projectCosts: [],
  projectBudgets: [],
  projectProfitability: [],
  cashFlows: [],
  financialPeriods: [],

  // Chart of Accounts actions
  loadChartOfAccounts: (companyId: string) => {
    const accounts = financeService.getAllAccounts(companyId);
    set({ chartOfAccounts: accounts });
  },

  createAccount: (account) => {
    const newAccount = financeService.createAccount(account);
    set(state => ({
      chartOfAccounts: [...state.chartOfAccounts, newAccount]
    }));
  },

  // Journal Entries actions
  loadJournalEntries: (companyId: string, period?: string) => {
    const entries = financeService.getJournalEntries(companyId, period);
    set({ journalEntries: entries });
  },

  createJournalEntry: (entry) => {
    const newEntry = financeService.createJournalEntry(entry);
    if (newEntry) {
      set(state => ({
        journalEntries: [...state.journalEntries, newEntry]
      }));
      return true;
    }
    return false;
  },

  postJournalEntry: (id: string, postedBy: string) => {
    const success = financeService.postJournalEntry(id, postedBy);
    if (success) {
      // Reload journal entries
      const entries = financeService.getJournalEntries('');
      set({ journalEntries: entries });
    }
    return success;
  },

  // Accounts Payable actions
  loadAccountsPayable: (companyId: string) => {
    const ap = financeService.getAllAccountsPayables(companyId);
    set({ accountsPayable: ap });
  },

  createAccountsPayable: (ap) => {
    const newAP = financeService.createAccountsPayable(ap);
    set(state => ({
      accountsPayable: [...state.accountsPayable, newAP]
    }));
  },

  makePayment: (apId: string, amount: number) => {
    const success = financeService.makePayment(apId, amount);
    if (success) {
      // Reload AP
      const ap = financeService.getAllAccountsPayables('');
      set({ accountsPayable: ap });
    }
    return success;
  },

  // Accounts Receivable actions
  loadAccountsReceivable: (companyId: string) => {
    const ar = financeService.getAllAccountsReceivables(companyId);
    set({ accountsReceivable: ar });
  },

  createAccountsReceivable: (ar) => {
    const newAR = financeService.createAccountsReceivable(ar);
    set(state => ({
      accountsReceivable: [...state.accountsReceivable, newAR]
    }));
  },

  receivePayment: (arId: string, amount: number) => {
    const success = financeService.receivePayment(arId, amount);
    if (success) {
      // Reload AR
      const ar = financeService.getAllAccountsReceivables('');
      set({ accountsReceivable: ar });
    }
    return success;
  },

  // Bank accounts actions
  loadBankAccounts: (companyId: string) => {
    const accounts = financeService.getAllBankAccounts(companyId);
    set({ bankAccounts: accounts });
  },

  createBankAccount: (account) => {
    const newAccount = financeService.createBankAccount(account);
    set(state => ({
      bankAccounts: [...state.bankAccounts, newAccount]
    }));
  },

  loadBankTransactions: (bankAccountId: string) => {
    const transactions = financeService.getBankTransactions(bankAccountId);
    set({ bankTransactions: transactions });
  },

  createBankTransaction: (transaction) => {
    const newTransaction = financeService.createBankTransaction(transaction);
    set(state => ({
      bankTransactions: [...state.bankTransactions, newTransaction]
    }));
    // Reload bank accounts to update balance
    const accounts = financeService.getAllBankAccounts('');
    set({ bankAccounts: accounts });
  },

  // Bank Reconciliation actions
  loadBankReconciliations: (companyId: string) => {
    // This would load reconciliations
    set({ bankReconciliations: [] });
  },

  createBankReconciliation: (reconciliation) => {
    const newReconciliation = financeService.createBankReconciliation(reconciliation);
    set(state => ({
      bankReconciliations: [...state.bankReconciliations, newReconciliation]
    }));
  },

  // Tax rules actions
  loadTaxRules: (companyId: string, taxType?: string) => {
    const rules = financeService.getActiveTaxRules(companyId, taxType);
    set({ taxRules: rules });
  },

  createTaxRule: (rule) => {
    const newRule = financeService.createTaxRule(rule);
    set(state => ({
      taxRules: [...state.taxRules, newRule]
    }));
  },

  // Project Costing actions
  loadProjectCosts: (projectId: string, category?: string) => {
    const costs = financeService.getProjectCosts(projectId, category);
    set({ projectCosts: costs });
  },

  createProjectCost: (cost) => {
    const newCost = financeService.createProjectCost(cost);
    set(state => ({
      projectCosts: [...state.projectCosts, newCost]
    }));
  },

  // Budget actions
  loadProjectBudgets: (projectId: string) => {
    const budgets = financeService.getProjectBudgets(projectId);
    set({ projectBudgets: budgets });
  },

  createProjectBudget: (budget) => {
    const newBudget = financeService.createProjectBudget(budget);
    set(state => ({
      projectBudgets: [...state.projectBudgets, newBudget]
    }));
  },

  // Project Profitability actions
  calculateProjectProfitability: (companyId: string, projectId: string, period: string) => {
    const profitability = financeService.calculateProjectProfitability(companyId, projectId, period);
    set(state => ({
      projectProfitability: [...state.projectProfitability, profitability]
    }));
  },

  // Cash Flow actions
  loadCashFlows: (companyId: string, period?: string) => {
    const flows = financeService.getCashFlows(companyId, period);
    set({ cashFlows: flows });
  },

  createCashFlow: (cashFlow) => {
    const newCashFlow = financeService.createCashFlow(cashFlow);
    set(state => ({
      cashFlows: [...state.cashFlows, newCashFlow]
    }));
  },

  // Financial Period actions
  loadFinancialPeriods: (companyId: string) => {
    const periods = financeService.getFinancialPeriods(companyId);
    set({ financialPeriods: periods });
  },

  createFinancialPeriod: (period) => {
    const newPeriod = financeService.createFinancialPeriod(period);
    set(state => ({
      financialPeriods: [...state.financialPeriods, newPeriod]
    }));
  },

  closePeriod: (id: string, closedBy: string) => {
    const success = financeService.closePeriod(id, closedBy);
    if (success) {
      // Reload periods
      const periods = financeService.getFinancialPeriods('');
      set({ financialPeriods: periods });
    }
    return success;
  },
}));

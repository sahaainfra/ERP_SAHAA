// ============================================================
// BUILDCORE ERP - MASTER DATA STORE
// Part 02: Zustand store for all master data
// ============================================================

import { create } from 'zustand';
import { masterDataService } from '../services/masterService';
import type {
  CompanyMaster, BusinessUnitMaster, BranchMaster, DepartmentMaster,
  DesignationMaster, LocationMaster, FinancialYear, AccountingPeriod,
  CurrencyMaster, TaxMaster, UOMMaster, PaymentTermsMaster,
  CostCodeMaster, DocumentTypeMaster, StatusMaster,
  ApprovalAuthorityMaster, MasterDataChangeLog, CompanyDashboardKPIs
} from '../types/master';

interface MasterDataState {
  // Data
  companies: CompanyMaster[];
  businessUnits: BusinessUnitMaster[];
  branches: BranchMaster[];
  departments: DepartmentMaster[];
  designations: DesignationMaster[];
  locations: LocationMaster[];
  financialYears: FinancialYear[];
  accountingPeriods: AccountingPeriod[];
  currencies: CurrencyMaster[];
  taxes: TaxMaster[];
  uoms: UOMMaster[];
  paymentTerms: PaymentTermsMaster[];
  costCodes: CostCodeMaster[];
  documentTypes: DocumentTypeMaster[];
  statuses: StatusMaster[];
  approvalAuthorities: ApprovalAuthorityMaster[];
  changeLogs: MasterDataChangeLog[];
  dashboardKPIs: CompanyDashboardKPIs | null;
  initialized: boolean;

  // Actions
  initialize: (companyId: string, userId: string) => void;
  refresh: (companyId?: string) => void;
  updateCompany: (id: string, data: Partial<CompanyMaster>, userId: string, reason: string) => void;
  updateFY: (id: string, data: Partial<FinancialYear>, userId: string) => void;
  updatePeriod: (id: string, data: Partial<AccountingPeriod>, userId: string, reason?: string) => void;
}

export const useMasterDataStore = create<MasterDataState>((set, get) => ({
  companies: [],
  businessUnits: [],
  branches: [],
  departments: [],
  designations: [],
  locations: [],
  financialYears: [],
  accountingPeriods: [],
  currencies: [],
  taxes: [],
  uoms: [],
  paymentTerms: [],
  costCodes: [],
  documentTypes: [],
  statuses: [],
  approvalAuthorities: [],
  changeLogs: [],
  dashboardKPIs: null,
  initialized: false,

  initialize: (companyId: string, userId: string) => {
    if (get().initialized) return;
    masterDataService.initializeDemoData(companyId, userId);
    get().refresh(companyId);
    set({ initialized: true });
  },

  refresh: (companyId?: string) => {
    set({
      companies: masterDataService.getCompanies(),
      businessUnits: masterDataService.getBusinessUnits(companyId),
      branches: masterDataService.getBranches(companyId),
      departments: masterDataService.getDepartments(companyId),
      designations: masterDataService.getDesignations(companyId),
      locations: masterDataService.getLocations(companyId),
      financialYears: masterDataService.getFinancialYears(companyId),
      accountingPeriods: masterDataService.getAccountingPeriods(),
      currencies: masterDataService.getCurrencies(companyId),
      taxes: masterDataService.getTaxes(companyId),
      uoms: masterDataService.getUOMs(companyId),
      paymentTerms: masterDataService.getPaymentTerms(companyId),
      costCodes: masterDataService.getCostCodes(companyId),
      documentTypes: masterDataService.getDocumentTypes(companyId),
      statuses: masterDataService.getStatuses(companyId),
      approvalAuthorities: masterDataService.getApprovalAuthorities(companyId),
      changeLogs: masterDataService.getChangeLogs(companyId),
      dashboardKPIs: {
        activeProjects: 5,
        totalContractValue: 12600000000,
        totalBilling: 2437000000,
        totalReceivables: 1850000000,
        totalPayables: 920000000,
        cashBankBalance: 345000000,
        openPOs: 23,
        stockValue: 285000000,
        totalManpower: 2847,
        activePlant: 48,
        openRisks: 7,
        pendingApprovals: 23,
        fyTarget: 8500000000,
        fyAchieved: 2437000000,
      },
    });
  },

  updateCompany: (id, data, userId, reason) => {
    masterDataService.updateCompany(id, data, userId, reason);
    get().refresh();
  },

  updateFY: (id, data, userId) => {
    masterDataService.updateFY(id, data, userId);
    get().refresh();
  },

  updatePeriod: (id, data, userId, reason) => {
    masterDataService.updatePeriod(id, data, userId, reason);
    get().refresh();
  },
}));

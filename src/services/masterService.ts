// ============================================================
// BUILDCORE ERP - MASTER DATA SERVICE
// Part 02: Enterprise Organization & Financial Structure
// Governance, Duplicate Detection, Change History
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  CompanyMaster, BusinessUnitMaster, BranchMaster, DepartmentMaster,
  DesignationMaster, LocationMaster, FinancialYear, AccountingPeriod,
  CurrencyMaster, TaxMaster, UOMMaster, PaymentTermsMaster,
  CostCodeMaster, WBSMaster, DocumentTypeMaster, StatusMaster,
  ApprovalAuthorityMaster, MasterDataChangeLog, MasterStatus,
  NumberSeriesMaster, BankAccount, UOMConversion, ExchangeRate,
  PaymentMilestone
} from '../types/master';

// ============================================================
// MASTER DATA SERVICE
// ============================================================
export class MasterDataService {
  private static instance: MasterDataService;

  // Storage
  private companies: Map<string, CompanyMaster> = new Map();
  private businessUnits: Map<string, BusinessUnitMaster> = new Map();
  private branches: Map<string, BranchMaster> = new Map();
  private departments: Map<string, DepartmentMaster> = new Map();
  private designations: Map<string, DesignationMaster> = new Map();
  private locations: Map<string, LocationMaster> = new Map();
  private financialYears: Map<string, FinancialYear> = new Map();
  private accountingPeriods: Map<string, AccountingPeriod> = new Map();
  private currencies: Map<string, CurrencyMaster> = new Map();
  private taxes: Map<string, TaxMaster> = new Map();
  private uoms: Map<string, UOMMaster> = new Map();
  private paymentTerms: Map<string, PaymentTermsMaster> = new Map();
  private costCodes: Map<string, CostCodeMaster> = new Map();
  private wbs: Map<string, WBSMaster> = new Map();
  private documentTypes: Map<string, DocumentTypeMaster> = new Map();
  private statuses: Map<string, StatusMaster> = new Map();
  private approvalAuthorities: Map<string, ApprovalAuthorityMaster> = new Map();
  private numberSeries: Map<string, NumberSeriesMaster> = new Map();
  private changeLogs: MasterDataChangeLog[] = [];

  static getInstance(): MasterDataService {
    if (!MasterDataService.instance) {
      MasterDataService.instance = new MasterDataService();
    }
    return MasterDataService.instance;
  }

  // ============================================================
  // INITIALIZE DEMO DATA
  // ============================================================
  initializeDemoData(companyId: string, userId: string): void {
    if (this.companies.size > 0) return; // Already initialized

    const now = new Date().toISOString();

    // 1. Company Master
    const company: CompanyMaster = {
      id: 'comp_001',
      companyId,
      companyCode: 'BCI',
      legalName: 'BuildCore Infrastructure Pvt Ltd',
      tradeName: 'BuildCore',
      companyType: 'PRIVATE_LIMITED',
      registrationNumber: 'U45201MH2020PTC123456',
      cinNumber: 'U45201MH2020PTC123456',
      panNumber: 'AABCB1234F',
      gstin: '27AABCB1234F1Z5',
      tanNumber: 'MUMB12345A',
      msmeUdyam: 'UDYAM-MH-01-0123456',
      registeredAddress: { line1: '101, Trade World, Kamala Mills Compound', line2: 'Lower Parel', state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', pin: '400013', country: 'India' },
      corporateAddress: { line1: '101, Trade World, Kamala Mills Compound', line2: 'Lower Parel', state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', pin: '400013', country: 'India' },
      billingAddress: { line1: '101, Trade World, Kamala Mills Compound', line2: 'Lower Parel', state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', pin: '400013', country: 'India' },
      contactNumber: '+91-22-45678900',
      email: 'info@buildcore.in',
      website: 'www.buildcore.in',
      authorizedSignatory: 'Mr. Rajesh Kumar, Director',
      financialYearId: 'fy_001',
      baseCurrencyId: 'cur_inr',
      bankAccounts: [
        { id: 'bank_001', bankName: 'HDFC Bank', branchName: 'Lower Parel Branch', accountNumber: '50100123456789', ifscCode: 'HDFC0000123', accountType: 'CURRENT', isDefault: true, status: 'ACTIVE' },
        { id: 'bank_002', bankName: 'State Bank of India', branchName: 'Dadar Branch', accountNumber: '38123456789', ifscCode: 'SBIN0001234', accountType: 'CURRENT', isDefault: false, status: 'ACTIVE' },
      ],
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      version: 1,
    };
    this.companies.set(company.id, company);

    // 2. Business Units
    const busUnits: BusinessUnitMaster[] = [
      { id: 'bu_001', companyId, code: 'INFRA', name: 'Infrastructure Division', description: 'Roads, bridges, metro, and heavy infrastructure', headId: 'usr_001', headName: 'Rajesh Kumar', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'bu_002', companyId, code: 'BLDG', name: 'Buildings Division', description: 'Commercial and residential buildings', headId: 'usr_002', headName: 'Priya Sharma', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'bu_003', companyId, code: 'IND', name: 'Industrial Division', description: 'Industrial plants and infrastructure', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    busUnits.forEach(bu => this.businessUnits.set(bu.id, bu));

    // 3. Branches
    const branches: BranchMaster[] = [
      { id: 'br_001', companyId, businessUnitId: 'bu_001', branchCode: 'MHO', branchName: 'Mumbai Head Office', address: { line1: '101, Trade World', line2: 'Lower Parel', state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', pin: '400013', country: 'India' }, gstRegistration: '27AABCB1234F1Z5', branchManagerId: 'usr_001', branchManagerName: 'Rajesh Kumar', contactNumber: '+91-22-45678900', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'br_002', companyId, businessUnitId: 'bu_001', branchCode: 'PNO', branchName: 'Pune Regional Office', address: { line1: '205, ICC Trade Tower', line2: 'Senapati Bapat Road', state: 'Maharashtra', district: 'Pune', city: 'Pune', pin: '411016', country: 'India' }, gstRegistration: '27AABCB1234F1Z5', contactNumber: '+91-20-25678900', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'br_003', companyId, businessUnitId: 'bu_002', branchCode: 'CHO', branchName: 'Chennai Office', address: { line1: '15, Whites Road', line2: 'Royapettah', state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', pin: '600014', country: 'India' }, gstRegistration: '33AABCB1234F1Z3', contactNumber: '+91-44-25678900', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    branches.forEach(br => this.branches.set(br.id, br));

    // 4. Departments
    const deptNames = [
      { code: 'MGT', name: 'Management', isSystem: true, sort: 1 },
      { code: 'PROJ', name: 'Projects', isSystem: true, sort: 2 },
      { code: 'CIVIL', name: 'Civil', isSystem: true, sort: 3 },
      { code: 'PLAN', name: 'Planning', isSystem: true, sort: 4 },
      { code: 'QS', name: 'Quantity Surveying', isSystem: true, sort: 5 },
      { code: 'COMM', name: 'Commercial', isSystem: true, sort: 6 },
      { code: 'CONT', name: 'Contracts', isSystem: true, sort: 7 },
      { code: 'PROC', name: 'Procurement', isSystem: true, sort: 8 },
      { code: 'PURCH', name: 'Purchase', isSystem: true, sort: 9 },
      { code: 'STORE', name: 'Stores', isSystem: true, sort: 10 },
      { code: 'ACCT', name: 'Accounts', isSystem: true, sort: 11 },
      { code: 'FIN', name: 'Finance', isSystem: true, sort: 12 },
      { code: 'HR', name: 'Human Resources', isSystem: true, sort: 13 },
      { code: 'ADMIN', name: 'Administration', isSystem: true, sort: 14 },
      { code: 'QAQC', name: 'QA/QC', isSystem: true, sort: 15 },
      { code: 'HSE', name: 'Safety/HSE', isSystem: true, sort: 16 },
      { code: 'PLANT', name: 'Plant & Machinery', isSystem: true, sort: 17 },
      { code: 'RMC', name: 'RMC', isSystem: true, sort: 18 },
      { code: 'TND', name: 'Tender', isSystem: true, sort: 19 },
      { code: 'IT', name: 'Information Technology', isSystem: true, sort: 20 },
      { code: 'LEGAL', name: 'Legal', isSystem: true, sort: 21 },
    ];
    deptNames.forEach(d => {
      const dept: DepartmentMaster = {
        id: `dept_${d.code.toLowerCase()}`,
        companyId,
        departmentCode: d.code,
        departmentName: d.name,
        isSystem: d.isSystem,
        sortOrder: d.sort,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      };
      this.departments.set(dept.id, dept);
    });

    // 5. Designations
    const desigs = [
      { code: 'CMD', name: 'Chairman & MD', level: 1, grade: 'A1', finLimit: 1000000000 },
      { code: 'DIR', name: 'Director', level: 2, grade: 'A2', finLimit: 500000000 },
      { code: 'GM', name: 'General Manager', level: 3, grade: 'B1', finLimit: 100000000 },
      { code: 'DGM', name: 'Deputy General Manager', level: 4, grade: 'B2', finLimit: 50000000 },
      { code: 'AGM', name: 'Assistant General Manager', level: 5, grade: 'C1', finLimit: 25000000 },
      { code: 'PM', name: 'Project Manager', level: 6, grade: 'C2', finLimit: 10000000 },
      { code: 'DPM', name: 'Deputy Project Manager', level: 7, grade: 'D1', finLimit: 5000000 },
      { code: 'SE', name: 'Senior Engineer', level: 8, grade: 'D2', finLimit: 2000000 },
      { code: 'ENGR', name: 'Engineer', level: 9, grade: 'E1', finLimit: 1000000 },
      { code: 'JE', name: 'Junior Engineer', level: 10, grade: 'E2', finLimit: 500000 },
      { code: 'SUPR', name: 'Supervisor', level: 11, grade: 'F1', finLimit: 200000 },
      { code: 'ACCT', name: 'Accountant', level: 8, grade: 'D2', finLimit: 5000000 },
      { code: 'STORE', name: 'Store Keeper', level: 11, grade: 'F1', finLimit: 100000 },
    ];
    desigs.forEach(d => {
      const desig: DesignationMaster = {
        id: `desig_${d.code.toLowerCase()}`,
        companyId,
        designationCode: d.code,
        designationName: d.name,
        level: d.level,
        grade: d.grade,
        approvalAuthority: { canApproveLeave: d.level <= 8, canApproveExpense: d.level <= 7, canApprovePurchase: d.level <= 6, canApproveContract: d.level <= 4 },
        financialAuthority: { maxLimit: d.finLimit, currencyId: 'cur_inr', transactionTypes: ['PO', 'PAYMENT', 'BILL', 'JV'] },
        isSystem: true,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      };
      this.designations.set(desig.id, desig);
    });

    // 7. Financial Years
    const fys: FinancialYear[] = [
      { id: 'fy_2023', companyId, fyName: '2023-24', startDate: '2023-04-01', endDate: '2024-03-31', isCurrent: false, isClosed: true, closedDate: '2024-05-15', closedBy: userId, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'fy_2024', companyId, fyName: '2024-25', startDate: '2024-04-01', endDate: '2025-03-31', isCurrent: false, isClosed: true, closedDate: '2025-05-10', closedBy: userId, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'fy_001', companyId, fyName: '2025-26', startDate: '2025-04-01', endDate: '2026-03-31', isCurrent: true, isClosed: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    fys.forEach(fy => this.financialYears.set(fy.id, fy));

    // 8. Accounting Periods (for current FY)
    const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    months.forEach((month, i) => {
      const period: AccountingPeriod = {
        id: `period_${i + 1}`,
        companyId,
        financialYearId: 'fy_001',
        fyName: '2025-26',
        periodNumber: i + 1,
        periodName: month,
        startDate: `2025-${String(4 + i > 12 ? (4 + i - 12) : (4 + i)).padStart(2, '0')}-01`,
        endDate: `2025-${String(4 + i > 12 ? (4 + i - 12) : (4 + i)).padStart(2, '0')}-${new Date(2025, (3 + i) % 12 + 1, 0).getDate()}`,
        status: i < 9 ? 'CLOSED' : 'OPEN',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      };
      this.accountingPeriods.set(period.id, period);
    });

    // 9. Currencies
    const currencies: CurrencyMaster[] = [
      { id: 'cur_inr', companyId, currencyCode: 'INR', currencyName: 'Indian Rupee', symbol: '₹', decimalPlaces: 2, isBase: true, exchangeRates: [], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cur_usd', companyId, currencyCode: 'USD', currencyName: 'US Dollar', symbol: '$', decimalPlaces: 2, isBase: false, exchangeRates: [{ id: 'exr_1', fromCurrencyId: 'cur_usd', toCurrencyId: 'cur_inr', rate: 83.5, effectiveDate: '2025-04-01' }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cur_aed', companyId, currencyCode: 'AED', currencyName: 'UAE Dirham', symbol: 'د.إ', decimalPlaces: 2, isBase: false, exchangeRates: [{ id: 'exr_2', fromCurrencyId: 'cur_aed', toCurrencyId: 'cur_inr', rate: 22.75, effectiveDate: '2025-04-01' }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    currencies.forEach(c => this.currencies.set(c.id, c));

    // 10. Tax Master
    const taxes: TaxMaster[] = [
      { id: 'tax_gst5', companyId, taxCode: 'GST5', taxName: 'GST 5%', taxType: 'GST', rate: 5, effectiveFrom: '2017-07-01', isCompound: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_gst12', companyId, taxCode: 'GST12', taxName: 'GST 12%', taxType: 'GST', rate: 12, effectiveFrom: '2017-07-01', isCompound: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_gst18', companyId, taxCode: 'GST18', taxName: 'GST 18%', taxType: 'GST', rate: 18, effectiveFrom: '2017-07-01', isCompound: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_gst28', companyId, taxCode: 'GST28', taxName: 'GST 28%', taxType: 'GST', rate: 28, effectiveFrom: '2017-07-01', isCompound: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_cgst9', companyId, taxCode: 'CGST9', taxName: 'CGST 9%', taxType: 'CGST', rate: 9, effectiveFrom: '2017-07-01', isCompound: false, parentTaxId: 'tax_gst18', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_sgst9', companyId, taxCode: 'SGST9', taxName: 'SGST 9%', taxType: 'SGST', rate: 9, effectiveFrom: '2017-07-01', isCompound: false, parentTaxId: 'tax_gst18', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_igst18', companyId, taxCode: 'IGST18', taxName: 'IGST 18%', taxType: 'IGST', rate: 18, effectiveFrom: '2017-07-01', isCompound: false, parentTaxId: 'tax_gst18', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_cess', companyId, taxCode: 'CESS', taxName: 'GST Compensation Cess', taxType: 'CESS', rate: 0, effectiveFrom: '2017-07-01', isCompound: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_tds2', companyId, taxCode: 'TDS2', taxName: 'TDS 2% - Section 194C', taxType: 'TDS', rate: 2, effectiveFrom: '2024-04-01', isCompound: false, description: 'TDS on payment to contractors', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_tds10', companyId, taxCode: 'TDS10', taxName: 'TDS 10% - Section 194C (No PAN)', taxType: 'TDS', rate: 10, effectiveFrom: '2024-04-01', isCompound: false, description: 'TDS on payment to contractors without PAN', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'tax_tds1', companyId, taxCode: 'TDS1', taxName: 'TDS 1% - Section 194Q', taxType: 'TDS', rate: 1, effectiveFrom: '2024-04-01', isCompound: false, description: 'TDS on purchase of goods', status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    taxes.forEach(t => this.taxes.set(t.id, t));

    // 11. UOM Master
    const uoms: UOMMaster[] = [
      { id: 'uom_nos', companyId, uomCode: 'NOS', uomName: 'Numbers', uomCategory: 'COUNT', decimalPlaces: 0, isSystem: true, conversions: [], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_each', companyId, uomCode: 'EACH', uomName: 'Each', uomCategory: 'COUNT', decimalPlaces: 0, isSystem: true, conversions: [{ id: 'conv_1', fromUOMId: 'uom_each', toUOMId: 'uom_nos', conversionFactor: 1, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_kg', companyId, uomCode: 'KG', uomName: 'Kilogram', uomCategory: 'WEIGHT', decimalPlaces: 2, isSystem: true, conversions: [{ id: 'conv_2', fromUOMId: 'uom_kg', toUOMId: 'uom_mt', conversionFactor: 0.001, isBidirectional: true }, { id: 'conv_3', fromUOMId: 'uom_kg', toUOMId: 'uom_qtl', conversionFactor: 0.01, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_mt', companyId, uomCode: 'MT', uomName: 'Metric Ton', uomCategory: 'WEIGHT', decimalPlaces: 3, isSystem: true, conversions: [{ id: 'conv_4', fromUOMId: 'uom_mt', toUOMId: 'uom_kg', conversionFactor: 1000, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_qtl', companyId, uomCode: 'QTL', uomName: 'Quintal', uomCategory: 'WEIGHT', decimalPlaces: 2, isSystem: true, conversions: [{ id: 'conv_5', fromUOMId: 'uom_qtl', toUOMId: 'uom_kg', conversionFactor: 100, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_ltr', companyId, uomCode: 'LTR', uomName: 'Litre', uomCategory: 'VOLUME', decimalPlaces: 2, isSystem: true, conversions: [{ id: 'conv_6', fromUOMId: 'uom_ltr', toUOMId: 'uom_kl', conversionFactor: 0.001, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_kl', companyId, uomCode: 'KL', uomName: 'Kilolitre', uomCategory: 'VOLUME', decimalPlaces: 3, isSystem: true, conversions: [{ id: 'conv_7', fromUOMId: 'uom_kl', toUOMId: 'uom_ltr', conversionFactor: 1000, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_cum', companyId, uomCode: 'CUM', uomName: 'Cubic Meter', uomCategory: 'VOLUME', decimalPlaces: 3, isSystem: true, conversions: [{ id: 'conv_8', fromUOMId: 'uom_cum', toUOMId: 'uom_cft', conversionFactor: 35.3147, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_cft', companyId, uomCode: 'CFT', uomName: 'Cubic Feet', uomCategory: 'VOLUME', decimalPlaces: 2, isSystem: true, conversions: [{ id: 'conv_9', fromUOMId: 'uom_cft', toUOMId: 'uom_cum', conversionFactor: 0.02832, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_sqm', companyId, uomCode: 'SQM', uomName: 'Square Meter', uomCategory: 'AREA', decimalPlaces: 2, isSystem: true, conversions: [{ id: 'conv_10', fromUOMId: 'uom_sqm', toUOMId: 'uom_sqft', conversionFactor: 10.7639, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_sqft', companyId, uomCode: 'SQFT', uomName: 'Square Feet', uomCategory: 'AREA', decimalPlaces: 2, isSystem: true, conversions: [{ id: 'conv_11', fromUOMId: 'uom_sqft', toUOMId: 'uom_sqm', conversionFactor: 0.0929, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_rm', companyId, uomCode: 'RM', uomName: 'Running Meter', uomCategory: 'LENGTH', decimalPlaces: 2, isSystem: true, conversions: [{ id: 'conv_12', fromUOMId: 'uom_rm', toUOMId: 'uom_km', conversionFactor: 0.001, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_km', companyId, uomCode: 'KM', uomName: 'Kilometer', uomCategory: 'LENGTH', decimalPlaces: 3, isSystem: true, conversions: [{ id: 'conv_13', fromUOMId: 'uom_km', toUOMId: 'uom_rm', conversionFactor: 1000, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_hr', companyId, uomCode: 'HR', uomName: 'Hour', uomCategory: 'TIME', decimalPlaces: 1, isSystem: true, conversions: [], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_day', companyId, uomCode: 'DAY', uomName: 'Day', uomCategory: 'TIME', decimalPlaces: 0, isSystem: true, conversions: [{ id: 'conv_14', fromUOMId: 'uom_day', toUOMId: 'uom_hr', conversionFactor: 8, isBidirectional: true }], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_bag', companyId, uomCode: 'BAG', uomName: 'Bag', uomCategory: 'COUNT', decimalPlaces: 0, isSystem: true, conversions: [], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_set', companyId, uomCode: 'SET', uomName: 'Set', uomCategory: 'COUNT', decimalPlaces: 0, isSystem: true, conversions: [], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'uom_lot', companyId, uomCode: 'LOT', uomName: 'Lot', uomCategory: 'COUNT', decimalPlaces: 0, isSystem: true, conversions: [], status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    uoms.forEach(u => this.uoms.set(u.id, u));

    // 12. Payment Terms
    const payTerms: PaymentTermsMaster[] = [
      { id: 'pt_imm', companyId, termsCode: 'IMM', termsName: 'Immediate Payment', creditDays: 0, paymentType: 'IMMEDIATE', isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'pt_7', companyId, termsCode: 'NET7', termsName: 'Net 7 Days', creditDays: 7, paymentType: 'CREDIT_DAYS', isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'pt_15', companyId, termsCode: 'NET15', termsName: 'Net 15 Days', creditDays: 15, paymentType: 'CREDIT_DAYS', isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'pt_30', companyId, termsCode: 'NET30', termsName: 'Net 30 Days', creditDays: 30, paymentType: 'CREDIT_DAYS', isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'pt_45', companyId, termsCode: 'NET45', termsName: 'Net 45 Days', creditDays: 45, paymentType: 'CREDIT_DAYS', isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'pt_60', companyId, termsCode: 'NET60', termsName: 'Net 60 Days', creditDays: 60, paymentType: 'CREDIT_DAYS', isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'pt_ms', companyId, termsCode: 'MILESTONE', termsName: 'Milestone Based', creditDays: 30, paymentType: 'MILESTONE', milestones: [{ id: 'ms_1', sequence: 1, description: 'Mobilization Advance', percent: 10 }, { id: 'ms_2', sequence: 2, description: 'Foundation Complete', percent: 25 }, { id: 'ms_3', sequence: 3, description: 'Structure Complete', percent: 35 }, { id: 'ms_4', sequence: 4, description: 'Completion', percent: 25 }, { id: 'ms_5', sequence: 5, description: 'Retention Release', percent: 5 }], retentionPercent: 5, advancePercent: 10, isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'pt_ret', companyId, termsCode: 'RET5', termsName: '5% Retention', creditDays: 30, paymentType: 'RETENTION', retentionPercent: 5, isSystem: true, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    payTerms.forEach(pt => this.paymentTerms.set(pt.id, pt));

    // 13. Cost Code Master (Hierarchical)
    const costCodes: CostCodeMaster[] = [
      { id: 'cc_civil', companyId, costCode: 'CIVIL', costCodeName: 'Civil Works', level: 1, fullPath: 'CIVIL', category: 'MATERIAL', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_earth', companyId, costCode: 'CIVIL-EARTH', costCodeName: 'Earthwork', parentId: 'cc_civil', parentName: 'Civil Works', level: 2, fullPath: 'CIVIL > Earthwork', category: 'MATERIAL', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_excav', companyId, costCode: 'CIVIL-EARTH-EXC', costCodeName: 'Excavation', parentId: 'cc_earth', parentName: 'Earthwork', level: 3, fullPath: 'CIVIL > Earthwork > Excavation', category: 'MATERIAL', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_embk', companyId, costCode: 'CIVIL-EARTH-EMB', costCodeName: 'Embankment', parentId: 'cc_earth', parentName: 'Earthwork', level: 3, fullPath: 'CIVIL > Earthwork > Embankment', category: 'MATERIAL', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_conc', companyId, costCode: 'CIVIL-CONC', costCodeName: 'Concrete', parentId: 'cc_civil', parentName: 'Civil Works', level: 2, fullPath: 'CIVIL > Concrete', category: 'MATERIAL', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_reinf', companyId, costCode: 'CIVIL-CONC-REINF', costCodeName: 'Reinforcement', parentId: 'cc_conc', parentName: 'Concrete', level: 3, fullPath: 'CIVIL > Concrete > Reinforcement', category: 'MATERIAL', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_masn', companyId, costCode: 'CIVIL-MASN', costCodeName: 'Masonry', parentId: 'cc_civil', parentName: 'Civil Works', level: 2, fullPath: 'CIVIL > Masonry', category: 'MATERIAL', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_labour', companyId, costCode: 'LABOUR', costCodeName: 'Labour', level: 1, fullPath: 'LABOUR', category: 'LABOUR', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_plant', companyId, costCode: 'PLANT', costCodeName: 'Plant & Machinery', level: 1, fullPath: 'PLANT', category: 'PLANT', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_oh', companyId, costCode: 'OVERHEAD', costCodeName: 'Overheads', level: 1, fullPath: 'OVERHEAD', category: 'OVERHEAD', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'cc_subc', companyId, costCode: 'SUBCONTRACT', costCodeName: 'Subcontracts', level: 1, fullPath: 'SUBCONTRACT', category: 'SUBCONTRACT', isProjectSpecific: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    costCodes.forEach(cc => this.costCodes.set(cc.id, cc));

    // 15. Document Type Master
    const docTypes: DocumentTypeMaster[] = [
      { id: 'dt_pr', companyId, docTypeCode: 'PR', docTypeName: 'Purchase Requisition', module: 'procurement', requiredAttachments: 1, mandatoryFields: ['material', 'quantity', 'uom', 'project'], financialPosting: false, isSystem: true, sortOrder: 1, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_rfq', companyId, docTypeCode: 'RFQ', docTypeName: 'Request for Quotation', module: 'procurement', requiredAttachments: 2, mandatoryFields: ['vendors', 'items', 'closingDate'], financialPosting: false, isSystem: true, sortOrder: 2, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_po', companyId, docTypeCode: 'PO', docTypeName: 'Purchase Order', module: 'procurement', requiredAttachments: 1, mandatoryFields: ['vendor', 'items', 'deliveryDate', 'tax'], financialPosting: true, postingType: 'NONE', isSystem: true, sortOrder: 3, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_grn', companyId, docTypeCode: 'GRN', docTypeName: 'Goods Receipt Note', module: 'inventory', requiredAttachments: 1, mandatoryFields: ['poNumber', 'items', 'quantity'], financialPosting: true, postingType: 'DEBIT', isSystem: true, sortOrder: 4, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_mb', companyId, docTypeCode: 'MB', docTypeName: 'Measurement Book', module: 'billing', requiredAttachments: 2, mandatoryFields: ['workOrder', 'measurements', 'wbsCode'], financialPosting: true, postingType: 'DEBIT', isSystem: true, sortOrder: 5, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_rab', companyId, docTypeCode: 'RAB', docTypeName: 'RA Bill', module: 'billing', requiredAttachments: 3, mandatoryFields: ['contract', 'mbRef', 'amount'], financialPosting: true, postingType: 'BOTH', isSystem: true, sortOrder: 6, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_inv', companyId, docTypeCode: 'INV', docTypeName: 'Invoice', module: 'finance', requiredAttachments: 1, mandatoryFields: ['party', 'items', 'amount', 'tax'], financialPosting: true, postingType: 'BOTH', isSystem: true, sortOrder: 7, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_pay', companyId, docTypeCode: 'PAY', docTypeName: 'Payment Voucher', module: 'finance', requiredAttachments: 2, mandatoryFields: ['party', 'amount', 'mode', 'reference'], financialPosting: true, postingType: 'CREDIT', isSystem: true, sortOrder: 8, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_jv', companyId, docTypeCode: 'JV', docTypeName: 'Journal Voucher', module: 'finance', requiredAttachments: 1, mandatoryFields: ['debitAccount', 'creditAccount', 'amount', 'narration'], financialPosting: true, postingType: 'BOTH', isSystem: true, sortOrder: 9, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_ct', companyId, docTypeCode: 'CT', docTypeName: 'Contract', module: 'contracts', requiredAttachments: 5, mandatoryFields: ['party', 'value', 'startDate', 'endDate', 'scope'], financialPosting: false, isSystem: true, sortOrder: 10, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_wo', companyId, docTypeCode: 'WO', docTypeName: 'Work Order', module: 'contracts', requiredAttachments: 2, mandatoryFields: ['contract', 'scope', 'value', 'timeline'], financialPosting: false, isSystem: true, sortOrder: 11, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_ncr', companyId, docTypeCode: 'NCR', docTypeName: 'Non-Conformance Report', module: 'quality', requiredAttachments: 2, mandatoryFields: ['description', 'severity', 'correctiveAction'], financialPosting: false, isSystem: true, sortOrder: 12, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_mir', companyId, docTypeCode: 'MIR', docTypeName: 'Material Inspection Report', module: 'quality', requiredAttachments: 2, mandatoryFields: ['material', 'grnRef', 'testResults'], financialPosting: false, isSystem: true, sortOrder: 13, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'dt_wir', companyId, docTypeCode: 'WIR', docTypeName: 'Work Inspection Request', module: 'quality', requiredAttachments: 1, mandatoryFields: ['workDescription', 'location', 'wbsCode'], financialPosting: false, isSystem: true, sortOrder: 14, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    docTypes.forEach(dt => this.documentTypes.set(dt.id, dt));

    // 16. Status Master
    const masterStatuses: StatusMaster[] = [
      { id: 'ms_draft', companyId, statusCode: 'DRAFT', statusName: 'Draft', module: '*', category: 'MASTER', color: 'gray', isSystem: true, allowTransitionTo: ['IN_REVIEW', 'ACTIVE'], sortOrder: 1, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'ms_review', companyId, statusCode: 'IN_REVIEW', statusName: 'In Review', module: '*', category: 'MASTER', color: 'blue', isSystem: true, allowTransitionTo: ['APPROVED', 'DRAFT'], sortOrder: 2, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'ms_approved', companyId, statusCode: 'APPROVED', statusName: 'Approved', module: '*', category: 'MASTER', color: 'green', isSystem: true, allowTransitionTo: ['ACTIVE', 'INACTIVE'], sortOrder: 3, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'ms_active', companyId, statusCode: 'ACTIVE', statusName: 'Active', module: '*', category: 'MASTER', color: 'green', isSystem: true, allowTransitionTo: ['INACTIVE', 'BLOCKED', 'ARCHIVED'], sortOrder: 4, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'ms_inactive', companyId, statusCode: 'INACTIVE', statusName: 'Inactive', module: '*', category: 'MASTER', color: 'orange', isSystem: true, allowTransitionTo: ['ACTIVE', 'ARCHIVED'], sortOrder: 5, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'ms_blocked', companyId, statusCode: 'BLOCKED', statusName: 'Blocked', module: '*', category: 'MASTER', color: 'red', isSystem: true, allowTransitionTo: ['ACTIVE', 'INACTIVE'], sortOrder: 6, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'ms_archived', companyId, statusCode: 'ARCHIVED', statusName: 'Archived', module: '*', category: 'MASTER', color: 'slate', isSystem: true, allowTransitionTo: ['ACTIVE'], sortOrder: 7, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    masterStatuses.forEach(ms => this.statuses.set(ms.id, ms));

    // 17. Approval Authority Master
    const approvals: ApprovalAuthorityMaster[] = [
      { id: 'aa_001', companyId, userId: 'usr_001', userName: 'Rajesh Kumar', roleId: 'role_admin', roleName: 'Administrator', departmentId: 'dept_mgt', departmentName: 'Management', transactionType: 'ALL', approvalLevel: 1, financialLimit: 1000000000, currencyId: 'cur_inr', isDelegation: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'aa_002', companyId, userId: 'usr_002', userName: 'Priya Sharma', roleId: 'role_pm', roleName: 'Project Manager', departmentId: 'dept_proj', departmentName: 'Projects', transactionType: 'PO', approvalLevel: 1, financialLimit: 10000000, currencyId: 'cur_inr', isDelegation: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
      { id: 'aa_003', companyId, userId: 'usr_002', userName: 'Priya Sharma', roleId: 'role_pm', roleName: 'Project Manager', departmentId: 'dept_proj', departmentName: 'Projects', transactionType: 'BILL', approvalLevel: 1, financialLimit: 5000000, currencyId: 'cur_inr', isDelegation: false, status: 'ACTIVE', createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId, version: 1 },
    ];
    approvals.forEach(aa => this.approvalAuthorities.set(aa.id, aa));
  }

  // ============================================================
  // GOVERNANCE: Create with approval flow
  // ============================================================
  createMaster<T extends { id: string; status: MasterStatus; companyId: string; createdAt: string; updatedAt: string; createdBy: string; updatedBy: string; version: number }>(
    store: Map<string, T>,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
    userId: string
  ): T {
    // Duplicate check
    const existing = Array.from(store.values()).find(
      item => item.companyId === data.companyId && JSON.stringify(item).includes((data as any).code || (data as any).name || '')
    );

    const now = new Date().toISOString();
    const record = {
      ...data,
      id: `${(data as any).docTypeCode || 'master'}_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      version: 1,
    } as T;

    store.set(record.id, record);

    // Log creation
    this.logChange(record.companyId, record.constructor.name, record.id, 'NEW_RECORD', '', JSON.stringify(record), userId, 'Initial creation');

    return record;
  }

  // ============================================================
  // GOVERNANCE: Update with change history
  // ============================================================
  updateMaster<T extends { id: string; status: MasterStatus; companyId: string; updatedAt: string; updatedBy: string; version: number }>(
    store: Map<string, T>,
    id: string,
    updates: Partial<T>,
    userId: string,
    reason: string
  ): T | null {
    const existing = store.get(id);
    if (!existing) return null;

    const oldValues = { ...existing };
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
      version: existing.version + 1,
    };

    store.set(id, updated);

    // Log changes
    Object.keys(updates).forEach(key => {
      if (key !== 'updatedAt' && key !== 'updatedBy' && key !== 'version') {
        const oldVal = (oldValues as any)[key];
        const newVal = (updates as any)[key];
        if (oldVal !== newVal) {
          this.logChange(existing.companyId, existing.constructor.name, id, key, String(oldVal || ''), String(newVal || ''), userId, reason);
        }
      }
    });

    return updated;
  }

  // ============================================================
  // DUPLICATE DETECTION
  // ============================================================
  checkDuplicate<T>(store: Map<string, T>, companyId: string, field: string, value: string, excludeId?: string): boolean {
    return Array.from(store.values()).some(
      item => {
        const obj = item as any;
        return obj.companyId === companyId && obj[field] === value && obj.id !== excludeId;
      }
    );
  }

  // ============================================================
  // CHANGE LOG
  // ============================================================
  private logChange(companyId: string, entityType: string, entityId: string, fieldName: string, prevValue: string, newValue: string, userId: string, reason: string): void {
    this.changeLogs.unshift({
      id: `cl_${uuidv4()}`,
      companyId,
      entityType,
      entityId,
      entityName: entityId,
      fieldName,
      previousValue: prevValue,
      newValue,
      changedBy: userId,
      changedByName: userId,
      changedAt: new Date().toISOString(),
      reason,
      approvalStatus: 'APPROVED',
    });
    if (this.changeLogs.length > 5000) this.changeLogs.pop();
  }

  // ============================================================
  // GETTERS
  // ============================================================
  getCompanies(): CompanyMaster[] { return Array.from(this.companies.values()); }
  getCompany(id: string): CompanyMaster | undefined { return this.companies.get(id); }
  getBusinessUnits(companyId?: string): BusinessUnitMaster[] { return Array.from(this.businessUnits.values()).filter(b => !companyId || b.companyId === companyId); }
  getBranches(companyId?: string): BranchMaster[] { return Array.from(this.branches.values()).filter(b => !companyId || b.companyId === companyId); }
  getDepartments(companyId?: string): DepartmentMaster[] { return Array.from(this.departments.values()).filter(d => !companyId || d.companyId === companyId).sort((a, b) => a.sortOrder - b.sortOrder); }
  getDesignations(companyId?: string): DesignationMaster[] { return Array.from(this.designations.values()).filter(d => !companyId || d.companyId === companyId); }
  getLocations(companyId?: string): LocationMaster[] { return Array.from(this.locations.values()).filter(l => !companyId || l.companyId === companyId); }
  getFinancialYears(companyId?: string): FinancialYear[] { return Array.from(this.financialYears.values()).filter(f => !companyId || f.companyId === companyId); }
  getCurrentFY(companyId: string): FinancialYear | undefined { return Array.from(this.financialYears.values()).find(f => f.companyId === companyId && f.isCurrent); }
  getAccountingPeriods(fyId?: string): AccountingPeriod[] { return Array.from(this.accountingPeriods.values()).filter(p => !fyId || p.financialYearId === fyId); }
  getCurrencies(companyId?: string): CurrencyMaster[] { return Array.from(this.currencies.values()).filter(c => !companyId || c.companyId === companyId); }
  getTaxes(companyId?: string): TaxMaster[] { return Array.from(this.taxes.values()).filter(t => !companyId || t.companyId === companyId); }
  getUOMs(companyId?: string): UOMMaster[] { return Array.from(this.uoms.values()).filter(u => !companyId || u.companyId === companyId); }
  getPaymentTerms(companyId?: string): PaymentTermsMaster[] { return Array.from(this.paymentTerms.values()).filter(p => !companyId || p.companyId === companyId); }
  getCostCodes(companyId?: string): CostCodeMaster[] { return Array.from(this.costCodes.values()).filter(c => !companyId || c.companyId === companyId); }
  getDocumentTypes(companyId?: string): DocumentTypeMaster[] { return Array.from(this.documentTypes.values()).filter(d => !companyId || d.companyId === companyId).sort((a, b) => a.sortOrder - b.sortOrder); }
  getStatuses(companyId?: string): StatusMaster[] { return Array.from(this.statuses.values()).filter(s => !companyId || s.companyId === companyId); }
  getApprovalAuthorities(companyId?: string): ApprovalAuthorityMaster[] { return Array.from(this.approvalAuthorities.values()).filter(a => !companyId || a.companyId === companyId); }
  getChangeLogs(companyId?: string): MasterDataChangeLog[] { return companyId ? this.changeLogs.filter(l => l.companyId === companyId) : this.changeLogs; }
  getNumberSeries(companyId?: string): NumberSeriesMaster[] { return Array.from(this.numberSeries.values()).filter(n => !companyId || n.companyId === companyId); }

  // Update methods
  updateCompany(id: string, data: Partial<CompanyMaster>, userId: string, reason: string): CompanyMaster | null {
    const existing = this.companies.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString(), updatedBy: userId, version: existing.version + 1 };
    this.companies.set(id, updated);
    return updated;
  }

  updateFY(id: string, data: Partial<FinancialYear>, userId: string): FinancialYear | null {
    const existing = this.financialYears.get(id);
    if (!existing) return null;
    if (data.isClosed && !existing.isClosed) {
      data = { ...data, closedDate: new Date().toISOString(), closedBy: userId };
    }
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString(), updatedBy: userId, version: existing.version + 1 };
    this.financialYears.set(id, updated);
    return updated;
  }

  updatePeriod(id: string, data: Partial<AccountingPeriod>, userId: string, reason?: string): AccountingPeriod | null {
    const existing = this.accountingPeriods.get(id);
    if (!existing) return null;
    if (data.status === 'OPEN' && existing.status === 'LOCKED') {
      data = { ...data, reopenedDate: new Date().toISOString(), reopenedBy: userId, reopenReason: reason };
      this.logChange(existing.companyId, 'AccountingPeriod', id, 'REOPEN', existing.status, 'OPEN', userId, reason || 'Period reopened');
    }
    if (data.status === 'CLOSED') {
      data = { ...data, closedDate: new Date().toISOString(), closedBy: userId };
    }
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString(), updatedBy: userId };
    this.accountingPeriods.set(id, updated);
    return updated;
  }

  // Period control - prevent posting to closed years
  canPostToPeriod(periodId: string): boolean {
    const period = this.accountingPeriods.get(periodId);
    if (!period) return false;
    return period.status === 'OPEN';
  }

  canPostToFY(fyId: string): boolean {
    const fy = this.financialYears.get(fyId);
    if (!fy) return false;
    return !fy.isClosed;
  }

  // UOM Conversion
  convertUOM(fromUOMId: string, toUOMId: string, quantity: number): number | null {
    if (fromUOMId === toUOMId) return quantity;
    const fromUOM = this.uoms.get(fromUOMId);
    if (!fromUOM) return null;
    const conv = fromUOM.conversions.find(c => c.toUOMId === toUOMId);
    if (conv) return quantity * conv.conversionFactor;
    // Try reverse
    const toUOM = this.uoms.get(toUOMId);
    if (!toUOM) return null;
    const reverseConv = toUOM.conversions.find(c => c.toUOMId === fromUOMId && c.isBidirectional);
    if (reverseConv) return quantity / reverseConv.conversionFactor;
    return null;
  }
}

export const masterDataService = MasterDataService.getInstance();

// ============================================================
// BUILDCORE ERP - VENDOR MASTER SERVICE
// Part 14: Complete Vendor and Business-Partner Management System
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  VendorMaster, VendorCategory, VendorKYC, VendorDocument,
  VendorQualification, ApprovedVendorList, VendorMaterialMapping,
  QuotationHistory, VendorPerformance, VendorScorecard, VendorBankAccount,
  SubcontractorMaster, LabourContractor, VendorCommunication,
  VendorSearchResult, VendorDashboardKPIs, VendorNumberingConfig,
  VendorType, VendorStatus
} from '../types/vendor';

export class VendorService {
  private static instance: VendorService;

  private vendors: Map<string, VendorMaster> = new Map();
  private categories: Map<string, VendorCategory> = new Map();
  private approvedVendorLists: Map<string, ApprovedVendorList[]> = new Map();
  private quotationHistory: Map<string, QuotationHistory[]> = new Map();
  private performanceRecords: Map<string, VendorPerformance[]> = new Map();
  private subcontractors: Map<string, SubcontractorMaster[]> = new Map();
  private labourContractors: Map<string, LabourContractor[]> = new Map();
  private numberingConfigs: Map<string, VendorNumberingConfig> = new Map();

  private constructor() {}

  static getInstance(): VendorService {
    if (!VendorService.instance) {
      VendorService.instance = new VendorService();
    }
    return VendorService.instance;
  }

  // ============================================================
  // VENDOR MASTER OPERATIONS
  // ============================================================

  createVendor(data: Omit<VendorMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>): VendorMaster {
    const now = new Date().toISOString();
    const vendor: VendorMaster = {
      ...data,
      id: this.generateVendorId(data.companyId, data.vendorType),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.vendors.set(vendor.id, vendor);
    return vendor;
  }

  getVendor(id: string): VendorMaster | undefined {
    return this.vendors.get(id);
  }

  getVendors(companyId: string, filters?: {
    status?: VendorStatus;
    vendorType?: VendorType;
    vendorCategory?: string;
    search?: string;
  }): VendorMaster[] {
    let vendors = Array.from(this.vendors.values()).filter(v => v.companyId === companyId);

    if (filters?.status) {
      vendors = vendors.filter(v => v.status === filters.status);
    }
    if (filters?.vendorType) {
      vendors = vendors.filter(v => v.vendorType === filters.vendorType);
    }
    if (filters?.vendorCategory) {
      vendors = vendors.filter(v => v.vendorCategory === filters.vendorCategory);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      vendors = vendors.filter(v =>
        v.vendorCode.toLowerCase().includes(searchLower) ||
        v.legalName.toLowerCase().includes(searchLower) ||
        v.tradeName?.toLowerCase().includes(searchLower) ||
        v.contactPerson.toLowerCase().includes(searchLower) ||
        v.gstin?.toLowerCase().includes(searchLower) ||
        v.pan?.toLowerCase().includes(searchLower)
      );
    }

    return vendors;
  }

  updateVendor(id: string, updates: Partial<VendorMaster>): VendorMaster | null {
    const vendor = this.vendors.get(id);
    if (!vendor) return null;

    const updated = {
      ...vendor,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: vendor.version + 1,
    };

    this.vendors.set(id, updated);
    return updated;
  }

  blockVendor(id: string, reason: string, blockedBy: string): VendorMaster | null {
    return this.updateVendor(id, {
      status: 'BLOCKED',
      blockedReason: reason,
      blockedAt: new Date().toISOString(),
      blockedBy,
    });
  }

  unblockVendor(id: string): VendorMaster | null {
    return this.updateVendor(id, {
      status: 'APPROVED',
      blockedReason: undefined,
      blockedAt: undefined,
      blockedBy: undefined,
    });
  }

  approveVendor(id: string): VendorMaster | null {
    return this.updateVendor(id, { status: 'APPROVED' });
  }

  // ============================================================
  // DUPLICATE DETECTION
  // ============================================================

  checkDuplicates(companyId: string, vendor: Partial<VendorMaster>): { hasDuplicates: boolean; duplicates: string[] } {
    const duplicates: string[] = [];
    const existingVendors = this.getVendors(companyId);

    existingVendors.forEach(existing => {
      if (vendor.gstin && existing.gstin === vendor.gstin) {
        duplicates.push(`GSTIN: ${vendor.gstin} (${existing.legalName})`);
      }
      if (vendor.pan && existing.pan === vendor.pan) {
        duplicates.push(`PAN: ${vendor.pan} (${existing.legalName})`);
      }
      if (vendor.mobile && existing.mobile === vendor.mobile) {
        duplicates.push(`Mobile: ${vendor.mobile} (${existing.legalName})`);
      }
      if (vendor.email && existing.email === vendor.email) {
        duplicates.push(`Email: ${vendor.email} (${existing.legalName})`);
      }
      if (vendor.legalName && existing.legalName === vendor.legalName) {
        duplicates.push(`Legal Name: ${vendor.legalName}`);
      }
    });

    return {
      hasDuplicates: duplicates.length > 0,
      duplicates,
    };
  }

  // ============================================================
  // VENDOR ID GENERATION
  // ============================================================

  private generateVendorId(companyId: string, vendorType: VendorType): string {
    const config = this.getNumberingConfig(companyId, vendorType);
    if (!config) {
      const prefix = this.getVendorTypePrefix(vendorType);
      return `${prefix}-${uuidv4().substring(0, 8).toUpperCase()}`;
    }

    config.currentSequence += 1;
    const sequence = String(config.currentSequence).padStart(config.sequenceLength, '0');
    return `${config.prefix}-${sequence}`;
  }

  private getVendorTypePrefix(vendorType: VendorType): string {
    const prefixes: Record<VendorType, string> = {
      MATERIAL_SUPPLIER: 'SUP',
      SERVICE_PROVIDER: 'SVC',
      SUBCONTRACTOR: 'SUB',
      LABOUR_CONTRACTOR: 'LAB',
      PLANT_HIRE: 'PLT',
      TRANSPORTER: 'TRN',
      CONSULTANT: 'CON',
      PROFESSIONAL: 'PRO',
      MANUFACTURER: 'MFR',
      DEALER: 'DLR',
      RMC_CUSTOMER: 'RMC',
      OTHER: 'VEN',
    };
    return prefixes[vendorType];
  }

  private getNumberingConfig(companyId: string, vendorType: VendorType): VendorNumberingConfig | undefined {
    const key = `${companyId}_${vendorType}`;
    return this.numberingConfigs.get(key);
  }

  configureNumbering(config: Omit<VendorNumberingConfig, 'id' | 'createdAt' | 'updatedAt'>): VendorNumberingConfig {
    const now = new Date().toISOString();
    const key = `${config.companyId}_${config.vendorType}`;
    
    const numberingConfig: VendorNumberingConfig = {
      ...config,
      id: `vnum_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.numberingConfigs.set(key, numberingConfig);
    return numberingConfig;
  }

  // ============================================================
  // VENDOR CATEGORY
  // ============================================================

  createCategory(data: Omit<VendorCategory, 'id' | 'createdAt' | 'updatedAt'>): VendorCategory {
    const now = new Date().toISOString();
    const category: VendorCategory = {
      ...data,
      id: `vcat_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.categories.set(category.id, category);
    return category;
  }

  getCategories(companyId: string, parentId?: string): VendorCategory[] {
    let categories = Array.from(this.categories.values()).filter(c => c.companyId === companyId);
    if (parentId) {
      categories = categories.filter(c => c.parentCategoryId === parentId);
    }
    return categories;
  }

  // ============================================================
  // KYC MANAGEMENT
  // ============================================================

  addKYC(vendorId: string, data: Omit<VendorKYC, 'id' | 'vendorId'>): VendorKYC {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error('Vendor not found');

    const kyc: VendorKYC = {
      ...data,
      id: `vkyc_${uuidv4()}`,
      vendorId,
    };

    vendor.kycDocuments.push(kyc);
    return kyc;
  }

  verifyKYC(vendorId: string, kycId: string, verifiedBy: string): VendorKYC | null {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return null;

    const kyc = vendor.kycDocuments.find(k => k.id === kycId);
    if (!kyc) return null;

    kyc.isVerified = true;
    kyc.verifiedAt = new Date().toISOString();
    kyc.verifiedBy = verifiedBy;

    return kyc;
  }

  removeKYC(vendorId: string, kycId: string): boolean {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return false;

    const index = vendor.kycDocuments.findIndex(k => k.id === kycId);
    if (index === -1) return false;

    vendor.kycDocuments.splice(index, 1);
    return true;
  }

  // ============================================================
  // DOCUMENT MANAGEMENT
  // ============================================================

  addDocument(vendorId: string, data: Omit<VendorDocument, 'id' | 'vendorId'>): VendorDocument {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error('Vendor not found');

    const doc: VendorDocument = {
      ...data,
      id: `vdoc_${uuidv4()}`,
      vendorId,
    };

    vendor.otherDocuments.push(doc);
    return doc;
  }

  removeDocument(vendorId: string, documentId: string): boolean {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return false;

    const index = vendor.otherDocuments.findIndex(d => d.id === documentId);
    if (index === -1) return false;

    vendor.otherDocuments.splice(index, 1);
    return true;
  }

  // ============================================================
  // BANK ACCOUNT MANAGEMENT
  // ============================================================

  addBankAccount(vendorId: string, data: Omit<VendorBankAccount, 'id' | 'vendorId'>): VendorBankAccount {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error('Vendor not found');

    const account: VendorBankAccount = {
      ...data,
      id: `vbank_${uuidv4()}`,
      vendorId,
    };

    if (account.isPrimary) {
      vendor.bankAccounts.forEach(acc => acc.isPrimary = false);
    }

    vendor.bankAccounts.push(account);
    return account;
  }

  removeBankAccount(vendorId: string, accountId: string): boolean {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return false;

    const index = vendor.bankAccounts.findIndex(a => a.id === accountId);
    if (index === -1) return false;

    vendor.bankAccounts.splice(index, 1);
    return true;
  }

  verifyBankAccount(vendorId: string, accountId: string, verifiedBy: string): VendorBankAccount | null {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return null;

    const account = vendor.bankAccounts.find(a => a.id === accountId);
    if (!account) return null;

    account.verificationStatus = 'VERIFIED';
    account.verifiedAt = new Date().toISOString();
    account.verifiedBy = verifiedBy;

    return account;
  }

  // ============================================================
  // QUALIFICATION
  // ============================================================

  setQualification(vendorId: string, data: Omit<VendorQualification, 'id' | 'vendorId' | 'overallScore'>): VendorQualification {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error('Vendor not found');

    const overallScore = (
      data.technicalScore +
      data.financialScore +
      data.experienceScore +
      data.qualityScore +
      data.deliveryScore +
      data.safetyScore +
      data.commercialScore
    ) / 7;

    const qualification: VendorQualification = {
      ...data,
      id: `vqual_${uuidv4()}`,
      vendorId,
      overallScore,
    };

    vendor.qualification = qualification;
    return qualification;
  }

  // ============================================================
  // APPROVED VENDOR LIST
  // ============================================================

  approveVendorForProject(data: Omit<ApprovedVendorList, 'id'>): ApprovedVendorList {
    const approved: ApprovedVendorList = {
      ...data,
      id: `vapp_${uuidv4()}`,
    };

    const projectList = this.approvedVendorLists.get(data.projectId) || [];
    projectList.push(approved);
    this.approvedVendorLists.set(data.projectId, projectList);

    const vendor = this.vendors.get(data.vendorId);
    if (vendor && !vendor.approvedProjects.includes(data.projectId)) {
      vendor.approvedProjects.push(data.projectId);
    }

    return approved;
  }

  getApprovedVendorsForProject(projectId: string): ApprovedVendorList[] {
    return this.approvedVendorLists.get(projectId) || [];
  }

  // ============================================================
  // MATERIAL MAPPING
  // ============================================================

  addMaterialMapping(vendorId: string, data: Omit<VendorMaterialMapping, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>): VendorMaterialMapping {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error('Vendor not found');

    const now = new Date().toISOString();
    const mapping: VendorMaterialMapping = {
      ...data,
      id: `vmat_${uuidv4()}`,
      vendorId,
      createdAt: now,
      updatedAt: now,
    };

    vendor.materialMappings.push(mapping);
    return mapping;
  }

  getMaterialMappings(vendorId: string): VendorMaterialMapping[] {
    const vendor = this.vendors.get(vendorId);
    return vendor?.materialMappings || [];
  }

  // ============================================================
  // QUOTATION HISTORY
  // ============================================================

  addQuotation(vendorId: string, data: Omit<QuotationHistory, 'id' | 'createdAt'>): QuotationHistory {
    const quotation: QuotationHistory = {
      ...data,
      id: `vquot_${uuidv4()}`,
      vendorId,
      createdAt: new Date().toISOString(),
    };

    const history = this.quotationHistory.get(vendorId) || [];
    history.push(quotation);
    this.quotationHistory.set(vendorId, history);

    return quotation;
  }

  getQuotationHistory(vendorId: string, materialId?: string): QuotationHistory[] {
    let history = this.quotationHistory.get(vendorId) || [];
    if (materialId) {
      history = history.filter(q => q.materialId === materialId);
    }
    return history.sort((a, b) => new Date(b.quotationDate).getTime() - new Date(a.quotationDate).getTime());
  }

  // ============================================================
  // PERFORMANCE TRACKING
  // ============================================================

  addPerformanceRecord(vendorId: string, data: Omit<VendorPerformance, 'id'>): VendorPerformance {
    const performance: VendorPerformance = {
      ...data,
      id: `vperf_${uuidv4()}`,
      vendorId,
    };

    const records = this.performanceRecords.get(vendorId) || [];
    records.push(performance);
    this.performanceRecords.set(vendorId, records);

    const vendor = this.vendors.get(vendorId);
    if (vendor) {
      vendor.performanceMetrics = performance;
      this.updateVendorScorecard(vendorId);
    }

    return performance;
  }

  getPerformanceRecords(vendorId: string): VendorPerformance[] {
    return this.performanceRecords.get(vendorId) || [];
  }

  private updateVendorScorecard(vendorId: string): void {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return;

    const records = this.performanceRecords.get(vendorId) || [];
    if (records.length === 0) return;

    const avgOnTime = records.reduce((sum, r) => sum + r.onTimeDeliveryPercent, 0) / records.length;
    const avgQuality = records.reduce((sum, r) => sum + r.qualityAcceptancePercent, 0) / records.length;
    const avgPrice = records.reduce((sum, r) => sum + r.priceCompetitivenessScore, 0) / records.length;
    const avgPayment = records.reduce((sum, r) => sum + r.paymentHistoryScore, 0) / records.length;

    const qualityWeight = 0.35;
    const deliveryWeight = 0.30;
    const priceWeight = 0.20;
    const serviceWeight = 0.15;

    const overallScore = (
      (avgQuality / 100 * 100 * qualityWeight) +
      (avgOnTime * serviceWeight) +
      (avgPrice / 10 * 100 * priceWeight) +
      (avgPayment / 10 * 100 * serviceWeight)
    );

    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 80) grade = 'B';
    else if (overallScore >= 70) grade = 'C';
    else if (overallScore >= 60) grade = 'D';
    else grade = 'F';

    vendor.scorecard = {
      id: vendor.scorecard?.id || `vsc_${uuidv4()}`,
      vendorId,
      qualityWeight: qualityWeight * 100,
      deliveryWeight: deliveryWeight * 100,
      priceWeight: priceWeight * 100,
      serviceWeight: serviceWeight * 100,
      overallScore,
      grade,
      lastUpdated: new Date().toISOString(),
    };
  }

  // ============================================================
  // SUBCONTRACTOR & LABOUR CONTRACTOR
  // ============================================================

  addSubcontractor(data: Omit<SubcontractorMaster, 'id' | 'createdAt' | 'updatedAt'>): SubcontractorMaster {
    const now = new Date().toISOString();
    const subcontractor: SubcontractorMaster = {
      ...data,
      id: `vsub_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };

    const subcontractors = this.subcontractors.get(data.vendorId) || [];
    subcontractors.push(subcontractor);
    this.subcontractors.set(data.vendorId, subcontractors);

    return subcontractor;
  }

  getSubcontractors(vendorId: string): SubcontractorMaster[] {
    return this.subcontractors.get(vendorId) || [];
  }

  addLabourContractor(data: Omit<LabourContractor, 'id' | 'createdAt' | 'updatedAt'>): LabourContractor {
    const now = new Date().toISOString();
    const contractor: LabourContractor = {
      ...data,
      id: `vlcon_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };

    const contractors = this.labourContractors.get(data.vendorId) || [];
    contractors.push(contractor);
    this.labourContractors.set(data.vendorId, contractors);

    return contractor;
  }

  getLabourContractors(vendorId: string): LabourContractor[] {
    return this.labourContractors.get(vendorId) || [];
  }

  // ============================================================
  // COMMUNICATION
  // ============================================================

  addCommunication(vendorId: string, data: Omit<VendorCommunication, 'id'>): VendorCommunication {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error('Vendor not found');

    const communication: VendorCommunication = {
      ...data,
      id: `vcomm_${uuidv4()}`,
      vendorId,
    };

    vendor.communications.push(communication);
    return communication;
  }

  getCommunications(vendorId: string, projectId?: string): VendorCommunication[] {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return [];

    let communications = vendor.communications;
    if (projectId) {
      communications = communications.filter(c => c.projectId === projectId);
    }

    return communications.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }

  // ============================================================
  // SEARCH
  // ============================================================

  searchVendors(companyId: string, query: string, limit: number = 50): VendorSearchResult[] {
    const vendors = this.getVendors(companyId, { search: query });
    
    return vendors.slice(0, limit).map(v => ({
      vendorId: v.id,
      vendorCode: v.vendorCode,
      legalName: v.legalName,
      vendorType: v.vendorType,
      vendorCategory: v.vendorCategory,
      contactPerson: v.contactPerson,
      mobile: v.mobile,
      status: v.status,
      overallScore: v.scorecard?.overallScore,
    }));
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getVendorDashboardKPIs(companyId: string): VendorDashboardKPIs {
    const vendors = this.getVendors(companyId);
    
    const approvedVendors = vendors.filter(v => v.status === 'APPROVED');
    const pendingApproval = vendors.filter(v => v.status === 'UNDER_REVIEW');
    const blockedVendors = vendors.filter(v => v.status === 'BLOCKED');
    
    let activeSubcontractors = 0;
    let labourContractors = 0;
    vendors.forEach(v => {
      const subs = this.getSubcontractors(v.id);
      activeSubcontractors += subs.filter(s => s.status === 'ACTIVE').length;
      labourContractors += this.getLabourContractors(v.id).length;
    });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    let expiringKYC = 0;
    let expiringDocuments = 0;
    
    vendors.forEach(v => {
      v.kycDocuments.forEach(kyc => {
        if (kyc.expiryDate && new Date(kyc.expiryDate) <= thirtyDaysFromNow) {
          expiringKYC++;
        }
      });
      v.otherDocuments.forEach(doc => {
        if (doc.expiryDate && new Date(doc.expiryDate) <= thirtyDaysFromNow) {
          expiringDocuments++;
        }
      });
    });

    const vendorsWithScore = vendors.filter(v => v.scorecard);
    const avgPerformanceScore = vendorsWithScore.length > 0
      ? vendorsWithScore.reduce((sum, v) => sum + (v.scorecard?.overallScore || 0), 0) / vendorsWithScore.length
      : 0;

    return {
      totalVendors: vendors.length,
      approvedVendors: approvedVendors.length,
      pendingApproval: pendingApproval.length,
      blockedVendors: blockedVendors.length,
      activeSubcontractors,
      labourContractors,
      expiringKYC,
      expiringDocuments,
      averagePerformanceScore: avgPerformanceScore,
      totalOutstanding: 0,
      vendorsWithPerformance: vendorsWithScore.length,
      vendorsWithoutPerformance: vendors.length - vendorsWithScore.length,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  getVendorByCode(companyId: string, vendorCode: string): VendorMaster | undefined {
    return Array.from(this.vendors.values()).find(
      v => v.companyId === companyId && v.vendorCode === vendorCode
    );
  }

  getVendorByGSTIN(companyId: string, gstin: string): VendorMaster | undefined {
    return Array.from(this.vendors.values()).find(
      v => v.companyId === companyId && v.gstin === gstin
    );
  }

  getVendorsByType(companyId: string, vendorType: VendorType): VendorMaster[] {
    return this.getVendors(companyId).filter(v => v.vendorType === vendorType);
  }

  getVendorsByCategory(companyId: string, category: string): VendorMaster[] {
    return this.getVendors(companyId).filter(v => v.vendorCategory === category);
  }

  getVendorsForMaterial(companyId: string, materialId: string): VendorMaster[] {
    return this.getVendors(companyId).filter(v =>
      v.materialMappings.some(m => m.materialId === materialId)
    );
  }
}

export const vendorService = VendorService.getInstance();

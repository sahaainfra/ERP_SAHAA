// ============================================================
// BUILDCORE ERP - CONTRACT MANAGEMENT SERVICE
// Part 11: Complete Contract Management Module
// ============================================================

import type {
  ContractMaster, ContractDocument, ContractAmendment, ContractMilestone,
  BankGuarantee, PerformanceGuarantee, ContractAdvance, ContractRetention,
  SecurityDeposit, ContractObligation, ContractNotice, ContractValueControl,
  ContractResponsibilityMatrix, ContractCloseout, ContractAlert, ContractDashboardKPIs
} from '../types/contract';

export class ContractService {
  private static instance: ContractService;

  private contracts: Map<string, ContractMaster> = new Map();
  private documents: Map<string, ContractDocument[]> = new Map();
  private amendments: Map<string, ContractAmendment[]> = new Map();
  private milestones: Map<string, ContractMilestone[]> = new Map();
  private bankGuarantees: Map<string, BankGuarantee[]> = new Map();
  private performanceGuarantees: Map<string, PerformanceGuarantee[]> = new Map();
  private advances: Map<string, ContractAdvance[]> = new Map();
  private retentions: Map<string, ContractRetention[]> = new Map();
  private securityDeposits: Map<string, SecurityDeposit[]> = new Map();
  private obligations: Map<string, ContractObligation[]> = new Map();
  private notices: Map<string, ContractNotice[]> = new Map();
  private valueControls: Map<string, ContractValueControl> = new Map();
  private responsibilityMatrices: Map<string, ContractResponsibilityMatrix[]> = new Map();
  private closeouts: Map<string, ContractCloseout> = new Map();
  private alerts: Map<string, ContractAlert[]> = new Map();

  private constructor() {}

  static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  // Contract Master Operations
  createContract(contractData: Omit<ContractMaster, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'revisedContractValue'>): ContractMaster {
    const now = new Date().toISOString();
    const contract: ContractMaster = {
      ...contractData,
      id: `contract_${uuidv4()}`,
      revisedContractValue: contractData.originalContractValue,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.contracts.set(contract.id, contract);
    this.documents.set(contract.id, []);
    this.amendments.set(contract.id, []);
    this.milestones.set(contract.id, []);
    this.bankGuarantees.set(contract.id, []);
    this.performanceGuarantees.set(contract.id, []);
    this.advances.set(contract.id, []);
    this.retentions.set(contract.id, []);
    this.securityDeposits.set(contract.id, []);
    this.obligations.set(contract.id, []);
    this.notices.set(contract.id, []);
    this.responsibilityMatrices.set(contract.id, []);
    this.alerts.set(contract.id, []);

    // Initialize value control
    this.valueControls.set(contract.id, {
      id: `vc_${uuidv4()}`,
      contractId: contract.id,
      originalValue: contractData.originalContractValue,
      approvedVariations: 0,
      extraItems: 0,
      deviations: 0,
      deductions: 0,
      revisedValue: contractData.originalContractValue,
      executedValue: 0,
      certifiedValue: 0,
      receivedValue: 0,
      outstandingValue: 0,
      lastUpdated: now,
    });

    return contract;
  }

  getContract(id: string): ContractMaster | undefined {
    return this.contracts.get(id);
  }

  getContracts(companyId: string, projectId?: string, status?: string): ContractMaster[] {
    let contracts = Array.from(this.contracts.values()).filter(c => c.companyId === companyId);
    if (projectId) contracts = contracts.filter(c => c.projectId === projectId);
    if (status) contracts = contracts.filter(c => c.status === status);
    return contracts;
  }

  updateContract(id: string, updates: Partial<ContractMaster>): ContractMaster | null {
    const contract = this.contracts.get(id);
    if (!contract) return null;
    const updated = { ...contract, ...updates, updatedAt: new Date().toISOString(), version: contract.version + 1 };
    this.contracts.set(id, updated);
    return updated;
  }

  // Document Operations
  addDocument(documentData: Omit<ContractDocument, 'id' | 'uploadedAt' | 'version'>): ContractDocument {
    const doc: ContractDocument = {
      ...documentData,
      id: `cdoc_${uuidv4()}`,
      uploadedAt: new Date().toISOString(),
      version: 1,
    };
    const docs = this.documents.get(documentData.contractId) || [];
    docs.push(doc);
    this.documents.set(documentData.contractId, docs);
    return doc;
  }

  getDocuments(contractId: string): ContractDocument[] {
    return this.documents.get(contractId) || [];
  }

  // Amendment Operations
  createAmendment(amendmentData: Omit<ContractAmendment, 'id' | 'createdAt' | 'updatedAt' | 'valueVariance'>): ContractAmendment {
    const amendment: ContractAmendment = {
      ...amendmentData,
      id: `amend_${uuidv4()}`,
      valueVariance: amendmentData.newValue - amendmentData.originalValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const amendments = this.amendments.get(amendmentData.contractId) || [];
    amendments.push(amendment);
    this.amendments.set(amendmentData.contractId, amendments);

    // Update contract revised value
    const contract = this.contracts.get(amendmentData.contractId);
    if (contract && amendmentData.status === 'APPROVED') {
      contract.revisedContractValue = amendmentData.newValue;
      contract.updatedAt = new Date().toISOString();
    }

    return amendment;
  }

  getAmendments(contractId: string): ContractAmendment[] {
    return this.amendments.get(contractId) || [];
  }

  // Milestone Operations
  createMilestone(milestoneData: Omit<ContractMilestone, 'id' | 'createdAt' | 'updatedAt' | 'varianceDays'>): ContractMilestone {
    const milestone: ContractMilestone = {
      ...milestoneData,
      id: `cmls_${uuidv4()}`,
      varianceDays: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const milestones = this.milestones.get(milestoneData.contractId) || [];
    milestones.push(milestone);
    this.milestones.set(milestoneData.contractId, milestones);
    return milestone;
  }

  getMilestones(contractId: string): ContractMilestone[] {
    return this.milestones.get(contractId) || [];
  }

  // Bank Guarantee Operations
  createBankGuarantee(bgData: Omit<BankGuarantee, 'id' | 'createdAt' | 'updatedAt' | 'renewalHistory' | 'alertSent'>): BankGuarantee {
    const bg: BankGuarantee = {
      ...bgData,
      id: `bg_${uuidv4()}`,
      renewalHistory: [],
      alertSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const bgs = this.bankGuarantees.get(bgData.contractId) || [];
    bgs.push(bg);
    this.bankGuarantees.set(bgData.contractId, bgs);
    return bg;
  }

  getBankGuarantees(contractId: string): BankGuarantee[] {
    return this.bankGuarantees.get(contractId) || [];
  }

  // Performance Guarantee Operations
  createPerformanceGuarantee(pgData: Omit<PerformanceGuarantee, 'id' | 'createdAt' | 'updatedAt' | 'alertSent'>): PerformanceGuarantee {
    const pg: PerformanceGuarantee = {
      ...pgData,
      id: `pg_${uuidv4()}`,
      alertSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const pgs = this.performanceGuarantees.get(pgData.contractId) || [];
    pgs.push(pg);
    this.performanceGuarantees.set(pgData.contractId, pgs);
    return pg;
  }

  getPerformanceGuarantees(contractId: string): PerformanceGuarantee[] {
    return this.performanceGuarantees.get(contractId) || [];
  }

  // Advance Operations
  createAdvance(advanceData: Omit<ContractAdvance, 'id' | 'createdAt' | 'updatedAt' | 'balanceAmount' | 'recoveryPercent'>): ContractAdvance {
    const advance: ContractAdvance = {
      ...advanceData,
      id: `adv_${uuidv4()}`,
      balanceAmount: advanceData.originalAmount,
      recoveryPercent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const advances = this.advances.get(advanceData.contractId) || [];
    advances.push(advance);
    this.advances.set(advanceData.contractId, advances);
    return advance;
  }

  getAdvances(contractId: string): ContractAdvance[] {
    return this.advances.get(contractId) || [];
  }

  // Retention Operations
  createRetention(retentionData: Omit<ContractRetention, 'id' | 'createdAt' | 'updatedAt' | 'balanceAmount'>): ContractRetention {
    const retention: ContractRetention = {
      ...retentionData,
      id: `ret_${uuidv4()}`,
      balanceAmount: retentionData.totalRetentionAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const retentions = this.retentions.get(retentionData.contractId) || [];
    retentions.push(retention);
    this.retentions.set(retentionData.contractId, retentions);
    return retention;
  }

  getRetentions(contractId: string): ContractRetention[] {
    return this.retentions.get(contractId) || [];
  }

  // Security Deposit Operations
  createSecurityDeposit(depositData: Omit<SecurityDeposit, 'id' | 'createdAt' | 'updatedAt' | 'balanceAmount' | 'releasedAmount'>): SecurityDeposit {
    const deposit: SecurityDeposit = {
      ...depositData,
      id: `sd_${uuidv4()}`,
      balanceAmount: depositData.depositAmount,
      releasedAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const deposits = this.securityDeposits.get(depositData.contractId) || [];
    deposits.push(deposit);
    this.securityDeposits.set(depositData.contractId, deposits);
    return deposit;
  }

  getSecurityDeposits(contractId: string): SecurityDeposit[] {
    return this.securityDeposits.get(contractId) || [];
  }

  // Obligation Operations
  createObligation(obligationData: Omit<ContractObligation, 'id' | 'createdAt' | 'updatedAt'>): ContractObligation {
    const obligation: ContractObligation = {
      ...obligationData,
      id: `obl_${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const obligations = this.obligations.get(obligationData.contractId) || [];
    obligations.push(obligation);
    this.obligations.set(obligationData.contractId, obligations);
    return obligation;
  }

  getObligations(contractId: string): ContractObligation[] {
    return this.obligations.get(contractId) || [];
  }

  // Notice Operations
  createNotice(noticeData: Omit<ContractNotice, 'id' | 'createdAt' | 'updatedAt'>): ContractNotice {
    const notice: ContractNotice = {
      ...noticeData,
      id: `notice_${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const notices = this.notices.get(noticeData.contractId) || [];
    notices.push(notice);
    this.notices.set(noticeData.contractId, notices);
    return notice;
  }

  getNotices(contractId: string): ContractNotice[] {
    return this.notices.get(contractId) || [];
  }

  // Value Control Operations
  getValueControl(contractId: string): ContractValueControl | undefined {
    return this.valueControls.get(contractId);
  }

  updateValueControl(contractId: string, updates: Partial<ContractValueControl>): void {
    const vc = this.valueControls.get(contractId);
    if (vc) {
      Object.assign(vc, updates, { lastUpdated: new Date().toISOString() });
      vc.revisedValue = vc.originalValue + vc.approvedVariations + vc.extraItems + vc.deviations - vc.deductions;
      vc.outstandingValue = vc.certifiedValue - vc.receivedValue;
    }
  }

  // Dashboard KPIs
  getContractDashboardKPIs(companyId: string): ContractDashboardKPIs {
    const contracts = this.getContracts(companyId);
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
    
    let totalContractValue = 0;
    let totalRevisedValue = 0;
    let totalExecutedValue = 0;
    let totalCertifiedValue = 0;
    let totalReceivedValue = 0;
    let totalOutstandingValue = 0;
    let totalVariations = 0;
    let totalRetention = 0;
    let totalSecurityDeposit = 0;
    let totalAdvance = 0;
    let totalBG = 0;
    let expiringBG = 0;
    let expiringPG = 0;
    let overdueObligations = 0;
    let pendingMilestones = 0;
    let contractsInDLP = 0;

    contracts.forEach(contract => {
      totalContractValue += contract.originalContractValue;
      totalRevisedValue += contract.revisedContractValue;

      const vc = this.valueControls.get(contract.id);
      if (vc) {
        totalExecutedValue += vc.executedValue;
        totalCertifiedValue += vc.certifiedValue;
        totalReceivedValue += vc.receivedValue;
        totalOutstandingValue += vc.outstandingValue;
        totalVariations += vc.approvedVariations;
      }

      const retentions = this.retentions.get(contract.id) || [];
      retentions.forEach(r => totalRetention += r.balanceAmount);

      const deposits = this.securityDeposits.get(contract.id) || [];
      deposits.forEach(d => totalSecurityDeposit += d.balanceAmount);

      const advances = this.advances.get(contract.id) || [];
      advances.forEach(a => totalAdvance += a.balanceAmount);

      const bgs = this.bankGuarantees.get(contract.id) || [];
      bgs.forEach(bg => {
        totalBG += bg.amount;
        const expiryDate = new Date(bg.expiryDate);
        if (expiryDate > now && expiryDate <= thirtyDaysLater) {
          expiringBG++;
        }
      });

      const pgs = this.performanceGuarantees.get(contract.id) || [];
      pgs.forEach(pg => {
        const expiryDate = new Date(pg.expiryDate);
        if (expiryDate > now && expiryDate <= thirtyDaysLater) {
          expiringPG++;
        }
      });

      const obligations = this.obligations.get(contract.id) || [];
      obligations.forEach(o => {
        if (o.status === 'OVERDUE' || (o.dueDate && new Date(o.dueDate) < now && o.status !== 'COMPLETED')) {
          overdueObligations++;
        }
      });

      const milestones = this.milestones.get(contract.id) || [];
      milestones.forEach(m => {
        if (m.status === 'PENDING' || m.status === 'AT_RISK') {
          pendingMilestones++;
        }
      });

      if (contract.status === 'DLP_PERIOD') {
        contractsInDLP++;
      }
    });

    return {
      totalContracts,
      activeContracts,
      totalContractValue,
      totalRevisedValue,
      totalExecutedValue,
      totalCertifiedValue,
      totalReceivedValue,
      totalOutstandingValue,
      totalVariations,
      totalClaims: 0, // Would need claims module
      totalEOT: 0, // Would need EOT module
      totalRetention,
      totalSecurityDeposit,
      totalAdvance,
      totalBG,
      expiringBG,
      expiringPG,
      overdueObligations,
      pendingMilestones,
      contractsInDLP,
    };
  }

  // Contract Conversion from Tender
  convertTenderToContract(tenderId: string, boqId: string, contractData: Omit<ContractMaster, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'revisedContractValue'>): ContractMaster {
    const contract = this.createContract(contractData);
    contract.tenderId = tenderId;
    contract.status = 'APPROVED';
    return contract;
  }
}

// Helper function for UUID generation
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const contractService = ContractService.getInstance();

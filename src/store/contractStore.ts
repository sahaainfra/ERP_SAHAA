// ============================================================
// BUILDCORE ERP - CONTRACT STORE
// Part 11: Complete Contract Management Module
// ============================================================

import { create } from 'zustand';
import type { ContractMaster, ContractDashboardKPIs } from '../types/contract';
import { contractService } from '../services/contractService';

interface ContractState {
  contracts: ContractMaster[];
  selectedContractId: string | null;
  selectedContract: ContractMaster | null;
  dashboardKPIs: ContractDashboardKPIs | null;
  initialized: boolean;

  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;
  selectContract: (contractId: string) => void;
  clearSelection: () => void;
  createContract: (contractData: any) => void;
  updateContract: (id: string, updates: Partial<ContractMaster>) => void;
  loadDashboardKPIs: (companyId: string) => void;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  selectedContractId: null,
  selectedContract: null,
  dashboardKPIs: null,
  initialized: false,

  initialize: (companyId: string) => {
    if (get().initialized) return;
    createDemoContractData(companyId);
    get().refresh(companyId);
    set({ initialized: true });
  },

  refresh: (companyId: string) => {
    set({
      contracts: contractService.getContracts(companyId),
    });
    
    const selectedId = get().selectedContractId;
    if (selectedId) {
      const contract = contractService.getContract(selectedId);
      set({ selectedContract: contract || null });
    }
  },

  selectContract: (contractId: string) => {
    const contract = contractService.getContract(contractId);
    set({
      selectedContractId: contractId,
      selectedContract: contract || null,
    });
  },

  clearSelection: () => {
    set({
      selectedContractId: null,
      selectedContract: null,
    });
  },

  createContract: (contractData: any) => {
    contractService.createContract(contractData);
    const companyId = contractData.companyId;
    get().refresh(companyId);
  },

  updateContract: (id: string, updates: Partial<ContractMaster>) => {
    contractService.updateContract(id, updates);
    const contract = contractService.getContract(id);
    if (contract) {
      get().refresh(contract.companyId);
      if (get().selectedContractId === id) {
        set({ selectedContract: contract });
      }
    }
  },

  loadDashboardKPIs: (companyId: string) => {
    const kpis = contractService.getContractDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },
}));

// Demo data creation
function createDemoContractData(companyId: string): void {
  const userId = 'usr_001';
  const now = new Date().toISOString();

  // Create contract for Mumbai-Pune Expressway
  const contract1 = contractService.createContract({
    companyId,
    contractNumber: 'CT-MPEW-001',
    contractCode: 'MPEW-CT-001',
    tenderId: 'tender_001',
    tenderNumber: 'NHAI/2025/001',
    projectId: 'proj_001',
    projectName: 'Mumbai-Pune Expressway Widening',
    client: 'National Highways Authority of India',
    employer: 'Ministry of Road Transport & Highways',
    consultant: 'L&T Consulting',
    contractor: 'BuildCore Infrastructure Pvt Ltd',
    agreementNumber: 'AGR-NHAI-2025-001',
    loaNumber: 'LOA-NHAI-2025-001',
    workOrderNumber: 'WO-NHAI-2025-001',
    contractType: 'ITEM_RATE',
    contractValue: 4850000000,
    originalContractValue: 4850000000,
    currency: 'INR',
    gstTreatment: 'EXCLUSIVE',
    awardDate: '2025-01-15',
    agreementDate: '2025-01-20',
    commencementDate: '2025-03-01',
    originalCompletionDate: '2028-02-28',
    contractDuration: 1095,
    retentionPercent: 5,
    securityDeposit: 242500000,
    performanceGuarantee: 485000000,
    mobilizationAdvance: 485000000,
    paymentTerms: 'Monthly billing with 45 days payment cycle',
    defectLiability: 24,
    status: 'ACTIVE',
    approvedBy: userId,
    approvedAt: now,
    createdBy: userId,
    updatedBy: userId,
  });

  // Add documents
  contractService.addDocument({
    contractId: contract1.id,
    documentType: 'LOA',
    documentNumber: 'LOA-NHAI-2025-001',
    fileName: 'LOA-MPEW-001.pdf',
    filePath: '/contracts/mpev-001/loa.pdf',
    fileSize: 2500000,
    uploadedBy: userId,
    status: 'ACTIVE',
  });

  contractService.addDocument({
    contractId: contract1.id,
    documentType: 'AGREEMENT',
    documentNumber: 'AGR-NHAI-2025-001',
    fileName: 'Agreement-MPEW-001.pdf',
    filePath: '/contracts/mpev-001/agreement.pdf',
    fileSize: 5000000,
    uploadedBy: userId,
    status: 'ACTIVE',
  });

  // Add milestones
  contractService.createMilestone({
    contractId: contract1.id,
    milestoneName: 'Mobilization Complete',
    description: 'Complete site mobilization and setup',
    baselineDate: '2025-03-31',
    contractDate: '2025-03-31',
    value: 485000000,
    isPaymentLinked: true,
    status: 'ACHIEVED',
    createdBy: userId,
    updatedBy: userId,
  });

  contractService.createMilestone({
    contractId: contract1.id,
    milestoneName: 'Earthwork 50% Complete',
    description: 'Complete 50% of earthwork',
    baselineDate: '2026-06-30',
    contractDate: '2026-06-30',
    value: 1212500000,
    isPaymentLinked: true,
    status: 'AT_RISK',
    createdBy: userId,
    updatedBy: userId,
  });

  // Add bank guarantee
  contractService.createBankGuarantee({
    contractId: contract1.id,
    bgType: 'PERFORMANCE',
    bgNumber: 'BG-SBI-2025-001',
    bankName: 'State Bank of India',
    branchName: 'Mumbai Main Branch',
    amount: 485000000,
    currency: 'INR',
    issueDate: '2025-01-25',
    expiryDate: '2028-08-28',
    claimPeriod: 180,
    beneficiary: 'National Highways Authority of India',
    purpose: 'Performance Guarantee for Mumbai-Pune Expressway',
    projectId: 'proj_001',
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  // Add performance guarantee
  contractService.createPerformanceGuarantee({
    contractId: contract1.id,
    pgNumber: 'PG-HDFC-2025-001',
    bankName: 'HDFC Bank',
    amount: 485000000,
    currency: 'INR',
    issueDate: '2025-01-25',
    expiryDate: '2028-08-28',
    claimPeriod: 180,
    renewalRequired: false,
    status: 'ACTIVE',
    createdBy: userId,
    updatedBy: userId,
  });

  // Add advance
  contractService.createAdvance({
    contractId: contract1.id,
    advanceType: 'MOBILIZATION',
    advanceNumber: 'ADV-MOB-001',
    originalAmount: 485000000,
    releasedAmount: 485000000,
    recoveredAmount: 120000000,
    releaseDate: '2025-03-15',
    recoveryStartBill: 'RA-001',
    status: 'PARTIALLY_RECOVERED',
    createdBy: userId,
    updatedBy: userId,
  });

  // Add retention
  contractService.createRetention({
    contractId: contract1.id,
    retentionPercent: 5,
    totalRetentionAmount: 242500000,
    releasedAmount: 0,
    releaseMilestoneName: 'Final Completion',
    status: 'ACCUMULATING',
    createdBy: userId,
    updatedBy: userId,
  });

  // Add security deposit
  contractService.createSecurityDeposit({
    contractId: contract1.id,
    depositAmount: 242500000,
    depositType: 'FD',
    depositDate: '2025-01-25',
    releaseConditions: 'Upon successful completion and DLP period',
    status: 'DEPOSITED',
    createdBy: userId,
    updatedBy: userId,
  });

  // Add obligations
  contractService.createObligation({
    contractId: contract1.id,
    obligation: 'Submit monthly progress reports',
    clauseReference: 'Clause 15.2',
    responsibleParty: 'CONTRACTOR',
    dueDate: '2026-01-31',
    status: 'IN_PROGRESS',
    risk: 'MEDIUM',
    createdBy: userId,
    updatedBy: userId,
  });

  contractService.createObligation({
    contractId: contract1.id,
    obligation: 'Maintain traffic management plan',
    clauseReference: 'Clause 22.1',
    responsibleParty: 'CONTRACTOR',
    dueDate: '2028-02-28',
    status: 'IN_PROGRESS',
    risk: 'HIGH',
    createdBy: userId,
    updatedBy: userId,
  });

  // Create contract for Chennai Metro
  const contract2 = contractService.createContract({
    companyId,
    contractNumber: 'CT-CMR-002',
    contractCode: 'CMR-CT-002',
    tenderId: 'tender_002',
    tenderNumber: 'CMRL/2025/002',
    projectId: 'proj_002',
    projectName: 'Chennai Metro Phase 2',
    client: 'Chennai Metro Rail Limited',
    contractor: 'BuildCore Infrastructure Pvt Ltd',
    contractType: 'EPC',
    contractValue: 3200000000,
    originalContractValue: 3200000000,
    currency: 'INR',
    gstTreatment: 'EXCLUSIVE',
    awardDate: '2025-04-01',
    commencementDate: '2025-06-01',
    originalCompletionDate: '2029-05-31',
    contractDuration: 1460,
    retentionPercent: 5,
    securityDeposit: 160000000,
    performanceGuarantee: 320000000,
    mobilizationAdvance: 320000000,
    paymentTerms: 'Monthly billing with 30 days payment cycle',
    defectLiability: 24,
    status: 'ACTIVE',
    approvedBy: userId,
    approvedAt: now,
    createdBy: userId,
    updatedBy: userId,
  });

  // Create contract for Godavari Bridge
  const contract3 = contractService.createContract({
    companyId,
    contractNumber: 'CT-GBR-003',
    contractCode: 'GBR-CT-003',
    tenderId: 'tender_003',
    tenderNumber: 'APPRDL/2025/003',
    projectId: 'proj_003',
    projectName: 'Godavari Bridge Rehabilitation',
    client: 'Andhra Pradesh Road Development Corporation',
    contractor: 'BuildCore Infrastructure Pvt Ltd',
    contractType: 'CONSTRUCTION',
    contractValue: 890000000,
    originalContractValue: 890000000,
    currency: 'INR',
    gstTreatment: 'EXCLUSIVE',
    awardDate: '2025-07-15',
    commencementDate: '2025-09-01',
    originalCompletionDate: '2027-08-31',
    contractDuration: 730,
    retentionPercent: 5,
    securityDeposit: 44500000,
    performanceGuarantee: 89000000,
    mobilizationAdvance: 89000000,
    paymentTerms: 'Monthly billing with 45 days payment cycle',
    defectLiability: 12,
    status: 'ACTIVE',
    approvedBy: userId,
    approvedAt: now,
    createdBy: userId,
    updatedBy: userId,
  });
}

// ============================================================
// BUILDCORE ERP - VENDOR MASTER TYPES
// Part 14: Complete Vendor and Business-Partner Management System
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. VENDOR MASTER
// ============================================================
export interface VendorMaster {
  id: string;
  companyId: string;
  vendorId: string;
  vendorCode: string;
  vendorType: VendorType;
  legalName: string;
  tradeName?: string;
  contactPerson: string;
  designation?: string;
  mobile: string;
  email: string;
  address: string;
  state: string;
  district: string;
  city: string;
  pin: string;
  pan?: string;
  gstin?: string;
  tan?: string;
  msmeUdyam?: string;
  bankAccounts: VendorBankAccount[];
  paymentTerms: VendorPaymentTerms;
  creditLimit?: number;
  vendorCategory: string;
  status: VendorStatus;
  blockedReason?: string;
  blockedAt?: string;
  blockedBy?: string;
  
  // KYC & Documents
  kycDocuments: VendorKYC[];
  otherDocuments: VendorDocument[];
  
  // Qualification
  qualification?: VendorQualification;
  
  // Performance
  performanceMetrics?: VendorPerformance;
  scorecard?: VendorScorecard;
  
  // Metadata
  approvedProjects: string[];
  materialMappings: VendorMaterialMapping[];
  communications: VendorCommunication[];
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type VendorType = 
  | 'MATERIAL_SUPPLIER'
  | 'SERVICE_PROVIDER'
  | 'SUBCONTRACTOR'
  | 'LABOUR_CONTRACTOR'
  | 'PLANT_HIRE'
  | 'TRANSPORTER'
  | 'CONSULTANT'
  | 'PROFESSIONAL'
  | 'MANUFACTURER'
  | 'DEALER'
  | 'RMC_CUSTOMER'
  | 'OTHER';

export type VendorStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'BLOCKED'
  | 'INACTIVE';

// ============================================================
// 2. VENDOR BANK ACCOUNT
// ============================================================
export interface VendorBankAccount {
  id: string;
  vendorId: string;
  accountType: 'CURRENT' | 'SAVINGS' | 'OD' | 'CC';
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountNumber: string;
  isPrimary: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  verifiedBy?: string;
}

// ============================================================
// 3. VENDOR PAYMENT TERMS
// ============================================================
export interface VendorPaymentTerms {
  creditDays: number;
  advancePercent?: number;
  retentionPercent?: number;
  paymentType: 'IMMEDIATE' | 'CREDIT_DAYS' | 'MILESTONE' | 'RETENTION' | 'OTHER';
  milestones?: VendorPaymentMilestone[];
  notes?: string;
}

export interface VendorPaymentMilestone {
  id: string;
  sequence: number;
  description: string;
  percent: number;
}

// ============================================================
// 4. VENDOR KYC
// ============================================================
export interface VendorKYC {
  id: string;
  vendorId: string;
  kycType: KYCDocumentType;
  documentNumber: string;
  documentPath: string;
  issueDate: string;
  expiryDate?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  status: EntityStatus;
}

export type KYCDocumentType = 
  | 'PAN'
  | 'GST'
  | 'UDYAM'
  | 'CANCELLED_CHEQUE'
  | 'REGISTRATION'
  | 'ADDRESS_PROOF'
  | 'AGREEMENT'
  | 'AUTHORIZATION'
  | 'CERTIFICATE';

// ============================================================
// 5. VENDOR DOCUMENT
// ============================================================
export interface VendorDocument {
  id: string;
  vendorId: string;
  documentType: string;
  documentName: string;
  documentPath: string;
  uploadedAt: string;
  uploadedBy: string;
  expiryDate?: string;
  status: EntityStatus;
}

// ============================================================
// 6. VENDOR QUALIFICATION
// ============================================================
export interface VendorQualification {
  id: string;
  vendorId: string;
  technicalScore: number; // 0-10
  financialScore: number; // 0-10
  experienceScore: number; // 0-10
  qualityScore: number; // 0-10
  deliveryScore: number; // 0-10
  safetyScore: number; // 0-10
  commercialScore: number; // 0-10
  overallScore: number; // Calculated
  qualifiedDate: string;
  qualifiedBy: string;
  remarks?: string;
  status: 'QUALIFIED' | 'NOT_QUALIFIED' | 'CONDITIONALLY_QUALIFIED';
}

// ============================================================
// 7. APPROVED VENDOR LIST
// ============================================================
export interface ApprovedVendorList {
  id: string;
  projectId: string;
  vendorId: string;
  vendorName: string;
  approvedDate: string;
  approvedBy: string;
  expiryDate?: string;
  remarks?: string;
  status: EntityStatus;
}

// ============================================================
// 8. VENDOR CATEGORY
// ============================================================
export interface VendorCategory {
  id: string;
  companyId: string;
  categoryCode: string;
  categoryName: string;
  parentCategoryId?: string;
  description?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 9. VENDOR MATERIAL MAPPING
// ============================================================
export interface VendorMaterialMapping {
  id: string;
  vendorId: string;
  materialId: string;
  materialName: string;
  brand?: string;
  specification?: string;
  rate: number;
  currency: string;
  leadTime: number; // days
  minimumOrderQuantity?: number;
  isPreferred: boolean;
  lastQuotedDate?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 10. QUOTATION HISTORY
// ============================================================
export interface QuotationHistory {
  id: string;
  vendorId: string;
  quotationNumber: string;
  quotationDate: string;
  materialId?: string;
  materialName?: string;
  quantity: number;
  uom: string;
  rate: number;
  currency: string;
  taxes: number;
  freight?: number;
  validityDays: number;
  deliveryDays: number;
  terms?: string;
  documentPath?: string;
  status: 'RECEIVED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  createdBy: string;
}

// ============================================================
// 11. VENDOR PERFORMANCE
// ============================================================
export interface VendorPerformance {
  id: string;
  vendorId: string;
  period: string; // YYYY-MM
  onTimeDeliveryPercent: number;
  qualityAcceptancePercent: number;
  priceCompetitivenessScore: number; // 0-10
  responseTimeHours: number;
  rejectionRatePercent: number;
  paymentHistoryScore: number; // 0-10
  contractCompliancePercent: number;
  totalOrders: number;
  totalValue: number;
  calculatedAt: string;
}

// ============================================================
// 12. VENDOR SCORECARD
// ============================================================
export interface VendorScorecard {
  id: string;
  vendorId: string;
  qualityWeight: number; // percentage
  deliveryWeight: number;
  priceWeight: number;
  serviceWeight: number;
  overallScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  lastUpdated: string;
  remarks?: string;
}

// ============================================================
// 13. SUBCONTRACTOR MASTER (Extended)
// ============================================================
export interface SubcontractorMaster {
  id: string;
  vendorId: string;
  projectId: string;
  contractId: string;
  scope: string;
  workPackage?: string;
  contractValue: number;
  manpowerCount?: number;
  plantCount?: number;
  performanceSecurity?: number;
  retention?: number;
  advance?: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 14. LABOUR CONTRACTOR
// ============================================================
export interface LabourContractor {
  id: string;
  vendorId: string;
  projectId?: string;
  workerCount: number;
  dailyRate: number;
  contractPeriod: string;
  complianceDocuments: string[];
  attendanceRecords?: any[];
  wageRecords?: any[];
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// 15. VENDOR COMMUNICATION
// ============================================================
export interface VendorCommunication {
  id: string;
  vendorId: string;
  projectId?: string;
  communicationType: 'NOTE' | 'EMAIL' | 'MEETING' | 'LETTER' | 'CALL';
  subject: string;
  content: string;
  sentBy: string;
  sentAt: string;
  isInternal: boolean;
  attachments?: string[];
}

// ============================================================
// 16. VENDOR SEARCH RESULT
// ============================================================
export interface VendorSearchResult {
  vendorId: string;
  vendorCode: string;
  legalName: string;
  vendorType: VendorType;
  vendorCategory: string;
  contactPerson: string;
  mobile: string;
  status: VendorStatus;
  overallScore?: number;
}

// ============================================================
// 17. VENDOR DASHBOARD KPIs
// ============================================================
export interface VendorDashboardKPIs {
  totalVendors: number;
  approvedVendors: number;
  pendingApproval: number;
  blockedVendors: number;
  activeSubcontractors: number;
  labourContractors: number;
  expiringKYC: number;
  expiringDocuments: number;
  averagePerformanceScore: number;
  totalOutstanding: number;
  vendorsWithPerformance: number;
  vendorsWithoutPerformance: number;
}

// ============================================================
// 18. VENDOR NUMBERING CONFIG
// ============================================================
export interface VendorNumberingConfig {
  id: string;
  companyId: string;
  vendorType: VendorType;
  prefix: string;
  sequenceLength: number;
  currentSequence: number;
  resetFrequency: 'NEVER' | 'YEARLY' | 'MONTHLY';
  lastResetAt?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// BUILDCORE ERP - COMMERCIAL MANAGEMENT SERVICE
// Part 23: Commercial Management / Receivables / Claims
// ============================================================

import type {
  Commercial360View,
  ContractPosition,
  ReceivableAgeing,
  AgeingBucket,
  ReceivableAgeingSummary,
  CollectionPlan,
  FollowUpActivity,
  CommercialCorrespondence,
  Claim,
  CommercialRisk,
  CommercialDashboardKPIs,
  ClaimStatusSummary,
  CollectionPerformanceSummary
} from '../types/commercial';

export class CommercialService {
  private static instance: CommercialService;
  
  private ageingBuckets: Map<string, AgeingBucket> = new Map();
  private collectionPlans: Map<string, CollectionPlan> = new Map();
  private followUpActivities: Map<string, FollowUpActivity> = new Map();
  private correspondences: Map<string, CommercialCorrespondence> = new Map();
  private claims: Map<string, Claim> = new Map();
  private commercialRisks: Map<string, CommercialRisk> = new Map();

  private constructor() {}

  static getInstance(): CommercialService {
    if (!CommercialService.instance) {
      CommercialService.instance = new CommercialService();
    }
    return CommercialService.instance;
  }

  // ============================================================
  // COMMERCIAL 360° VIEW
  // ============================================================

  getCommercial360View(projectId: string): Commercial360View {
    // This would aggregate data from multiple sources
    // For now, return mock data
    return {
      projectId,
      contractValue: {
        originalValue: 10000000,
        revisedValue: 10500000,
        variationValue: 500000,
        claimValue: 0,
        totalValue: 10500000
      },
      executionValue: 8000000,
      measuredValue: 7500000,
      billingValue: {
        billedAmount: 7000000,
        certifiedAmount: 6500000,
        uncertifiedAmount: 500000
      },
      certificationValue: {
        certifiedAmount: 6500000,
        pendingCertification: 500000,
        rejectedAmount: 0
      },
      receivableValue: {
        totalReceivable: 6500000,
        currentReceivable: 4000000,
        overdueReceivable: 2500000
      },
      collectionValue: {
        collectedAmount: 4000000,
        pendingCollection: 2500000,
        collectionTarget: 6500000
      },
      profitability: {
        contractValue: 10500000,
        totalCost: 8500000,
        grossProfit: 2000000,
        grossProfitMargin: 19.05,
        netProfit: 1800000,
        netProfitMargin: 17.14
      }
    };
  }

  // ============================================================
  // CONTRACT POSITION
  // ============================================================

  getContractPosition(projectId: string): ContractPosition {
    // This would aggregate data from contracts, billing, etc.
    // For now, return mock data
    return {
      projectId,
      contractId: 'contract_001',
      originalContractValue: 10000000,
      revisedContractValue: 10500000,
      executedValue: 8000000,
      measuredValue: 7500000,
      certifiedValue: 6500000,
      billedValue: 7000000,
      receivedValue: 4000000,
      outstanding: 2500000,
      variance: 500000,
      variancePercent: 5.0
    };
  }

  // ============================================================
  // RECEIVABLE AGEING
  // ============================================================

  getAgeingBuckets(companyId: string): AgeingBucket[] {
    return Array.from(this.ageingBuckets.values()).filter(b => b.companyId === companyId);
  }

  createAgeingBucket(bucket: Omit<AgeingBucket, 'id'>): AgeingBucket {
    const id = `bucket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBucket: AgeingBucket = { ...bucket, id };
    this.ageingBuckets.set(id, newBucket);
    return newBucket;
  }

  getReceivableAgeing(companyId: string): ReceivableAgeing[] {
    // This would calculate ageing based on bills and payments
    // For now, return mock data
    const buckets = this.getAgeingBuckets(companyId);
    const mockAgeing: ReceivableAgeing[] = [
      {
        id: 'ageing_1',
        projectId: 'project_001',
        clientId: 'client_001',
        billId: 'bill_001',
        billNumber: 'BILL-2024-001',
        billDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: 1000000,
        outstandingAmount: 1000000,
        ageingBucket: buckets.find(b => b.bucketName === '1-30') || buckets[0],
        daysOutstanding: 5
      }
    ];
    return mockAgeing;
  }

  getReceivableAgeingSummary(companyId: string): ReceivableAgeingSummary[] {
    const ageing = this.getReceivableAgeing(companyId);
    const buckets = this.getAgeingBuckets(companyId);
    
    return buckets.map(bucket => {
      const bucketAgeing = ageing.filter(a => a.ageingBucket.id === bucket.id);
      const totalAmount = bucketAgeing.reduce((sum, a) => sum + a.outstandingAmount, 0);
      const totalReceivable = ageing.reduce((sum, a) => sum + a.outstandingAmount, 0);
      
      return {
        bucketName: bucket.bucketName,
        count: bucketAgeing.length,
        totalAmount,
        percentage: totalReceivable > 0 ? (totalAmount / totalReceivable) * 100 : 0
      };
    });
  }

  // ============================================================
  // COLLECTION PLANNING
  // ============================================================

  getCollectionPlans(projectId?: string): CollectionPlan[] {
    if (projectId) {
      return Array.from(this.collectionPlans.values()).filter(p => p.projectId === projectId);
    }
    return Array.from(this.collectionPlans.values());
  }

  createCollectionPlan(plan: Omit<CollectionPlan, 'id'>): CollectionPlan {
    const id = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPlan: CollectionPlan = { ...plan, id };
    this.collectionPlans.set(id, newPlan);
    return newPlan;
  }

  updateCollectionPlan(id: string, updates: Partial<CollectionPlan>): CollectionPlan | null {
    const plan = this.collectionPlans.get(id);
    if (!plan) return null;
    
    const updated = { ...plan, ...updates };
    this.collectionPlans.set(id, updated);
    return updated;
  }

  getCollectionPerformanceSummary(projectId: string): CollectionPerformanceSummary {
    const plans = this.getCollectionPlans(projectId);
    const targetAmount = plans.reduce((sum, p) => sum + p.expectedAmount, 0);
    const collectedAmount = plans.reduce((sum, p) => sum + (p.actualReceipt || 0), 0);
    const overdueAmount = plans
      .filter(p => p.status === 'OVERDUE')
      .reduce((sum, p) => sum + p.expectedAmount, 0);
    
    return {
      targetAmount,
      collectedAmount,
      collectionPercentage: targetAmount > 0 ? (collectedAmount / targetAmount) * 100 : 0,
      overdueAmount
    };
  }

  // ============================================================
  // FOLLOW-UP CRM
  // ============================================================

  getFollowUpActivities(projectId?: string, clientId?: string): FollowUpActivity[] {
    let activities = Array.from(this.followUpActivities.values());
    if (projectId) {
      activities = activities.filter(a => a.projectId === projectId);
    }
    if (clientId) {
      activities = activities.filter(a => a.clientId === clientId);
    }
    return activities;
  }

  createFollowUpActivity(activity: Omit<FollowUpActivity, 'id'>): FollowUpActivity {
    const id = `followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newActivity: FollowUpActivity = { ...activity, id };
    this.followUpActivities.set(id, newActivity);
    return newActivity;
  }

  updateFollowUpActivity(id: string, updates: Partial<FollowUpActivity>): FollowUpActivity | null {
    const activity = this.followUpActivities.get(id);
    if (!activity) return null;
    
    const updated = { ...activity, ...updates };
    this.followUpActivities.set(id, updated);
    return updated;
  }

  // ============================================================
  // COMMERCIAL CORRESPONDENCE
  // ============================================================

  getCorrespondences(projectId?: string, contractId?: string): CommercialCorrespondence[] {
    let correspondences = Array.from(this.correspondences.values());
    if (projectId) {
      correspondences = correspondences.filter(c => c.projectId === projectId);
    }
    if (contractId) {
      correspondences = correspondences.filter(c => c.contractId === contractId);
    }
    return correspondences;
  }

  createCorrespondence(correspondence: Omit<CommercialCorrespondence, 'id'>): CommercialCorrespondence {
    const id = `correspondence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCorrespondence: CommercialCorrespondence = { ...correspondence, id };
    this.correspondences.set(id, newCorrespondence);
    return newCorrespondence;
  }

  updateCorrespondence(id: string, updates: Partial<CommercialCorrespondence>): CommercialCorrespondence | null {
    const correspondence = this.correspondences.get(id);
    if (!correspondence) return null;
    
    const updated = { ...correspondence, ...updates };
    this.correspondences.set(id, updated);
    return updated;
  }

  // ============================================================
  // CLAIM MANAGEMENT
  // ============================================================

  getClaims(companyId: string, projectId?: string): Claim[] {
    let claims = Array.from(this.claims.values()).filter(c => c.companyId === companyId);
    if (projectId) {
      claims = claims.filter(c => c.projectId === projectId);
    }
    return claims;
  }

  createClaim(claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Claim {
    const id = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newClaim: Claim = {
      ...claim,
      id,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.claims.set(id, newClaim);
    return newClaim;
  }

  updateClaim(id: string, updates: Partial<Claim>): Claim | null {
    const claim = this.claims.get(id);
    if (!claim) return null;
    
    const updated = {
      ...claim,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: claim.version + 1
    };
    this.claims.set(id, updated);
    return updated;
  }

  getClaimStatusSummary(companyId: string): ClaimStatusSummary[] {
    const claims = this.getClaims(companyId);
    const statuses: Claim['status'][] = ['DRAFT', 'NOTICE_SENT', 'SUBMITTED', 'UNDER_REVIEW', 'QUERY_RAISED', 'IN_NEGOTIATION', 'APPROVED', 'REJECTED', 'CERTIFIED', 'PAID'];
    
    return statuses.map(status => {
      const statusClaims = claims.filter(c => c.status === status);
      const totalAmount = statusClaims.reduce((sum, c) => sum + c.claimAmount, 0);
      
      return {
        status,
        count: statusClaims.length,
        totalAmount
      };
    });
  }

  // ============================================================
  // COMMERCIAL RISK REGISTER
  // ============================================================

  getCommercialRisks(companyId: string, projectId?: string): CommercialRisk[] {
    let risks = Array.from(this.commercialRisks.values()).filter(r => r.companyId === companyId);
    if (projectId) {
      risks = risks.filter(r => r.projectId === projectId);
    }
    return risks;
  }

  createCommercialRisk(risk: Omit<CommercialRisk, 'id' | 'createdAt' | 'updatedAt'>): CommercialRisk {
    const id = `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const newRisk: CommercialRisk = {
      ...risk,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.commercialRisks.set(id, newRisk);
    return newRisk;
  }

  updateCommercialRisk(id: string, updates: Partial<CommercialRisk>): CommercialRisk | null {
    const risk = this.commercialRisks.get(id);
    if (!risk) return null;
    
    const updated = { ...risk, ...updates, updatedAt: new Date().toISOString() };
    this.commercialRisks.set(id, updated);
    return updated;
  }

  // ============================================================
  // COMMERCIAL DASHBOARD KPIs
  // ============================================================

  getCommercialDashboardKPIs(companyId: string): CommercialDashboardKPIs {
    // This would aggregate data from multiple sources
    // For now, return mock data
    return {
      contractValue: 50000000,
      billingValue: 35000000,
      certificationValue: 30000000,
      collectionValue: 25000000,
      outstandingValue: 5000000,
      claimsValue: 2000000,
      variationsValue: 1500000,
      retentionValue: 3000000,
      advanceValue: 5000000,
      commercialRiskScore: 75,
      receivableAgeing: this.getReceivableAgeingSummary(companyId),
      claimStatus: this.getClaimStatusSummary(companyId),
      collectionPerformance: {
        targetAmount: 30000000,
        collectedAmount: 25000000,
        collectionPercentage: 83.33,
        overdueAmount: 2000000
      }
    };
  }
}

export const commercialService = CommercialService.getInstance();

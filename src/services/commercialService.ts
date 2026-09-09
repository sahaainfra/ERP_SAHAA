// ============================================================
// BUILDCORE ERP - COMMERCIAL CHANGE CONTROL SERVICE
// Part 12: Complete Commercial Change-Control System
// ============================================================

import type {
  VariationMaster, DeviationControl, ExtraItem, RateNegotiation,
  ClientInstruction, SiteInstruction, ClaimRegister, EOTRegister,
  DelayEvent, CommercialImpact, ChangeRegister, CommercialDashboardKPIs,
  CommercialAlert, VariationType, VariationStatus, ClaimType, ClaimStatus,
  EOTReason, EOTStatus, CommercialAlertType, NegotiationEntry
} from '../types/commercial';

export class CommercialService {
  private static instance: CommercialService;

  private variations: Map<string, VariationMaster> = new Map();
  private deviations: Map<string, DeviationControl> = new Map();
  private extraItems: Map<string, ExtraItem> = new Map();
  private rateNegotiations: Map<string, RateNegotiation> = new Map();
  private clientInstructions: Map<string, ClientInstruction> = new Map();
  private siteInstructions: Map<string, SiteInstruction> = new Map();
  private claims: Map<string, ClaimRegister> = new Map();
  private eots: Map<string, EOTRegister> = new Map();
  private delayEvents: Map<string, DelayEvent> = new Map();
  private commercialImpacts: Map<string, CommercialImpact> = new Map();
  private changeRegister: Map<string, ChangeRegister> = new Map();
  private alerts: Map<string, CommercialAlert> = new Map();

  private constructor() {}

  static getInstance(): CommercialService {
    if (!CommercialService.instance) {
      CommercialService.instance = new CommercialService();
    }
    return CommercialService.instance;
  }

  // ============================================================
  // VARIATION MANAGEMENT
  // ============================================================

  createVariation(data: Omit<VariationMaster, 'id' | 'varianceQuantity' | 'varianceAmount' | 'percentageVariance' | 'createdAt' | 'updatedAt' | 'version'>): VariationMaster {
    const now = new Date().toISOString();
    
    // Calculate variances
    const varianceQuantity = data.revisedQuantity - data.originalQuantity;
    const varianceAmount = varianceQuantity * data.approvedRate;
    const percentageVariance = data.originalAmount > 0 
      ? (varianceAmount / data.originalAmount) * 100 
      : 0;

    const variation: VariationMaster = {
      ...data,
      id: `var_${this.generateId()}`,
      varianceQuantity,
      varianceAmount,
      percentageVariance,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.variations.set(variation.id, variation);
    this.addToChangeRegister({
      changeType: 'VARIATION',
      changeId: variation.id,
      changeNumber: variation.variationNumber,
      projectId: variation.projectId,
      contractId: variation.contractId,
      description: variation.description,
      value: variation.varianceAmount,
      status: variation.status,
      date: variation.initiatedDate,
      impact: varianceAmount !== 0 ? 'COST' : 'NONE',
    });

    return variation;
  }

  getVariation(id: string): VariationMaster | undefined {
    return this.variations.get(id);
  }

  getVariationsByContract(contractId: string): VariationMaster[] {
    return Array.from(this.variations.values()).filter(v => v.contractId === contractId);
  }

  updateVariationStatus(id: string, status: VariationStatus, approvedBy?: string): VariationMaster | null {
    const variation = this.variations.get(id);
    if (!variation) return null;

    const now = new Date().toISOString();
    variation.status = status;
    variation.updatedAt = now;
    variation.version += 1;

    if (status === 'APPROVED' && approvedBy) {
      variation.approvedBy = approvedBy;
      variation.approvedAt = now;
    }

    // Update change register
    const changeEntry = Array.from(this.changeRegister.values()).find(
      c => c.changeId === id && c.changeType === 'VARIATION'
    );
    if (changeEntry) {
      changeEntry.status = status;
    }

    return variation;
  }

  // ============================================================
  // DEVIATION CONTROL
  // ============================================================

  createDeviationControl(data: Omit<DeviationControl, 'id' | 'deviationPercent' | 'approvalRequired' | 'status' | 'alertSent' | 'createdAt' | 'updatedAt'>): DeviationControl {
    const now = new Date().toISOString();
    
    const balanceQuantity = data.contractQuantity - data.executedQuantity;
    const deviationPercent = data.contractQuantity > 0
      ? ((data.executedQuantity - data.contractQuantity) / data.contractQuantity) * 100
      : 0;
    
    const approvalRequired = Math.abs(deviationPercent) > data.allowedThreshold;
    
    let status: DeviationControl['status'] = 'WITHIN_LIMIT';
    if (approvalRequired) {
      status = 'THRESHOLD_EXCEEDED';
    }

    const deviation: DeviationControl = {
      ...data,
      id: `dev_${this.generateId()}`,
      balanceQuantity,
      deviationPercent,
      approvalRequired,
      status,
      alertSent: false,
      createdAt: now,
      updatedAt: now,
    };

    this.deviations.set(deviation.id, deviation);

    // Create alert if threshold exceeded
    if (approvalRequired) {
      this.createAlert({
        alertType: 'VARIATION_THRESHOLD_EXCEEDED',
        title: 'Deviation Threshold Exceeded',
        message: `Item ${data.itemNumber} has exceeded allowed deviation threshold by ${Math.abs(deviationPercent - data.allowedThreshold).toFixed(2)}%`,
        severity: 'HIGH',
        entityId: deviation.id,
        entityType: 'DEVIATION',
      });
    }

    return deviation;
  }

  getDeviationControl(id: string): DeviationControl | undefined {
    return this.deviations.get(id);
  }

  getDeviationsByContract(contractId: string): DeviationControl[] {
    return Array.from(this.deviations.values()).filter(d => d.contractId === contractId);
  }

  updateDeviationExecutedQuantity(id: string, executedQuantity: number): DeviationControl | null {
    const deviation = this.deviations.get(id);
    if (!deviation) return null;

    deviation.executedQuantity = executedQuantity;
    deviation.balanceQuantity = deviation.contractQuantity - executedQuantity;
    deviation.deviationPercent = deviation.contractQuantity > 0
      ? ((executedQuantity - deviation.contractQuantity) / deviation.contractQuantity) * 100
      : 0;
    
    deviation.approvalRequired = Math.abs(deviation.deviationPercent) > deviation.allowedThreshold;
    
    if (deviation.approvalRequired && deviation.status === 'WITHIN_LIMIT') {
      deviation.status = 'THRESHOLD_EXCEEDED';
      deviation.alertSent = true;
      
      this.createAlert({
        alertType: 'VARIATION_THRESHOLD_EXCEEDED',
        title: 'Deviation Threshold Exceeded',
        message: `Item ${deviation.itemNumber} has exceeded allowed deviation threshold`,
        severity: 'HIGH',
        entityId: deviation.id,
        entityType: 'DEVIATION',
      });
    } else if (!deviation.approvalRequired) {
      deviation.status = 'WITHIN_LIMIT';
    }

    deviation.updatedAt = new Date().toISOString();
    return deviation;
  }

  // ============================================================
  // EXTRA ITEM MANAGEMENT
  // ============================================================

  createExtraItem(data: Omit<ExtraItem, 'id' | 'createdAt' | 'updatedAt'>): ExtraItem {
    const now = new Date().toISOString();
    
    const extraItem: ExtraItem = {
      ...data,
      id: `ext_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.extraItems.set(extraItem.id, extraItem);
    this.addToChangeRegister({
      changeType: 'EXTRA_ITEM',
      changeId: extraItem.id,
      changeNumber: extraItem.extraItemNumber,
      projectId: extraItem.projectId,
      contractId: extraItem.contractId,
      description: extraItem.description,
      value: extraItem.quantity * (extraItem.approvedRate || extraItem.proposedRate),
      status: extraItem.status,
      date: now,
      impact: 'COST',
    });

    return extraItem;
  }

  getExtraItem(id: string): ExtraItem | undefined {
    return this.extraItems.get(id);
  }

  getExtraItemsByContract(contractId: string): ExtraItem[] {
    return Array.from(this.extraItems.values()).filter(e => e.contractId === contractId);
  }

  updateExtraItemStatus(id: string, status: ExtraItem['status'], approvedBy?: string, approvedRate?: number): ExtraItem | null {
    const extraItem = this.extraItems.get(id);
    if (!extraItem) return null;

    const now = new Date().toISOString();
    extraItem.status = status;
    extraItem.updatedAt = now;

    if (status === 'APPROVED') {
      if (approvedBy) extraItem.approvedBy = approvedBy;
      if (approvedRate) extraItem.approvedRate = approvedRate;
      extraItem.approvedAt = now;
    }

    // Update change register
    const changeEntry = Array.from(this.changeRegister.values()).find(
      c => c.changeId === id && c.changeType === 'EXTRA_ITEM'
    );
    if (changeEntry) {
      changeEntry.status = status;
      changeEntry.value = extraItem.quantity * (extraItem.approvedRate || extraItem.proposedRate);
    }

    return extraItem;
  }

  // ============================================================
  // RATE NEGOTIATION
  // ============================================================

  createRateNegotiation(data: Omit<RateNegotiation, 'id' | 'createdAt' | 'updatedAt'>): RateNegotiation {
    const now = new Date().toISOString();
    
    const negotiation: RateNegotiation = {
      ...data,
      id: `neg_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.rateNegotiations.set(negotiation.id, negotiation);
    return negotiation;
  }

  addNegotiationEntry(negotiationId: string, entry: Omit<NegotiationEntry, 'id'>): RateNegotiation | null {
    const negotiation = this.rateNegotiations.get(negotiationId);
    if (!negotiation) return null;

    negotiation.negotiationHistory.push({
      ...entry,
      id: `neg_entry_${this.generateId()}`,
    });
    negotiation.updatedAt = new Date().toISOString();

    return negotiation;
  }

  completeNegotiation(negotiationId: string, finalApprovedRate: number): RateNegotiation | null {
    const negotiation = this.rateNegotiations.get(negotiationId);
    if (!negotiation) return null;

    negotiation.finalApprovedRate = finalApprovedRate;
    negotiation.status = 'COMPLETED';
    negotiation.conclusionDate = new Date().toISOString();
    negotiation.updatedAt = new Date().toISOString();

    // Update related extra item or variation
    if (negotiation.extraItemId) {
      const extraItem = this.extraItems.get(negotiation.extraItemId);
      if (extraItem) {
        extraItem.approvedRate = finalApprovedRate;
      }
    }

    return negotiation;
  }

  // ============================================================
  // CLIENT INSTRUCTION
  // ============================================================

  createClientInstruction(data: Omit<ClientInstruction, 'id' | 'createdAt' | 'updatedAt'>): ClientInstruction {
    const now = new Date().toISOString();
    
    const instruction: ClientInstruction = {
      ...data,
      id: `ci_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.clientInstructions.set(instruction.id, instruction);
    this.addToChangeRegister({
      changeType: 'INSTRUCTION',
      changeId: instruction.id,
      changeNumber: instruction.instructionNumber,
      projectId: instruction.projectId,
      contractId: instruction.contractId,
      description: instruction.description,
      value: 0, // Value to be determined
      status: instruction.status,
      date: instruction.instructionDate,
      impact: 'BOTH', // May affect both cost and time
    });

    return instruction;
  }

  getClientInstruction(id: string): ClientInstruction | undefined {
    return this.clientInstructions.get(id);
  }

  getClientInstructionsByContract(contractId: string): ClientInstruction[] {
    return Array.from(this.clientInstructions.values()).filter(i => i.contractId === contractId);
  }

  // ============================================================
  // SITE INSTRUCTION
  // ============================================================

  createSiteInstruction(data: Omit<SiteInstruction, 'id' | 'createdAt' | 'updatedAt'>): SiteInstruction {
    const now = new Date().toISOString();
    
    const instruction: SiteInstruction = {
      ...data,
      id: `si_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.siteInstructions.set(instruction.id, instruction);
    return instruction;
  }

  getSiteInstruction(id: string): SiteInstruction | undefined {
    return this.siteInstructions.get(id);
  }

  getSiteInstructionsByContract(contractId: string): SiteInstruction[] {
    return Array.from(this.siteInstructions.values()).filter(i => i.contractId === contractId);
  }

  // ============================================================
  // CLAIM MANAGEMENT
  // ============================================================

  createClaim(data: Omit<ClaimRegister, 'id' | 'createdAt' | 'updatedAt' | 'version'>): ClaimRegister {
    const now = new Date().toISOString();
    
    const claim: ClaimRegister = {
      ...data,
      id: `claim_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.claims.set(claim.id, claim);
    this.addToChangeRegister({
      changeType: 'CLAIM',
      changeId: claim.id,
      changeNumber: claim.claimNumber,
      projectId: claim.projectId,
      contractId: claim.contractId,
      description: `${claim.claimType.replace(/_/g, ' ')}: ${claim.basis}`,
      value: claim.claimAmount,
      status: claim.status,
      date: claim.eventDate,
      impact: 'COST',
    });

    return claim;
  }

  getClaim(id: string): ClaimRegister | undefined {
    return this.claims.get(id);
  }

  getClaimsByContract(contractId: string): ClaimRegister[] {
    return Array.from(this.claims.values()).filter(c => c.contractId === contractId);
  }

  updateClaimStatus(id: string, status: ClaimStatus, additionalData?: Partial<ClaimRegister>): ClaimRegister | null {
    const claim = this.claims.get(id);
    if (!claim) return null;

    const now = new Date().toISOString();
    claim.status = status;
    claim.updatedAt = now;
    claim.version += 1;

    if (additionalData) {
      Object.assign(claim, additionalData);
    }

    // Update change register
    const changeEntry = Array.from(this.changeRegister.values()).find(
      c => c.changeId === id && c.changeType === 'CLAIM'
    );
    if (changeEntry) {
      changeEntry.status = status;
    }

    return claim;
  }

  // ============================================================
  // EOT MANAGEMENT
  // ============================================================

  createEOT(data: Omit<EOTRegister, 'id' | 'createdAt' | 'updatedAt' | 'version'>): EOTRegister {
    const now = new Date().toISOString();
    
    const eot: EOTRegister = {
      ...data,
      id: `eot_${this.generateId()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.eots.set(eot.id, eot);
    this.addToChangeRegister({
      changeType: 'EOT',
      changeId: eot.id,
      changeNumber: eot.eotNumber,
      projectId: eot.projectId,
      contractId: eot.contractId,
      description: `${eot.reason.replace(/_/g, ' ')}: ${eot.eventDescription}`,
      value: 0, // Time impact, not cost
      status: eot.status,
      date: eot.eventStartDate,
      impact: 'TIME',
    });

    return eot;
  }

  getEOT(id: string): EOTRegister | undefined {
    return this.eots.get(id);
  }

  getEOTsByContract(contractId: string): EOTRegister[] {
    return Array.from(this.eots.values()).filter(e => e.contractId === contractId);
  }

  approveEOT(id: string, approvedExtension: number, approvedBy: string): EOTRegister | null {
    const eot = this.eots.get(id);
    if (!eot) return null;

    const now = new Date().toISOString();
    eot.approvedExtension = approvedExtension;
    eot.status = approvedExtension > 0 ? 'APPROVED' : 'PARTIALLY_APPROVED';
    eot.approvedBy = approvedBy;
    eot.approvedAt = now;
    eot.updatedAt = now;
    eot.version += 1;

    // Calculate revised completion date
    const originalDate = new Date(eot.originalCompletionDate);
    originalDate.setDate(originalDate.getDate() + approvedExtension);
    eot.revisedCompletionDate = originalDate.toISOString();

    // Update change register
    const changeEntry = Array.from(this.changeRegister.values()).find(
      c => c.changeId === id && c.changeType === 'EOT'
    );
    if (changeEntry) {
      changeEntry.status = eot.status;
    }

    return eot;
  }

  // ============================================================
  // DELAY EVENT MANAGEMENT
  // ============================================================

  createDelayEvent(data: Omit<DelayEvent, 'id' | 'durationDays' | 'createdAt' | 'updatedAt'>): DelayEvent {
    const now = new Date().toISOString();
    
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : new Date();
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const event: DelayEvent = {
      ...data,
      id: `delay_${this.generateId()}`,
      durationDays,
      createdAt: now,
      updatedAt: now,
    };

    this.delayEvents.set(event.id, event);
    return event;
  }

  getDelayEvent(id: string): DelayEvent | undefined {
    return this.delayEvents.get(id);
  }

  getDelayEventsByContract(contractId: string): DelayEvent[] {
    return Array.from(this.delayEvents.values()).filter(e => e.contractId === contractId);
  }

  linkDelayToClaim(delayEventId: string, claimId: string): DelayEvent | null {
    const event = this.delayEvents.get(delayEventId);
    if (!event) return null;

    event.claimId = claimId;
    event.updatedAt = new Date().toISOString();
    return event;
  }

  linkDelayToEOT(delayEventId: string, eotId: string): DelayEvent | null {
    const event = this.delayEvents.get(delayEventId);
    if (!event) return null;

    event.eotId = eotId;
    event.updatedAt = new Date().toISOString();
    return event;
  }

  // ============================================================
  // COMMERCIAL IMPACT CALCULATION
  // ============================================================

  calculateCommercialImpact(
    entityId: string,
    entityType: 'VARIATION' | 'CLAIM' | 'EOT',
    data: Omit<CommercialImpact, 'id' | 'totalImpact' | 'calculatedAt'>
  ): CommercialImpact {
    const totalImpact = 
      data.additionalCost +
      data.lostProductivity +
      data.idlePlant +
      data.idleManpower +
      data.materialEscalation +
      data.overhead +
      data.revenueImpact;

    const impact: CommercialImpact = {
      ...data,
      id: `impact_${this.generateId()}`,
      totalImpact,
      calculatedAt: new Date().toISOString(),
    };

    if (entityType === 'VARIATION') {
      impact.variationId = entityId;
    } else if (entityType === 'CLAIM') {
      impact.claimId = entityId;
    } else if (entityType === 'EOT') {
      impact.eotId = entityId;
    }

    this.commercialImpacts.set(impact.id, impact);
    return impact;
  }

  getCommercialImpact(id: string): CommercialImpact | undefined {
    return this.commercialImpacts.get(id);
  }

  // ============================================================
  // CHANGE REGISTER
  // ============================================================

  private addToChangeRegister(data: Omit<ChangeRegister, 'id'>): void {
    const entry: ChangeRegister = {
      ...data,
      id: `change_${this.generateId()}`,
    };
    this.changeRegister.set(entry.id, entry);
  }

  getChangeRegister(projectId: string, contractId?: string): ChangeRegister[] {
    return Array.from(this.changeRegister.values()).filter(c => {
      if (contractId) {
        return c.projectId === projectId && c.contractId === contractId;
      }
      return c.projectId === projectId;
    });
  }

  // ============================================================
  // ALERT MANAGEMENT
  // ============================================================

  createAlert(data: Omit<CommercialAlert, 'id' | 'isAcknowledged' | 'createdAt'>): CommercialAlert {
    const alert: CommercialAlert = {
      ...data,
      id: `alert_${this.generateId()}`,
      isAcknowledged: false,
      createdAt: new Date().toISOString(),
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  getAlerts(isAcknowledged?: boolean): CommercialAlert[] {
    return Array.from(this.alerts.values()).filter(a => 
      isAcknowledged === undefined || a.isAcknowledged === isAcknowledged
    );
  }

  acknowledgeAlert(id: string, acknowledgedBy: string): CommercialAlert | null {
    const alert = this.alerts.get(id);
    if (!alert) return null;

    alert.isAcknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = acknowledgedBy;

    return alert;
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getCommercialDashboardKPIs(projectId: string, contractId: string): CommercialDashboardKPIs {
    const variations = this.getVariationsByContract(contractId);
    const extraItems = this.getExtraItemsByContract(contractId);
    const claims = this.getClaimsByContract(contractId);
    const eots = this.getEOTsByContract(contractId);
    const deviations = this.getDeviationsByContract(contractId);

    const pendingVariations = variations.filter(v => v.status !== 'APPROVED' && v.status !== 'REJECTED');
    const approvedVariations = variations.filter(v => v.status === 'APPROVED');
    const pendingExtraItems = extraItems.filter(e => e.status !== 'APPROVED' && e.status !== 'REJECTED');
    const pendingClaims = claims.filter(c => !['APPROVED', 'REJECTED', 'PAID', 'CLOSED'].includes(c.status));
    const approvedClaims = claims.filter(c => c.status === 'APPROVED' || c.status === 'PAID');
    const approvedEOTs = eots.filter(e => e.status === 'APPROVED' || e.status === 'PARTIALLY_APPROVED');

    // Calculate claim ageing
    const now = new Date();
    const claimAgeing: { bucket: string; count: number; value: number }[] = [
      { bucket: '0-30', count: 0, value: 0 },
      { bucket: '31-60', count: 0, value: 0 },
      { bucket: '61-90', count: 0, value: 0 },
      { bucket: '90+', count: 0, value: 0 },
    ];

    pendingClaims.forEach(claim => {
      const daysPending = Math.ceil((now.getTime() - new Date(claim.submissionDate || claim.noticeDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysPending <= 30) {
        claimAgeing[0].count++;
        claimAgeing[0].value += claim.claimAmount;
      } else if (daysPending <= 60) {
        claimAgeing[1].count++;
        claimAgeing[1].value += claim.claimAmount;
      } else if (daysPending <= 90) {
        claimAgeing[2].count++;
        claimAgeing[2].value += claim.claimAmount;
      } else {
        claimAgeing[3].count++;
        claimAgeing[3].value += claim.claimAmount;
      }
    });

    // Calculate total EOT days
    const totalEOTDays = approvedEOTs.reduce((sum, eot) => sum + (eot.approvedExtension || 0), 0);

    // Calculate delay days
    const delayEvents = this.getDelayEventsByContract(contractId);
    const delayDays = delayEvents.reduce((sum, event) => sum + event.durationDays, 0);

    // Calculate potential recovery (approved claims - paid claims)
    const potentialRecovery = approvedClaims
      .filter(c => c.status === 'APPROVED')
      .reduce((sum, c) => {
        const amount = typeof c.approvedAmount === 'string' ? parseFloat(c.approvedAmount) : (c.approvedAmount || 0);
        return sum + amount;
      }, 0);

    // Count deviation alerts
    const deviationAlerts = deviations.filter(d => d.status === 'THRESHOLD_EXCEEDED').length;

    return {
      totalVariations: variations.length,
      variationValue: approvedVariations.reduce((sum, v) => sum + v.varianceAmount, 0),
      pendingVariations: pendingVariations.length,
      approvedVariations: approvedVariations.length,
      extraItemValue: extraItems
        .filter(e => e.status === 'APPROVED')
        .reduce((sum, e) => sum + (e.quantity * (e.approvedRate || e.proposedRate)), 0),
      pendingExtraItems: pendingExtraItems.length,
      totalClaims: claims.length,
      claimValue: claims.reduce((sum, c) => sum + c.claimAmount, 0),
      pendingClaims: pendingClaims.length,
      approvedClaims: approvedClaims.length,
      claimAgeing,
      eotRequests: eots.length,
      approvedEOT: approvedEOTs.length,
      totalEOTDays,
      delayDays,
      potentialRecovery,
      deviationAlerts,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const commercialService = CommercialService.getInstance();

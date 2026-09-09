// ============================================================
// BUILDCORE ERP - COMMERCIAL CHANGE CONTROL STORE
// Part 12: Complete Commercial Change-Control System
// ============================================================

import { create } from 'zustand';
import type {
  VariationMaster, DeviationControl, ExtraItem, RateNegotiation,
  ClientInstruction, SiteInstruction, ClaimRegister, EOTRegister,
  DelayEvent, CommercialImpact, ChangeRegister, CommercialDashboardKPIs,
  CommercialAlert, VariationStatus, ClaimStatus
} from '../types/commercial';
import { commercialService } from '../services/commercialService';

interface CommercialState {
  // Data
  variations: VariationMaster[];
  deviations: DeviationControl[];
  extraItems: ExtraItem[];
  rateNegotiations: RateNegotiation[];
  clientInstructions: ClientInstruction[];
  siteInstructions: SiteInstruction[];
  claims: ClaimRegister[];
  eots: EOTRegister[];
  delayEvents: DelayEvent[];
  commercialImpacts: CommercialImpact[];
  changeRegister: ChangeRegister[];
  alerts: CommercialAlert[];
  dashboardKPIs: CommercialDashboardKPIs | null;
  
  // Filters
  selectedContractId: string | null;
  selectedProjectId: string | null;
  
  // Actions
  initialize: () => void;
  setContractFilter: (contractId: string | null) => void;
  setProjectFilter: (projectId: string | null) => void;
  
  // Variation actions
  createVariation: (data: any) => VariationMaster;
  getVariationsByContract: (contractId: string) => VariationMaster[];
  updateVariationStatus: (id: string, status: VariationStatus, approvedBy?: string) => void;
  
  // Deviation actions
  createDeviationControl: (data: any) => DeviationControl;
  getDeviationsByContract: (contractId: string) => DeviationControl[];
  updateDeviationExecutedQuantity: (id: string, executedQuantity: number) => void;
  
  // Extra Item actions
  createExtraItem: (data: any) => ExtraItem;
  getExtraItemsByContract: (contractId: string) => ExtraItem[];
  updateExtraItemStatus: (id: string, status: ExtraItem['status'], approvedBy?: string, approvedRate?: number) => void;
  
  // Rate Negotiation actions
  createRateNegotiation: (data: any) => RateNegotiation;
  addNegotiationEntry: (negotiationId: string, entry: any) => void;
  completeNegotiation: (negotiationId: string, finalApprovedRate: number) => void;
  
  // Client Instruction actions
  createClientInstruction: (data: any) => ClientInstruction;
  getClientInstructionsByContract: (contractId: string) => ClientInstruction[];
  
  // Site Instruction actions
  createSiteInstruction: (data: any) => SiteInstruction;
  getSiteInstructionsByContract: (contractId: string) => SiteInstruction[];
  
  // Claim actions
  createClaim: (data: any) => ClaimRegister;
  getClaimsByContract: (contractId: string) => ClaimRegister[];
  updateClaimStatus: (id: string, status: ClaimStatus, additionalData?: Partial<ClaimRegister>) => void;
  
  // EOT actions
  createEOT: (data: any) => EOTRegister;
  getEOTsByContract: (contractId: string) => EOTRegister[];
  approveEOT: (id: string, approvedExtension: number, approvedBy: string) => void;
  
  // Delay Event actions
  createDelayEvent: (data: any) => DelayEvent;
  getDelayEventsByContract: (contractId: string) => DelayEvent[];
  linkDelayToClaim: (delayEventId: string, claimId: string) => void;
  linkDelayToEOT: (delayEventId: string, eotId: string) => void;
  
  // Commercial Impact actions
  calculateCommercialImpact: (entityId: string, entityType: 'VARIATION' | 'CLAIM' | 'EOT', data: any) => CommercialImpact;
  
  // Change Register actions
  getChangeRegister: (projectId: string, contractId?: string) => ChangeRegister[];
  
  // Alert actions
  getAlerts: (isAcknowledged?: boolean) => CommercialAlert[];
  acknowledgeAlert: (id: string, acknowledgedBy: string) => void;
  
  // Dashboard actions
  loadDashboardKPIs: (projectId: string, contractId: string) => void;
}

export const useCommercialStore = create<CommercialState>((set, get) => ({
  // Initial state
  variations: [],
  deviations: [],
  extraItems: [],
  rateNegotiations: [],
  clientInstructions: [],
  siteInstructions: [],
  claims: [],
  eots: [],
  delayEvents: [],
  commercialImpacts: [],
  changeRegister: [],
  alerts: [],
  dashboardKPIs: null,
  selectedContractId: null,
  selectedProjectId: null,

  // Initialize
  initialize: () => {
    // Initialize with demo data if needed
  },

  // Filters
  setContractFilter: (contractId: string | null) => {
    set({ selectedContractId: contractId });
  },

  setProjectFilter: (projectId: string | null) => {
    set({ selectedProjectId: projectId });
  },

  // Variation actions
  createVariation: (data) => {
    const variation = commercialService.createVariation(data);
    set(state => ({ variations: [...state.variations, variation] }));
    return variation;
  },

  getVariationsByContract: (contractId: string) => {
    return commercialService.getVariationsByContract(contractId);
  },

  updateVariationStatus: (id: string, status: VariationStatus, approvedBy?: string) => {
    const variation = commercialService.updateVariationStatus(id, status, approvedBy);
    if (variation) {
      set(state => ({
        variations: state.variations.map(v => v.id === id ? variation : v)
      }));
    }
  },

  // Deviation actions
  createDeviationControl: (data) => {
    const deviation = commercialService.createDeviationControl(data);
    set(state => ({ deviations: [...state.deviations, deviation] }));
    return deviation;
  },

  getDeviationsByContract: (contractId: string) => {
    return commercialService.getDeviationsByContract(contractId);
  },

  updateDeviationExecutedQuantity: (id: string, executedQuantity: number) => {
    const deviation = commercialService.updateDeviationExecutedQuantity(id, executedQuantity);
    if (deviation) {
      set(state => ({
        deviations: state.deviations.map(d => d.id === id ? deviation : d)
      }));
    }
  },

  // Extra Item actions
  createExtraItem: (data) => {
    const extraItem = commercialService.createExtraItem(data);
    set(state => ({ extraItems: [...state.extraItems, extraItem] }));
    return extraItem;
  },

  getExtraItemsByContract: (contractId: string) => {
    return commercialService.getExtraItemsByContract(contractId);
  },

  updateExtraItemStatus: (id: string, status: ExtraItem['status'], approvedBy?: string, approvedRate?: number) => {
    const extraItem = commercialService.updateExtraItemStatus(id, status, approvedBy, approvedRate);
    if (extraItem) {
      set(state => ({
        extraItems: state.extraItems.map(e => e.id === id ? extraItem : e)
      }));
    }
  },

  // Rate Negotiation actions
  createRateNegotiation: (data) => {
    const negotiation = commercialService.createRateNegotiation(data);
    set(state => ({ rateNegotiations: [...state.rateNegotiations, negotiation] }));
    return negotiation;
  },

  addNegotiationEntry: (negotiationId: string, entry: any) => {
    const negotiation = commercialService.addNegotiationEntry(negotiationId, entry);
    if (negotiation) {
      set(state => ({
        rateNegotiations: state.rateNegotiations.map(n => n.id === negotiationId ? negotiation : n)
      }));
    }
  },

  completeNegotiation: (negotiationId: string, finalApprovedRate: number) => {
    const negotiation = commercialService.completeNegotiation(negotiationId, finalApprovedRate);
    if (negotiation) {
      set(state => ({
        rateNegotiations: state.rateNegotiations.map(n => n.id === negotiationId ? negotiation : n)
      }));
    }
  },

  // Client Instruction actions
  createClientInstruction: (data) => {
    const instruction = commercialService.createClientInstruction(data);
    set(state => ({ clientInstructions: [...state.clientInstructions, instruction] }));
    return instruction;
  },

  getClientInstructionsByContract: (contractId: string) => {
    return commercialService.getClientInstructionsByContract(contractId);
  },

  // Site Instruction actions
  createSiteInstruction: (data) => {
    const instruction = commercialService.createSiteInstruction(data);
    set(state => ({ siteInstructions: [...state.siteInstructions, instruction] }));
    return instruction;
  },

  getSiteInstructionsByContract: (contractId: string) => {
    return commercialService.getSiteInstructionsByContract(contractId);
  },

  // Claim actions
  createClaim: (data) => {
    const claim = commercialService.createClaim(data);
    set(state => ({ claims: [...state.claims, claim] }));
    return claim;
  },

  getClaimsByContract: (contractId: string) => {
    return commercialService.getClaimsByContract(contractId);
  },

  updateClaimStatus: (id: string, status: ClaimStatus, additionalData?: Partial<ClaimRegister>) => {
    const claim = commercialService.updateClaimStatus(id, status, additionalData);
    if (claim) {
      set(state => ({
        claims: state.claims.map(c => c.id === id ? claim : c)
      }));
    }
  },

  // EOT actions
  createEOT: (data) => {
    const eot = commercialService.createEOT(data);
    set(state => ({ eots: [...state.eots, eot] }));
    return eot;
  },

  getEOTsByContract: (contractId: string) => {
    return commercialService.getEOTsByContract(contractId);
  },

  approveEOT: (id: string, approvedExtension: number, approvedBy: string) => {
    const eot = commercialService.approveEOT(id, approvedExtension, approvedBy);
    if (eot) {
      set(state => ({
        eots: state.eots.map(e => e.id === id ? eot : e)
      }));
    }
  },

  // Delay Event actions
  createDelayEvent: (data) => {
    const event = commercialService.createDelayEvent(data);
    set(state => ({ delayEvents: [...state.delayEvents, event] }));
    return event;
  },

  getDelayEventsByContract: (contractId: string) => {
    return commercialService.getDelayEventsByContract(contractId);
  },

  linkDelayToClaim: (delayEventId: string, claimId: string) => {
    const event = commercialService.linkDelayToClaim(delayEventId, claimId);
    if (event) {
      set(state => ({
        delayEvents: state.delayEvents.map(d => d.id === delayEventId ? event : d)
      }));
    }
  },

  linkDelayToEOT: (delayEventId: string, eotId: string) => {
    const event = commercialService.linkDelayToEOT(delayEventId, eotId);
    if (event) {
      set(state => ({
        delayEvents: state.delayEvents.map(d => d.id === delayEventId ? event : d)
      }));
    }
  },

  // Commercial Impact actions
  calculateCommercialImpact: (entityId: string, entityType: 'VARIATION' | 'CLAIM' | 'EOT', data: any) => {
    const impact = commercialService.calculateCommercialImpact(entityId, entityType, data);
    set(state => ({ commercialImpacts: [...state.commercialImpacts, impact] }));
    return impact;
  },

  // Change Register actions
  getChangeRegister: (projectId: string, contractId?: string) => {
    return commercialService.getChangeRegister(projectId, contractId);
  },

  // Alert actions
  getAlerts: (isAcknowledged?: boolean) => {
    return commercialService.getAlerts(isAcknowledged);
  },

  acknowledgeAlert: (id: string, acknowledgedBy: string) => {
    const alert = commercialService.acknowledgeAlert(id, acknowledgedBy);
    if (alert) {
      set(state => ({
        alerts: state.alerts.map(a => a.id === id ? alert : a)
      }));
    }
  },

  // Dashboard actions
  loadDashboardKPIs: (projectId: string, contractId: string) => {
    const kpis = commercialService.getCommercialDashboardKPIs(projectId, contractId);
    set({ dashboardKPIs: kpis });
  },
}));

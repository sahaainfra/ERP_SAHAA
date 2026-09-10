// ============================================================
// BUILDCORE ERP - QA/QC + HSE + DOCUMENT MANAGEMENT + COMMUNICATION STORE
// Part 06: Quality, Safety, Documents & Communication
// ============================================================

import { create } from 'zustand';
import { qualitySafetyDocsCommsService } from '../services/quality-safety-docs-comms-service';
import type {
  ITP, WIR, MIR, Inspection, Test, NCR, CAPA, MaterialApproval, Calibration,
  SafetyInduction, ToolboxTalk, PPE, SafetyInspection, Permit, Incident, NearMiss, SafetyObservation,
  Document, Drawing, RFI,
  Chat, ChatMessage, ChatAction
} from '../types/quality-safety-docs-comms';

interface QualitySafetyDocsCommsState {
  // QA/QC
  itps: ITP[];
  wirs: WIR[];
  mirs: MIR[];
  inspections: Inspection[];
  tests: Test[];
  ncrs: NCR[];
  capas: CAPA[];
  materialApprovals: MaterialApproval[];
  calibrations: Calibration[];

  // HSE
  safetyInductions: SafetyInduction[];
  toolboxTalks: ToolboxTalk[];
  ppes: PPE[];
  safetyInspections: SafetyInspection[];
  permits: Permit[];
  incidents: Incident[];
  nearMisses: NearMiss[];
  safetyObservations: SafetyObservation[];

  // Document Management
  documents: Document[];
  drawings: Drawing[];
  rfis: RFI[];

  // Communication
  chats: Chat[];
  chatMessages: { [chatId: string]: ChatMessage[] };
  chatActions: ChatAction[];

  // Actions
  loadITPs: (projectId?: string) => void;
  createITP: (data: Omit<ITP, 'id' | 'createdAt' | 'updatedAt'>) => ITP;

  loadWIRs: (projectId?: string) => void;
  createWIR: (data: Omit<WIR, 'id' | 'createdAt' | 'updatedAt' | 'wirNumber' | 'measurementEligible'>) => WIR;
  updateWIR: (id: string, updates: Partial<WIR>) => WIR | null;

  loadMIRs: (projectId?: string) => void;
  createMIR: (data: Omit<MIR, 'id' | 'createdAt' | 'updatedAt' | 'mirNumber'>) => MIR;
  updateMIR: (id: string, updates: Partial<MIR>) => MIR | null;

  loadInspections: (projectId?: string) => void;
  createInspection: (data: Omit<Inspection, 'id' | 'createdAt' | 'updatedAt' | 'inspectionNumber'>) => Inspection;

  loadTests: (projectId?: string) => void;
  createTest: (data: Omit<Test, 'id' | 'createdAt' | 'updatedAt' | 'testNumber'>) => Test;

  loadNCRs: (projectId?: string) => void;
  createNCR: (data: Omit<NCR, 'id' | 'createdAt' | 'updatedAt' | 'ncrNumber'>) => NCR;
  updateNCR: (id: string, updates: Partial<NCR>) => NCR | null;

  loadCAPAs: (projectId?: string) => void;
  createCAPA: (data: Omit<CAPA, 'id' | 'createdAt' | 'updatedAt' | 'capaNumber'>) => CAPA;

  loadMaterialApprovals: (projectId?: string) => void;
  createMaterialApproval: (data: Omit<MaterialApproval, 'id' | 'createdAt' | 'updatedAt'>) => MaterialApproval;

  loadCalibrations: () => void;
  createCalibration: (data: Omit<Calibration, 'id' | 'createdAt' | 'updatedAt'>) => Calibration;

  loadSafetyInductions: (projectId?: string) => void;
  createSafetyInduction: (data: Omit<SafetyInduction, 'id' | 'createdAt' | 'updatedAt'>) => SafetyInduction;

  loadToolboxTalks: (projectId?: string) => void;
  createToolboxTalk: (data: Omit<ToolboxTalk, 'id' | 'createdAt' | 'updatedAt'>) => ToolboxTalk;

  loadPPEs: (projectId?: string) => void;
  createPPE: (data: Omit<PPE, 'id' | 'createdAt' | 'updatedAt'>) => PPE;

  loadSafetyInspections: (projectId?: string) => void;
  createSafetyInspection: (data: Omit<SafetyInspection, 'id' | 'createdAt' | 'updatedAt' | 'inspectionNumber'>) => SafetyInspection;

  loadPermits: (projectId?: string) => void;
  createPermit: (data: Omit<Permit, 'id' | 'createdAt' | 'updatedAt' | 'permitNumber'>) => Permit;
  updatePermit: (id: string, updates: Partial<Permit>) => Permit | null;

  loadIncidents: (projectId?: string) => void;
  createIncident: (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'incidentNumber'>) => Incident;
  updateIncident: (id: string, updates: Partial<Incident>) => Incident | null;

  loadNearMisses: (projectId?: string) => void;
  createNearMiss: (data: Omit<NearMiss, 'id' | 'createdAt' | 'updatedAt' | 'nearMissNumber'>) => NearMiss;

  loadSafetyObservations: (projectId?: string) => void;
  createSafetyObservation: (data: Omit<SafetyObservation, 'id' | 'createdAt' | 'updatedAt' | 'observationNumber'>) => SafetyObservation;
  updateSafetyObservation: (id: string, updates: Partial<SafetyObservation>) => SafetyObservation | null;

  loadDocuments: (projectId?: string) => void;
  createDocument: (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'documentNumber'>) => Document;
  updateDocument: (id: string, updates: Partial<Document>) => Document | null;

  loadDrawings: (projectId?: string) => void;
  createDrawing: (data: Omit<Drawing, 'id' | 'createdAt' | 'updatedAt'>) => Drawing;
  updateDrawing: (id: string, updates: Partial<Drawing>) => Drawing | null;

  loadRFIs: (projectId?: string) => void;
  createRFI: (data: Omit<RFI, 'id' | 'createdAt' | 'updatedAt' | 'rfiNumber'>) => RFI;
  updateRFI: (id: string, updates: Partial<RFI>) => RFI | null;

  loadChats: (userId: string) => void;
  createChat: (data: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>) => Chat;
  loadChatMessages: (chatId: string) => void;
  createChatMessage: (data: Omit<ChatMessage, 'id' | 'createdAt' | 'readBy' | 'pinned' | 'reactions'>) => ChatMessage;
  markMessageAsRead: (messageId: string, userId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  pinMessage: (messageId: string) => void;
  createChatAction: (data: Omit<ChatAction, 'id' | 'createdAt'>) => ChatAction;
  getChatActions: (messageId: string) => ChatAction[];
}

export const useQualitySafetyDocsCommsStore = create<QualitySafetyDocsCommsState>((set) => ({
  // Initial state
  itps: [],
  wirs: [],
  mirs: [],
  inspections: [],
  tests: [],
  ncrs: [],
  capas: [],
  materialApprovals: [],
  calibrations: [],
  safetyInductions: [],
  toolboxTalks: [],
  ppes: [],
  safetyInspections: [],
  permits: [],
  incidents: [],
  nearMisses: [],
  safetyObservations: [],
  documents: [],
  drawings: [],
  rfis: [],
  chats: [],
  chatMessages: {},
  chatActions: [],

  // QA/QC Actions
  loadITPs: (projectId) => {
    const itps = qualitySafetyDocsCommsService.getITPs(projectId);
    set({ itps });
  },

  createITP: (data) => {
    const itp = qualitySafetyDocsCommsService.createITP(data);
    set((state) => ({ itps: [...state.itps, itp] }));
    return itp;
  },

  loadWIRs: (projectId) => {
    const wirs = qualitySafetyDocsCommsService.getWIRs(projectId);
    set({ wirs });
  },

  createWIR: (data) => {
    const wir = qualitySafetyDocsCommsService.createWIR(data);
    set((state) => ({ wirs: [...state.wirs, wir] }));
    return wir;
  },

  updateWIR: (id, updates) => {
    const wir = qualitySafetyDocsCommsService.updateWIR(id, updates);
    if (wir) {
      set((state) => ({
        wirs: state.wirs.map(w => w.id === id ? wir : w)
      }));
    }
    return wir;
  },

  loadMIRs: (projectId) => {
    const mirs = qualitySafetyDocsCommsService.getMIRs(projectId);
    set({ mirs });
  },

  createMIR: (data) => {
    const mir = qualitySafetyDocsCommsService.createMIR(data);
    set((state) => ({ mirs: [...state.mirs, mir] }));
    return mir;
  },

  updateMIR: (id, updates) => {
    const mir = qualitySafetyDocsCommsService.updateMIR(id, updates);
    if (mir) {
      set((state) => ({
        mirs: state.mirs.map(m => m.id === id ? mir : m)
      }));
    }
    return mir;
  },

  loadInspections: (projectId) => {
    const inspections = qualitySafetyDocsCommsService.getInspections(projectId);
    set({ inspections });
  },

  createInspection: (data) => {
    const inspection = qualitySafetyDocsCommsService.createInspection(data);
    set((state) => ({ inspections: [...state.inspections, inspection] }));
    return inspection;
  },

  loadTests: (projectId) => {
    const tests = qualitySafetyDocsCommsService.getTests(projectId);
    set({ tests });
  },

  createTest: (data) => {
    const test = qualitySafetyDocsCommsService.createTest(data);
    set((state) => ({ tests: [...state.tests, test] }));
    return test;
  },

  loadNCRs: (projectId) => {
    const ncrs = qualitySafetyDocsCommsService.getNCRs(projectId);
    set({ ncrs });
  },

  createNCR: (data) => {
    const ncr = qualitySafetyDocsCommsService.createNCR(data);
    set((state) => ({ ncrs: [...state.ncrs, ncr] }));
    return ncr;
  },

  updateNCR: (id, updates) => {
    const ncr = qualitySafetyDocsCommsService.updateNCR(id, updates);
    if (ncr) {
      set((state) => ({
        ncrs: state.ncrs.map(n => n.id === id ? ncr : n)
      }));
    }
    return ncr;
  },

  loadCAPAs: (projectId) => {
    const capas = qualitySafetyDocsCommsService.getCAPAs(projectId);
    set({ capas });
  },

  createCAPA: (data) => {
    const capa = qualitySafetyDocsCommsService.createCAPA(data);
    set((state) => ({ capas: [...state.capas, capa] }));
    return capa;
  },

  loadMaterialApprovals: (projectId) => {
    const materialApprovals = qualitySafetyDocsCommsService.getMaterialApprovals(projectId);
    set({ materialApprovals });
  },

  createMaterialApproval: (data) => {
    const approval = qualitySafetyDocsCommsService.createMaterialApproval(data);
    set((state) => ({ materialApprovals: [...state.materialApprovals, approval] }));
    return approval;
  },

  loadCalibrations: () => {
    const calibrations = qualitySafetyDocsCommsService.getCalibrations();
    set({ calibrations });
  },

  createCalibration: (data) => {
    const calibration = qualitySafetyDocsCommsService.createCalibration(data);
    set((state) => ({ calibrations: [...state.calibrations, calibration] }));
    return calibration;
  },

  // HSE Actions
  loadSafetyInductions: (projectId) => {
    const safetyInductions = qualitySafetyDocsCommsService.getSafetyInductions(projectId);
    set({ safetyInductions });
  },

  createSafetyInduction: (data) => {
    const induction = qualitySafetyDocsCommsService.createSafetyInduction(data);
    set((state) => ({ safetyInductions: [...state.safetyInductions, induction] }));
    return induction;
  },

  loadToolboxTalks: (projectId) => {
    const toolboxTalks = qualitySafetyDocsCommsService.getToolboxTalks(projectId);
    set({ toolboxTalks });
  },

  createToolboxTalk: (data) => {
    const talk = qualitySafetyDocsCommsService.createToolboxTalk(data);
    set((state) => ({ toolboxTalks: [...state.toolboxTalks, talk] }));
    return talk;
  },

  loadPPEs: (projectId) => {
    const ppes = qualitySafetyDocsCommsService.getPPEs(projectId);
    set({ ppes });
  },

  createPPE: (data) => {
    const ppe = qualitySafetyDocsCommsService.createPPE(data);
    set((state) => ({ ppes: [...state.ppes, ppe] }));
    return ppe;
  },

  loadSafetyInspections: (projectId) => {
    const safetyInspections = qualitySafetyDocsCommsService.getSafetyInspections(projectId);
    set({ safetyInspections });
  },

  createSafetyInspection: (data) => {
    const inspection = qualitySafetyDocsCommsService.createSafetyInspection(data);
    set((state) => ({ safetyInspections: [...state.safetyInspections, inspection] }));
    return inspection;
  },

  loadPermits: (projectId) => {
    const permits = qualitySafetyDocsCommsService.getPermits(projectId);
    set({ permits });
  },

  createPermit: (data) => {
    const permit = qualitySafetyDocsCommsService.createPermit(data);
    set((state) => ({ permits: [...state.permits, permit] }));
    return permit;
  },

  updatePermit: (id, updates) => {
    const permit = qualitySafetyDocsCommsService.updatePermit(id, updates);
    if (permit) {
      set((state) => ({
        permits: state.permits.map(p => p.id === id ? permit : p)
      }));
    }
    return permit;
  },

  loadIncidents: (projectId) => {
    const incidents = qualitySafetyDocsCommsService.getIncidents(projectId);
    set({ incidents });
  },

  createIncident: (data) => {
    const incident = qualitySafetyDocsCommsService.createIncident(data);
    set((state) => ({ incidents: [...state.incidents, incident] }));
    return incident;
  },

  updateIncident: (id, updates) => {
    const incident = qualitySafetyDocsCommsService.updateIncident(id, updates);
    if (incident) {
      set((state) => ({
        incidents: state.incidents.map(i => i.id === id ? incident : i)
      }));
    }
    return incident;
  },

  loadNearMisses: (projectId) => {
    const nearMisses = qualitySafetyDocsCommsService.getNearMisses(projectId);
    set({ nearMisses });
  },

  createNearMiss: (data) => {
    const nearMiss = qualitySafetyDocsCommsService.createNearMiss(data);
    set((state) => ({ nearMisses: [...state.nearMisses, nearMiss] }));
    return nearMiss;
  },

  loadSafetyObservations: (projectId) => {
    const safetyObservations = qualitySafetyDocsCommsService.getSafetyObservations(projectId);
    set({ safetyObservations });
  },

  createSafetyObservation: (data) => {
    const observation = qualitySafetyDocsCommsService.createSafetyObservation(data);
    set((state) => ({ safetyObservations: [...state.safetyObservations, observation] }));
    return observation;
  },

  updateSafetyObservation: (id, updates) => {
    const observation = qualitySafetyDocsCommsService.updateSafetyObservation(id, updates);
    if (observation) {
      set((state) => ({
        safetyObservations: state.safetyObservations.map(o => o.id === id ? observation : o)
      }));
    }
    return observation;
  },

  // Document Management Actions
  loadDocuments: (projectId) => {
    const documents = qualitySafetyDocsCommsService.getDocuments(projectId);
    set({ documents });
  },

  createDocument: (data) => {
    const document = qualitySafetyDocsCommsService.createDocument(data);
    set((state) => ({ documents: [...state.documents, document] }));
    return document;
  },

  updateDocument: (id, updates) => {
    const document = qualitySafetyDocsCommsService.updateDocument(id, updates);
    if (document) {
      set((state) => ({
        documents: state.documents.map(d => d.id === id ? document : d)
      }));
    }
    return document;
  },

  loadDrawings: (projectId) => {
    const drawings = qualitySafetyDocsCommsService.getDrawings(projectId);
    set({ drawings });
  },

  createDrawing: (data) => {
    const drawing = qualitySafetyDocsCommsService.createDrawing(data);
    set((state) => ({ drawings: [...state.drawings, drawing] }));
    return drawing;
  },

  updateDrawing: (id, updates) => {
    const drawing = qualitySafetyDocsCommsService.updateDrawing(id, updates);
    if (drawing) {
      set((state) => ({
        drawings: state.drawings.map(d => d.id === id ? drawing : d)
      }));
    }
    return drawing;
  },

  loadRFIs: (projectId) => {
    const rfis = qualitySafetyDocsCommsService.getRFIs(projectId);
    set({ rfis });
  },

  createRFI: (data) => {
    const rfi = qualitySafetyDocsCommsService.createRFI(data);
    set((state) => ({ rfis: [...state.rfis, rfi] }));
    return rfi;
  },

  updateRFI: (id, updates) => {
    const rfi = qualitySafetyDocsCommsService.updateRFI(id, updates);
    if (rfi) {
      set((state) => ({
        rfis: state.rfis.map(r => r.id === id ? rfi : r)
      }));
    }
    return rfi;
  },

  // Communication Actions
  loadChats: (userId) => {
    const chats = qualitySafetyDocsCommsService.getChats(userId);
    set({ chats });
  },

  createChat: (data) => {
    const chat = qualitySafetyDocsCommsService.createChat(data);
    set((state) => ({ chats: [...state.chats, chat] }));
    return chat;
  },

  loadChatMessages: (chatId) => {
    const messages = qualitySafetyDocsCommsService.getChatMessages(chatId);
    set((state) => ({
      chatMessages: { ...state.chatMessages, [chatId]: messages }
    }));
  },

  createChatMessage: (data) => {
    const message = qualitySafetyDocsCommsService.createChatMessage(data);
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [data.chatId]: [...(state.chatMessages[data.chatId] || []), message]
      }
    }));
    return message;
  },

  markMessageAsRead: (messageId, userId) => {
    qualitySafetyDocsCommsService.markMessageAsRead(messageId, userId);
  },

  addReaction: (messageId, emoji, userId) => {
    qualitySafetyDocsCommsService.addReaction(messageId, emoji, userId);
  },

  pinMessage: (messageId) => {
    qualitySafetyDocsCommsService.pinMessage(messageId);
  },

  createChatAction: (data) => {
    const action = qualitySafetyDocsCommsService.createChatAction(data);
    set((state) => ({ chatActions: [...state.chatActions, action] }));
    return action;
  },

  getChatActions: (messageId) => {
    return qualitySafetyDocsCommsService.getChatActions(messageId);
  },
}));

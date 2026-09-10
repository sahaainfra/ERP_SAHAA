// ============================================================
// BUILDCORE ERP - QA/QC + HSE + DOCUMENT MANAGEMENT + COMMUNICATION SERVICE
// Part 29: Quality, Safety, Documents & Communication
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  ITP, WIR, MIR, Inspection, Test, NCR, CAPA, MaterialApproval, Calibration,
  SafetyInduction, ToolboxTalk, PPE, SafetyInspection, Permit, Incident, NearMiss, SafetyObservation,
  Document, Drawing, RFI,
  Chat, ChatMessage, ChatAction, TypingIndicator
} from '../types/quality-safety-docs-comms';

export class QualitySafetyDocsCommsService {
  private static instance: QualitySafetyDocsCommsService;

  // QA/QC Storage
  private itps: Map<string, ITP> = new Map();
  private wirs: Map<string, WIR> = new Map();
  private mirs: Map<string, MIR> = new Map();
  private inspections: Map<string, Inspection> = new Map();
  private tests: Map<string, Test> = new Map();
  private ncrs: Map<string, NCR> = new Map();
  private capas: Map<string, CAPA> = new Map();
  private materialApprovals: Map<string, MaterialApproval> = new Map();
  private calibrations: Map<string, Calibration> = new Map();

  // HSE Storage
  private safetyInductions: Map<string, SafetyInduction> = new Map();
  private toolboxTalks: Map<string, ToolboxTalk> = new Map();
  private ppes: Map<string, PPE> = new Map();
  private safetyInspections: Map<string, SafetyInspection> = new Map();
  private permits: Map<string, Permit> = new Map();
  private incidents: Map<string, Incident> = new Map();
  private nearMisses: Map<string, NearMiss> = new Map();
  private safetyObservations: Map<string, SafetyObservation> = new Map();

  // Document Management Storage
  private documents: Map<string, Document> = new Map();
  private drawings: Map<string, Drawing> = new Map();
  private rfis: Map<string, RFI> = new Map();

  // Communication Storage
  private chats: Map<string, Chat> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();
  private chatActions: Map<string, ChatAction> = new Map();
  private typingIndicators: Map<string, TypingIndicator> = new Map();

  private constructor() {}

  static getInstance(): QualitySafetyDocsCommsService {
    if (!QualitySafetyDocsCommsService.instance) {
      QualitySafetyDocsCommsService.instance = new QualitySafetyDocsCommsService();
    }
    return QualitySafetyDocsCommsService.instance;
  }

  // ============================================================
  // QA/QC METHODS
  // ============================================================

  createITP(data: Omit<ITP, 'id' | 'createdAt' | 'updatedAt'>): ITP {
    const itp: ITP = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.itps.set(itp.id, itp);
    return itp;
  }

  getITPs(projectId?: string): ITP[] {
    const itps = Array.from(this.itps.values());
    return projectId ? itps.filter(itp => itp.projectId === projectId) : itps;
  }

  createWIR(data: Omit<WIR, 'id' | 'createdAt' | 'updatedAt' | 'wirNumber' | 'measurementEligible'>): WIR {
    const wirNumber = `WIR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const wir: WIR = {
      ...data,
      id: uuidv4(),
      wirNumber,
      measurementEligible: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.wirs.set(wir.id, wir);
    return wir;
  }

  getWIRs(projectId?: string): WIR[] {
    const wirs = Array.from(this.wirs.values());
    return projectId ? wirs.filter(wir => wir.projectId === projectId) : wirs;
  }

  updateWIR(id: string, updates: Partial<WIR>): WIR | null {
    const wir = this.wirs.get(id);
    if (!wir) return null;
    
    const updated = { ...wir, ...updates, updatedAt: new Date().toISOString() };
    
    // If inspection result is ACCEPTED, mark as measurement eligible
    if (updates.inspectionResult === 'ACCEPTED') {
      updated.measurementEligible = true;
    }
    
    this.wirs.set(id, updated);
    return updated;
  }

  createMIR(data: Omit<MIR, 'id' | 'createdAt' | 'updatedAt' | 'mirNumber'>): MIR {
    const mirNumber = `MIR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const mir: MIR = {
      ...data,
      id: uuidv4(),
      mirNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mirs.set(mir.id, mir);
    return mir;
  }

  getMIRs(projectId?: string): MIR[] {
    const mirs = Array.from(this.mirs.values());
    return projectId ? mirs.filter(mir => mir.projectId === projectId) : mirs;
  }

  updateMIR(id: string, updates: Partial<MIR>): MIR | null {
    const mir = this.mirs.get(id);
    if (!mir) return null;
    const updated = { ...mir, ...updates, updatedAt: new Date().toISOString() };
    this.mirs.set(id, updated);
    return updated;
  }

  createInspection(data: Omit<Inspection, 'id' | 'createdAt' | 'updatedAt' | 'inspectionNumber'>): Inspection {
    const inspectionNumber = `INS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const inspection: Inspection = {
      ...data,
      id: uuidv4(),
      inspectionNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.inspections.set(inspection.id, inspection);
    return inspection;
  }

  getInspections(projectId?: string): Inspection[] {
    const inspections = Array.from(this.inspections.values());
    return projectId ? inspections.filter(i => i.projectId === projectId) : inspections;
  }

  createTest(data: Omit<Test, 'id' | 'createdAt' | 'updatedAt' | 'testNumber'>): Test {
    const testNumber = `TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const test: Test = {
      ...data,
      id: uuidv4(),
      testNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tests.set(test.id, test);
    return test;
  }

  getTests(projectId?: string): Test[] {
    const tests = Array.from(this.tests.values());
    return projectId ? tests.filter(t => t.projectId === projectId) : tests;
  }

  createNCR(data: Omit<NCR, 'id' | 'createdAt' | 'updatedAt' | 'ncrNumber'>): NCR {
    const ncrNumber = `NCR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const ncr: NCR = {
      ...data,
      id: uuidv4(),
      ncrNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.ncrs.set(ncr.id, ncr);
    return ncr;
  }

  getNCRs(projectId?: string): NCR[] {
    const ncrs = Array.from(this.ncrs.values());
    return projectId ? ncrs.filter(ncr => ncr.projectId === projectId) : ncrs;
  }

  updateNCR(id: string, updates: Partial<NCR>): NCR | null {
    const ncr = this.ncrs.get(id);
    if (!ncr) return null;
    const updated = { ...ncr, ...updates, updatedAt: new Date().toISOString() };
    this.ncrs.set(id, updated);
    return updated;
  }

  createCAPA(data: Omit<CAPA, 'id' | 'createdAt' | 'updatedAt' | 'capaNumber'>): CAPA {
    const capaNumber = `CAPA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const capa: CAPA = {
      ...data,
      id: uuidv4(),
      capaNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.capas.set(capa.id, capa);
    return capa;
  }

  getCAPAs(projectId?: string): CAPA[] {
    const capas = Array.from(this.capas.values());
    return projectId ? capas.filter(c => c.projectId === projectId) : capas;
  }

  createMaterialApproval(data: Omit<MaterialApproval, 'id' | 'createdAt' | 'updatedAt'>): MaterialApproval {
    const approval: MaterialApproval = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.materialApprovals.set(approval.id, approval);
    return approval;
  }

  getMaterialApprovals(projectId?: string): MaterialApproval[] {
    const approvals = Array.from(this.materialApprovals.values());
    return projectId ? approvals.filter(a => a.projectId === projectId) : approvals;
  }

  createCalibration(data: Omit<Calibration, 'id' | 'createdAt' | 'updatedAt'>): Calibration {
    const calibration: Calibration = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.calibrations.set(calibration.id, calibration);
    return calibration;
  }

  getCalibrations(): Calibration[] {
    return Array.from(this.calibrations.values());
  }

  // ============================================================
  // HSE METHODS
  // ============================================================

  createSafetyInduction(data: Omit<SafetyInduction, 'id' | 'createdAt' | 'updatedAt'>): SafetyInduction {
    const induction: SafetyInduction = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.safetyInductions.set(induction.id, induction);
    return induction;
  }

  getSafetyInductions(projectId?: string): SafetyInduction[] {
    const inductions = Array.from(this.safetyInductions.values());
    return projectId ? inductions.filter(i => i.projectId === projectId) : inductions;
  }

  createToolboxTalk(data: Omit<ToolboxTalk, 'id' | 'createdAt' | 'updatedAt'>): ToolboxTalk {
    const talk: ToolboxTalk = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.toolboxTalks.set(talk.id, talk);
    return talk;
  }

  getToolboxTalks(projectId?: string): ToolboxTalk[] {
    const talks = Array.from(this.toolboxTalks.values());
    return projectId ? talks.filter(t => t.projectId === projectId) : talks;
  }

  createPPE(data: Omit<PPE, 'id' | 'createdAt' | 'updatedAt'>): PPE {
    const ppe: PPE = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.ppes.set(ppe.id, ppe);
    return ppe;
  }

  getPPEs(projectId?: string): PPE[] {
    const ppes = Array.from(this.ppes.values());
    return projectId ? ppes.filter(p => p.projectId === projectId) : ppes;
  }

  createSafetyInspection(data: Omit<SafetyInspection, 'id' | 'createdAt' | 'updatedAt' | 'inspectionNumber'>): SafetyInspection {
    const inspectionNumber = `SI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const inspection: SafetyInspection = {
      ...data,
      id: uuidv4(),
      inspectionNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.safetyInspections.set(inspection.id, inspection);
    return inspection;
  }

  getSafetyInspections(projectId?: string): SafetyInspection[] {
    const inspections = Array.from(this.safetyInspections.values());
    return projectId ? inspections.filter(i => i.projectId === projectId) : inspections;
  }

  createPermit(data: Omit<Permit, 'id' | 'createdAt' | 'updatedAt' | 'permitNumber'>): Permit {
    const permitNumber = `PERMIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const permit: Permit = {
      ...data,
      id: uuidv4(),
      permitNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.permits.set(permit.id, permit);
    return permit;
  }

  getPermits(projectId?: string): Permit[] {
    const permits = Array.from(this.permits.values());
    return projectId ? permits.filter(p => p.projectId === projectId) : permits;
  }

  updatePermit(id: string, updates: Partial<Permit>): Permit | null {
    const permit = this.permits.get(id);
    if (!permit) return null;
    const updated = { ...permit, ...updates, updatedAt: new Date().toISOString() };
    this.permits.set(id, updated);
    return updated;
  }

  createIncident(data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'incidentNumber'>): Incident {
    const incidentNumber = `INC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const incident: Incident = {
      ...data,
      id: uuidv4(),
      incidentNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.incidents.set(incident.id, incident);
    return incident;
  }

  getIncidents(projectId?: string): Incident[] {
    const incidents = Array.from(this.incidents.values());
    return projectId ? incidents.filter(i => i.projectId === projectId) : incidents;
  }

  updateIncident(id: string, updates: Partial<Incident>): Incident | null {
    const incident = this.incidents.get(id);
    if (!incident) return null;
    const updated = { ...incident, ...updates, updatedAt: new Date().toISOString() };
    this.incidents.set(id, updated);
    return updated;
  }

  createNearMiss(data: Omit<NearMiss, 'id' | 'createdAt' | 'updatedAt' | 'nearMissNumber'>): NearMiss {
    const nearMissNumber = `NM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nearMiss: NearMiss = {
      ...data,
      id: uuidv4(),
      nearMissNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.nearMisses.set(nearMiss.id, nearMiss);
    return nearMiss;
  }

  getNearMisses(projectId?: string): NearMiss[] {
    const nearMisses = Array.from(this.nearMisses.values());
    return projectId ? nearMisses.filter(n => n.projectId === projectId) : nearMisses;
  }

  createSafetyObservation(data: Omit<SafetyObservation, 'id' | 'createdAt' | 'updatedAt' | 'observationNumber'>): SafetyObservation {
    const observationNumber = `SO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const observation: SafetyObservation = {
      ...data,
      id: uuidv4(),
      observationNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.safetyObservations.set(observation.id, observation);
    return observation;
  }

  getSafetyObservations(projectId?: string): SafetyObservation[] {
    const observations = Array.from(this.safetyObservations.values());
    return projectId ? observations.filter(o => o.projectId === projectId) : observations;
  }

  updateSafetyObservation(id: string, updates: Partial<SafetyObservation>): SafetyObservation | null {
    const observation = this.safetyObservations.get(id);
    if (!observation) return null;
    const updated = { ...observation, ...updates, updatedAt: new Date().toISOString() };
    this.safetyObservations.set(id, updated);
    return updated;
  }

  // ============================================================
  // DOCUMENT MANAGEMENT METHODS
  // ============================================================

  createDocument(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'documentNumber'>): Document {
    const documentNumber = `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const document: Document = {
      ...data,
      id: uuidv4(),
      documentNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.documents.set(document.id, document);
    return document;
  }

  getDocuments(projectId?: string): Document[] {
    const documents = Array.from(this.documents.values());
    return projectId ? documents.filter(d => d.projectId === projectId) : documents;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const document = this.documents.get(id);
    if (!document) return null;
    const updated = { ...document, ...updates, updatedAt: new Date().toISOString() };
    this.documents.set(id, updated);
    return updated;
  }

  createDrawing(data: Omit<Drawing, 'id' | 'createdAt' | 'updatedAt'>): Drawing {
    const drawing: Drawing = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.drawings.set(drawing.id, drawing);
    return drawing;
  }

  getDrawings(projectId?: string): Drawing[] {
    const drawings = Array.from(this.drawings.values());
    return projectId ? drawings.filter(d => d.projectId === projectId) : drawings;
  }

  updateDrawing(id: string, updates: Partial<Drawing>): Drawing | null {
    const drawing = this.drawings.get(id);
    if (!drawing) return null;
    const updated = { ...drawing, ...updates, updatedAt: new Date().toISOString() };
    this.drawings.set(id, updated);
    return updated;
  }

  createRFI(data: Omit<RFI, 'id' | 'createdAt' | 'updatedAt' | 'rfiNumber'>): RFI {
    const rfiNumber = `RFI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const rfi: RFI = {
      ...data,
      id: uuidv4(),
      rfiNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rfis.set(rfi.id, rfi);
    return rfi;
  }

  getRFIs(projectId?: string): RFI[] {
    const rfis = Array.from(this.rfis.values());
    return projectId ? rfis.filter(r => r.projectId === projectId) : rfis;
  }

  updateRFI(id: string, updates: Partial<RFI>): RFI | null {
    const rfi = this.rfis.get(id);
    if (!rfi) return null;
    const updated = { ...rfi, ...updates, updatedAt: new Date().toISOString() };
    this.rfis.set(id, updated);
    return updated;
  }

  // ============================================================
  // COMMUNICATION METHODS
  // ============================================================

  createChat(data: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Chat {
    const chat: Chat = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.chats.set(chat.id, chat);
    this.chatMessages.set(chat.id, []);
    return chat;
  }

  getChats(userId: string): Chat[] {
    return Array.from(this.chats.values()).filter(chat => 
      chat.participants.includes(userId)
    );
  }

  createChatMessage(data: Omit<ChatMessage, 'id' | 'createdAt' | 'readBy' | 'pinned' | 'reactions'>): ChatMessage {
    const message: ChatMessage = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      readBy: [],
      pinned: false,
      reactions: {},
    };
    
    const messages = this.chatMessages.get(data.chatId) || [];
    messages.push(message);
    this.chatMessages.set(data.chatId, messages);

    // Update chat last message
    const chat = this.chats.get(data.chatId);
    if (chat) {
      chat.lastMessage = message.content;
      chat.lastMessageTime = message.timestamp;
      chat.updatedAt = new Date().toISOString();
    }

    return message;
  }

  getChatMessages(chatId: string): ChatMessage[] {
    return this.chatMessages.get(chatId) || [];
  }

  markMessageAsRead(messageId: string, userId: string): void {
    for (const [chatId, messages] of this.chatMessages.entries()) {
      const message = messages.find(m => m.id === messageId);
      if (message && !message.readBy.includes(userId)) {
        message.readBy.push(userId);
        break;
      }
    }
  }

  addReaction(messageId: string, emoji: string, userId: string): void {
    for (const [chatId, messages] of this.chatMessages.entries()) {
      const message = messages.find(m => m.id === messageId);
      if (message && message.reactions) {
        if (!message.reactions[emoji]) {
          message.reactions[emoji] = [];
        }
        if (!message.reactions[emoji].includes(userId)) {
          message.reactions[emoji].push(userId);
        }
        break;
      }
    }
  }

  pinMessage(messageId: string): void {
    for (const [chatId, messages] of this.chatMessages.entries()) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.pinned = !message.pinned;
        break;
      }
    }
  }

  createChatAction(data: Omit<ChatAction, 'id' | 'createdAt'>): ChatAction {
    const action: ChatAction = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.chatActions.set(action.id, action);
    return action;
  }

  getChatActions(messageId: string): ChatAction[] {
    return Array.from(this.chatActions.values()).filter(a => a.messageId === messageId);
  }

  setTypingIndicator(chatId: string, userId: string, userName: string): void {
    this.typingIndicators.set(chatId, {
      chatId,
      userId,
      userName,
      timestamp: new Date().toISOString(),
    });
  }

  clearTypingIndicator(chatId: string): void {
    this.typingIndicators.delete(chatId);
  }

  getTypingIndicator(chatId: string): TypingIndicator | undefined {
    return this.typingIndicators.get(chatId);
  }
}

export const qualitySafetyDocsCommsService = QualitySafetyDocsCommsService.getInstance();

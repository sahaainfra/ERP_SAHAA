// ============================================================
// BUILDCORE ERP - TENDER SERVICE
// Part 08: Complete Tender Management Module
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  TenderMaster, TenderDocument, TenderChecklist, EligibilityMatrix,
  TenderTeam, PreBidQuery, Corrigendum, TenderBOQ, BidEstimate,
  BidNoBidDecision, EMDTracking, CompetitorBid, TenderResult,
  TenderCalendarEvent, TenderDashboardKPIs, TenderType, TenderStatus
} from '../types/tender';

export class TenderService {
  private static instance: TenderService;

  // Storage
  private tenders: Map<string, TenderMaster> = new Map();
  private documents: Map<string, TenderDocument[]> = new Map();
  private checklists: Map<string, TenderChecklist> = new Map();
  private eligibilityMatrices: Map<string, EligibilityMatrix> = new Map();
  private teams: Map<string, TenderTeam[]> = new Map();
  private prebidQueries: Map<string, PreBidQuery[]> = new Map();
  private corrigendums: Map<string, Corrigendum[]> = new Map();
  private boqs: Map<string, TenderBOQ> = new Map();
  private estimates: Map<string, BidEstimate[]> = new Map();
  private bidNoBidDecisions: Map<string, BidNoBidDecision> = new Map();
  private emdTrackings: Map<string, EMDTracking> = new Map();
  private competitorBids: Map<string, CompetitorBid[]> = new Map();
  private results: Map<string, TenderResult> = new Map();
  private calendarEvents: Map<string, TenderCalendarEvent[]> = new Map();

  private constructor() {}

  static getInstance(): TenderService {
    if (!TenderService.instance) {
      TenderService.instance = new TenderService();
    }
    return TenderService.instance;
  }

  // ============================================================
  // TENDER MASTER OPERATIONS
  // ============================================================

  createTender(data: Omit<TenderMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>): TenderMaster {
    const now = new Date().toISOString();
    const tender: TenderMaster = {
      ...data,
      id: `tender_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.tenders.set(tender.id, tender);
    this.initializeChecklist(tender.id);
    this.initializeCalendarEvents(tender);

    return tender;
  }

  getTender(id: string): TenderMaster | undefined {
    return this.tenders.get(id);
  }

  getTenders(companyId: string, status?: TenderStatus): TenderMaster[] {
    let tenders = Array.from(this.tenders.values()).filter(t => t.companyId === companyId);
    if (status) {
      tenders = tenders.filter(t => t.status === status);
    }
    return tenders;
  }

  updateTender(id: string, updates: Partial<TenderMaster>): TenderMaster | null {
    const tender = this.tenders.get(id);
    if (!tender) return null;

    const updated = {
      ...tender,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: tender.version + 1,
    };

    this.tenders.set(id, updated);
    return updated;
  }

  updateTenderStatus(id: string, status: TenderStatus): TenderMaster | null {
    return this.updateTender(id, { status });
  }

  // ============================================================
  // DOCUMENT OPERATIONS
  // ============================================================

  uploadDocument(tenderId: string, data: Omit<TenderDocument, 'id' | 'uploadedAt' | 'isSuperseded'>): TenderDocument {
    const doc: TenderDocument = {
      ...data,
      id: `doc_${uuidv4()}`,
      uploadedAt: new Date().toISOString(),
      isSuperseded: false,
    };

    const docs = this.documents.get(tenderId) || [];
    
    if (doc.documentType !== 'CORRIGENDUM' && doc.documentType !== 'ADDENDUM') {
      docs.forEach(d => {
        if (d.documentType === doc.documentType && !d.isSuperseded) {
          d.isSuperseded = true;
          d.supersededBy = doc.id;
        }
      });
    }

    docs.push(doc);
    this.documents.set(tenderId, docs);

    return doc;
  }

  getDocuments(tenderId: string, includeSuperseded: boolean = false): TenderDocument[] {
    const docs = this.documents.get(tenderId) || [];
    if (includeSuperseded) {
      return docs;
    }
    return docs.filter(d => !d.isSuperseded);
  }

  // ============================================================
  // CHECKLIST OPERATIONS
  // ============================================================

  initializeChecklist(tenderId: string): TenderChecklist {
    const items = [
      'Company Registration',
      'Eligibility Criteria Met',
      'Similar Work Experience',
      'Annual Turnover',
      'Financial Capacity',
      'Key Personnel',
      'Equipment Availability',
      'EMD Arrangement',
      'Tender Fee Payment',
      'Power of Attorney',
      'GST Registration',
      'PAN Card',
      'Solvency Certificate',
      'Required Affidavits',
      'Declarations',
    ].map((itemName, index) => ({
      id: `chk_${uuidv4()}`,
      category: 'OTHER' as const,
      itemName,
      isRequired: true,
      isCompleted: false,
    }));

    const checklist: TenderChecklist = {
      id: `checklist_${uuidv4()}`,
      tenderId,
      items,
      completionPercentage: 0,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system',
    };

    this.checklists.set(tenderId, checklist);
    return checklist;
  }

  getChecklist(tenderId: string): TenderChecklist | undefined {
    return this.checklists.get(tenderId);
  }

  updateChecklistItem(tenderId: string, itemId: string, isCompleted: boolean, userId: string): void {
    const checklist = this.checklists.get(tenderId);
    if (!checklist) return;

    const item = checklist.items.find(i => i.id === itemId);
    if (item) {
      item.isCompleted = isCompleted;
      if (isCompleted) {
        item.completedAt = new Date().toISOString();
        item.completedBy = userId;
      } else {
        item.completedAt = undefined;
        item.completedBy = undefined;
      }
    }

    const completed = checklist.items.filter(i => i.isCompleted).length;
    checklist.completionPercentage = (completed / checklist.items.length) * 100;
    checklist.lastUpdated = new Date().toISOString();
    checklist.updatedBy = userId;
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getDashboardKPIs(companyId: string): TenderDashboardKPIs {
    const tenders = this.getTenders(companyId);
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const openTenders = tenders.filter(t => 
      ['IDENTIFIED', 'UNDER_REVIEW', 'ELIGIBILITY_CHECK', 'ESTIMATION', 'BID_NO_BID', 'APPROVED'].includes(t.status)
    );

    const closingSoon = openTenders.filter(t => {
      const deadline = new Date(t.submissionDeadline);
      return deadline > now && deadline <= sevenDaysLater;
    });

    const bidNoBidPending = tenders.filter(t => t.status === 'BID_NO_BID').length;
    const estimatePending = tenders.filter(t => t.status === 'ESTIMATION').length;
    const approvalPending = tenders.filter(t => t.status === 'APPROVED').length;
    const submitted = tenders.filter(t => t.status === 'SUBMITTED' || t.status === 'OPENED').length;
    const won = tenders.filter(t => t.status === 'WON').length;
    const lost = tenders.filter(t => t.status === 'LOST').length;

    const winRate = (won + lost) > 0 ? (won / (won + lost)) * 100 : 0;

    const estimatedValue = openTenders.reduce((sum, t) => sum + t.estimatedCost, 0);
    const pipeline = estimatedValue;
    const wonValue = tenders.filter(t => t.status === 'WON').reduce((sum, t) => sum + t.estimatedCost, 0);
    const lostValue = tenders.filter(t => t.status === 'LOST').reduce((sum, t) => sum + t.estimatedCost, 0);

    return {
      openTenders: openTenders.length,
      closingSoon: closingSoon.length,
      bidNoBidPending,
      estimatePending,
      approvalPending,
      submitted,
      won,
      lost,
      winRate,
      estimatedValue,
      pipeline,
      wonValue,
      lostValue,
    };
  }

  // ============================================================
  // CALENDAR EVENTS
  // ============================================================

  initializeCalendarEvents(tender: TenderMaster): void {
    const events: TenderCalendarEvent[] = [];

    if (tender.prebidDate) {
      events.push({
        id: `event_${uuidv4()}`,
        tenderId: tender.id,
        eventType: 'PREBID_MEETING',
        eventDate: tender.prebidDate,
        title: 'Pre-Bid Meeting',
        isMandatory: true,
      });
    }

    events.push({
      id: `event_${uuidv4()}`,
      tenderId: tender.id,
      eventType: 'SUBMISSION_DEADLINE',
      eventDate: tender.submissionDeadline,
      title: 'Bid Submission Deadline',
      isMandatory: true,
    });

    if (tender.openingDate) {
      events.push({
        id: `event_${uuidv4()}`,
        tenderId: tender.id,
        eventType: 'OPENING_DATE',
        eventDate: tender.openingDate,
        title: 'Bid Opening',
        isMandatory: true,
      });
    }

    this.calendarEvents.set(tender.id, events);
  }

  getCalendarEvents(tenderId: string): TenderCalendarEvent[] {
    return this.calendarEvents.get(tenderId) || [];
  }
}

export const tenderService = TenderService.getInstance();

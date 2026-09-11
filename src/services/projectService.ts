// ============================================================
// BUILDCORE ERP - PROJECT MANAGEMENT SERVICE
// Part 06: Project Management & Construction Execution
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  ProjectMaster, ProjectType, ProjectStatus, ProjectLocation,
  ProjectBudget, ProjectHealth, ProjectTeamMember, ProjectRole,
  WBS, WorkFront, WorkFrontType, BOQItem, ExecutionEntry,
  DailyProgress, DailyProgressEntry, PhotoEvidence, ProductivityMetric,
  DelayEntry, DelayCause, RiskEntry, RiskCategory, IssueEntry,
  Correspondence, Meeting, MeetingParticipant, ActionItem,
  ProjectClosureChecklist, ClosureItem, ProjectAnalytics,
  ProjectSummary, WBSProgress, BOQProgress, CostAnalysis
} from '../types/project';

export class ProjectService {
  private static instance: ProjectService;

  // Storage
  private projects: Map<string, ProjectMaster> = new Map();
  private teamMembers: Map<string, ProjectTeamMember[]> = new Map();
  private wbsItems: Map<string, WBS[]> = new Map();
  private workFronts: Map<string, WorkFront[]> = new Map();
  private boqItems: Map<string, BOQItem[]> = new Map();
  private executionEntries: Map<string, ExecutionEntry[]> = new Map();
  private dailyProgress: Map<string, DailyProgress[]> = new Map();
  private photos: Map<string, PhotoEvidence[]> = new Map();
  private productivity: Map<string, ProductivityMetric[]> = new Map();
  private delays: Map<string, DelayEntry[]> = new Map();
  private risks: Map<string, RiskEntry[]> = new Map();
  private issues: Map<string, IssueEntry[]> = new Map();
  private correspondence: Map<string, Correspondence[]> = new Map();
  private meetings: Map<string, Meeting[]> = new Map();
  private closureChecklists: Map<string, ProjectClosureChecklist> = new Map();

  private constructor() {}

  static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  // ============================================================
  // INITIALIZE DEMO DATA
  // ============================================================
  initializeDemoData(companyId: string, userId: string): void {
    if (this.projects.size > 0) return;

    const now = new Date().toISOString();

    // Demo Projects
    const demoProjects: ProjectMaster[] = [
      {
        id: 'proj_001',
        companyId,
        projectCode: 'MPEW-001',
        projectName: 'Mumbai-Pune Expressway Widening',
        projectType: 'HIGHWAY',
        client: 'NHAI',
        employer: 'Ministry of Road Transport & Highways',
        consultant: 'L&T Consulting',
        authority: 'NHAI',
        contractNumber: 'CT/NHAI/2025/001',
        tenderNumber: 'TD/NHAI/2024/123',
        loaNumber: 'LOA/NHAI/2025/001',
        workOrderNumber: 'WO/NHAI/2025/001',
        agreementNumber: 'AGR/NHAI/2025/001',
        contractValue: 4850000000,
        revisedValue: 5100000000,
        gstPercent: 18,
        startDate: '2025-03-01',
        originalCompletionDate: '2028-02-28',
        revisedCompletionDate: '2028-08-31',
        eotDays: 180,
        dlpDays: 365,
        location: {
          address: 'Mumbai-Pune Expressway, Chainage 45-78 km',
          state: 'Maharashtra',
          district: 'Pune',
          city: 'Pune',
          pin: '411001',
          country: 'India',
          latitude: 18.5204,
          longitude: 73.8567,
        },
        projectManagerId: 'usr_002',
        projectManagerName: 'Priya Sharma',
        siteManagerId: 'usr_003',
        siteManagerName: 'Amit Patel',
        planningManagerId: 'usr_002',
        planningManagerName: 'Priya Sharma',
        commercialManagerId: 'usr_001',
        commercialManagerName: 'Rajesh Kumar',
        status: 'IN_PROGRESS',
        progress: 34,
        budget: {
          originalBudget: 4850000000,
          revisedBudget: 5100000000,
          committedCost: 2100000000,
          actualCost: 1649000000,
          forecastCost: 4950000000,
          variance: 150000000,
          variancePercent: 3.1,
        },
        health: {
          overall: 'AMBER',
          schedule: 'AMBER',
          cost: 'GREEN',
          quality: 'GREEN',
          safety: 'GREEN',
          billing: 'AMBER',
          procurement: 'GREEN',
          resources: 'GREEN',
          score: 78,
          lastCalculated: now,
        },
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'proj_002',
        companyId,
        projectCode: 'CMR-002',
        projectName: 'Chennai Metro Phase 2 - Corridor 4',
        projectType: 'METRO',
        client: 'CMRL',
        employer: 'Chennai Metro Rail Limited',
        consultant: 'Deloitte Consulting',
        contractNumber: 'CT/CMRL/2025/002',
        contractValue: 3200000000,
        startDate: '2025-06-01',
        originalCompletionDate: '2029-05-31',
        location: {
          address: 'Chennai Metro Corridor 4',
          state: 'Tamil Nadu',
          district: 'Chennai',
          city: 'Chennai',
          pin: '600001',
          country: 'India',
          latitude: 13.0827,
          longitude: 80.2707,
        },
        projectManagerId: 'usr_002',
        projectManagerName: 'Priya Sharma',
        status: 'IN_PROGRESS',
        progress: 18,
        budget: {
          originalBudget: 3200000000,
          revisedBudget: 3200000000,
          committedCost: 800000000,
          actualCost: 576000000,
          forecastCost: 3250000000,
          variance: 50000000,
          variancePercent: 1.6,
        },
        health: {
          overall: 'GREEN',
          schedule: 'GREEN',
          cost: 'GREEN',
          quality: 'GREEN',
          safety: 'GREEN',
          billing: 'GREEN',
          procurement: 'GREEN',
          resources: 'GREEN',
          score: 88,
          lastCalculated: now,
        },
        createdAt: '2025-04-01T00:00:00Z',
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'proj_003',
        companyId,
        projectCode: 'GBR-003',
        projectName: 'Godavari Bridge Rehabilitation',
        projectType: 'BRIDGE',
        client: 'APPRDL',
        contractNumber: 'CT/APPRDL/2025/003',
        contractValue: 890000000,
        startDate: '2025-09-01',
        originalCompletionDate: '2027-08-31',
        location: {
          address: 'Godavari Bridge, Rajahmundry',
          state: 'Andhra Pradesh',
          district: 'East Godavari',
          city: 'Rajahmundry',
          pin: '533101',
          country: 'India',
          latitude: 17.0005,
          longitude: 81.7600,
        },
        projectManagerId: 'usr_003',
        projectManagerName: 'Amit Patel',
        status: 'IN_PROGRESS',
        progress: 8,
        budget: {
          originalBudget: 890000000,
          revisedBudget: 890000000,
          committedCost: 120000000,
          actualCost: 71200000,
          forecastCost: 920000000,
          variance: 30000000,
          variancePercent: 3.4,
        },
        health: {
          overall: 'GREEN',
          schedule: 'GREEN',
          cost: 'GREEN',
          quality: 'GREEN',
          safety: 'AMBER',
          billing: 'GREEN',
          procurement: 'GREEN',
          resources: 'GREEN',
          score: 85,
          lastCalculated: now,
        },
        createdAt: '2025-07-15T00:00:00Z',
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
    ];

    demoProjects.forEach(p => this.projects.set(p.id, p));

    // Demo WBS for Project 1
    const wbsData: WBS[] = [
      {
        id: 'wbs_001',
        companyId,
        projectId: 'proj_001',
        wbsCode: 'PKG-01',
        wbsName: 'Package 1 - Earthwork',
        level: 1,
        wbsType: 'PACKAGE',
        budget: 800000000,
        actual: 320000000,
        progress: 40,
        status: 'ACTIVE',
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'wbs_002',
        companyId,
        projectId: 'proj_001',
        wbsCode: 'PKG-01/STR-01',
        wbsName: 'Structure 1 - Cut Section',
        parentId: 'wbs_001',
        parentName: 'Package 1 - Earthwork',
        level: 2,
        wbsType: 'STRUCTURE',
        budget: 400000000,
        actual: 180000000,
        progress: 45,
        status: 'ACTIVE',
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'wbs_003',
        companyId,
        projectId: 'proj_001',
        wbsCode: 'PKG-01/STR-01/AREA-01',
        wbsName: 'Area 1 - Chainage 45-50 km',
        parentId: 'wbs_002',
        parentName: 'Structure 1 - Cut Section',
        level: 3,
        wbsType: 'AREA',
        budget: 200000000,
        actual: 100000000,
        progress: 50,
        status: 'ACTIVE',
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'wbs_004',
        companyId,
        projectId: 'proj_001',
        wbsCode: 'PKG-02',
        wbsName: 'Package 2 - Bridge Works',
        level: 1,
        wbsType: 'PACKAGE',
        budget: 1200000000,
        actual: 360000000,
        progress: 30,
        status: 'ACTIVE',
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'wbs_005',
        companyId,
        projectId: 'proj_001',
        wbsCode: 'PKG-03',
        wbsName: 'Package 3 - Road Formation',
        level: 1,
        wbsType: 'PACKAGE',
        budget: 1500000000,
        actual: 375000000,
        progress: 25,
        status: 'ACTIVE',
        sortOrder: 3,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
    ];
    this.wbsItems.set('proj_001', wbsData);

    // Demo Work Fronts
    const workFrontsData: WorkFront[] = [
      {
        id: 'wf_001',
        companyId,
        projectId: 'proj_001',
        wbsId: 'wbs_003',
        workFrontCode: 'WF-001',
        workFrontName: 'Earthwork - Chainage 45-47 km',
        workFrontType: 'EARTHWORK',
        location: 'Chainage 45-47 km',
        responsibleEngineerId: 'usr_003',
        responsibleEngineerName: 'Amit Patel',
        plannedQuantity: 50000,
        actualQuantity: 25000,
        uomId: 'uom_cum',
        uomName: 'CUM',
        startDate: '2025-03-15',
        status: 'IN_PROGRESS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'wf_002',
        companyId,
        projectId: 'proj_001',
        wbsId: 'wbs_004',
        workFrontCode: 'WF-002',
        workFrontName: 'Bridge Pier P1',
        workFrontType: 'BRIDGE_PIER',
        location: 'Chainage 52.5 km',
        responsibleEngineerId: 'usr_003',
        responsibleEngineerName: 'Amit Patel',
        plannedQuantity: 1,
        actualQuantity: 0.6,
        uomId: 'uom_nos',
        uomName: 'NOS',
        startDate: '2025-05-01',
        status: 'IN_PROGRESS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
    ];
    this.workFronts.set('proj_001', workFrontsData);

    // Demo BOQ Items
    const boqData: BOQItem[] = [
      {
        id: 'boq_001',
        companyId,
        projectId: 'proj_001',
        boqCode: 'BOQ-001',
        description: 'Excavation in ordinary soil including lead and lift',
        uomId: 'uom_cum',
        uomName: 'CUM',
        quantity: 100000,
        rate: 450,
        amount: 45000000,
        wbsId: 'wbs_001',
        category: 'CIVIL',
        isExecuted: true,
        executedQuantity: 45000,
        balanceQuantity: 55000,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'boq_002',
        companyId,
        projectId: 'proj_001',
        boqCode: 'BOQ-002',
        description: 'Embankment formation including compaction',
        uomId: 'uom_cum',
        uomName: 'CUM',
        quantity: 80000,
        rate: 550,
        amount: 44000000,
        wbsId: 'wbs_001',
        category: 'CIVIL',
        isExecuted: true,
        executedQuantity: 32000,
        balanceQuantity: 48000,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'boq_003',
        companyId,
        projectId: 'proj_001',
        boqCode: 'BOQ-003',
        description: 'RCC M30 grade for bridge pier',
        uomId: 'uom_cum',
        uomName: 'CUM',
        quantity: 5000,
        rate: 8500,
        amount: 42500000,
        wbsId: 'wbs_004',
        category: 'STRUCTURAL',
        isExecuted: true,
        executedQuantity: 1500,
        balanceQuantity: 3500,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
    ];
    this.boqItems.set('proj_001', boqData);

    // Demo Team Members
    const teamData: ProjectTeamMember[] = [
      {
        id: 'tm_001',
        projectId: 'proj_001',
        userId: 'usr_002',
        userName: 'Priya Sharma',
        role: 'PROJECT_MANAGER',
        allocation: 100,
        startDate: '2025-03-01',
        status: 'ACTIVE',
      },
      {
        id: 'tm_002',
        projectId: 'proj_001',
        userId: 'usr_003',
        userName: 'Amit Patel',
        role: 'SITE_ENGINEER',
        allocation: 100,
        startDate: '2025-03-01',
        status: 'ACTIVE',
      },
    ];
    this.teamMembers.set('proj_001', teamData);

    // Demo Risks
    const risksData: RiskEntry[] = [
      {
        id: 'risk_001',
        companyId,
        projectId: 'proj_001',
        riskTitle: 'Monsoon delay in earthwork',
        description: 'Heavy rainfall may impact earthwork progress in Q3',
        category: 'WEATHER',
        probability: 'HIGH',
        impact: 'MAJOR',
        riskScore: 20,
        ownerId: 'usr_002',
        ownerName: 'Priya Sharma',
        mitigation: 'Accelerate earthwork before monsoon; deploy additional equipment',
        contingency: 'Extend completion by 30 days if required',
        dueDate: '2026-05-31',
        status: 'MITIGATING',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
      {
        id: 'risk_002',
        companyId,
        projectId: 'proj_001',
        riskTitle: 'Steel price escalation',
        category: 'FINANCIAL',
        probability: 'MEDIUM',
        impact: 'MODERATE',
        riskScore: 12,
        ownerId: 'usr_001',
        ownerName: 'Rajesh Kumar',
        mitigation: 'Lock in prices with suppliers; hedge through forward contracts',
        status: 'MONITORING',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
    ];
    this.risks.set('proj_001', risksData);

    // Demo Issues
    const issuesData: IssueEntry[] = [
      {
        id: 'issue_001',
        companyId,
        projectId: 'proj_001',
        siteId: 'site_001',
        issueTitle: 'Design clarification required for Pier P2',
        description: 'Consultant drawing shows conflicting reinforcement details',
        priority: 'HIGH',
        ownerId: 'usr_003',
        ownerName: 'Amit Patel',
        raisedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        action: 'Raise RFI with consultant',
        status: 'IN_PROGRESS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
    ];
    this.issues.set('proj_001', issuesData);

    // Demo Delays
    const delaysData: DelayEntry[] = [
      {
        id: 'delay_001',
        companyId,
        projectId: 'proj_001',
        activityName: 'Bridge Pier P1 Foundation',
        delayCause: 'APPROVAL_DELAY',
        responsibleParty: 'CONSULTANT',
        startDate: new Date(Date.now() - 15 * 86400000).toISOString(),
        endDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        durationDays: 10,
        impact: 'MAJOR',
        evidence: 'Consultant approval delayed due to design revision',
        mitigation: 'Fast-track subsequent approvals',
        claimPotential: true,
        eotPotential: true,
        status: 'UNDER_ANALYSIS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
    ];
    this.delays.set('proj_001', delaysData);

    // Demo Correspondence
    const corrData: Correspondence[] = [
      {
        id: 'corr_001',
        companyId,
        projectId: 'proj_001',
        letterNumber: 'BCI/NHAI/2026/045',
        letterDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        fromParty: 'BuildCore Infrastructure',
        toParty: 'NHAI Project Director',
        subject: 'Request for EOT due to design changes',
        reference: 'WO/NHAI/2025/001',
        contractRef: 'CT/NHAI/2025/001',
        category: 'OUTGOING',
        correspondenceType: 'EOT',
        responseRequired: true,
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        status: 'SENT',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
    ];
    this.correspondence.set('proj_001', corrData);

    // Demo Meetings
    const meetingsData: Meeting[] = [
      {
        id: 'mtg_001',
        companyId,
        projectId: 'proj_001',
        meetingTitle: 'Weekly Progress Review',
        meetingDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        meetingTime: '10:00',
        location: 'Site Office',
        meetingType: 'INTERNAL',
        agenda: 'Review weekly progress, discuss issues, plan next week',
        participants: [
          { id: 'p1', userId: 'usr_002', name: 'Priya Sharma', role: 'Project Manager', attended: true },
          { id: 'p2', userId: 'usr_003', name: 'Amit Patel', role: 'Site Engineer', attended: true },
        ],
        minutes: 'Discussed progress on earthwork and bridge works. Identified design clarification issue for Pier P2.',
        actionItems: [
          {
            id: 'ai_001',
            meetingId: 'mtg_001',
            description: 'Raise RFI for Pier P2 design',
            ownerId: 'usr_003',
            ownerName: 'Amit Patel',
            dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
            status: 'IN_PROGRESS',
          },
        ],
        status: 'COMPLETED',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
    ];
    this.meetings.set('proj_001', meetingsData);
  }

  // ============================================================
  // PROJECT CRUD
  // ============================================================
  createProject(data: Omit<ProjectMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>): ProjectMaster {
    const now = new Date().toISOString();
    const project: ProjectMaster = {
      ...data,
      id: `proj_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.projects.set(project.id, project);
    return project;
  }

  getProjects(companyId?: string): ProjectMaster[] {
    return Array.from(this.projects.values()).filter(p => !companyId || p.companyId === companyId);
  }

  getProject(id: string): ProjectMaster | undefined {
    return this.projects.get(id);
  }

  updateProject(id: string, updates: Partial<ProjectMaster>): ProjectMaster | null {
    const project = this.projects.get(id);
    if (!project) return null;
    const updated = { ...project, ...updates, updatedAt: new Date().toISOString(), version: project.version + 1 };
    this.projects.set(id, updated);
    return updated;
  }

  // ============================================================
  // TEAM MANAGEMENT
  // ============================================================
  getTeamMembers(projectId: string): ProjectTeamMember[] {
    return this.teamMembers.get(projectId) || [];
  }

  addTeamMember(member: Omit<ProjectTeamMember, 'id'>): ProjectTeamMember {
    const newMember = { ...member, id: `tm_${uuidv4().slice(0, 8)}` };
    const members = this.teamMembers.get(member.projectId) || [];
    members.push(newMember);
    this.teamMembers.set(member.projectId, members);
    return newMember;
  }

  // ============================================================
  // WBS MANAGEMENT
  // ============================================================
  getWBS(projectId: string): WBS[] {
    return this.wbsItems.get(projectId) || [];
  }

  createWBS(data: Omit<WBS, 'id' | 'createdAt' | 'updatedAt' | 'version'>): WBS {
    const now = new Date().toISOString();
    const wbs: WBS = {
      ...data,
      id: `wbs_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    const wbsList = this.wbsItems.get(data.projectId) || [];
    wbsList.push(wbs);
    this.wbsItems.set(data.projectId, wbsList);
    return wbs;
  }

  // ============================================================
  // WORK FRONT MANAGEMENT
  // ============================================================
  getWorkFronts(projectId: string): WorkFront[] {
    return this.workFronts.get(projectId) || [];
  }

  // ============================================================
  // BOQ MANAGEMENT
  // ============================================================
  getBOQItems(projectId: string): BOQItem[] {
    return this.boqItems.get(projectId) || [];
  }

  // ============================================================
  // EXECUTION REGISTER
  // ============================================================
  getExecutionEntries(projectId: string): ExecutionEntry[] {
    return this.executionEntries.get(projectId) || [];
  }

  addExecutionEntry(entry: Omit<ExecutionEntry, 'id' | 'createdAt' | 'updatedAt'>): ExecutionEntry {
    const now = new Date().toISOString();
    const newEntry: ExecutionEntry = {
      ...entry,
      id: `exec_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const entries = this.executionEntries.get(entry.projectId) || [];
    entries.push(newEntry);
    this.executionEntries.set(entry.projectId, entries);
    return newEntry;
  }

  // ============================================================
  // DAILY PROGRESS
  // ============================================================
  getDailyProgress(projectId: string): DailyProgress[] {
    return this.dailyProgress.get(projectId) || [];
  }

  addDailyProgress(report: Omit<DailyProgress, 'id' | 'createdAt' | 'updatedAt' | 'version'>): DailyProgress {
    const now = new Date().toISOString();
    const newReport: DailyProgress = {
      ...report,
      id: `dpr_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    const reports = this.dailyProgress.get(report.projectId) || [];
    reports.push(newReport);
    this.dailyProgress.set(report.projectId, reports);
    return newReport;
  }

  // ============================================================
  // DELAY REGISTER
  // ============================================================
  getDelays(projectId: string): DelayEntry[] {
    return this.delays.get(projectId) || [];
  }

  addDelay(delay: Omit<DelayEntry, 'id' | 'createdAt' | 'updatedAt'>): DelayEntry {
    const now = new Date().toISOString();
    const newDelay: DelayEntry = {
      ...delay,
      id: `delay_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const delays = this.delays.get(delay.projectId) || [];
    delays.push(newDelay);
    this.delays.set(delay.projectId, delays);
    return newDelay;
  }

  // ============================================================
  // RISK REGISTER
  // ============================================================
  getRisks(projectId: string): RiskEntry[] {
    return this.risks.get(projectId) || [];
  }

  addRisk(risk: Omit<RiskEntry, 'id' | 'createdAt' | 'updatedAt'>): RiskEntry {
    const now = new Date().toISOString();
    const newRisk: RiskEntry = {
      ...risk,
      id: `risk_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const risks = this.risks.get(risk.projectId) || [];
    risks.push(newRisk);
    this.risks.set(risk.projectId, risks);
    return newRisk;
  }

  // ============================================================
  // ISSUE REGISTER
  // ============================================================
  getIssues(projectId: string): IssueEntry[] {
    return this.issues.get(projectId) || [];
  }

  addIssue(issue: Omit<IssueEntry, 'id' | 'createdAt' | 'updatedAt'>): IssueEntry {
    const now = new Date().toISOString();
    const newIssue: IssueEntry = {
      ...issue,
      id: `issue_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const issues = this.issues.get(issue.projectId) || [];
    issues.push(newIssue);
    this.issues.set(issue.projectId, issues);
    return newIssue;
  }

  // ============================================================
  // CORRESPONDENCE
  // ============================================================
  getCorrespondence(projectId: string): Correspondence[] {
    return this.correspondence.get(projectId) || [];
  }

  addCorrespondence(corr: Omit<Correspondence, 'id' | 'createdAt' | 'updatedAt'>): Correspondence {
    const now = new Date().toISOString();
    const newCorr: Correspondence = {
      ...corr,
      id: `corr_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const corrs = this.correspondence.get(corr.projectId) || [];
    corrs.push(newCorr);
    this.correspondence.set(corr.projectId, corrs);
    return newCorr;
  }

  // ============================================================
  // MEETING MANAGEMENT
  // ============================================================
  getMeetings(projectId: string): Meeting[] {
    return this.meetings.get(projectId) || [];
  }

  addMeeting(meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Meeting {
    const now = new Date().toISOString();
    const newMeeting: Meeting = {
      ...meeting,
      id: `mtg_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const meetings = this.meetings.get(meeting.projectId) || [];
    meetings.push(newMeeting);
    this.meetings.set(meeting.projectId, meetings);
    return newMeeting;
  }

  // ============================================================
  // PROJECT HEALTH CALCULATION
  // ============================================================
  calculateProjectHealth(projectId: string): ProjectHealth {
    const project = this.projects.get(projectId);
    if (!project) {
      return {
        overall: 'GREEN', schedule: 'GREEN', cost: 'GREEN', quality: 'GREEN',
        safety: 'GREEN', billing: 'GREEN', procurement: 'GREEN', resources: 'GREEN',
        score: 100, lastCalculated: new Date().toISOString(),
      };
    }

    // Schedule Health
    const scheduleVariance = project.budget.variancePercent;
    const schedule: 'GREEN' | 'AMBER' | 'RED' =
      scheduleVariance < 5 ? 'GREEN' : scheduleVariance < 15 ? 'AMBER' : 'RED';

    // Cost Health
    const costVariance = project.budget.variancePercent;
    const cost: 'GREEN' | 'AMBER' | 'RED' =
      costVariance < 5 ? 'GREEN' : costVariance < 15 ? 'AMBER' : 'RED';

    // Other health metrics (simplified for demo)
    const quality: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
    const safety: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
    const billing: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
    const procurement: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
    const resources: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';

    // Overall health
    const healthValues = [schedule, cost, quality, safety, billing, procurement, resources];
    const redCount = healthValues.filter(h => h === 'RED').length;
    const amberCount = healthValues.filter(h => h === 'AMBER').length;
    const overall: 'GREEN' | 'AMBER' | 'RED' =
      redCount > 0 ? 'RED' : amberCount > 2 ? 'AMBER' : amberCount > 0 ? 'AMBER' : 'GREEN';

    // Score calculation
    const scoreMap = { GREEN: 100, AMBER: 70, RED: 40 };
    const score = Math.round(
      healthValues.reduce((sum, h) => sum + scoreMap[h], 0) / healthValues.length
    );

    return {
      overall, schedule, cost, quality, safety, billing, procurement, resources,
      score, lastCalculated: new Date().toISOString(),
    };
  }

  // ============================================================
  // PROJECT ANALYTICS
  // ============================================================
  getProjectAnalytics(projectId: string): ProjectAnalytics | null {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const wbsList = this.getWBS(projectId);
    const boqList = this.getBOQItems(projectId);
    const delaysList = this.getDelays(projectId);
    const risksList = this.getRisks(projectId);
    const issuesList = this.getIssues(projectId);
    const corrList = this.getCorrespondence(projectId);
    const meetingsList = this.getMeetings(projectId);

    // Calculate days remaining
    const endDate = new Date(project.revisedCompletionDate || project.originalCompletionDate);
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / 86400000));

    const summary: ProjectSummary = {
      contractValue: project.contractValue,
      revisedValue: project.revisedValue || project.contractValue,
      workExecuted: project.budget.actualCost,
      certifiedBilling: project.budget.actualCost * 0.85,
      receivables: project.budget.actualCost * 0.25,
      physicalProgress: project.progress,
      financialProgress: (project.budget.actualCost / project.budget.revisedBudget) * 100,
      scheduleVariance: project.budget.variancePercent,
      costVariance: project.budget.variancePercent,
      daysRemaining,
      daysOverdue: 0,
    };

    const wbsProgress: WBSProgress[] = wbsList.map(w => ({
      wbsId: w.id,
      wbsCode: w.wbsCode,
      wbsName: w.wbsName,
      level: w.level,
      planned: w.budget,
      actual: w.actual,
      progress: w.progress,
    }));

    const boqProgress: BOQProgress[] = boqList.map(b => ({
      boqItemId: b.id,
      boqCode: b.boqCode,
      description: b.description,
      totalQuantity: b.quantity,
      executedQuantity: b.executedQuantity,
      balanceQuantity: b.balanceQuantity,
      progress: (b.executedQuantity / b.quantity) * 100,
      value: b.executedQuantity * b.rate,
    }));

    const costAnalysis: CostAnalysis = {
      budget: project.budget.revisedBudget,
      committed: project.budget.committedCost,
      actual: project.budget.actualCost,
      forecast: project.budget.forecastCost,
      variance: project.budget.variance,
      variancePercent: project.budget.variancePercent,
      costBreakdown: {
        material: project.budget.actualCost * 0.40,
        labour: project.budget.actualCost * 0.25,
        plant: project.budget.actualCost * 0.15,
        subcontract: project.budget.actualCost * 0.15,
        overhead: project.budget.actualCost * 0.05,
      },
    };

    const allActions = meetingsList.flatMap(m => m.actionItems);

    return {
      projectId,
      summary,
      wbsProgress,
      boqProgress,
      activityProgress: [],
      dailyProgress: [],
      productivity: [],
      delays: delaysList,
      risks: risksList,
      issues: issuesList,
      correspondence: corrList,
      meetingActions: allActions,
      costAnalysis,
    };
  }

  // ============================================================
  // PROJECT CLOSURE
  // ============================================================
  getClosureChecklist(projectId: string): ProjectClosureChecklist | null {
    return this.closureChecklists.get(projectId) || null;
  }

  initializeClosureChecklist(projectId: string): ProjectClosureChecklist {
    const items: ClosureItem[] = [
      { id: 'cl_1', category: 'Work Completion', item: 'All work completed as per contract', isCompleted: false },
      { id: 'cl_2', category: 'Work Completion', item: 'As-built drawings submitted', isCompleted: false },
      { id: 'cl_3', category: 'Measurement', item: 'Final measurement completed', isCompleted: false },
      { id: 'cl_4', category: 'Billing', item: 'Final bill submitted', isCompleted: false },
      { id: 'cl_5', category: 'Billing', item: 'Final bill certified', isCompleted: false },
      { id: 'cl_6', category: 'Financial', item: 'All receivables collected', isCompleted: false },
      { id: 'cl_7', category: 'Financial', item: 'All payables cleared', isCompleted: false },
      { id: 'cl_8', category: 'Material', item: 'Material reconciliation completed', isCompleted: false },
      { id: 'cl_9', category: 'Plant', item: 'Plant demobilization completed', isCompleted: false },
      { id: 'cl_10', category: 'Documents', item: 'All documents archived', isCompleted: false },
      { id: 'cl_11', category: 'Quality', item: 'All NCRs closed', isCompleted: false },
      { id: 'cl_12', category: 'Safety', item: 'Safety closure report submitted', isCompleted: false },
      { id: 'cl_13', category: 'DLP', item: 'DLP period started', isCompleted: false },
      { id: 'cl_14', category: 'Financial', item: 'Retention money released', isCompleted: false },
      { id: 'cl_15', category: 'Financial', item: 'Security deposit released', isCompleted: false },
      { id: 'cl_16', category: 'Handover', item: 'Client handover completed', isCompleted: false },
    ];

    const checklist: ProjectClosureChecklist = {
      id: `pcl_${uuidv4().slice(0, 8)}`,
      projectId,
      items,
      overallStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.closureChecklists.set(projectId, checklist);
    return checklist;
  }

  updateClosureItem(projectId: string, itemId: string, isCompleted: boolean, completedBy?: string): void {
    const checklist = this.closureChecklists.get(projectId);
    if (!checklist) return;

    const item = checklist.items.find(i => i.id === itemId);
    if (item) {
      item.isCompleted = isCompleted;
      if (isCompleted) {
        item.completedAt = new Date().toISOString();
        item.completedBy = completedBy;
      } else {
        item.completedAt = undefined;
        item.completedBy = undefined;
      }
    }

    const completedCount = checklist.items.filter(i => i.isCompleted).length;
    checklist.overallStatus = completedCount === 0 ? 'PENDING' : completedCount === checklist.items.length ? 'COMPLETED' : 'IN_PROGRESS';
    checklist.updatedAt = new Date().toISOString();

    if (checklist.overallStatus === 'COMPLETED') {
      checklist.completedAt = new Date().toISOString();
      checklist.completedBy = completedBy;
    }
  }
}

export const projectService = ProjectService.getInstance();

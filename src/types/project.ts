// ============================================================
// BUILDCORE ERP - PROJECT MANAGEMENT TYPES
// Part 06: Project Management & Construction Execution
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. PROJECT MASTER
// ============================================================
export interface ProjectMaster {
  id: string;
  companyId: string;
  projectCode: string;
  projectName: string;
  projectType: ProjectType;
  client: string;
  employer?: string;
  consultant?: string;
  authority?: string;
  contractNumber?: string;
  tenderNumber?: string;
  loaNumber?: string;
  workOrderNumber?: string;
  agreementNumber?: string;
  contractValue: number;
  revisedValue?: number;
  gstPercent?: number;
  startDate: string;
  originalCompletionDate: string;
  revisedCompletionDate?: string;
  eotDays?: number;
  dlpDays?: number;
  location: ProjectLocation;
  projectManagerId?: string;
  projectManagerName?: string;
  siteManagerId?: string;
  siteManagerName?: string;
  planningManagerId?: string;
  planningManagerName?: string;
  commercialManagerId?: string;
  commercialManagerName?: string;
  status: ProjectStatus;
  progress: number;
  budget: ProjectBudget;
  health: ProjectHealth;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type ProjectType =
  | 'BUILDING' | 'ROAD' | 'HIGHWAY' | 'BRIDGE' | 'RAILWAY'
  | 'METRO' | 'TUNNEL' | 'DAM' | 'CANAL' | 'WATER_SUPPLY'
  | 'SEWERAGE' | 'INDUSTRIAL' | 'MINING' | 'RMC' | 'EPC'
  | 'INFRASTRUCTURE' | 'OTHER';

export type ProjectStatus =
  | 'TENDER' | 'LOA_RECEIVED' | 'WORK_ORDERED' | 'MOBILIZATION'
  | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'DLP_PERIOD'
  | 'CLOSED' | 'TERMINATED';

// ============================================================
// 2. PROJECT LOCATION (GIS-Ready)
// ============================================================
export interface ProjectLocation {
  address: string;
  state: string;
  district: string;
  city: string;
  pin: string;
  country: string;
  latitude?: number;
  longitude?: number;
  siteBoundaries?: SiteBoundary[];
}

export interface SiteBoundary {
  id: string;
  point: { lat: number; lng: number };
  sequence: number;
}

// ============================================================
// 3. PROJECT BUDGET
// ============================================================
export interface ProjectBudget {
  originalBudget: number;
  revisedBudget: number;
  committedCost: number;
  actualCost: number;
  forecastCost: number;
  variance: number;
  variancePercent: number;
}

// ============================================================
// 4. PROJECT HEALTH
// ============================================================
export interface ProjectHealth {
  overall: 'GREEN' | 'AMBER' | 'RED';
  schedule: 'GREEN' | 'AMBER' | 'RED';
  cost: 'GREEN' | 'AMBER' | 'RED';
  quality: 'GREEN' | 'AMBER' | 'RED';
  safety: 'GREEN' | 'AMBER' | 'RED';
  billing: 'GREEN' | 'AMBER' | 'RED';
  procurement: 'GREEN' | 'AMBER' | 'RED';
  resources: 'GREEN' | 'AMBER' | 'RED';
  score: number;
  lastCalculated: string;
}

// ============================================================
// 5. PROJECT TEAM
// ============================================================
export interface ProjectTeamMember {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  role: ProjectRole;
  allocation: number; // percentage
  startDate: string;
  endDate?: string;
  status: EntityStatus;
}

export type ProjectRole =
  | 'PROJECT_MANAGER' | 'SITE_MANAGER' | 'SITE_ENGINEER'
  | 'PLANNING_ENGINEER' | 'QS_ENGINEER' | 'COMMERCIAL_MANAGER'
  | 'ACCOUNTS_MANAGER' | 'PROCUREMENT_MANAGER' | 'STORE_KEEPER'
  | 'QA_QC_ENGINEER' | 'SAFETY_OFFICER' | 'PLANT_MANAGER'
  | 'HR_MANAGER' | 'OTHER';

// ============================================================
// 6. WBS (Work Breakdown Structure)
// ============================================================
export interface WBS {
  id: string;
  companyId: string;
  projectId: string;
  wbsCode: string;
  wbsName: string;
  parentId?: string;
  parentName?: string;
  level: number; // 1=Package, 2=Structure, 3=Area, 4=WorkFront, 5=Activity, 6=Sub-activity
  wbsType: 'PACKAGE' | 'STRUCTURE' | 'AREA' | 'WORK_FRONT' | 'ACTIVITY' | 'SUB_ACTIVITY';
  description?: string;
  startDate?: string;
  finishDate?: string;
  responsibleId?: string;
  responsibleName?: string;
  costCodeId?: string;
  costCodeName?: string;
  boqItemId?: string;
  budget: number;
  actual: number;
  progress: number;
  status: EntityStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 7. COST CODE (extended linkage)
// ============================================================
export interface CostCodeLinkage {
  id: string;
  costCodeId: string;
  wbsId?: string;
  boqItemId?: string;
  materialId?: string;
  labourCategoryId?: string;
  plantId?: string;
  subcontractId?: string;
  purchaseOrderId?: string;
  expenseId?: string;
  billingId?: string;
}

// ============================================================
// 8. WORK FRONT
// ============================================================
export interface WorkFront {
  id: string;
  companyId: string;
  projectId: string;
  siteId?: string;
  wbsId?: string;
  workFrontCode: string;
  workFrontName: string;
  workFrontType: WorkFrontType;
  location?: string;
  responsibleEngineerId?: string;
  responsibleEngineerName?: string;
  plannedQuantity: number;
  actualQuantity: number;
  uomId?: string;
  uomName?: string;
  startDate?: string;
  endDate?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'ABANDONED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export type WorkFrontType =
  | 'EARTHWORK' | 'FOUNDATION' | 'RCC' | 'MASONRY' | 'PLASTER'
  | 'ROAD_FORMATION' | 'DRAIN' | 'BRIDGE_PIER' | 'ABUTMENT'
  | 'DECK' | 'TUNNEL_HEADING' | 'STEEL_WORK' | 'FINISHING'
  | 'ELECTRICAL' | 'PLUMBING' | 'OTHER';

// ============================================================
// 9. BOQ (Bill of Quantities)
// ============================================================
export interface BOQItem {
  id: string;
  companyId: string;
  projectId: string;
  boqCode: string;
  description: string;
  uomId: string;
  uomName: string;
  quantity: number;
  rate: number;
  amount: number;
  costCodeId?: string;
  wbsId?: string;
  category: 'CIVIL' | 'STRUCTURAL' | 'FINISHING' | 'ELECTRICAL' | 'PLUMBING' | 'OTHER';
  isExecuted: boolean;
  executedQuantity: number;
  balanceQuantity: number;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 10. EXECUTION REGISTER
// ============================================================
export interface ExecutionEntry {
  id: string;
  companyId: string;
  projectId: string;
  siteId?: string;
  wbsId?: string;
  boqItemId?: string;
  activityName: string;
  plannedQuantity: number;
  executedQuantity: number;
  cumulativeQuantity: number;
  balanceQuantity: number;
  rate: number;
  value: number;
  entryDate: string;
  engineerId: string;
  engineerName: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 11. DAILY PROGRESS REPORT
// ============================================================
export interface DailyProgress {
  id: string;
  companyId: string;
  projectId: string;
  siteId: string;
  siteName: string;
  reportDate: string;
  weather: 'SUNNY' | 'CLOUDY' | 'RAINY' | 'WINDY' | 'EXTREME';
  entries: DailyProgressEntry[];
  manpowerCount: number;
  plantCount: number;
  materialReceived?: string;
  constraints?: string;
  remarks?: string;
  photos: PhotoEvidence[];
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface DailyProgressEntry {
  id: string;
  wbsId?: string;
  activityName: string;
  boqItemId?: string;
  plannedQuantity: number;
  actualQuantity: number;
  uomId?: string;
  manpower: number;
  plantHours: number;
  remarks?: string;
}

// ============================================================
// 12. PHOTO EVIDENCE
// ============================================================
export interface PhotoEvidence {
  id: string;
  companyId: string;
  projectId: string;
  siteId?: string;
  activityId?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  capturedAt: string;
  capturedBy: string;
  capturedByName: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  tags?: string[];
  status: EntityStatus;
}

// ============================================================
// 13. PRODUCTIVITY METRICS
// ============================================================
export interface ProductivityMetric {
  id: string;
  projectId: string;
  activityId: string;
  activityName: string;
  period: string;
  quantityProduced: number;
  labourDays: number;
  machineHours: number;
  crewSize: number;
  cost: number;
  quantityPerLabourDay: number;
  quantityPerMachineHour: number;
  quantityPerCrew: number;
  costPerQuantity: number;
  benchmark?: number;
  variancePercent?: number;
}

// ============================================================
// 14. DELAY REGISTER
// ============================================================
export interface DelayEntry {
  id: string;
  companyId: string;
  projectId: string;
  activityId?: string;
  activityName: string;
  delayCause: DelayCause;
  responsibleParty: 'CLIENT' | 'CONSULTANT' | 'CONTRACTOR' | 'SUBCONTRACTOR' | 'AUTHORITY' | 'FORCE_MAJEURE' | 'OTHER';
  startDate: string;
  endDate?: string;
  durationDays: number;
  impact: 'CRITICAL' | 'MAJOR' | 'MINOR';
  evidence?: string;
  mitigation?: string;
  claimPotential: boolean;
  eotPotential: boolean;
  status: 'IDENTIFIED' | 'UNDER_ANALYSIS' | 'CLAIM_SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type DelayCause =
  | 'CLIENT_DELAY' | 'DESIGN_CHANGE' | 'APPROVAL_DELAY' | 'PAYMENT_DELAY'
  | 'MATERIAL_SHORTAGE' | 'LABOUR_SHORTAGE' | 'PLANT_BREAKDOWN'
  | 'WEATHER' | 'STATUTORY' | 'SITE_CONDITION' | 'FORCE_MAJEURE' | 'OTHER';

// ============================================================
// 15. RISK REGISTER
// ============================================================
export interface RiskEntry {
  id: string;
  companyId: string;
  projectId: string;
  riskTitle: string;
  description?: string;
  category: RiskCategory;
  probability: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  impact: 'NEGLIGIBLE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'SEVERE';
  riskScore: number; // 1-25
  ownerId: string;
  ownerName: string;
  mitigation?: string;
  contingency?: string;
  dueDate?: string;
  status: 'IDENTIFIED' | 'ANALYZED' | 'MITIGATING' | 'MONITORING' | 'CLOSED' | 'OCCURRED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type RiskCategory =
  | 'COMMERCIAL' | 'TECHNICAL' | 'FINANCIAL' | 'PROCUREMENT'
  | 'MANPOWER' | 'PLANT' | 'MATERIAL' | 'CLIENT' | 'CONSULTANT'
  | 'WEATHER' | 'STATUTORY' | 'SAFETY';

// ============================================================
// 16. ISSUE REGISTER
// ============================================================
export interface IssueEntry {
  id: string;
  companyId: string;
  projectId: string;
  siteId?: string;
  issueTitle: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ownerId: string;
  ownerName: string;
  raisedDate: string;
  dueDate?: string;
  action?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  closureEvidence?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 17. CORRESPONDENCE
// ============================================================
export interface Correspondence {
  id: string;
  companyId: string;
  projectId: string;
  letterNumber: string;
  letterDate: string;
  fromParty: string;
  toParty: string;
  subject: string;
  reference?: string;
  contractRef?: string;
  category: 'INCOMING' | 'OUTGOING' | 'INTERNAL';
  correspondenceType: 'GENERAL' | 'CLAIM' | 'VARIATION' | 'EOT' | 'PAYMENT' | 'TECHNICAL' | 'LEGAL';
  responseRequired: boolean;
  dueDate?: string;
  attachmentIds?: string[];
  status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 18. MEETING MANAGEMENT
// ============================================================
export interface Meeting {
  id: string;
  companyId: string;
  projectId: string;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  location?: string;
  meetingType: 'INTERNAL' | 'CLIENT' | 'CONSULTANT' | 'SUBCONTRACTOR' | 'STATUTORY';
  agenda: string;
  participants: MeetingParticipant[];
  minutes?: string;
  actionItems: ActionItem[];
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface MeetingParticipant {
  id: string;
  userId?: string;
  name: string;
  role?: string;
  organization?: string;
  attended: boolean;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  ownerId: string;
  ownerName: string;
  dueDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  completedAt?: string;
}

// ============================================================
// 19. PROJECT CLOSURE CHECKLIST
// ============================================================
export interface ProjectClosureChecklist {
  id: string;
  projectId: string;
  items: ClosureItem[];
  overallStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClosureItem {
  id: string;
  category: string;
  item: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  remarks?: string;
}

// ============================================================
// 20. PROJECT ANALYTICS
// ============================================================
export interface ProjectAnalytics {
  projectId: string;
  summary: ProjectSummary;
  wbsProgress: WBSProgress[];
  boqProgress: BOQProgress[];
  activityProgress: ActivityProgress[];
  dailyProgress: DailyProgressSummary[];
  productivity: ProductivityMetric[];
  delays: DelayEntry[];
  risks: RiskEntry[];
  issues: IssueEntry[];
  correspondence: Correspondence[];
  meetingActions: ActionItem[];
  costAnalysis: CostAnalysis;
}

export interface ProjectSummary {
  contractValue: number;
  revisedValue: number;
  workExecuted: number;
  certifiedBilling: number;
  receivables: number;
  physicalProgress: number;
  financialProgress: number;
  scheduleVariance: number;
  costVariance: number;
  daysRemaining: number;
  daysOverdue: number;
}

export interface WBSProgress {
  wbsId: string;
  wbsCode: string;
  wbsName: string;
  level: number;
  planned: number;
  actual: number;
  progress: number;
}

export interface BOQProgress {
  boqItemId: string;
  boqCode: string;
  description: string;
  totalQuantity: number;
  executedQuantity: number;
  balanceQuantity: number;
  progress: number;
  value: number;
}

export interface ActivityProgress {
  activityId: string;
  activityName: string;
  plannedStart: string;
  plannedFinish: string;
  actualStart?: string;
  actualFinish?: string;
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

export interface DailyProgressSummary {
  date: string;
  totalQuantity: number;
  manpower: number;
  plantHours: number;
  productivity: number;
}

export interface CostAnalysis {
  budget: number;
  committed: number;
  actual: number;
  forecast: number;
  variance: number;
  variancePercent: number;
  costBreakdown: {
    material: number;
    labour: number;
    plant: number;
    subcontract: number;
    overhead: number;
  };
}

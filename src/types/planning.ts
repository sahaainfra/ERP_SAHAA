// ============================================================
// BUILDCORE ERP - PLANNING & PROJECT CONTROLS TYPES
// Part 07: Advanced Construction Planning & Project Controls
// ============================================================

import type { EntityStatus } from './index';

// ============================================================
// 1. PLANNING MASTER
// ============================================================
export interface PlanningMaster {
  id: string;
  companyId: string;
  projectId: string;
  planningType: PlanningType;
  planningName: string;
  description?: string;
  version: number;
  isBaseline: boolean;
  baselineVersion?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'FROZEN' | 'SUPERSEDED';
  approvedBy?: string;
  approvedAt?: string;
  frozenAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type PlanningType = 
  | 'BASELINE'
  | 'CURRENT_PLAN'
  | 'RECOVERY_PLAN'
  | 'LOOK_AHEAD'
  | 'DAILY_PLAN'
  | 'WEEKLY_PLAN'
  | 'MONTHLY_PLAN';

// ============================================================
// 2. ACTIVITY MASTER
// ============================================================
export interface ActivityMaster {
  id: string;
  companyId: string;
  projectId: string;
  planningId: string;
  activityCode: string;
  activityName: string;
  wbsId?: string;
  boqItemId?: string;
  costCodeId?: string;
  activityType: 'TASK' | 'MILESTONE' | 'LOE' | 'START' | 'FINISH';
  duration: number; // days
  durationUnit: 'DAYS' | 'WEEKS' | 'MONTHS';
  startDate: string;
  finishDate: string;
  responsibleId?: string;
  responsibleName?: string;
  weightage: number; // percentage
  quantity?: number;
  uomId?: string;
  uomName?: string;
  rate?: number;
  budget?: number;
  isCritical: boolean;
  isNearCritical: boolean;
  isDelayed: boolean;
  progress: number; // percentage
  actualStart?: string;
  actualFinish?: string;
  remainingDuration?: number;
  predecessorIds: string[];
  successorIds: string[];
  constraints: string[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
}

// ============================================================
// 3. DEPENDENCIES
// ============================================================
export interface ActivityDependency {
  id: string;
  projectId: string;
  predecessorId: string;
  predecessorName: string;
  successorId: string;
  successorName: string;
  dependencyType: 'FS' | 'SS' | 'FF' | 'SF'; // Finish-to-Start, Start-to-Start, Finish-to-Finish, Start-to-Finish
  lagDays: number; // positive lag or negative lead
  isCritical: boolean;
  createdAt: string;
  createdBy: string;
}

// ============================================================
// 4. BASELINE
// ============================================================
export interface Baseline {
  id: string;
  companyId: string;
  projectId: string;
  baselineName: string;
  version: number;
  frozenAt: string;
  frozenBy: string;
  frozenByName: string;
  totalActivities: number;
  totalDuration: number;
  startDate: string;
  finishDate: string;
  status: 'ACTIVE' | 'SUPERSEDED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface BaselineActivity {
  id: string;
  baselineId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  baselineStartDate: string;
  baselineFinishDate: string;
  baselineDuration: number;
  baselineBudget: number;
  weightage: number;
}

// ============================================================
// 5. GANTT-READY STRUCTURE
// ============================================================
export interface GanttTask {
  id: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  wbsId?: string;
  parentId?: string;
  level: number;
  startDate: string;
  finishDate: string;
  duration: number;
  progress: number;
  isCritical: boolean;
  isMilestone: boolean;
  isSummary: boolean;
  predecessors: string[];
  successors: string[];
  constraints: string[];
  resources: ResourceAllocation[];
  status: string;
}

// ============================================================
// 6. MILESTONES
// ============================================================
export interface Milestone {
  id: string;
  companyId: string;
  projectId: string;
  milestoneName: string;
  milestoneCode: string;
  contractDate?: string;
  baselineDate: string;
  forecastDate: string;
  actualDate?: string;
  varianceDays: number;
  variancePercent: number;
  weightage: number;
  isAchieved: boolean;
  achievedAt?: string;
  status: 'PENDING' | 'ACHIEVED' | 'DELAYED' | 'AT_RISK';
  linkedActivityId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 7. LOOK-AHEAD PLANNING
// ============================================================
export interface LookAheadPlan {
  id: string;
  companyId: string;
  projectId: string;
  planType: '7_DAY' | '14_DAY' | '21_DAY' | 'MONTHLY';
  planName: string;
  startDate: string;
  endDate: string;
  activities: LookAheadActivity[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface LookAheadActivity {
  id: string;
  lookAheadId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  plannedStart: string;
  plannedFinish: string;
  plannedQuantity: number;
  status: 'PLANNED' | 'READY' | 'BLOCKED' | 'EXECUTED';
  constraints?: string[];
  remarks?: string;
  executedQuantity?: number;
  executedAt?: string;
}

// ============================================================
// 8. CONSTRAINT REGISTER
// ============================================================
export interface Constraint {
  id: string;
  companyId: string;
  projectId: string;
  activityId?: string;
  activityName?: string;
  constraintType: ConstraintType;
  constraintDescription: string;
  ownerId: string;
  ownerName: string;
  dateRaised: string;
  requiredBy: string;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  impact: 'CRITICAL' | 'MAJOR' | 'MINOR';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type ConstraintType = 
  | 'DRAWING'
  | 'MATERIAL'
  | 'MANPOWER'
  | 'PLANT'
  | 'APPROVAL'
  | 'CLIENT'
  | 'CONSULTANT'
  | 'LAND'
  | 'UTILITY'
  | 'FINANCE'
  | 'WEATHER';

// ============================================================
// 9. DAILY PROGRESS (Extended from Part 06)
// ============================================================
export interface PlanningDailyProgress {
  id: string;
  companyId: string;
  projectId: string;
  siteId: string;
  reportDate: string;
  activities: DailyActivityProgress[];
  totalManpower: number;
  totalPlantHours: number;
  weather: string;
  remarks?: string;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface DailyActivityProgress {
  id: string;
  dailyProgressId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  plannedQuantity: number;
  actualQuantity: number;
  balanceQuantity: number;
  productivity: number;
  manpowerDeployed: number;
  plantHours: number;
  remarks?: string;
  evidenceIds?: string[];
}

// ============================================================
// 10. WEEKLY/MONTHLY PROGRESS
// ============================================================
export interface WeeklyProgress {
  id: string;
  companyId: string;
  projectId: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  activities: WeeklyActivityProgress[];
  totalPlannedQuantity: number;
  totalActualQuantity: number;
  totalManpower: number;
  totalPlantHours: number;
  productivity: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface WeeklyActivityProgress {
  id: string;
  weeklyProgressId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  plannedQuantity: number;
  actualQuantity: number;
  variance: number;
  variancePercent: number;
  productivity: number;
}

export interface MonthlyProgress {
  id: string;
  companyId: string;
  projectId: string;
  month: number;
  year: number;
  monthName: string;
  activities: MonthlyActivityProgress[];
  totalPlannedQuantity: number;
  totalActualQuantity: number;
  totalManpower: number;
  totalPlantHours: number;
  productivity: number;
  physicalProgress: number;
  financialProgress: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface MonthlyActivityProgress {
  id: string;
  monthlyProgressId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  plannedQuantity: number;
  actualQuantity: number;
  variance: number;
  variancePercent: number;
  productivity: number;
}

// ============================================================
// 11. PROGRESS WEIGHTAGE
// ============================================================
export interface ProgressWeightage {
  id: string;
  companyId: string;
  projectId: string;
  weightageType: 'QUANTITY' | 'VALUE' | 'MILESTONE' | 'CUSTOM';
  activities: ActivityWeightage[];
  totalWeightage: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ActivityWeightage {
  id: string;
  weightageId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  weightage: number; // percentage
  quantity?: number;
  value?: number;
  milestoneId?: string;
  customWeight?: number;
}

// ============================================================
// 12. PHYSICAL PROGRESS
// ============================================================
export interface PhysicalProgress {
  id: string;
  projectId: string;
  asOfDate: string;
  overallProgress: number;
  wbsProgress: WBSPhysicalProgress[];
  activityProgress: ActivityPhysicalProgress[];
  calculatedAt: string;
  calculatedBy: string;
}

export interface WBSPhysicalProgress {
  wbsId: string;
  wbsCode: string;
  wbsName: string;
  plannedProgress: number;
  actualProgress: number;
  variance: number;
}

export interface ActivityPhysicalProgress {
  activityId: string;
  activityCode: string;
  activityName: string;
  plannedQuantity: number;
  actualQuantity: number;
  progress: number;
  weightage: number;
  weightedProgress: number;
}

// ============================================================
// 13. FINANCIAL PROGRESS
// ============================================================
export interface FinancialProgress {
  id: string;
  projectId: string;
  asOfDate: string;
  contractValue: number;
  executedValue: number;
  certifiedValue: number;
  billedValue: number;
  collectedValue: number;
  executedProgress: number;
  certifiedProgress: number;
  billedProgress: number;
  collectedProgress: number;
  calculatedAt: string;
  calculatedBy: string;
}

// ============================================================
// 14. SCHEDULE VARIANCE
// ============================================================
export interface ScheduleVariance {
  id: string;
  projectId: string;
  asOfDate: string;
  activities: ActivityScheduleVariance[];
  overallVarianceDays: number;
  criticalPathVarianceDays: number;
  calculatedAt: string;
  calculatedBy: string;
}

export interface ActivityScheduleVariance {
  activityId: string;
  activityCode: string;
  activityName: string;
  baselineFinish: string;
  forecastFinish: string;
  actualFinish?: string;
  varianceDays: number;
  isCritical: boolean;
  isDelayed: boolean;
}

// ============================================================
// 15. CRITICAL ACTIVITIES
// ============================================================
export interface CriticalActivity {
  id: string;
  projectId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  totalFloat: number; // days
  freeFloat: number; // days
  isCritical: boolean;
  isNearCritical: boolean;
  nearCriticalThreshold: number; // days
  startDate: string;
  finishDate: string;
  duration: number;
  progress: number;
  status: string;
}

// ============================================================
// 16. RECOVERY PLAN
// ============================================================
export interface RecoveryPlan {
  id: string;
  companyId: string;
  projectId: string;
  planName: string;
  description?: string;
  originalCompletionDate: string;
  recoveryTargetDate: string;
  daysToRecover: number;
  activities: RecoveryActivity[];
  additionalManpower: number;
  additionalPlant: number;
  extendedShift: boolean;
  resequencingRequired: boolean;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface RecoveryActivity {
  id: string;
  recoveryPlanId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  originalPlan: string;
  recoveryTarget: string;
  additionalManpower: number;
  additionalPlant: number;
  extendedShift: boolean;
  resequenced: boolean;
  targetDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

// ============================================================
// 17. PRODUCTIVITY TRACKING
// ============================================================
export interface ProductivityTracking {
  id: string;
  projectId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  period: string;
  plannedProductivity: number;
  actualProductivity: number;
  targetProductivity: number;
  variance: number;
  variancePercent: number;
  unit: string; // Cum/man-day, Cum/machine-hour, MT/day, Sqm/day, etc.
  quantityProduced: number;
  resourceUsed: number; // man-days or machine-hours
  calculatedAt: string;
}

// ============================================================
// 18. RESOURCE LOADING
// ============================================================
export interface ResourceLoading {
  id: string;
  projectId: string;
  activityId: string;
  activityCode: string;
  activityName: string;
  startDate: string;
  finishDate: string;
  manpower: ResourceAllocation[];
  plant: ResourceAllocation[];
  material: MaterialRequirement[];
}

export interface ResourceAllocation {
  id: string;
  resourceLoadingId: string;
  resourceType: 'MANPOWER' | 'PLANT';
  resourceId: string;
  resourceName: string;
  quantity: number;
  unit: string;
  startDate: string;
  finishDate: string;
  allocationPercent: number;
}

export interface MaterialRequirement {
  id: string;
  resourceLoadingId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  uomId: string;
  uomName: string;
  requiredDate: string;
}

// ============================================================
// 19. S-CURVE
// ============================================================
export interface SCurve {
  id: string;
  projectId: string;
  asOfDate: string;
  dataPoints: SCurveDataPoint[];
  plannedTotal: number;
  actualTotal: number;
  forecastTotal: number;
  calculatedAt: string;
  calculatedBy: string;
}

export interface SCurveDataPoint {
  date: string;
  plannedCumulative: number;
  actualCumulative: number;
  forecastCumulative: number;
  variance: number;
}

// ============================================================
// 20. EARNED VALUE
// ============================================================
export interface EarnedValue {
  id: string;
  projectId: string;
  asOfDate: string;
  pv: number; // Planned Value
  ev: number; // Earned Value
  ac: number; // Actual Cost
  cpi: number; // Cost Performance Index
  spi: number; // Schedule Performance Index;
  cv: number; // Cost Variance
  sv: number; // Schedule Variance
  eac: number; // Estimate at Completion
  etc: number; // Estimate to Complete
  vac: number; // Variance at Completion
  tcpi: number; // To-Complete Performance Index
  calculatedAt: string;
  calculatedBy: string;
}

// ============================================================
// 21. FORECAST
// ============================================================
export interface Forecast {
  id: string;
  projectId: string;
  forecastType: 'COMPLETION_DATE' | 'COST' | 'BILLING' | 'RESOURCE_DEMAND';
  forecastName: string;
  asOfDate: string;
  forecastDate?: string;
  forecastValue?: number;
  baselineDate?: string;
  baselineValue?: number;
  variance?: number;
  variancePercent?: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  assumptions?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================
// 22. DELAY ANALYTICS
// ============================================================
export interface DelayAnalytics {
  id: string;
  projectId: string;
  asOfDate: string;
  delays: DelayCategory[];
  totalDelayDays: number;
  criticalDelayDays: number;
  compensableDays: number;
  nonCompensableDays: number;
  calculatedAt: string;
  calculatedBy: string;
}

export interface DelayCategory {
  category: 'CLIENT' | 'CONTRACTOR' | 'CONSULTANT' | 'MATERIAL' | 'DESIGN' | 'RESOURCE' | 'WEATHER' | 'STATUTORY';
  delayDays: number;
  impact: 'CRITICAL' | 'MAJOR' | 'MINOR';
  activities: string[];
  isCompensable: boolean;
}

// ============================================================
// 23. PLANNING DASHBOARD KPIs
// ============================================================
export interface PlanningDashboardKPIs {
  plannedProgress: number;
  actualProgress: number;
  variance: number;
  criticalActivities: number;
  delayedActivities: number;
  upcomingMilestones: number;
  openConstraints: number;
  averageProductivity: number;
  forecastCompletionDate: string;
  scheduleVarianceDays: number;
  costVariancePercent: number;
  cpi: number;
  spi: number;
}

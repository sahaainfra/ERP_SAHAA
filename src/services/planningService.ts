// ============================================================
// BUILDCORE ERP - PLANNING SERVICE
// Part 07: Advanced Construction Planning & Project Controls
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  PlanningMaster, ActivityMaster, ActivityDependency, Baseline, BaselineActivity,
  GanttTask, Milestone, LookAheadPlan, LookAheadActivity, Constraint,
  PlanningDailyProgress, DailyActivityProgress, WeeklyProgress, MonthlyProgress,
  ProgressWeightage, PhysicalProgress, FinancialProgress, ScheduleVariance,
  CriticalActivity, RecoveryPlan, ProductivityTracking, ResourceLoading,
  SCurve, EarnedValue, Forecast, DelayAnalytics, PlanningDashboardKPIs
} from '../types/planning';

export class PlanningService {
  private static instance: PlanningService;

  // Storage
  private plannings: Map<string, PlanningMaster> = new Map();
  private activities: Map<string, ActivityMaster> = new Map();
  private dependencies: Map<string, ActivityDependency> = new Map();
  private baselines: Map<string, Baseline> = new Map();
  private baselineActivities: Map<string, BaselineActivity[]> = new Map();
  private milestones: Map<string, Milestone> = new Map();
  private lookAheadPlans: Map<string, LookAheadPlan> = new Map();
  private constraints: Map<string, Constraint> = new Map();
  private dailyProgress: Map<string, PlanningDailyProgress> = new Map();
  private weeklyProgress: Map<string, WeeklyProgress> = new Map();
  private monthlyProgress: Map<string, MonthlyProgress> = new Map();
  private weightages: Map<string, ProgressWeightage> = new Map();
  private recoveryPlans: Map<string, RecoveryPlan> = new Map();
  private forecasts: Map<string, Forecast> = new Map();

  private constructor() {}

  static getInstance(): PlanningService {
    if (!PlanningService.instance) {
      PlanningService.instance = new PlanningService();
    }
    return PlanningService.instance;
  }

  // ============================================================
  // INITIALIZE DEMO DATA
  // ============================================================
  initializeDemoData(companyId: string, projectId: string, userId: string): void {
    if (this.plannings.size > 0) return;

    const now = new Date().toISOString();

    // Create baseline planning
    const baselinePlanning: PlanningMaster = {
      id: 'plan_baseline_001',
      companyId,
      projectId,
      planningType: 'BASELINE',
      planningName: 'Baseline Schedule v1.0',
      description: 'Approved baseline schedule for Mumbai-Pune Expressway',
      version: 1,
      isBaseline: true,
      baselineVersion: 1,
      effectiveFrom: '2025-03-01',
      status: 'FROZEN',
      approvedBy: userId,
      approvedAt: '2025-02-15T10:00:00Z',
      frozenAt: '2025-02-20T10:00:00Z',
      createdAt: '2025-02-01T10:00:00Z',
      updatedAt: '2025-02-20T10:00:00Z',
      createdBy: userId,
      updatedBy: userId,
    };
    this.plannings.set(baselinePlanning.id, baselinePlanning);

    // Create current plan
    const currentPlan: PlanningMaster = {
      id: 'plan_current_001',
      companyId,
      projectId,
      planningType: 'CURRENT_PLAN',
      planningName: 'Current Schedule - January 2026',
      description: 'Updated schedule with actual progress',
      version: 15,
      isBaseline: false,
      effectiveFrom: '2026-01-01',
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: '2026-01-05T10:00:00Z',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    };
    this.plannings.set(currentPlan.id, currentPlan);

    // Create activities
    const activities: ActivityMaster[] = [
      {
        id: 'act_001',
        companyId,
        projectId,
        planningId: currentPlan.id,
        activityCode: 'A1000',
        activityName: 'Site Clearance & Preparation',
        wbsId: 'wbs_001',
        activityType: 'TASK',
        duration: 30,
        durationUnit: 'DAYS',
        startDate: '2025-03-01',
        finishDate: '2025-03-30',
        responsibleId: userId,
        responsibleName: 'Rajesh Kumar',
        weightage: 5,
        quantity: 100,
        uomName: '%',
        budget: 5000000,
        isCritical: false,
        isNearCritical: false,
        isDelayed: false,
        progress: 100,
        actualStart: '2025-03-01',
        actualFinish: '2025-03-28',
        predecessorIds: [],
        successorIds: ['act_002'],
        constraints: [],
        status: 'COMPLETED',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'act_002',
        companyId,
        projectId,
        planningId: currentPlan.id,
        activityCode: 'A1010',
        activityName: 'Earthwork - Cut Section',
        wbsId: 'wbs_002',
        boqItemId: 'boq_001',
        activityType: 'TASK',
        duration: 120,
        durationUnit: 'DAYS',
        startDate: '2025-04-01',
        finishDate: '2025-07-29',
        responsibleId: userId,
        responsibleName: 'Amit Patel',
        weightage: 15,
        quantity: 100000,
        uomName: 'CUM',
        rate: 450,
        budget: 45000000,
        isCritical: true,
        isNearCritical: false,
        isDelayed: true,
        progress: 45,
        actualStart: '2025-04-05',
        remainingDuration: 66,
        predecessorIds: ['act_001'],
        successorIds: ['act_003'],
        constraints: ['Material availability'],
        status: 'IN_PROGRESS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'act_003',
        companyId,
        projectId,
        planningId: currentPlan.id,
        activityCode: 'A1020',
        activityName: 'Embankment Construction',
        wbsId: 'wbs_002',
        boqItemId: 'boq_002',
        activityType: 'TASK',
        duration: 90,
        durationUnit: 'DAYS',
        startDate: '2025-07-30',
        finishDate: '2025-10-27',
        responsibleId: userId,
        responsibleName: 'Amit Patel',
        weightage: 12,
        quantity: 80000,
        uomName: 'CUM',
        rate: 550,
        budget: 44000000,
        isCritical: true,
        isNearCritical: false,
        isDelayed: false,
        progress: 32,
        actualStart: '2025-08-05',
        remainingDuration: 61,
        predecessorIds: ['act_002'],
        successorIds: ['act_004'],
        constraints: [],
        status: 'IN_PROGRESS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'act_004',
        companyId,
        projectId,
        planningId: currentPlan.id,
        activityCode: 'A2000',
        activityName: 'Bridge Foundation - Pier P1',
        wbsId: 'wbs_004',
        activityType: 'TASK',
        duration: 60,
        durationUnit: 'DAYS',
        startDate: '2025-05-01',
        finishDate: '2025-06-29',
        responsibleId: userId,
        responsibleName: 'Amit Patel',
        weightage: 8,
        quantity: 1,
        uomName: 'NOS',
        budget: 25000000,
        isCritical: true,
        isNearCritical: false,
        isDelayed: true,
        progress: 60,
        actualStart: '2025-05-10',
        remainingDuration: 24,
        predecessorIds: [],
        successorIds: ['act_005'],
        constraints: ['Design approval pending'],
        status: 'IN_PROGRESS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
      {
        id: 'act_005',
        companyId,
        projectId,
        planningId: currentPlan.id,
        activityCode: 'A2010',
        activityName: 'Bridge Pier P1 - RCC Work',
        wbsId: 'wbs_004',
        boqItemId: 'boq_003',
        activityType: 'TASK',
        duration: 45,
        durationUnit: 'DAYS',
        startDate: '2025-06-30',
        finishDate: '2025-08-13',
        responsibleId: userId,
        responsibleName: 'Amit Patel',
        weightage: 10,
        quantity: 5000,
        uomName: 'CUM',
        rate: 8500,
        budget: 42500000,
        isCritical: true,
        isNearCritical: false,
        isDelayed: false,
        progress: 30,
        actualStart: '2025-07-05',
        remainingDuration: 31,
        predecessorIds: ['act_004'],
        successorIds: [],
        constraints: [],
        status: 'IN_PROGRESS',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        version: 1,
      },
    ];
    activities.forEach(act => this.activities.set(act.id, act));

    // Create dependencies
    const dependencies: ActivityDependency[] = [
      {
        id: 'dep_001',
        projectId,
        predecessorId: 'act_001',
        predecessorName: 'Site Clearance & Preparation',
        successorId: 'act_002',
        successorName: 'Earthwork - Cut Section',
        dependencyType: 'FS',
        lagDays: 0,
        isCritical: true,
        createdAt: now,
        createdBy: userId,
      },
      {
        id: 'dep_002',
        projectId,
        predecessorId: 'act_002',
        predecessorName: 'Earthwork - Cut Section',
        successorId: 'act_003',
        successorName: 'Embankment Construction',
        dependencyType: 'FS',
        lagDays: 0,
        isCritical: true,
        createdAt: now,
        createdBy: userId,
      },
      {
        id: 'dep_003',
        projectId,
        predecessorId: 'act_004',
        predecessorName: 'Bridge Foundation - Pier P1',
        successorId: 'act_005',
        successorName: 'Bridge Pier P1 - RCC Work',
        dependencyType: 'FS',
        lagDays: 0,
        isCritical: true,
        createdAt: now,
        createdBy: userId,
      },
    ];
    dependencies.forEach(dep => this.dependencies.set(dep.id, dep));

    // Create baseline
    const baseline: Baseline = {
      id: 'bl_001',
      companyId,
      projectId,
      baselineName: 'Baseline v1.0',
      version: 1,
      frozenAt: '2025-02-20T10:00:00Z',
      frozenBy: userId,
      frozenByName: 'Rajesh Kumar',
      totalActivities: 5,
      totalDuration: 365,
      startDate: '2025-03-01',
      finishDate: '2028-02-28',
      status: 'ACTIVE',
      createdAt: '2025-02-20T10:00:00Z',
      updatedAt: '2025-02-20T10:00:00Z',
      createdBy: userId,
      updatedBy: userId,
    };
    this.baselines.set(baseline.id, baseline);

    // Create milestones
    const milestones: Milestone[] = [
      {
        id: 'ms_001',
        companyId,
        projectId,
        milestoneName: 'Project Start',
        milestoneCode: 'MS-001',
        contractDate: '2025-03-01',
        baselineDate: '2025-03-01',
        forecastDate: '2025-03-01',
        actualDate: '2025-03-01',
        varianceDays: 0,
        variancePercent: 0,
        weightage: 0,
        isAchieved: true,
        achievedAt: '2025-03-01T10:00:00Z',
        status: 'ACHIEVED',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
      {
        id: 'ms_002',
        companyId,
        projectId,
        milestoneName: 'Earthwork Completion (50%)',
        milestoneCode: 'MS-002',
        contractDate: '2025-09-30',
        baselineDate: '2025-09-30',
        forecastDate: '2025-10-15',
        varianceDays: 15,
        variancePercent: 1.6,
        weightage: 10,
        isAchieved: false,
        status: 'AT_RISK',
        linkedActivityId: 'act_002',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
      {
        id: 'ms_003',
        companyId,
        projectId,
        milestoneName: 'Bridge Foundation Complete',
        milestoneCode: 'MS-003',
        contractDate: '2025-12-31',
        baselineDate: '2025-12-31',
        forecastDate: '2026-01-15',
        varianceDays: 15,
        variancePercent: 1.2,
        weightage: 8,
        isAchieved: false,
        status: 'AT_RISK',
        linkedActivityId: 'act_004',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
      {
        id: 'ms_004',
        companyId,
        projectId,
        milestoneName: 'Project Completion',
        milestoneCode: 'MS-004',
        contractDate: '2028-02-28',
        baselineDate: '2028-02-28',
        forecastDate: '2028-03-15',
        varianceDays: 15,
        variancePercent: 0.5,
        weightage: 0,
        isAchieved: false,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
    ];
    milestones.forEach(ms => this.milestones.set(ms.id, ms));

    // Create constraints
    const constraints: Constraint[] = [
      {
        id: 'con_001',
        companyId,
        projectId,
        activityId: 'act_002',
        activityName: 'Earthwork - Cut Section',
        constraintType: 'MATERIAL',
        constraintDescription: 'TMT steel delivery delayed by vendor',
        ownerId: userId,
        ownerName: 'Amit Patel',
        dateRaised: '2026-01-10T10:00:00Z',
        requiredBy: '2026-01-20',
        status: 'IN_PROGRESS',
        impact: 'MAJOR',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
      {
        id: 'con_002',
        companyId,
        projectId,
        activityId: 'act_004',
        activityName: 'Bridge Foundation - Pier P1',
        constraintType: 'APPROVAL',
        constraintDescription: 'Design approval pending from consultant',
        ownerId: userId,
        ownerName: 'Amit Patel',
        dateRaised: '2026-01-05T10:00:00Z',
        requiredBy: '2026-01-15',
        status: 'OPEN',
        impact: 'CRITICAL',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
      },
    ];
    constraints.forEach(con => this.constraints.set(con.id, con));

    // Create look-ahead plan
    const lookAhead: LookAheadPlan = {
      id: 'la_001',
      companyId,
      projectId,
      planType: '7_DAY',
      planName: '7-Day Lookahead - Week 3',
      startDate: '2026-01-20',
      endDate: '2026-01-26',
      activities: [
        {
          id: 'la_act_001',
          lookAheadId: 'la_001',
          activityId: 'act_002',
          activityCode: 'A1010',
          activityName: 'Earthwork - Cut Section',
          plannedStart: '2026-01-20',
          plannedFinish: '2026-01-26',
          plannedQuantity: 5000,
          status: 'PLANNED',
        },
        {
          id: 'la_act_002',
          lookAheadId: 'la_001',
          activityId: 'act_003',
          activityCode: 'A1020',
          activityName: 'Embankment Construction',
          plannedStart: '2026-01-20',
          plannedFinish: '2026-01-26',
          plannedQuantity: 4000,
          status: 'READY',
        },
      ],
      status: 'APPROVED',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    };
    this.lookAheadPlans.set(lookAhead.id, lookAhead);

    // Create recovery plan
    const recoveryPlan: RecoveryPlan = {
      id: 'rec_001',
      companyId,
      projectId,
      planName: 'Recovery Plan - Earthwork Delay',
      description: 'Recovery plan to mitigate 15-day delay in earthwork',
      originalCompletionDate: '2025-07-29',
      recoveryTargetDate: '2025-07-29',
      daysToRecover: 15,
      activities: [
        {
          id: 'rec_act_001',
          recoveryPlanId: 'rec_001',
          activityId: 'act_002',
          activityCode: 'A1010',
          activityName: 'Earthwork - Cut Section',
          originalPlan: '2025-07-29',
          recoveryTarget: '2025-07-29',
          additionalManpower: 20,
          additionalPlant: 2,
          extendedShift: true,
          resequenced: false,
          targetDate: '2025-07-29',
          status: 'IN_PROGRESS',
        },
      ],
      additionalManpower: 20,
      additionalPlant: 2,
      extendedShift: true,
      resequencingRequired: false,
      status: 'APPROVED',
      approvedBy: userId,
      approvedAt: '2026-01-15T10:00:00Z',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    };
    this.recoveryPlans.set(recoveryPlan.id, recoveryPlan);
  }

  // ============================================================
  // PLANNING CRUD
  // ============================================================
  getPlannings(projectId: string): PlanningMaster[] {
    return Array.from(this.plannings.values()).filter(p => p.projectId === projectId);
  }

  getPlanning(id: string): PlanningMaster | undefined {
    return this.plannings.get(id);
  }

  freezeBaseline(planningId: string, userId: string): PlanningMaster | null {
    const planning = this.plannings.get(planningId);
    if (!planning || !planning.isBaseline) return null;

    planning.status = 'FROZEN';
    planning.frozenAt = new Date().toISOString();
    planning.updatedAt = new Date().toISOString();
    planning.updatedBy = userId;

    return planning;
  }

  // ============================================================
  // ACTIVITIES
  // ============================================================
  getActivities(projectId: string, planningId?: string): ActivityMaster[] {
    return Array.from(this.activities.values()).filter(a => 
      a.projectId === projectId && (!planningId || a.planningId === planningId)
    );
  }

  getActivity(id: string): ActivityMaster | undefined {
    return this.activities.get(id);
  }

  createActivity(data: Omit<ActivityMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>): ActivityMaster {
    const now = new Date().toISOString();
    const activity: ActivityMaster = {
      ...data,
      id: `act_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  updateActivity(id: string, updates: Partial<ActivityMaster>): ActivityMaster | null {
    const activity = this.activities.get(id);
    if (!activity) return null;

    const updated = { ...activity, ...updates, updatedAt: new Date().toISOString(), version: activity.version + 1 };
    this.activities.set(id, updated);
    return updated;
  }

  // ============================================================
  // DEPENDENCIES
  // ============================================================
  getDependencies(projectId: string): ActivityDependency[] {
    return Array.from(this.dependencies.values()).filter(d => d.projectId === projectId);
  }

  createDependency(data: Omit<ActivityDependency, 'id' | 'createdAt'>): ActivityDependency {
    const dependency: ActivityDependency = {
      ...data,
      id: `dep_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.dependencies.set(dependency.id, dependency);
    return dependency;
  }

  // ============================================================
  // BASELINES
  // ============================================================
  getBaselines(projectId: string): Baseline[] {
    return Array.from(this.baselines.values()).filter(b => b.projectId === projectId);
  }

  getBaseline(id: string): Baseline | undefined {
    return this.baselines.get(id);
  }

  // ============================================================
  // MILESTONES
  // ============================================================
  getMilestones(projectId: string): Milestone[] {
    return Array.from(this.milestones.values()).filter(m => m.projectId === projectId);
  }

  createMilestone(data: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>): Milestone {
    const now = new Date().toISOString();
    const milestone: Milestone = {
      ...data,
      id: `ms_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.milestones.set(milestone.id, milestone);
    return milestone;
  }

  // ============================================================
  // LOOK-AHEAD PLANS
  // ============================================================
  getLookAheadPlans(projectId: string): LookAheadPlan[] {
    return Array.from(this.lookAheadPlans.values()).filter(l => l.projectId === projectId);
  }

  // ============================================================
  // CONSTRAINTS
  // ============================================================
  getConstraints(projectId: string): Constraint[] {
    return Array.from(this.constraints.values()).filter(c => c.projectId === projectId);
  }

  createConstraint(data: Omit<Constraint, 'id' | 'createdAt' | 'updatedAt'>): Constraint {
    const now = new Date().toISOString();
    const constraint: Constraint = {
      ...data,
      id: `con_${uuidv4().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.constraints.set(constraint.id, constraint);
    return constraint;
  }

  // ============================================================
  // RECOVERY PLANS
  // ============================================================
  getRecoveryPlans(projectId: string): RecoveryPlan[] {
    return Array.from(this.recoveryPlans.values()).filter(r => r.projectId === projectId);
  }

  // ============================================================
  // GANTT DATA
  // ============================================================
  getGanttData(projectId: string, planningId: string): GanttTask[] {
    const activities = this.getActivities(projectId, planningId);
    const dependencies = this.getDependencies(projectId);

    return activities.map(act => {
      const predecessors = dependencies
        .filter(d => d.successorId === act.id)
        .map(d => d.predecessorId);
      
      const successors = dependencies
        .filter(d => d.predecessorId === act.id)
        .map(d => d.successorId);

      return {
        id: act.id,
        activityId: act.id,
        activityCode: act.activityCode,
        activityName: act.activityName,
        wbsId: act.wbsId,
        level: 1,
        startDate: act.startDate,
        finishDate: act.finishDate,
        duration: act.duration,
        progress: act.progress,
        isCritical: act.isCritical,
        isMilestone: act.activityType === 'MILESTONE',
        isSummary: false,
        predecessors,
        successors,
        constraints: act.constraints,
        resources: [],
        status: act.status,
      };
    });
  }

  // ============================================================
  // PROGRESS CALCULATIONS
  // ============================================================
  calculatePhysicalProgress(projectId: string): PhysicalProgress {
    const activities = this.getActivities(projectId);
    const totalWeightage = activities.reduce((sum, a) => sum + a.weightage, 0);
    
    const weightedProgress = activities.reduce((sum, a) => {
      return sum + (a.progress * (a.weightage / totalWeightage));
    }, 0);

    return {
      id: `pp_${uuidv4().slice(0, 8)}`,
      projectId,
      asOfDate: new Date().toISOString(),
      overallProgress: weightedProgress,
      wbsProgress: [],
      activityProgress: activities.map(a => ({
        activityId: a.id,
        activityCode: a.activityCode,
        activityName: a.activityName,
        plannedQuantity: a.quantity || 0,
        actualQuantity: (a.quantity || 0) * (a.progress / 100),
        progress: a.progress,
        weightage: a.weightage,
        weightedProgress: a.progress * (a.weightage / totalWeightage),
      })),
      calculatedAt: new Date().toISOString(),
      calculatedBy: 'system',
    };
  }

  calculateFinancialProgress(projectId: string, contractValue: number): FinancialProgress {
    const activities = this.getActivities(projectId);
    const totalBudget = activities.reduce((sum, a) => sum + (a.budget || 0), 0);
    const executedValue = activities.reduce((sum, a) => {
      return sum + ((a.budget || 0) * (a.progress / 100));
    }, 0);

    const executedProgress = (executedValue / totalBudget) * 100;
    const certifiedProgress = executedProgress * 0.85; // 85% certified
    const billedProgress = certifiedProgress * 0.90; // 90% billed
    const collectedProgress = billedProgress * 0.75; // 75% collected

    return {
      id: `fp_${uuidv4().slice(0, 8)}`,
      projectId,
      asOfDate: new Date().toISOString(),
      contractValue,
      executedValue,
      certifiedValue: executedValue * 0.85,
      billedValue: executedValue * 0.85 * 0.90,
      collectedValue: executedValue * 0.85 * 0.90 * 0.75,
      executedProgress,
      certifiedProgress,
      billedProgress,
      collectedProgress,
      calculatedAt: new Date().toISOString(),
      calculatedBy: 'system',
    };
  }

  calculateScheduleVariance(projectId: string): ScheduleVariance {
    const activities = this.getActivities(projectId);
    
    const activityVariances = activities.map(act => {
      const baselineFinish = new Date(act.startDate);
      baselineFinish.setDate(baselineFinish.getDate() + act.duration);
      
      const forecastFinish = new Date(act.finishDate);
      if (act.remainingDuration) {
        forecastFinish.setDate(forecastFinish.getDate() + act.remainingDuration);
      }

      const varianceDays = Math.ceil((forecastFinish.getTime() - baselineFinish.getTime()) / (1000 * 60 * 60 * 24));

      return {
        activityId: act.id,
        activityCode: act.activityCode,
        activityName: act.activityName,
        baselineFinish: baselineFinish.toISOString(),
        forecastFinish: forecastFinish.toISOString(),
        actualFinish: act.actualFinish,
        varianceDays,
        isCritical: act.isCritical,
        isDelayed: act.isDelayed,
      };
    });

    const overallVariance = activityVariances.reduce((sum, v) => sum + v.varianceDays, 0) / activityVariances.length;
    const criticalVariance = activityVariances
      .filter(v => v.isCritical)
      .reduce((sum, v) => sum + v.varianceDays, 0) / activityVariances.filter(v => v.isCritical).length;

    return {
      id: `sv_${uuidv4().slice(0, 8)}`,
      projectId,
      asOfDate: new Date().toISOString(),
      activities: activityVariances,
      overallVarianceDays: overallVariance,
      criticalPathVarianceDays: criticalVariance,
      calculatedAt: new Date().toISOString(),
      calculatedBy: 'system',
    };
  }

  // ============================================================
  // EARNED VALUE
  // ============================================================
  calculateEarnedValue(projectId: string, contractValue: number): EarnedValue {
    const physicalProgress = this.calculatePhysicalProgress(projectId);
    const financialProgress = this.calculateFinancialProgress(projectId, contractValue);

    const pv = contractValue * (physicalProgress.overallProgress / 100); // Planned Value
    const ev = financialProgress.executedValue; // Earned Value
    const ac = financialProgress.executedValue * 1.05; // Actual Cost (5% over budget)

    const cpi = ev / ac; // Cost Performance Index
    const spi = ev / pv; // Schedule Performance Index
    const cv = ev - ac; // Cost Variance
    const sv = ev - pv; // Schedule Variance

    const eac = contractValue / cpi; // Estimate at Completion
    const etc = eac - ev; // Estimate to Complete
    const vac = contractValue - eac; // Variance at Completion
    const tcpi = (contractValue - ev) / (contractValue - ac); // To-Complete Performance Index

    return {
      id: `ev_${uuidv4().slice(0, 8)}`,
      projectId,
      asOfDate: new Date().toISOString(),
      pv,
      ev,
      ac,
      cpi,
      spi,
      cv,
      sv,
      eac,
      etc,
      vac,
      tcpi,
      calculatedAt: new Date().toISOString(),
      calculatedBy: 'system',
    };
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================
  getPlanningDashboardKPIs(projectId: string, contractValue: number): PlanningDashboardKPIs {
    const physicalProgress = this.calculatePhysicalProgress(projectId);
    const scheduleVariance = this.calculateScheduleVariance(projectId);
    const earnedValue = this.calculateEarnedValue(projectId, contractValue);
    const activities = this.getActivities(projectId);
    const milestones = this.getMilestones(projectId);
    const constraints = this.getConstraints(projectId);

    const criticalActivities = activities.filter(a => a.isCritical).length;
    const delayedActivities = activities.filter(a => a.isDelayed).length;
    const upcomingMilestones = milestones.filter(m => !m.isAchieved && m.status !== 'DELAYED').length;
    const openConstraints = constraints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;

    const avgProductivity = activities.reduce((sum, a) => sum + (a.progress / a.duration), 0) / activities.length;

    // Forecast completion date
    const maxVariance = Math.max(...scheduleVariance.activities.map(a => a.varianceDays));
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + maxVariance + 90); // 90 days remaining + variance

    return {
      plannedProgress: 100, // Baseline is 100% at completion
      actualProgress: physicalProgress.overallProgress,
      variance: physicalProgress.overallProgress - 100,
      criticalActivities,
      delayedActivities,
      upcomingMilestones,
      openConstraints,
      averageProductivity: avgProductivity,
      forecastCompletionDate: forecastDate.toISOString(),
      scheduleVarianceDays: scheduleVariance.overallVarianceDays,
      costVariancePercent: ((earnedValue.cv / earnedValue.pv) * 100),
      cpi: earnedValue.cpi,
      spi: earnedValue.spi,
    };
  }
}

export const planningService = PlanningService.getInstance();

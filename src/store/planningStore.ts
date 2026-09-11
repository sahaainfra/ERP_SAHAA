// ============================================================
// BUILDCORE ERP - PLANNING STORE
// Part 07: Advanced Construction Planning & Project Controls
// ============================================================

import { create } from 'zustand';
import type {
  PlanningMaster, ActivityMaster, ActivityDependency, Baseline, Milestone,
  LookAheadPlan, Constraint, RecoveryPlan, PlanningDashboardKPIs,
  PhysicalProgress, FinancialProgress, ScheduleVariance, EarnedValue, GanttTask
} from '../types/planning';
import { planningService } from '../services/planningService';

interface PlanningState {
  // Data
  plannings: PlanningMaster[];
  activities: ActivityMaster[];
  dependencies: ActivityDependency[];
  baselines: Baseline[];
  milestones: Milestone[];
  lookAheadPlans: LookAheadPlan[];
  constraints: Constraint[];
  recoveryPlans: RecoveryPlan[];
  ganttData: GanttTask[];
  
  // Calculations
  physicalProgress: PhysicalProgress | null;
  financialProgress: FinancialProgress | null;
  scheduleVariance: ScheduleVariance | null;
  earnedValue: EarnedValue | null;
  dashboardKPIs: PlanningDashboardKPIs | null;
  
  // State
  selectedProjectId: string | null;
  selectedPlanningId: string | null;
  initialized: boolean;

  // Actions
  initialize: (companyId: string, projectId: string, userId: string) => void;
  refresh: (projectId: string, planningId?: string) => void;
  selectProject: (projectId: string) => void;
  selectPlanning: (planningId: string) => void;
  loadGanttData: (projectId: string, planningId: string) => void;
  calculatePhysicalProgress: (projectId: string) => void;
  calculateFinancialProgress: (projectId: string, contractValue: number) => void;
  calculateScheduleVariance: (projectId: string) => void;
  calculateEarnedValue: (projectId: string, contractValue: number) => void;
  loadDashboardKPIs: (projectId: string, contractValue: number) => void;
  freezeBaseline: (planningId: string, userId: string) => void;
  createActivity: (data: Omit<ActivityMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateActivity: (id: string, updates: Partial<ActivityMaster>) => void;
  createDependency: (data: Omit<ActivityDependency, 'id' | 'createdAt'>) => void;
  createMilestone: (data: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createConstraint: (data: Omit<Constraint, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const usePlanningStore = create<PlanningState>((set, get) => ({
  // Initial state
  plannings: [],
  activities: [],
  dependencies: [],
  baselines: [],
  milestones: [],
  lookAheadPlans: [],
  constraints: [],
  recoveryPlans: [],
  ganttData: [],
  physicalProgress: null,
  financialProgress: null,
  scheduleVariance: null,
  earnedValue: null,
  dashboardKPIs: null,
  selectedProjectId: null,
  selectedPlanningId: null,
  initialized: false,

  // Initialize demo data
  initialize: (companyId: string, projectId: string, userId: string) => {
    if (get().initialized) return;
    planningService.initializeDemoData(companyId, projectId, userId);
    get().refresh(projectId);
    set({ initialized: true, selectedProjectId: projectId });
  },

  // Refresh data
  refresh: (projectId: string, planningId?: string) => {
    set({
      plannings: planningService.getPlannings(projectId),
      activities: planningService.getActivities(projectId, planningId),
      dependencies: planningService.getDependencies(projectId),
      baselines: planningService.getBaselines(projectId),
      milestones: planningService.getMilestones(projectId),
      lookAheadPlans: planningService.getLookAheadPlans(projectId),
      constraints: planningService.getConstraints(projectId),
      recoveryPlans: planningService.getRecoveryPlans(projectId),
    });
  },

  // Select project
  selectProject: (projectId: string) => {
    set({ selectedProjectId: projectId });
    get().refresh(projectId);
  },

  // Select planning
  selectPlanning: (planningId: string) => {
    const projectId = get().selectedProjectId;
    if (projectId) {
      set({ selectedPlanningId: planningId });
      get().refresh(projectId, planningId);
    }
  },

  // Load Gantt data
  loadGanttData: (projectId: string, planningId: string) => {
    const ganttData = planningService.getGanttData(projectId, planningId);
    set({ ganttData });
  },

  // Calculate physical progress
  calculatePhysicalProgress: (projectId: string) => {
    const progress = planningService.calculatePhysicalProgress(projectId);
    set({ physicalProgress: progress });
  },

  // Calculate financial progress
  calculateFinancialProgress: (projectId: string, contractValue: number) => {
    const progress = planningService.calculateFinancialProgress(projectId, contractValue);
    set({ financialProgress: progress });
  },

  // Calculate schedule variance
  calculateScheduleVariance: (projectId: string) => {
    const variance = planningService.calculateScheduleVariance(projectId);
    set({ scheduleVariance: variance });
  },

  // Calculate earned value
  calculateEarnedValue: (projectId: string, contractValue: number) => {
    const ev = planningService.calculateEarnedValue(projectId, contractValue);
    set({ earnedValue: ev });
  },

  // Load dashboard KPIs
  loadDashboardKPIs: (projectId: string, contractValue: number) => {
    const kpis = planningService.getPlanningDashboardKPIs(projectId, contractValue);
    set({ dashboardKPIs: kpis });
  },

  // Freeze baseline
  freezeBaseline: (planningId: string, userId: string) => {
    planningService.freezeBaseline(planningId, userId);
    const projectId = get().selectedProjectId;
    if (projectId) {
      get().refresh(projectId);
    }
  },

  // Create activity
  createActivity: (data) => {
    planningService.createActivity(data);
    const projectId = get().selectedProjectId;
    if (projectId) {
      get().refresh(projectId);
    }
  },

  // Update activity
  updateActivity: (id: string, updates: Partial<ActivityMaster>) => {
    planningService.updateActivity(id, updates);
    const projectId = get().selectedProjectId;
    if (projectId) {
      get().refresh(projectId);
    }
  },

  // Create dependency
  createDependency: (data) => {
    planningService.createDependency(data);
    const projectId = get().selectedProjectId;
    if (projectId) {
      get().refresh(projectId);
    }
  },

  // Create milestone
  createMilestone: (data) => {
    planningService.createMilestone(data);
    const projectId = get().selectedProjectId;
    if (projectId) {
      get().refresh(projectId);
    }
  },

  // Create constraint
  createConstraint: (data) => {
    planningService.createConstraint(data);
    const projectId = get().selectedProjectId;
    if (projectId) {
      get().refresh(projectId);
    }
  },
}));

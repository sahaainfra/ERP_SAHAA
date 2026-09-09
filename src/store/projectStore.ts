// ============================================================
// BUILDCORE ERP - PROJECT MANAGEMENT STORE
// Part 06: Project Management & Construction Execution
// ============================================================

import { create } from 'zustand';
import type {
  ProjectMaster, ProjectTeamMember, WBS, WorkFront, BOQItem,
  ExecutionEntry, DailyProgress, DelayEntry, RiskEntry, IssueEntry,
  Correspondence, Meeting, ProjectClosureChecklist, ProjectAnalytics
} from '../types/project';
import { projectService } from '../services/projectService';

interface ProjectState {
  projects: ProjectMaster[];
  selectedProjectId: string | null;
  selectedProject: ProjectMaster | null;
  teamMembers: ProjectTeamMember[];
  wbsItems: WBS[];
  workFronts: WorkFront[];
  boqItems: BOQItem[];
  executionEntries: ExecutionEntry[];
  dailyProgress: DailyProgress[];
  delays: DelayEntry[];
  risks: RiskEntry[];
  issues: IssueEntry[];
  correspondence: Correspondence[];
  meetings: Meeting[];
  closureChecklist: ProjectClosureChecklist | null;
  analytics: ProjectAnalytics | null;
  initialized: boolean;

  // Actions
  initialize: (companyId: string, userId: string) => void;
  refresh: (companyId?: string) => void;
  selectProject: (projectId: string) => void;
  loadProjectData: (projectId: string) => void;
  clearSelection: () => void;
  updateProject: (id: string, updates: Partial<ProjectMaster>) => void;
  addTeamMember: (member: Omit<ProjectTeamMember, 'id'>) => void;
  createWBS: (data: Omit<WBS, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  addExecutionEntry: (entry: Omit<ExecutionEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addDailyProgress: (report: Omit<DailyProgress, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  addDelay: (delay: Omit<DelayEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addRisk: (risk: Omit<RiskEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addIssue: (issue: Omit<IssueEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addCorrespondence: (corr: Omit<Correspondence, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  loadAnalytics: (projectId: string) => void;
  initializeClosure: (projectId: string) => void;
  updateClosureItem: (projectId: string, itemId: string, isCompleted: boolean, userId?: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProjectId: null,
  selectedProject: null,
  teamMembers: [],
  wbsItems: [],
  workFronts: [],
  boqItems: [],
  executionEntries: [],
  dailyProgress: [],
  delays: [],
  risks: [],
  issues: [],
  correspondence: [],
  meetings: [],
  closureChecklist: null,
  analytics: null,
  initialized: false,

  initialize: (companyId: string, userId: string) => {
    if (get().initialized) return;
    projectService.initializeDemoData(companyId, userId);
    get().refresh(companyId);
    set({ initialized: true });
  },

  refresh: (companyId?: string) => {
    set({
      projects: projectService.getProjects(companyId),
    });
    const selectedId = get().selectedProjectId;
    if (selectedId) {
      get().loadProjectData(selectedId);
    }
  },

  selectProject: (projectId: string) => {
    const project = projectService.getProject(projectId);
    if (!project) return;

    set({
      selectedProjectId: projectId,
      selectedProject: project,
      teamMembers: projectService.getTeamMembers(projectId),
      wbsItems: projectService.getWBS(projectId),
      workFronts: projectService.getWorkFronts(projectId),
      boqItems: projectService.getBOQItems(projectId),
      executionEntries: projectService.getExecutionEntries(projectId),
      dailyProgress: projectService.getDailyProgress(projectId),
      delays: projectService.getDelays(projectId),
      risks: projectService.getRisks(projectId),
      issues: projectService.getIssues(projectId),
      correspondence: projectService.getCorrespondence(projectId),
      meetings: projectService.getMeetings(projectId),
      closureChecklist: projectService.getClosureChecklist(projectId),
      analytics: projectService.getProjectAnalytics(projectId),
    });
  },

  loadProjectData: (projectId: string) => {
    set({
      teamMembers: projectService.getTeamMembers(projectId),
      wbsItems: projectService.getWBS(projectId),
      workFronts: projectService.getWorkFronts(projectId),
      boqItems: projectService.getBOQItems(projectId),
      executionEntries: projectService.getExecutionEntries(projectId),
      dailyProgress: projectService.getDailyProgress(projectId),
      delays: projectService.getDelays(projectId),
      risks: projectService.getRisks(projectId),
      issues: projectService.getIssues(projectId),
      correspondence: projectService.getCorrespondence(projectId),
      meetings: projectService.getMeetings(projectId),
      closureChecklist: projectService.getClosureChecklist(projectId),
      analytics: projectService.getProjectAnalytics(projectId),
    });
  },

  clearSelection: () => {
    set({
      selectedProjectId: null,
      selectedProject: null,
      teamMembers: [],
      wbsItems: [],
      workFronts: [],
      boqItems: [],
      executionEntries: [],
      dailyProgress: [],
      delays: [],
      risks: [],
      issues: [],
      correspondence: [],
      meetings: [],
      closureChecklist: null,
      analytics: null,
    });
  },

  updateProject: (id, updates) => {
    projectService.updateProject(id, updates);
    get().refresh();
  },

  addTeamMember: (member) => {
    projectService.addTeamMember(member);
    get().loadProjectData(member.projectId);
  },

  createWBS: (data) => {
    projectService.createWBS(data);
    get().loadProjectData(data.projectId);
  },

  addExecutionEntry: (entry) => {
    projectService.addExecutionEntry(entry);
    get().loadProjectData(entry.projectId);
  },

  addDailyProgress: (report) => {
    projectService.addDailyProgress(report);
    get().loadProjectData(report.projectId);
  },

  addDelay: (delay) => {
    projectService.addDelay(delay);
    get().loadProjectData(delay.projectId);
  },

  addRisk: (risk) => {
    projectService.addRisk(risk);
    get().loadProjectData(risk.projectId);
  },

  addIssue: (issue) => {
    projectService.addIssue(issue);
    get().loadProjectData(issue.projectId);
  },

  addCorrespondence: (corr) => {
    projectService.addCorrespondence(corr);
    get().loadProjectData(corr.projectId);
  },

  addMeeting: (meeting) => {
    projectService.addMeeting(meeting);
    get().loadProjectData(meeting.projectId);
  },

  loadAnalytics: (projectId) => {
    set({ analytics: projectService.getProjectAnalytics(projectId) });
  },

  initializeClosure: (projectId) => {
    projectService.initializeClosureChecklist(projectId);
    get().loadProjectData(projectId);
  },

  updateClosureItem: (projectId, itemId, isCompleted, userId) => {
    projectService.updateClosureItem(projectId, itemId, isCompleted, userId);
    get().loadProjectData(projectId);
  },
}));

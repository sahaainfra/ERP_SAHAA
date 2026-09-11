// ============================================================
// BUILDCORE ERP - QUALITY MANAGEMENT STORE
// Part 18: Material Quality Control System
// ============================================================

import { create } from 'zustand';
import type {
  MaterialInspectionRequest, MaterialInspectionChecklist, MaterialTest,
  TestCertificate, MaterialSample, NonConformanceReport, MaterialHold,
  InspectionPhoto, CalibrationRecord, VendorQualityScore, QualityAlert,
  QualityDashboardKPIs, MaterialQualityHistory, MIRStatus, TestStatus,
  SampleStatus, NCRStatus, QualityAlertType, InspectionChecklistItem
} from '../types/quality';
import { qualityService } from '../services/qualityService';

interface QualityState {
  // Data
  mirs: MaterialInspectionRequest[];
  checklists: MaterialInspectionChecklist[];
  tests: MaterialTest[];
  certificates: TestCertificate[];
  samples: MaterialSample[];
  ncrs: NonConformanceReport[];
  holds: MaterialHold[];
  calibrations: CalibrationRecord[];
  alerts: QualityAlert[];
  vendorScores: VendorQualityScore[];
  qualityHistory: MaterialQualityHistory[];
  dashboardKPIs: QualityDashboardKPIs | null;

  // Filters
  companyId: string | null;
  mirStatusFilter: MIRStatus | null;
  testStatusFilter: TestStatus | null;
  ncrStatusFilter: NCRStatus | null;
  vendorIdFilter: string | null;
  projectIdFilter: string | null;
  materialIdFilter: string | null;

  // Actions
  initialize: (companyId: string) => void;
  refresh: (companyId: string) => void;

  // MIR Actions
  createMIR: (data: Omit<MaterialInspectionRequest, 'id' | 'mirNumber' | 'createdAt' | 'updatedAt' | 'version'>) => MaterialInspectionRequest;
  getMIR: (id: string) => MaterialInspectionRequest | undefined;
  updateMIRStatus: (id: string, status: MIRStatus, userId: string, userName: string, notes?: string) => void;
  updateMIRChecklist: (mirId: string, checklist: InspectionChecklistItem[]) => void;

  // Checklist Actions
  createChecklistTemplate: (data: Omit<MaterialInspectionChecklist, 'id' | 'createdAt' | 'updatedAt'>) => MaterialInspectionChecklist;
  getChecklistTemplates: (companyId: string, materialCategory?: string) => MaterialInspectionChecklist[];

  // Test Actions
  createTest: (data: Omit<MaterialTest, 'id' | 'testId' | 'createdAt' | 'updatedAt'>) => MaterialTest;
  updateTestResult: (testId: string, result: string, resultUnit: string, status: TestStatus, userId: string, userName: string) => void;

  // Certificate Actions
  createCertificate: (data: Omit<TestCertificate, 'id' | 'createdAt' | 'updatedAt'>) => TestCertificate;

  // Sample Actions
  createSample: (data: Omit<MaterialSample, 'id' | 'sampleId' | 'createdAt' | 'updatedAt'>) => MaterialSample;
  updateSampleStatus: (sampleId: string, status: SampleStatus, labName?: string) => void;

  // NCR Actions
  createNCR: (data: Omit<NonConformanceReport, 'id' | 'ncrNumber' | 'createdAt' | 'updatedAt'>) => NonConformanceReport;
  updateNCRStatus: (ncrId: string, status: NCRStatus, userId: string, userName: string, correctiveAction?: string, preventiveAction?: string) => void;

  // Hold Actions
  createHold: (data: Omit<MaterialHold, 'id' | 'createdAt' | 'updatedAt'>) => MaterialHold;
  releaseHold: (holdId: string, userId: string, userName: string, authorization: string) => void;

  // Photo Actions
  addInspectionPhoto: (data: Omit<InspectionPhoto, 'id' | 'uploadedAt'>) => InspectionPhoto;
  getInspectionPhotos: (mirId: string) => InspectionPhoto[];

  // Calibration Actions
  createCalibration: (data: Omit<CalibrationRecord, 'id' | 'createdAt' | 'updatedAt'>) => CalibrationRecord;

  // Alert Actions
  acknowledgeAlert: (alertId: string, userId: string) => void;

  // Vendor Quality Actions
  calculateVendorQualityScore: (vendorId: string, vendorName: string) => VendorQualityScore;

  // Dashboard Actions
  loadDashboardKPIs: (companyId: string) => void;

  // History Actions
  loadMaterialQualityHistory: (companyId: string, materialId?: string, vendorId?: string) => void;

  // Filter Actions
  setCompanyId: (companyId: string) => void;
  setMIRStatusFilter: (status: MIRStatus | null) => void;
  setTestStatusFilter: (status: TestStatus | null) => void;
  setNCRStatusFilter: (status: NCRStatus | null) => void;
  setVendorIdFilter: (vendorId: string | null) => void;
  setProjectIdFilter: (projectId: string | null) => void;
  setMaterialIdFilter: (materialId: string | null) => void;
}

export const useQualityStore = create<QualityState>((set, get) => ({
  // Initial State
  mirs: [],
  checklists: [],
  tests: [],
  certificates: [],
  samples: [],
  ncrs: [],
  holds: [],
  calibrations: [],
  alerts: [],
  vendorScores: [],
  qualityHistory: [],
  dashboardKPIs: null,

  companyId: null,
  mirStatusFilter: null,
  testStatusFilter: null,
  ncrStatusFilter: null,
  vendorIdFilter: null,
  projectIdFilter: null,
  materialIdFilter: null,

  // Initialize
  initialize: (companyId: string) => {
    set({ companyId });
    get().refresh(companyId);
  },

  // Refresh
  refresh: (companyId: string) => {
    const filters = {
      status: get().mirStatusFilter || undefined,
      vendorId: get().vendorIdFilter || undefined,
      projectId: get().projectIdFilter || undefined,
    };

    set({
      mirs: qualityService.getMIRs(companyId, filters),
      checklists: qualityService.getChecklistTemplates(companyId),
      tests: qualityService.getTests(companyId, {
        materialId: get().materialIdFilter || undefined,
        status: get().testStatusFilter || undefined,
      }),
      certificates: qualityService.getCertificates(companyId, {
        materialId: get().materialIdFilter || undefined,
        vendorId: get().vendorIdFilter || undefined,
      }),
      samples: qualityService.getSamples(companyId, {
        materialId: get().materialIdFilter || undefined,
      }),
      ncrs: qualityService.getNCRs(companyId, {
        status: get().ncrStatusFilter || undefined,
        vendorId: get().vendorIdFilter || undefined,
        projectId: get().projectIdFilter || undefined,
      }),
      holds: qualityService.getHolds(companyId, {
        materialId: get().materialIdFilter || undefined,
      }),
      calibrations: qualityService.getCalibrations(companyId),
      alerts: qualityService.getAlerts(companyId),
    });
  },

  // MIR Actions
  createMIR: (data) => {
    const mir = qualityService.createMIR(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return mir;
  },

  getMIR: (id) => {
    return qualityService.getMIR(id);
  },

  updateMIRStatus: (id, status, userId, userName, notes) => {
    qualityService.updateMIRStatus(id, status, userId, userName, notes);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  updateMIRChecklist: (mirId, checklist) => {
    qualityService.updateMIRChecklist(mirId, checklist);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Checklist Actions
  createChecklistTemplate: (data) => {
    const checklist = qualityService.createChecklistTemplate(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return checklist;
  },

  getChecklistTemplates: (companyId, materialCategory) => {
    return qualityService.getChecklistTemplates(companyId, materialCategory);
  },

  // Test Actions
  createTest: (data) => {
    const test = qualityService.createTest(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return test;
  },

  updateTestResult: (testId, result, resultUnit, status, userId, userName) => {
    qualityService.updateTestResult(testId, result, resultUnit, status, userId, userName);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Certificate Actions
  createCertificate: (data) => {
    const cert = qualityService.createCertificate(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return cert;
  },

  // Sample Actions
  createSample: (data) => {
    const sample = qualityService.createSample(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return sample;
  },

  updateSampleStatus: (sampleId, status, labName) => {
    qualityService.updateSampleStatus(sampleId, status, labName);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // NCR Actions
  createNCR: (data) => {
    const ncr = qualityService.createNCR(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return ncr;
  },

  updateNCRStatus: (ncrId, status, userId, userName, correctiveAction, preventiveAction) => {
    qualityService.updateNCRStatus(ncrId, status, userId, userName, correctiveAction, preventiveAction);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Hold Actions
  createHold: (data) => {
    const hold = qualityService.createHold(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return hold;
  },

  releaseHold: (holdId, userId, userName, authorization) => {
    qualityService.releaseHold(holdId, userId, userName, authorization);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Photo Actions
  addInspectionPhoto: (data) => {
    const photo = qualityService.addInspectionPhoto(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return photo;
  },

  getInspectionPhotos: (mirId) => {
    return qualityService.getInspectionPhotos(mirId);
  },

  // Calibration Actions
  createCalibration: (data) => {
    const calibration = qualityService.createCalibration(data);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
    return calibration;
  },

  // Alert Actions
  acknowledgeAlert: (alertId, userId) => {
    qualityService.acknowledgeAlert(alertId, userId);
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  // Vendor Quality Actions
  calculateVendorQualityScore: (vendorId, vendorName) => {
    return qualityService.calculateVendorQualityScore(vendorId, vendorName);
  },

  // Dashboard Actions
  loadDashboardKPIs: (companyId) => {
    const kpis = qualityService.getQualityDashboardKPIs(companyId);
    set({ dashboardKPIs: kpis });
  },

  // History Actions
  loadMaterialQualityHistory: (companyId, materialId, vendorId) => {
    const history = qualityService.getMaterialQualityHistory(companyId, materialId, vendorId);
    set({ qualityHistory: history });
  },

  // Filter Actions
  setCompanyId: (companyId) => {
    set({ companyId });
  },

  setMIRStatusFilter: (status) => {
    set({ mirStatusFilter: status });
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setTestStatusFilter: (status) => {
    set({ testStatusFilter: status });
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setNCRStatusFilter: (status) => {
    set({ ncrStatusFilter: status });
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setVendorIdFilter: (vendorId) => {
    set({ vendorIdFilter: vendorId });
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setProjectIdFilter: (projectId) => {
    set({ projectIdFilter: projectId });
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },

  setMaterialIdFilter: (materialId) => {
    set({ materialIdFilter: materialId });
    const companyId = get().companyId;
    if (companyId) {
      get().refresh(companyId);
    }
  },
}));

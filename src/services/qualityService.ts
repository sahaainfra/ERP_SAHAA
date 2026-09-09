// ============================================================
// BUILDCORE ERP - MATERIAL QUALITY CONTROL SERVICE
// Part 18: Material Quality Control System
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  MaterialInspectionRequest, MaterialInspectionChecklist, MaterialTest,
  TestCertificate, MaterialSample, NonConformanceReport, MaterialHold,
  InspectionPhoto, CalibrationRecord, VendorQualityScore, QualityAlert,
  QualityDashboardKPIs, MaterialQualityHistory, MIRStatus, TestStatus,
  SampleStatus, NCRStatus, QualityAlertType, InspectionChecklistItem
} from '../types/quality';

export class QualityService {
  private static instance: QualityService;

  private mirs: Map<string, MaterialInspectionRequest> = new Map();
  private checklists: Map<string, MaterialInspectionChecklist> = new Map();
  private tests: Map<string, MaterialTest> = new Map();
  private certificates: Map<string, TestCertificate> = new Map();
  private samples: Map<string, MaterialSample> = new Map();
  private ncrs: Map<string, NonConformanceReport> = new Map();
  private holds: Map<string, MaterialHold> = new Map();
  private photos: Map<string, InspectionPhoto> = new Map();
  private calibrations: Map<string, CalibrationRecord> = new Map();
  private alerts: Map<string, QualityAlert> = new Map();

  private constructor() {}

  static getInstance(): QualityService {
    if (!QualityService.instance) {
      QualityService.instance = new QualityService();
    }
    return QualityService.instance;
  }

  // ============================================================
  // MIR MANAGEMENT
  // ============================================================

  createMIR(data: Omit<MaterialInspectionRequest, 'id' | 'mirNumber' | 'createdAt' | 'updatedAt' | 'version'>): MaterialInspectionRequest {
    const mir: MaterialInspectionRequest = {
      ...data,
      id: uuidv4(),
      mirNumber: this.generateMIRNumber(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    this.mirs.set(mir.id, mir);
    this.createAlert('PENDING_INSPECTION', `New MIR ${mir.mirNumber} requires inspection`, `Material ${mir.materialName} from ${mir.vendorName} pending inspection`, 'MEDIUM', mir.id);
    return mir;
  }

  getMIR(id: string): MaterialInspectionRequest | undefined {
    return this.mirs.get(id);
  }

  getMIRs(companyId: string, filters?: { status?: MIRStatus; vendorId?: string; projectId?: string }): MaterialInspectionRequest[] {
    let mirs = Array.from(this.mirs.values()).filter(m => m.companyId === companyId);
    
    if (filters?.status) {
      mirs = mirs.filter(m => m.status === filters.status);
    }
    if (filters?.vendorId) {
      mirs = mirs.filter(m => m.vendorId === filters.vendorId);
    }
    if (filters?.projectId) {
      mirs = mirs.filter(m => m.projectId === filters.projectId);
    }

    return mirs;
  }

  updateMIRStatus(id: string, status: MIRStatus, userId: string, userName: string, notes?: string): MaterialInspectionRequest | null {
    const mir = this.mirs.get(id);
    if (!mir) return null;

    mir.status = status;
    mir.updatedAt = new Date().toISOString();
    mir.version += 1;

    if (status === 'ACCEPTED' || status === 'CONDITIONALLY_ACCEPTED') {
      mir.approvedById = userId;
      mir.approvedByName = userName;
      mir.approvedAt = new Date().toISOString();
    }

    if (status === 'REJECTED') {
      mir.rejectionReason = notes;
    }

    if (status === 'CONDITIONALLY_ACCEPTED') {
      mir.conditionalConditions = notes;
    }

    return mir;
  }

  updateMIRChecklist(mirId: string, checklist: InspectionChecklistItem[]): MaterialInspectionRequest | null {
    const mir = this.mirs.get(mirId);
    if (!mir) return null;

    mir.checklist = checklist;
    mir.updatedAt = new Date().toISOString();
    mir.version += 1;

    return mir;
  }

  // ============================================================
  // CHECKLIST TEMPLATE MANAGEMENT
  // ============================================================

  createChecklistTemplate(data: Omit<MaterialInspectionChecklist, 'id' | 'createdAt' | 'updatedAt'>): MaterialInspectionChecklist {
    const checklist: MaterialInspectionChecklist = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.checklists.set(checklist.id, checklist);
    return checklist;
  }

  getChecklistTemplate(id: string): MaterialInspectionChecklist | undefined {
    return this.checklists.get(id);
  }

  getChecklistTemplates(companyId: string, materialCategory?: string): MaterialInspectionChecklist[] {
    let templates = Array.from(this.checklists.values()).filter(c => c.companyId === companyId);
    
    if (materialCategory) {
      templates = templates.filter(c => c.materialCategory === materialCategory);
    }

    return templates;
  }

  // ============================================================
  // TEST MANAGEMENT
  // ============================================================

  createTest(data: Omit<MaterialTest, 'id' | 'testId' | 'createdAt' | 'updatedAt'>): MaterialTest {
    const test: MaterialTest = {
      ...data,
      id: uuidv4(),
      testId: this.generateTestId(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tests.set(test.id, test);
    this.createAlert('TEST_DUE', `Test ${test.testId} is due`, `Test ${test.testName} for material ${test.materialName} is pending`, 'MEDIUM', undefined, test.id);
    return test;
  }

  getTest(id: string): MaterialTest | undefined {
    return this.tests.get(id);
  }

  getTests(companyId: string, filters?: { materialId?: string; status?: TestStatus; mirId?: string }): MaterialTest[] {
    let tests = Array.from(this.tests.values()).filter(t => t.companyId === companyId);
    
    if (filters?.materialId) {
      tests = tests.filter(t => t.materialId === filters.materialId);
    }
    if (filters?.status) {
      tests = tests.filter(t => t.status === filters.status);
    }
    if (filters?.mirId) {
      tests = tests.filter(t => t.mirId === filters.mirId);
    }

    return tests;
  }

  updateTestResult(testId: string, result: string, resultUnit: string, status: TestStatus, userId: string, userName: string): MaterialTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.result = result;
    test.resultUnit = resultUnit;
    test.status = status;
    test.testDate = new Date().toISOString();
    test.updatedAt = new Date().toISOString();
    test.updatedBy = userId;

    if (status === 'FAILED') {
      this.createAlert('FAILED_TEST', `Test ${test.testId} failed`, `Test ${test.testName} for material ${test.materialName} has failed`, 'HIGH', undefined, test.id);
    }

    return test;
  }

  // ============================================================
  // CERTIFICATE MANAGEMENT
  // ============================================================

  createCertificate(data: Omit<TestCertificate, 'id' | 'createdAt' | 'updatedAt'>): TestCertificate {
    const cert: TestCertificate = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.certificates.set(cert.id, cert);

    if (cert.expiryDate) {
      const daysUntilExpiry = Math.ceil((new Date(cert.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) {
        this.createAlert('CERTIFICATE_EXPIRY', `Certificate ${cert.certificateNumber} expiring soon`, `Certificate expires in ${daysUntilExpiry} days`, 'MEDIUM', undefined, undefined, undefined, cert.id);
      }
    }

    return cert;
  }

  getCertificate(id: string): TestCertificate | undefined {
    return this.certificates.get(id);
  }

  getCertificates(companyId: string, filters?: { materialId?: string; vendorId?: string }): TestCertificate[] {
    let certs = Array.from(this.certificates.values()).filter(c => c.companyId === companyId);
    
    if (filters?.materialId) {
      certs = certs.filter(c => c.materialId === filters.materialId);
    }
    if (filters?.vendorId) {
      certs = certs.filter(c => c.vendorId === filters.vendorId);
    }

    return certs;
  }

  // ============================================================
  // SAMPLE MANAGEMENT
  // ============================================================

  createSample(data: Omit<MaterialSample, 'id' | 'sampleId' | 'createdAt' | 'updatedAt'>): MaterialSample {
    const sample: MaterialSample = {
      ...data,
      id: uuidv4(),
      sampleId: this.generateSampleId(),
      status: 'COLLECTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.samples.set(sample.id, sample);
    return sample;
  }

  getSample(id: string): MaterialSample | undefined {
    return this.samples.get(id);
  }

  getSamples(companyId: string, filters?: { materialId?: string; status?: SampleStatus }): MaterialSample[] {
    let samples = Array.from(this.samples.values()).filter(s => s.companyId === companyId);
    
    if (filters?.materialId) {
      samples = samples.filter(s => s.materialId === filters.materialId);
    }
    if (filters?.status) {
      samples = samples.filter(s => s.status === filters.status);
    }

    return samples;
  }

  updateSampleStatus(sampleId: string, status: SampleStatus, labName?: string): MaterialSample | null {
    const sample = this.samples.get(sampleId);
    if (!sample) return null;

    sample.status = status;
    if (labName) sample.labName = labName;
    sample.updatedAt = new Date().toISOString();

    return sample;
  }

  // ============================================================
  // NCR MANAGEMENT
  // ============================================================

  createNCR(data: Omit<NonConformanceReport, 'id' | 'ncrNumber' | 'createdAt' | 'updatedAt'>): NonConformanceReport {
    const ncr: NonConformanceReport = {
      ...data,
      id: uuidv4(),
      ncrNumber: this.generateNCRNumber(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.ncrs.set(ncr.id, ncr);
    this.createAlert('NCR_OVERDUE', `New NCR ${ncr.ncrNumber} created`, `NCR for material ${ncr.materialName} requires attention`, 'HIGH', undefined, undefined, ncr.id);
    return ncr;
  }

  getNCR(id: string): NonConformanceReport | undefined {
    return this.ncrs.get(id);
  }

  getNCRs(companyId: string, filters?: { status?: NCRStatus; vendorId?: string; projectId?: string }): NonConformanceReport[] {
    let ncrs = Array.from(this.ncrs.values()).filter(n => n.companyId === companyId);
    
    if (filters?.status) {
      ncrs = ncrs.filter(n => n.status === filters.status);
    }
    if (filters?.vendorId) {
      ncrs = ncrs.filter(n => n.vendorId === filters.vendorId);
    }
    if (filters?.projectId) {
      ncrs = ncrs.filter(n => n.projectId === filters.projectId);
    }

    return ncrs;
  }

  updateNCRStatus(ncrId: string, status: NCRStatus, userId: string, userName: string, correctiveAction?: string, preventiveAction?: string): NonConformanceReport | null {
    const ncr = this.ncrs.get(ncrId);
    if (!ncr) return null;

    ncr.status = status;
    ncr.updatedAt = new Date().toISOString();

    if (status === 'RESOLVED' || status === 'CLOSED') {
      ncr.resolvedById = userId;
      ncr.resolvedByName = userName;
      ncr.resolvedDate = new Date().toISOString();
    }

    if (correctiveAction) ncr.correctiveAction = correctiveAction;
    if (preventiveAction) ncr.preventiveAction = preventiveAction;

    return ncr;
  }

  // ============================================================
  // MATERIAL HOLD MANAGEMENT
  // ============================================================

  createHold(data: Omit<MaterialHold, 'id' | 'createdAt' | 'updatedAt'>): MaterialHold {
    const hold: MaterialHold = {
      ...data,
      id: uuidv4(),
      status: 'HOLD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.holds.set(hold.id, hold);
    return hold;
  }

  getHold(id: string): MaterialHold | undefined {
    return this.holds.get(id);
  }

  getHolds(companyId: string, filters?: { materialId?: string; status?: 'HOLD' | 'RELEASED' }): MaterialHold[] {
    let holds = Array.from(this.holds.values()).filter(h => h.companyId === companyId);
    
    if (filters?.materialId) {
      holds = holds.filter(h => h.materialId === filters.materialId);
    }
    if (filters?.status) {
      holds = holds.filter(h => h.status === filters.status);
    }

    return holds;
  }

  releaseHold(holdId: string, userId: string, userName: string, authorization: string): MaterialHold | null {
    const hold = this.holds.get(holdId);
    if (!hold) return null;

    hold.status = 'RELEASED';
    hold.releaseDate = new Date().toISOString();
    hold.releasedById = userId;
    hold.releasedByName = userName;
    hold.releaseAuthorization = authorization;
    hold.updatedAt = new Date().toISOString();

    return hold;
  }

  // ============================================================
  // INSPECTION PHOTO MANAGEMENT
  // ============================================================

  addInspectionPhoto(data: Omit<InspectionPhoto, 'id' | 'uploadedAt'>): InspectionPhoto {
    const photo: InspectionPhoto = {
      ...data,
      id: uuidv4(),
      uploadedAt: new Date().toISOString(),
    };

    this.photos.set(photo.id, photo);
    return photo;
  }

  getInspectionPhotos(mirId: string): InspectionPhoto[] {
    return Array.from(this.photos.values()).filter(p => p.mirId === mirId);
  }

  // ============================================================
  // CALIBRATION MANAGEMENT
  // ============================================================

  createCalibration(data: Omit<CalibrationRecord, 'id' | 'createdAt' | 'updatedAt'>): CalibrationRecord {
    const calibration: CalibrationRecord = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.calibrations.set(calibration.id, calibration);

    const daysUntilDue = Math.ceil((new Date(calibration.nextCalibrationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 30) {
      this.createAlert('CALIBRATION_DUE', `Calibration due for ${calibration.equipmentName}`, `Equipment calibration due in ${daysUntilDue} days`, 'MEDIUM');
    }

    return calibration;
  }

  getCalibration(id: string): CalibrationRecord | undefined {
    return this.calibrations.get(id);
  }

  getCalibrations(companyId: string, filters?: { equipmentId?: string }): CalibrationRecord[] {
    let calibrations = Array.from(this.calibrations.values()).filter(c => c.companyId === companyId);
    
    if (filters?.equipmentId) {
      calibrations = calibrations.filter(c => c.equipmentId === filters.equipmentId);
    }

    return calibrations;
  }

  // ============================================================
  // VENDOR QUALITY SCORE CALCULATION
  // ============================================================

  calculateVendorQualityScore(vendorId: string, vendorName: string): VendorQualityScore {
    const mirs = Array.from(this.mirs.values()).filter(m => m.vendorId === vendorId);
    const ncrs = Array.from(this.ncrs.values()).filter(n => n.vendorId === vendorId);
    const tests = Array.from(this.tests.values()).filter(t => {
      const mir = this.mirs.get(t.mirId || '');
      return mir?.vendorId === vendorId;
    });

    const totalInspections = mirs.length;
    const acceptedCount = mirs.filter(m => m.status === 'ACCEPTED').length;
    const rejectedCount = mirs.filter(m => m.status === 'REJECTED').length;
    const conditionalCount = mirs.filter(m => m.status === 'CONDITIONALLY_ACCEPTED').length;
    const rejectionRate = totalInspections > 0 ? (rejectedCount / totalInspections) * 100 : 0;
    const testFailures = tests.filter(t => t.status === 'FAILED').length;
    const damageCount = ncrs.filter(n => n.nonConformanceType === 'DAMAGE').length;
    const ncrCount = ncrs.length;

    // Calculate overall score (0-100)
    const acceptanceScore = totalInspections > 0 ? (acceptedCount / totalInspections) * 40 : 0;
    const rejectionPenalty = Math.min(rejectionRate * 0.5, 20);
    const testFailurePenalty = Math.min(testFailures * 5, 15);
    const ncrPenalty = Math.min(ncrCount * 3, 15);
    const damagePenalty = Math.min(damageCount * 5, 10);

    const overallScore = Math.max(0, 100 - rejectionPenalty - testFailurePenalty - ncrPenalty - damagePenalty);

    return {
      vendorId,
      vendorName,
      totalInspections,
      acceptedCount,
      rejectedCount,
      conditionalCount,
      rejectionRate,
      testFailures,
      damageCount,
      ncrCount,
      overallScore,
      lastUpdated: new Date().toISOString(),
    };
  }

  // ============================================================
  // ALERT MANAGEMENT
  // ============================================================

  createAlert(
    alertType: QualityAlertType,
    title: string,
    message: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    mirId?: string,
    testId?: string,
    ncrId?: string,
    certificateId?: string,
    dueDate?: string
  ): QualityAlert {
    const alert: QualityAlert = {
      id: uuidv4(),
      companyId: '', // Will be set from context
      alertType,
      title,
      message,
      severity,
      mirId,
      testId,
      ncrId,
      certificateId,
      dueDate,
      isAcknowledged: false,
      createdAt: new Date().toISOString(),
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  getAlerts(companyId: string, filters?: { acknowledged?: boolean; severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }): QualityAlert[] {
    let alerts = Array.from(this.alerts.values()).filter(a => a.companyId === companyId);
    
    if (filters?.acknowledged !== undefined) {
      alerts = alerts.filter(a => a.isAcknowledged === filters.acknowledged);
    }
    if (filters?.severity) {
      alerts = alerts.filter(a => a.severity === filters.severity);
    }

    return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  acknowledgeAlert(alertId: string, userId: string): QualityAlert | null {
    const alert = this.alerts.get(alertId);
    if (!alert) return null;

    alert.isAcknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = userId;

    return alert;
  }

  // ============================================================
  // QUALITY DASHBOARD KPIs
  // ============================================================

  getQualityDashboardKPIs(companyId: string): QualityDashboardKPIs {
    const mirs = Array.from(this.mirs.values()).filter(m => m.companyId === companyId);
    const ncrs = Array.from(this.ncrs.values()).filter(n => n.companyId === companyId);
    const tests = Array.from(this.tests.values()).filter(t => t.companyId === companyId);
    const certs = Array.from(this.certificates.values()).filter(c => c.companyId === companyId);
    const calibrations = Array.from(this.calibrations.values()).filter(c => c.companyId === companyId);

    const pendingMIR = mirs.filter(m => m.status === 'PENDING').length;
    const acceptedMIR = mirs.filter(m => m.status === 'ACCEPTED').length;
    const rejectedMIR = mirs.filter(m => m.status === 'REJECTED').length;
    const conditionalMIR = mirs.filter(m => m.status === 'CONDITIONALLY_ACCEPTED').length;
    const openNCR = ncrs.filter(n => n.status === 'OPEN' || n.status === 'UNDER_INVESTIGATION').length;
    const testFailures = tests.filter(t => t.status === 'FAILED').length;
    const pendingTests = tests.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;

    const now = Date.now();
    const expiringCertificates = certs.filter(c => {
      if (!c.expiryDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(c.expiryDate).getTime() - now) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30;
    }).length;

    const calibrationDue = calibrations.filter(c => {
      const daysUntilDue = Math.ceil((new Date(c.nextCalibrationDate).getTime() - now) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 30;
    }).length;

    // Calculate average inspection time (from creation to approval)
    const approvedMIRs = mirs.filter(m => m.approvedAt);
    const avgInspectionTime = approvedMIRs.length > 0
      ? approvedMIRs.reduce((sum, m) => {
          const created = new Date(m.createdAt).getTime();
          const approved = new Date(m.approvedAt!).getTime();
          return sum + (approved - created) / (1000 * 60 * 60); // hours
        }, 0) / approvedMIRs.length
      : 0;

    const overallAcceptanceRate = mirs.length > 0 ? (acceptedMIR / mirs.length) * 100 : 0;

    // Calculate average vendor quality score
    const vendorIds = [...new Set(mirs.map(m => m.vendorId))];
    const vendorScores = vendorIds.map(vId => {
      const vendor = mirs.find(m => m.vendorId === vId);
      return vendor ? this.calculateVendorQualityScore(vId, vendor.vendorName).overallScore : 0;
    });
    const vendorQualityScore = vendorScores.length > 0 ? vendorScores.reduce((a, b) => a + b, 0) / vendorScores.length : 0;

    return {
      pendingMIR,
      acceptedMIR,
      rejectedMIR,
      conditionalMIR,
      openNCR,
      testFailures,
      pendingTests,
      expiringCertificates,
      calibrationDue,
      averageInspectionTime: avgInspectionTime,
      overallAcceptanceRate,
      vendorQualityScore,
    };
  }

  // ============================================================
  // MATERIAL QUALITY HISTORY
  // ============================================================

  getMaterialQualityHistory(companyId: string, materialId?: string, vendorId?: string): MaterialQualityHistory[] {
    let mirs = Array.from(this.mirs.values()).filter(m => m.companyId === companyId);
    
    if (materialId) {
      mirs = mirs.filter(m => m.materialId === materialId);
    }
    if (vendorId) {
      mirs = mirs.filter(m => m.vendorId === vendorId);
    }

    return mirs.map(mir => {
      const tests = Array.from(this.tests.values()).filter(t => t.mirId === mir.id);
      const ncr = Array.from(this.ncrs.values()).find(n => n.mirId === mir.id);

      return {
        materialId: mir.materialId,
        materialName: mir.materialName,
        vendorId: mir.vendorId,
        vendorName: mir.vendorName,
        batchNumber: mir.batchNumber,
        projectId: mir.projectId,
        projectName: mir.projectName,
        mirId: mir.id,
        mirNumber: mir.mirNumber,
        inspectionDate: mir.inspectionDate,
        status: mir.status,
        testResults: tests.map(t => ({
          testId: t.id,
          testName: t.testName,
          result: t.result || '',
          status: t.status,
          testDate: t.testDate || '',
        })),
        ncrId: ncr?.id,
        remarks: mir.inspectionNotes,
      };
    });
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  private generateMIRNumber(): string {
    const count = this.mirs.size + 1;
    return `MIR-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
  }

  private generateTestId(): string {
    const count = this.tests.size + 1;
    return `TEST-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
  }

  private generateSampleId(): string {
    const count = this.samples.size + 1;
    return `SAMPLE-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
  }

  private generateNCRNumber(): string {
    const count = this.ncrs.size + 1;
    return `NCR-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
  }
}

export const qualityService = QualityService.getInstance();

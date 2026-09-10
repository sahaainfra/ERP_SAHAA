// ============================================================
// BUILDCORE ERP - MEASUREMENT BOOK SERVICE
// Part 21: Advanced Measurement Book (MB) / e-MB Module
// ============================================================

import type {
  MeasurementBook,
  MBItem,
  MBDeduction,
  JointMeasurement,
  MBRevision,
  LevelData,
  MBDashboardKPIs,
  MBStatus,
  DimensionCalculation
} from '../types/mb';

export class MBService {
  private static instance: MBService;
  private mbStore: Map<string, MeasurementBook> = new Map();
  private mbItemsStore: Map<string, MBItem[]> = new Map();
  private jointMeasurementsStore: Map<string, JointMeasurement[]> = new Map();
  private revisionsStore: Map<string, MBRevision[]> = new Map();
  private levelDataStore: Map<string, LevelData[]> = new Map();

  private constructor() {}

  public static getInstance(): MBService {
    if (!MBService.instance) {
      MBService.instance = new MBService();
    }
    return MBService.instance;
  }

  // ============================================================
  // MB CREATION AND MANAGEMENT
  // ============================================================

  public createMB(data: Omit<MeasurementBook, 'id' | 'mbNumber' | 'createdAt' | 'updatedAt' | 'status' | 'revision' | 'totalAmount'>): MeasurementBook {
    const mbNumber = this.generateMBNumber(data.companyId, data.projectId);
    const mb: MeasurementBook = {
      ...data,
      id: `mb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mbNumber,
      status: 'DRAFT',
      revision: 0,
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mbStore.set(mb.id, mb);
    return mb;
  }

  public getMB(id: string): MeasurementBook | undefined {
    return this.mbStore.get(id);
  }

  public getAllMBs(companyId: string): MeasurementBook[] {
    return Array.from(this.mbStore.values()).filter(mb => mb.companyId === companyId);
  }

  public getMBsByStatus(companyId: string, status: MBStatus): MeasurementBook[] {
    return this.getAllMBs(companyId).filter(mb => mb.status === status);
  }

  public updateMB(id: string, updates: Partial<MeasurementBook>): MeasurementBook | null {
    const mb = this.mbStore.get(id);
    if (!mb) return null;

    const updated = {
      ...mb,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.mbStore.set(id, updated);
    return updated;
  }

  public updateMBStatus(id: string, status: MBStatus, userId: string, userName: string): MeasurementBook | null {
    const mb = this.mbStore.get(id);
    if (!mb) return null;

    const updated = { ...mb, status, updatedAt: new Date().toISOString(), updatedBy: userId };
    
    // Update approval fields based on status
    if (status === 'CERTIFIED') {
      updated.certificationAuthority = userName;
    }
    
    this.mbStore.set(id, updated);
    return updated;
  }

  // ============================================================
  // MB ITEMS (MEASUREMENT GRID)
  // ============================================================

  public addMBItem(mbId: string, data: Omit<MBItem, 'id' | 'mbId' | 'createdAt' | 'updatedAt' | 'srNo' | 'cumulativeQuantity' | 'balanceQuantity' | 'excessQuantity' | 'amount'>): MBItem {
    const items = this.mbItemsStore.get(mbId) || [];
    const srNo = items.length + 1;
    
    // Calculate quantities
    const grossQuantity = this.calculateGrossQuantity(data);
    const netQuantity = this.calculateNetQuantity(grossQuantity, data.deductions || []);
    const previousQuantity = this.calculatePreviousQuantity(mbId, data.boqItemId);
    const currentQuantity = netQuantity;
    const cumulativeQuantity = previousQuantity + currentQuantity;
    
    // Get approved quantity from BOQ (mock for now)
    const approvedQuantity = 1000; // This should come from BOQ
    const balanceQuantity = approvedQuantity - cumulativeQuantity;
    const excessQuantity = balanceQuantity < 0 ? Math.abs(balanceQuantity) : 0;
    
    const amount = netQuantity * data.rate;

    const item: MBItem = {
      ...data,
      id: `mbi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mbId,
      srNo,
      grossQuantity,
      netQuantity,
      previousQuantity,
      currentQuantity,
      cumulativeQuantity,
      balanceQuantity,
      excessQuantity,
      amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.push(item);
    this.mbItemsStore.set(mbId, items);
    
    // Update MB total amount
    this.updateMBTotalAmount(mbId);
    
    return item;
  }

  public getMBItems(mbId: string): MBItem[] {
    return this.mbItemsStore.get(mbId) || [];
  }

  public updateMBItem(mbItemId: string, updates: Partial<MBItem>): MBItem | null {
    for (const [mbId, items] of this.mbItemsStore.entries()) {
      const index = items.findIndex(item => item.id === mbItemId);
      if (index !== -1) {
        const item = items[index];
        const updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
        
        // Recalculate quantities if dimensions changed
        if (updates.length || updates.width || updates.height || updates.depth || updates.noOfUnits) {
          updated.grossQuantity = this.calculateGrossQuantity(updated);
          updated.netQuantity = this.calculateNetQuantity(updated.grossQuantity, updated.deductions);
          updated.currentQuantity = updated.netQuantity;
          updated.cumulativeQuantity = updated.previousQuantity + updated.currentQuantity;
          updated.amount = updated.netQuantity * updated.rate;
        }
        
        items[index] = updated;
        this.mbItemsStore.set(mbId, items);
        this.updateMBTotalAmount(mbId);
        return updated;
      }
    }
    return null;
  }

  public deleteMBItem(mbItemId: string): boolean {
    for (const [mbId, items] of this.mbItemsStore.entries()) {
      const index = items.findIndex(item => item.id === mbItemId);
      if (index !== -1) {
        items.splice(index, 1);
        this.mbItemsStore.set(mbId, items);
        this.updateMBTotalAmount(mbId);
        return true;
      }
    }
    return false;
  }

  // ============================================================
  // DIMENSION CALCULATION ENGINE
  // ============================================================

  public calculateGrossQuantity(item: Partial<MBItem>): number {
    const { noOfUnits, length, width, height, depth } = item;
    
    // Determine calculation type based on available dimensions
    if (length && width && (height || depth)) {
      // Volume calculation
      const h = height || depth || 0;
      return (noOfUnits || 1) * length * width * h;
    } else if (length && width) {
      // Area calculation
      return (noOfUnits || 1) * length * width;
    } else if (length) {
      // Length calculation
      return (noOfUnits || 1) * length;
    }
    
    return 0;
  }

  public calculateNetQuantity(grossQuantity: number, deductions: MBDeduction[]): number {
    const totalDeduction = deductions.reduce((sum, d) => sum + d.quantity, 0);
    return Math.max(0, grossQuantity - totalDeduction);
  }

  public calculatePreviousQuantity(mbId: string, boqItemId: string): number {
    const items = this.mbItemsStore.get(mbId) || [];
    return items
      .filter(item => item.boqItemId === boqItemId)
      .reduce((sum, item) => sum + item.currentQuantity, 0);
  }

  public calculateDeduction(deduction: Partial<MBDeduction>): number {
    const { length, width, height } = deduction;
    if (length && width && height) {
      return length * width * height;
    } else if (length && width) {
      return length * width;
    } else if (length) {
      return length;
    }
    return 0;
  }

  // ============================================================
  // DEDUCTIONS
  // ============================================================

  public addDeduction(mbItemId: string, data: Omit<MBDeduction, 'id' | 'mbItemId' | 'quantity'>): MBDeduction {
    for (const [mbId, items] of this.mbItemsStore.entries()) {
      const item = items.find(item => item.id === mbItemId);
      if (item) {
        const quantity = this.calculateDeduction(data);
        const deduction: MBDeduction = {
          ...data,
          id: `ded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          mbItemId,
          quantity
        };
        
        item.deductions.push(deduction);
        item.netQuantity = this.calculateNetQuantity(item.grossQuantity, item.deductions);
        item.currentQuantity = item.netQuantity;
        item.cumulativeQuantity = item.previousQuantity + item.currentQuantity;
        item.amount = item.netQuantity * item.rate;
        
        this.updateMBTotalAmount(mbId);
        return deduction;
      }
    }
    throw new Error('MB Item not found');
  }

  public removeDeduction(mbItemId: string, deductionId: string): boolean {
    for (const [mbId, items] of this.mbItemsStore.entries()) {
      const item = items.find(item => item.id === mbItemId);
      if (item) {
        const index = item.deductions.findIndex(d => d.id === deductionId);
        if (index !== -1) {
          item.deductions.splice(index, 1);
          item.netQuantity = this.calculateNetQuantity(item.grossQuantity, item.deductions);
          item.currentQuantity = item.netQuantity;
          item.cumulativeQuantity = item.previousQuantity + item.currentQuantity;
          item.amount = item.netQuantity * item.rate;
          
          this.updateMBTotalAmount(mbId);
          return true;
        }
      }
    }
    return false;
  }

  // ============================================================
  // JOINT MEASUREMENT
  // ============================================================

  public createJointMeasurement(mbId: string, mbItemId: string, data: Omit<JointMeasurement, 'id' | 'mbId' | 'mbItemId' | 'createdAt' | 'updatedAt'>): JointMeasurement {
    const jointMeasurement: JointMeasurement = {
      ...data,
      id: `jm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mbId,
      mbItemId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const measurements = this.jointMeasurementsStore.get(mbId) || [];
    measurements.push(jointMeasurement);
    this.jointMeasurementsStore.set(mbId, measurements);

    return jointMeasurement;
  }

  public getJointMeasurements(mbId: string): JointMeasurement[] {
    return this.jointMeasurementsStore.get(mbId) || [];
  }

  // ============================================================
  // REVISIONS
  // ============================================================

  public createRevision(mbId: string, reason: string, userId: string, userName: string): MBRevision | null {
    const mb = this.mbStore.get(mbId);
    if (!mb) return null;

    const revisions = this.revisionsStore.get(mbId) || [];
    const revisionNumber = revisions.length + 1;
    
    const revision: MBRevision = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mbId,
      revisionNumber,
      previousValue: mb.totalAmount,
      revisedValue: mb.totalAmount, // Will be updated when items are modified
      difference: 0,
      reason,
      revisedBy: userId,
      revisedByName: userName,
      revisedAt: new Date().toISOString()
    };

    revisions.push(revision);
    this.revisionsStore.set(mbId, revisions);

    // Update MB revision number
    this.updateMB(mbId, { revision: revisionNumber });

    return revision;
  }

  public getRevisions(mbId: string): MBRevision[] {
    return this.revisionsStore.get(mbId) || [];
  }

  // ============================================================
  // LEVEL DATA (for infrastructure projects)
  // ============================================================

  public addLevelData(mbItemId: string, data: Omit<LevelData, 'id' | 'mbItemId'>): LevelData {
    const levelData: LevelData = {
      ...data,
      id: `ld_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mbItemId
    };

    const levels = this.levelDataStore.get(mbItemId) || [];
    levels.push(levelData);
    this.levelDataStore.set(mbItemId, levels);

    return levelData;
  }

  public getLevelData(mbItemId: string): LevelData[] {
    return this.levelDataStore.get(mbItemId) || [];
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  public getDashboardKPIs(companyId: string): MBDashboardKPIs {
    const allMBs = this.getAllMBs(companyId);
    const allItems = Array.from(this.mbItemsStore.values()).flat();

    return {
      totalMB: allMBs.length,
      draftMB: allMBs.filter(mb => mb.status === 'DRAFT').length,
      pendingMB: allMBs.filter(mb => ['SUBMITTED', 'QS_REVIEW', 'SITE_VERIFICATION', 'PROJECT_MANAGER', 'CONSULTANT', 'CLIENT'].includes(mb.status)).length,
      approvedMB: allMBs.filter(mb => mb.status === 'APPROVED').length,
      certifiedMB: allMBs.filter(mb => mb.status === 'CERTIFIED').length,
      disputedMB: 0, // Would need dispute tracking
      excessQuantity: allItems.reduce((sum, item) => sum + item.excessQuantity, 0),
      currentQuantity: allItems.reduce((sum, item) => sum + item.currentQuantity, 0),
      cumulativeQuantity: allItems.reduce((sum, item) => sum + item.cumulativeQuantity, 0),
      billingReadyQuantity: allItems.reduce((sum, item) => sum + (item.excessQuantity === 0 ? item.currentQuantity : 0), 0),
      totalValue: allMBs.reduce((sum, mb) => sum + mb.totalAmount, 0)
    };
  }

  // ============================================================
  // HELPER METHODS
  // ============================================================

  private updateMBTotalAmount(mbId: string): void {
    const items = this.mbItemsStore.get(mbId) || [];
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    this.updateMB(mbId, { totalAmount });
  }

  private generateMBNumber(companyId: string, projectId: string): string {
    const allMBs = this.getAllMBs(companyId);
    const year = new Date().getFullYear();
    const count = allMBs.filter(mb => mb.mbNumber.includes(`/${year}/`)).length + 1;
    return `MB/${projectId}/${year}/${count.toString().padStart(6, '0')}`;
  }

  // ============================================================
  // WORKFLOW INTEGRATION
  // ============================================================

  public canModifyMB(mbId: string): boolean {
    const mb = this.mbStore.get(mbId);
    if (!mb) return false;
    
    // Only draft MBs can be modified
    return mb.status === 'DRAFT';
  }

  public canApproveMB(mbId: string, userRole: string): boolean {
    const mb = this.mbStore.get(mbId);
    if (!mb) return false;

    // Define approval workflow
    const workflow: Record<string, MBStatus> = {
      'QS': 'QS_REVIEW',
      'SITE_ENGINEER': 'SITE_VERIFICATION',
      'PROJECT_MANAGER': 'PROJECT_MANAGER',
      'CONSULTANT': 'CONSULTANT',
      'CLIENT': 'CLIENT'
    };

    const requiredStatus = workflow[userRole];
    if (!requiredStatus) return false;

    return mb.status === requiredStatus || mb.status === 'DRAFT';
  }

  // ============================================================
  // REPORT GENERATION
  // ============================================================

  public generateMBRegister(companyId: string): any {
    const allMBs = this.getAllMBs(companyId);
    return {
      title: 'MB Register',
      data: allMBs.map(mb => ({
        mbNumber: mb.mbNumber,
        projectName: mb.projectCode,
        siteName: mb.siteId,
        measurementDate: mb.measurementDate,
        status: mb.status,
        totalAmount: mb.totalAmount
      }))
    };
  }

  public generateDetailedMB(mbId: string): any {
    const mb = this.mbStore.get(mbId);
    const items = this.getMBItems(mbId);
    
    if (!mb) return null;

    return {
      title: 'Detailed Measurement Book',
      mbNumber: mb.mbNumber,
      projectName: mb.projectCode,
      measurementDate: mb.measurementDate,
      items: items.map(item => ({
        srNo: item.srNo,
        description: item.description,
        location: item.location,
        dimensions: `${item.length || 0} x ${item.width || 0} x ${item.height || item.depth || 0}`,
        grossQuantity: item.grossQuantity,
        deductions: item.deductions.reduce((sum, d) => sum + d.quantity, 0),
        netQuantity: item.netQuantity,
        rate: item.rate,
        amount: item.amount
      }))
    };
  }
}

export const mbService = MBService.getInstance();

// ============================================================
// BUILDCORE ERP - MATERIAL MASTER SERVICE
// Part 13: Central Material Master and Material Management Engine
// ============================================================

import type {
  MaterialMaster, MaterialClassification, MaterialGroup, MaterialDocument,
  MaterialImage, MaterialAlternative, ApprovedMaterialList, MaterialRateHistory,
  MaterialVendorLink, MaterialRateAlert, MaterialSearchResult, MaterialComparison,
  MaterialBulkImport, MaterialDashboardKPIs, MaterialNumberingConfig,
  MaterialType, MaterialStatus, MaterialDocumentType, MaterialImageType,
  MaterialRateType, MaterialRateAlertType
} from '../types/material';

export class MaterialService {
  private static instance: MaterialService;

  private materials: Map<string, MaterialMaster> = new Map();
  private classifications: Map<string, MaterialClassification> = new Map();
  private groups: Map<string, MaterialGroup> = new Map();
  private approvedMaterialLists: Map<string, ApprovedMaterialList[]> = new Map();
  private rateHistories: Map<string, MaterialRateHistory[]> = new Map();
  private vendorLinks: Map<string, MaterialVendorLink[]> = new Map();
  private rateAlerts: Map<string, MaterialRateAlert> = new Map();
  private numberingConfigs: Map<string, MaterialNumberingConfig> = new Map();
  private bulkImports: Map<string, MaterialBulkImport> = new Map();

  private constructor() {}

  static getInstance(): MaterialService {
    if (!MaterialService.instance) {
      MaterialService.instance = new MaterialService();
    }
    return MaterialService.instance;
  }

  // ============================================================
  // MATERIAL MASTER OPERATIONS
  // ============================================================

  createMaterial(data: Omit<MaterialMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'>): MaterialMaster {
    const now = new Date().toISOString();
    const material: MaterialMaster = {
      ...data,
      id: this.generateMaterialId(data.companyId, data.materialType, data.materialCategory),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.materials.set(material.id, material);
    return material;
  }

  getMaterial(id: string): MaterialMaster | undefined {
    return this.materials.get(id);
  }

  getMaterials(companyId: string, filters?: {
    status?: MaterialStatus;
    materialType?: MaterialType;
    materialCategory?: string;
    search?: string;
  }): MaterialMaster[] {
    let materials = Array.from(this.materials.values()).filter(m => m.companyId === companyId);

    if (filters?.status) {
      materials = materials.filter(m => m.status === filters.status);
    }
    if (filters?.materialType) {
      materials = materials.filter(m => m.materialType === filters.materialType);
    }
    if (filters?.materialCategory) {
      materials = materials.filter(m => m.materialCategory === filters.materialCategory);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      materials = materials.filter(m => 
        m.materialCode.toLowerCase().includes(searchLower) ||
        m.materialName.toLowerCase().includes(searchLower) ||
        m.brand?.toLowerCase().includes(searchLower) ||
        m.hsnCode?.toLowerCase().includes(searchLower)
      );
    }

    return materials;
  }

  updateMaterial(id: string, updates: Partial<MaterialMaster>): MaterialMaster | null {
    const material = this.materials.get(id);
    if (!material) return null;

    const updated = {
      ...material,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: material.version + 1,
    };

    this.materials.set(id, updated);
    return updated;
  }

  blockMaterial(id: string, reason: string): MaterialMaster | null {
    return this.updateMaterial(id, {
      status: 'BLOCKED',
      blockedReason: reason,
    });
  }

  approveMaterial(id: string): MaterialMaster | null {
    return this.updateMaterial(id, { status: 'APPROVED' });
  }

  // ============================================================
  // MATERIAL ID GENERATION
  // ============================================================

  private generateMaterialId(companyId: string, materialType: MaterialType, category: string): string {
    const config = this.getNumberingConfig(companyId, materialType);
    if (!config) {
      // Fallback to simple ID generation
      return `MAT-${category.substring(0, 3).toUpperCase()}-${Date.now()}`;
    }

    config.currentSequence += 1;
    const sequence = String(config.currentSequence).padStart(config.sequenceLength, '0');
    
    let materialId = config.prefix;
    if (config.includeCategory) {
      materialId += `-${category.substring(0, 3).toUpperCase()}`;
    }
    materialId += `-${sequence}`;

    return materialId;
  }

  private getNumberingConfig(companyId: string, materialType: MaterialType): MaterialNumberingConfig | undefined {
    const key = `${companyId}_${materialType}`;
    return this.numberingConfigs.get(key);
  }

  configureNumbering(config: Omit<MaterialNumberingConfig, 'id' | 'createdAt' | 'updatedAt'>): MaterialNumberingConfig {
    const now = new Date().toISOString();
    const key = `${config.companyId}_${config.materialType}`;
    
    const numberingConfig: MaterialNumberingConfig = {
      ...config,
      id: `mnum_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.numberingConfigs.set(key, numberingConfig);
    return numberingConfig;
  }

  // ============================================================
  // MATERIAL CLASSIFICATION
  // ============================================================

  createClassification(data: Omit<MaterialClassification, 'id' | 'createdAt' | 'updatedAt'>): MaterialClassification {
    const now = new Date().toISOString();
    const classification: MaterialClassification = {
      ...data,
      id: `mcls_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.classifications.set(classification.id, classification);
    return classification;
  }

  getClassifications(companyId: string, parentId?: string): MaterialClassification[] {
    let classifications = Array.from(this.classifications.values()).filter(c => c.companyId === companyId);
    if (parentId) {
      classifications = classifications.filter(c => c.parentClassificationId === parentId);
    }
    return classifications;
  }

  // ============================================================
  // MATERIAL GROUP
  // ============================================================

  createGroup(data: Omit<MaterialGroup, 'id' | 'createdAt' | 'updatedAt'>): MaterialGroup {
    const now = new Date().toISOString();
    const group: MaterialGroup = {
      ...data,
      id: `mgrp_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.groups.set(group.id, group);
    return group;
  }

  getGroups(companyId: string, parentId?: string): MaterialGroup[] {
    let groups = Array.from(this.groups.values()).filter(g => g.companyId === companyId);
    if (parentId) {
      groups = groups.filter(g => g.parentGroupId === parentId);
    }
    return groups;
  }

  // ============================================================
  // MATERIAL DOCUMENTS
  // ============================================================

  addDocument(materialId: string, data: Omit<MaterialDocument, 'id' | 'materialId'>): MaterialDocument {
    const material = this.materials.get(materialId);
    if (!material) throw new Error('Material not found');

    const document: MaterialDocument = {
      ...data,
      id: `mdoc_${Date.now()}`,
      materialId,
    };

    material.documents.push(document);
    return document;
  }

  removeDocument(materialId: string, documentId: string): boolean {
    const material = this.materials.get(materialId);
    if (!material) return false;

    const index = material.documents.findIndex(d => d.id === documentId);
    if (index === -1) return false;

    material.documents.splice(index, 1);
    return true;
  }

  // ============================================================
  // MATERIAL IMAGES
  // ============================================================

  addImage(materialId: string, data: Omit<MaterialImage, 'id' | 'materialId'>): MaterialImage {
    const material = this.materials.get(materialId);
    if (!material) throw new Error('Material not found');

    const image: MaterialImage = {
      ...data,
      id: `mimg_${Date.now()}`,
      materialId,
    };

    material.images.push(image);
    return image;
  }

  removeImage(materialId: string, imageId: string): boolean {
    const material = this.materials.get(materialId);
    if (!material) return false;

    const index = material.images.findIndex(i => i.id === imageId);
    if (index === -1) return false;

    material.images.splice(index, 1);
    return true;
  }

  // ============================================================
  // MATERIAL ALTERNATIVES
  // ============================================================

  addAlternative(originalMaterialId: string, data: Omit<MaterialAlternative, 'id' | 'originalMaterialId'>): MaterialAlternative {
    const material = this.materials.get(originalMaterialId);
    if (!material) throw new Error('Material not found');

    const alternative: MaterialAlternative = {
      ...data,
      id: `malt_${Date.now()}`,
      originalMaterialId,
    };

    material.alternatives.push(alternative);
    return alternative;
  }

  getAlternatives(materialId: string): MaterialAlternative[] {
    const material = this.materials.get(materialId);
    return material?.alternatives || [];
  }

  // ============================================================
  // APPROVED MATERIAL LIST
  // ============================================================

  approveMaterialForProject(data: Omit<ApprovedMaterialList, 'id' | 'createdAt' | 'updatedAt'>): ApprovedMaterialList {
    const now = new Date().toISOString();
    const approved: ApprovedMaterialList = {
      ...data,
      id: `mapp_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    const projectList = this.approvedMaterialLists.get(data.projectId) || [];
    projectList.push(approved);
    this.approvedMaterialLists.set(data.projectId, projectList);

    return approved;
  }

  getApprovedMaterialsForProject(projectId: string): ApprovedMaterialList[] {
    return this.approvedMaterialLists.get(projectId) || [];
  }

  // ============================================================
  // MATERIAL RATE HISTORY
  // ============================================================

  addRateHistory(materialId: string, data: Omit<MaterialRateHistory, 'id' | 'createdAt'>): MaterialRateHistory {
    const rateHistory: MaterialRateHistory = {
      ...data,
      id: `mrate_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const history = this.rateHistories.get(materialId) || [];
    history.push(rateHistory);
    this.rateHistories.set(materialId, history);

    // Check for rate alerts
    this.checkRateAlerts(materialId, rateHistory);

    return rateHistory;
  }

  getRateHistory(materialId: string, rateType?: MaterialRateType): MaterialRateHistory[] {
    let history = this.rateHistories.get(materialId) || [];
    if (rateType) {
      history = history.filter(r => r.rateType === rateType);
    }
    return history.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  }

  private checkRateAlerts(materialId: string, newRate: MaterialRateHistory): void {
    const history = this.getRateHistory(materialId, newRate.rateType);
    if (history.length < 2) return;

    const previousRate = history[1]; // Second most recent
    const variance = newRate.rate - previousRate.rate;
    const variancePercent = (variance / previousRate.rate) * 100;

    let alertType: MaterialRateAlertType | null = null;
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let message = '';

    if (variancePercent > 20) {
      alertType = 'RATE_INCREASE';
      severity = 'HIGH';
      message = `Rate increased by ${variancePercent.toFixed(2)}%`;
    } else if (variancePercent < -20) {
      alertType = 'RATE_DECREASE';
      severity = 'MEDIUM';
      message = `Rate decreased by ${Math.abs(variancePercent).toFixed(2)}%`;
    } else if (Math.abs(variancePercent) > 10) {
      alertType = 'UNUSUAL_RATE';
      severity = 'LOW';
      message = `Unusual rate variance of ${variancePercent.toFixed(2)}%`;
    }

    if (alertType) {
      this.createRateAlert({
        materialId,
        alertType,
        currentRate: newRate.rate,
        previousRate: previousRate.rate,
        variance,
        variancePercent,
        message,
        severity,
        isAcknowledged: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // ============================================================
  // MATERIAL VENDOR LINK
  // ============================================================

  linkVendor(materialId: string, data: Omit<MaterialVendorLink, 'id' | 'materialId' | 'createdAt' | 'updatedAt'>): MaterialVendorLink {
    const now = new Date().toISOString();
    const link: MaterialVendorLink = {
      ...data,
      id: `mlink_${Date.now()}`,
      materialId,
      createdAt: now,
      updatedAt: now,
    };

    const links = this.vendorLinks.get(materialId) || [];
    links.push(link);
    this.vendorLinks.set(materialId, links);

    // Update material's approved vendors
    const material = this.materials.get(materialId);
    if (material && !material.approvedVendors.includes(data.vendorId)) {
      material.approvedVendors.push(data.vendorId);
    }

    return link;
  }

  getVendorLinks(materialId: string): MaterialVendorLink[] {
    return this.vendorLinks.get(materialId) || [];
  }

  // ============================================================
  // MATERIAL RATE ALERTS
  // ============================================================

  private createRateAlert(data: Omit<MaterialRateAlert, 'id'>): MaterialRateAlert {
    const alert: MaterialRateAlert = {
      ...data,
      id: `malert_${Date.now()}`,
    };

    this.rateAlerts.set(alert.id, alert);
    return alert;
  }

  getRateAlerts(materialId?: string, isAcknowledged?: boolean): MaterialRateAlert[] {
    let alerts = Array.from(this.rateAlerts.values());
    
    if (materialId) {
      alerts = alerts.filter(a => a.materialId === materialId);
    }
    if (isAcknowledged !== undefined) {
      alerts = alerts.filter(a => a.isAcknowledged === isAcknowledged);
    }

    return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  acknowledgeRateAlert(alertId: string, acknowledgedBy: string): MaterialRateAlert | null {
    const alert = this.rateAlerts.get(alertId);
    if (!alert) return null;

    alert.isAcknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = acknowledgedBy;

    return alert;
  }

  // ============================================================
  // MATERIAL SEARCH
  // ============================================================

  searchMaterials(companyId: string, query: string, limit: number = 50): MaterialSearchResult[] {
    const materials = this.getMaterials(companyId, { search: query });
    
    return materials.slice(0, limit).map(m => {
      const rateHistory = this.getRateHistory(m.id, 'LAST_PURCHASE_RATE');
      const lastRate = rateHistory.length > 0 ? rateHistory[0].rate : undefined;

      return {
        materialId: m.id,
        materialCode: m.materialCode,
        materialName: m.materialName,
        materialCategory: m.materialCategory,
        brand: m.brand,
        primaryUOM: m.primaryUOM,
        status: m.status,
        lastPurchaseRate: lastRate,
      };
    });
  }

  // ============================================================
  // MATERIAL COMPARISON
  // ============================================================

  compareMaterials(materialIds: string[]): MaterialComparison {
    const materials = materialIds.map(id => this.materials.get(id)).filter(m => m !== undefined) as MaterialMaster[];
    
    const comparisonPoints: any[] = [
      { attribute: 'Material Name', values: {} },
      { attribute: 'Category', values: {} },
      { attribute: 'Brand', values: {} },
      { attribute: 'Grade', values: {} },
      { attribute: 'Specification', values: {} },
      { attribute: 'UOM', values: {} },
      { attribute: 'Status', values: {} },
    ];

    materials.forEach(m => {
      comparisonPoints[0].values[m.id] = m.materialName;
      comparisonPoints[1].values[m.id] = m.materialCategory;
      comparisonPoints[2].values[m.id] = m.brand || 'N/A';
      comparisonPoints[3].values[m.id] = m.grade || 'N/A';
      comparisonPoints[4].values[m.id] = m.specification || 'N/A';
      comparisonPoints[5].values[m.id] = m.primaryUOM;
      comparisonPoints[6].values[m.id] = m.status;
    });

    return { materialIds, comparisonPoints };
  }

  // ============================================================
  // BULK IMPORT
  // ============================================================

  importMaterials(companyId: string, fileName: string, fileType: 'EXCEL' | 'CSV', materials: any[]): MaterialBulkImport {
    const now = new Date().toISOString();
    const importedMaterials: string[] = [];
    const errors: any[] = [];

    materials.forEach((row, index) => {
      try {
        // Validate required fields
        if (!row.materialCode || !row.materialName || !row.materialCategory || !row.primaryUOM) {
          errors.push({
            rowNumber: index + 1,
            field: 'Required Fields',
            error: 'Missing required fields: materialCode, materialName, materialCategory, or primaryUOM',
          });
          return;
        }

        // Check for duplicates
        const existing = Array.from(this.materials.values()).find(
          m => m.companyId === companyId && m.materialCode === row.materialCode
        );
        if (existing) {
          errors.push({
            rowNumber: index + 1,
            field: 'materialCode',
            error: `Duplicate material code: ${row.materialCode}`,
            value: row.materialCode,
          });
          return;
        }

        // Prepare material data
        const materialData: Omit<MaterialMaster, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
          companyId,
          materialId: String(row.materialCode),
          materialCode: String(row.materialCode),
          materialName: String(row.materialName),
          materialType: (row.materialType as MaterialType) || 'RAW_MATERIAL',
          materialGroup: String(row.materialGroup || 'General'),
          materialCategory: String(row.materialCategory),
          primaryUOM: String(row.primaryUOM),
          gstRate: Number(row.gstRate || 18),
          cgstRate: Number((row.gstRate || 18) / 2),
          sgstRate: Number((row.gstRate || 18) / 2),
          igstRate: Number(row.gstRate || 18),
          batchRequired: Boolean(row.batchRequired || false),
          serialRequired: Boolean(row.serialRequired || false),
          qcRequired: Boolean(row.qcRequired || false),
          approvalRequired: Boolean(row.approvalRequired || false),
          isHazardous: Boolean(row.isHazardous || false),
          msdsRequired: Boolean(row.msdsRequired || false),
          inspectionRequired: Boolean(row.inspectionRequired || false),
          testRequired: Boolean(row.testRequired || false),
          certificateRequired: Boolean(row.certificateRequired || false),
          status: 'DRAFT' as MaterialStatus,
          documents: [],
          images: [],
          approvedVendors: [],
          alternatives: [],
          createdBy: 'system',
          updatedBy: 'system',
        };

        // Create material
        const material = this.createMaterial(materialData);
        importedMaterials.push(material.id);
      } catch (error) {
        errors.push({
          rowNumber: index + 1,
          field: 'General',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    const bulkImport: MaterialBulkImport = {
      id: `mbulk_${Date.now()}`,
      companyId,
      fileName,
      fileType,
      totalRows: materials.length,
      validRows: importedMaterials.length,
      invalidRows: errors.length,
      duplicateRows: errors.filter(e => e.field === 'materialCode').length,
      importedMaterials,
      errors,
      status: errors.length === 0 ? 'IMPORTED' : 'FAILED',
      importedBy: 'system',
      importedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    this.bulkImports.set(bulkImport.id, bulkImport);
    return bulkImport;
  }

  // ============================================================
  // MATERIAL DASHBOARD KPIs
  // ============================================================

  getMaterialDashboardKPIs(companyId: string): MaterialDashboardKPIs {
    const materials = this.getMaterials(companyId);
    const classifications = this.getClassifications(companyId);
    const groups = this.getGroups(companyId);
    const rateAlerts = this.getRateAlerts();

    const approvedMaterials = materials.filter(m => m.status === 'APPROVED');
    const pendingApproval = materials.filter(m => m.status === 'UNDER_REVIEW');
    const blockedMaterials = materials.filter(m => m.status === 'BLOCKED');
    const materialsWithVendors = materials.filter(m => m.approvedVendors.length > 0);
    const materialsWithoutVendors = materials.filter(m => m.approvedVendors.length === 0);
    const hazardousMaterials = materials.filter(m => m.isHazardous);
    const materialsRequiringQC = materials.filter(m => m.qcRequired);

    // Count expiring documents (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    let expiringDocuments = 0;
    materials.forEach(m => {
      m.documents.forEach(doc => {
        if (doc.expiryDate && new Date(doc.expiryDate) <= thirtyDaysFromNow) {
          expiringDocuments++;
        }
      });
    });

    return {
      totalMaterials: materials.length,
      approvedMaterials: approvedMaterials.length,
      pendingApproval: pendingApproval.length,
      blockedMaterials: blockedMaterials.length,
      totalCategories: classifications.length,
      totalGroups: groups.length,
      materialsWithVendors: materialsWithVendors.length,
      materialsWithoutVendors: materialsWithoutVendors.length,
      rateAlerts: rateAlerts.filter(a => !a.isAcknowledged).length,
      expiringDocuments,
      hazardousMaterials: hazardousMaterials.length,
      materialsRequiringQC: materialsRequiringQC.length,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  getMaterialByCode(companyId: string, materialCode: string): MaterialMaster | undefined {
    return Array.from(this.materials.values()).find(
      m => m.companyId === companyId && m.materialCode === materialCode
    );
  }

  getMaterialsByCategory(companyId: string, category: string): MaterialMaster[] {
    return this.getMaterials(companyId).filter(m => m.materialCategory === category);
  }

  getMaterialsByGroup(companyId: string, group: string): MaterialMaster[] {
    return this.getMaterials(companyId).filter(m => m.materialGroup === group);
  }
}

export const materialService = MaterialService.getInstance();

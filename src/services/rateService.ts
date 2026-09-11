// ============================================================
// BUILDCORE ERP - RATE LIBRARY & ANALYSIS SERVICE
// Part 09: Professional Rate Library and Rate Analysis Engine
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  RateLibrary, RateItem, Resource, RateAnalysis, Estimate, EstimationDashboardKPIs
} from '../types/rate';

export class RateService {
  private static instance: RateService;

  private rateLibraries: Map<string, RateLibrary> = new Map();
  private rateItems: Map<string, RateItem[]> = new Map();
  private resources: Map<string, Resource> = new Map();
  private rateAnalyses: Map<string, RateAnalysis> = new Map();
  private estimates: Map<string, Estimate> = new Map();

  private constructor() {}

  static getInstance(): RateService {
    if (!RateService.instance) {
      RateService.instance = new RateService();
    }
    return RateService.instance;
  }

  // Rate Library Management
  createRateLibrary(library: any): RateLibrary {
    const now = new Date().toISOString();
    const newLibrary: RateLibrary = {
      ...library,
      id: `rl_${uuidv4()}`,
      itemCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.rateLibraries.set(newLibrary.id, newLibrary);
    this.rateItems.set(newLibrary.id, []);
    return newLibrary;
  }

  getRateLibrary(id: string): RateLibrary | undefined {
    return this.rateLibraries.get(id);
  }

  getRateLibraries(companyId: string): RateLibrary[] {
    return Array.from(this.rateLibraries.values()).filter(l => l.companyId === companyId);
  }

  // Item Management
  createRateItem(item: any): RateItem {
    const now = new Date().toISOString();
    const newItem: RateItem = {
      ...item,
      id: `ri_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    const items = this.rateItems.get(item.rateLibraryId) || [];
    items.push(newItem);
    this.rateItems.set(item.rateLibraryId, items);
    
    const library = this.rateLibraries.get(item.rateLibraryId);
    if (library) {
      library.itemCount = items.length;
    }
    return newItem;
  }

  getRateItems(libraryId: string): RateItem[] {
    return this.rateItems.get(libraryId) || [];
  }

  // Resource Management
  createResource(resource: any): Resource {
    const now = new Date().toISOString();
    const newResource: Resource = {
      ...resource,
      id: `res_${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  getResources(companyId: string): Resource[] {
    return Array.from(this.resources.values()).filter(r => r.companyId === companyId);
  }

  // Rate Analysis
  createRateAnalysis(analysis: any): RateAnalysis {
    const now = new Date().toISOString();
    const directCost = analysis.resources.reduce((sum: number, r: any) => sum + r.amount, 0);
    const wastageAmount = directCost * (analysis.wastagePercent / 100);
    const profitAmount = (directCost + wastageAmount + analysis.leadLiftCost + analysis.overheads.total) * (analysis.profitPercent / 100);
    const subtotal = directCost + wastageAmount + analysis.transportationCost + analysis.leadLiftCost + analysis.overheads.total + profitAmount;
    const totalAmount = subtotal + analysis.taxes.totalTaxAmount;
    const totalRate = totalAmount / analysis.quantity;
    
    const newAnalysis: RateAnalysis = {
      ...analysis,
      id: `ra_${uuidv4()}`,
      directCost,
      wastageAmount,
      profitAmount,
      totalRate,
      totalAmount,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.rateAnalyses.set(newAnalysis.id, newAnalysis);
    return newAnalysis;
  }

  getRateAnalysis(id: string): RateAnalysis | undefined {
    return this.rateAnalyses.get(id);
  }

  getRateAnalyses(companyId: string): RateAnalysis[] {
    return Array.from(this.rateAnalyses.values()).filter(a => a.companyId === companyId);
  }

  // Estimate Management
  createEstimate(estimate: any): Estimate {
    const now = new Date().toISOString();
    const civilAmount = estimate.items.filter((i: any) => i.category === 'CIVIL').reduce((sum: number, i: any) => sum + i.amount, 0);
    const structuralAmount = estimate.items.filter((i: any) => i.category === 'STRUCTURAL').reduce((sum: number, i: any) => sum + i.amount, 0);
    const architecturalAmount = estimate.items.filter((i: any) => i.category === 'ARCHITECTURAL').reduce((sum: number, i: any) => sum + i.amount, 0);
    const electricalAmount = estimate.items.filter((i: any) => i.category === 'ELECTRICAL').reduce((sum: number, i: any) => sum + i.amount, 0);
    const mechanicalAmount = estimate.items.filter((i: any) => i.category === 'MECHANICAL').reduce((sum: number, i: any) => sum + i.amount, 0);
    const plumbingAmount = estimate.items.filter((i: any) => i.category === 'PLUMBING').reduce((sum: number, i: any) => sum + i.amount, 0);
    const roadAmount = estimate.items.filter((i: any) => i.category === 'ROAD').reduce((sum: number, i: any) => sum + i.amount, 0);
    const bridgeAmount = estimate.items.filter((i: any) => i.category === 'BRIDGE').reduce((sum: number, i: any) => sum + i.amount, 0);
    const otherAmount = estimate.items.filter((i: any) => i.category === 'OTHER').reduce((sum: number, i: any) => sum + i.amount, 0);
    
    const subtotal = estimate.items.reduce((sum: number, i: any) => sum + i.amount, 0);
    const profitAmount = (subtotal + estimate.overheads.total) * (estimate.profitPercent / 100);
    const grandTotal = subtotal + estimate.overheads.total + profitAmount + estimate.taxes.totalTaxAmount;
    
    const newEstimate: Estimate = {
      ...estimate,
      id: `est_${uuidv4()}`,
      civilAmount,
      structuralAmount,
      architecturalAmount,
      electricalAmount,
      mechanicalAmount,
      plumbingAmount,
      roadAmount,
      bridgeAmount,
      otherAmount,
      subtotal,
      profitAmount,
      grandTotal,
      revision: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.estimates.set(newEstimate.id, newEstimate);
    return newEstimate;
  }

  getEstimate(id: string): Estimate | undefined {
    return this.estimates.get(id);
  }

  getEstimates(companyId: string): Estimate[] {
    return Array.from(this.estimates.values()).filter(e => e.companyId === companyId);
  }

  // Dashboard KPIs
  getEstimationDashboardKPIs(companyId: string): EstimationDashboardKPIs {
    const estimates = this.getEstimates(companyId);
    const totalEstimates = estimates.length;
    const pendingApproval = estimates.filter(e => ['DRAFT', 'REVISION_1', 'REVISION_2'].includes(e.status)).length;
    const tenderEstimates = estimates.filter(e => e.status === 'TENDER_SUBMITTED').length;
    const approvedEstimates = estimates.filter(e => ['APPROVED', 'AWARDED'].includes(e.status)).length;
    const totalEstimateValue = estimates.reduce((sum, e) => sum + e.grandTotal, 0);
    const averageRate = totalEstimates > 0 ? totalEstimateValue / totalEstimates : 0;
    
    let totalMaterial = 0, totalLabour = 0, totalPlant = 0, totalOverhead = 0, totalProfit = 0;
    estimates.forEach(estimate => {
      totalOverhead += estimate.overheads.total;
      totalProfit += estimate.profitAmount;
      const itemTotal = estimate.items.reduce((sum, i) => sum + i.amount, 0);
      totalMaterial += itemTotal * 0.5;
      totalLabour += itemTotal * 0.3;
      totalPlant += itemTotal * 0.2;
    });

    const totalCost = totalMaterial + totalLabour + totalPlant + totalOverhead + totalProfit;
    const topCostComponents = [
      { name: 'Material', amount: totalMaterial, percentage: totalCost > 0 ? (totalMaterial / totalCost) * 100 : 0 },
      { name: 'Labour', amount: totalLabour, percentage: totalCost > 0 ? (totalLabour / totalCost) * 100 : 0 },
      { name: 'Plant', amount: totalPlant, percentage: totalCost > 0 ? (totalPlant / totalCost) * 100 : 0 },
      { name: 'Overhead', amount: totalOverhead, percentage: totalCost > 0 ? (totalOverhead / totalCost) * 100 : 0 },
      { name: 'Profit', amount: totalProfit, percentage: totalCost > 0 ? (totalProfit / totalCost) * 100 : 0 },
    ].sort((a, b) => b.amount - a.amount);

    return {
      totalEstimates,
      pendingApproval,
      tenderEstimates,
      approvedEstimates,
      averageRate,
      rateVariance: 0,
      topCostComponents,
      materialShare: totalCost > 0 ? (totalMaterial / totalCost) * 100 : 0,
      labourShare: totalCost > 0 ? (totalLabour / totalCost) * 100 : 0,
      plantShare: totalCost > 0 ? (totalPlant / totalCost) * 100 : 0,
      overheadShare: totalCost > 0 ? (totalOverhead / totalCost) * 100 : 0,
      profitShare: totalCost > 0 ? (totalProfit / totalCost) * 100 : 0,
      totalEstimateValue,
    };
  }
}

export const rateService = RateService.getInstance();

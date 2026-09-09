// ============================================================
// BUILDCORE ERP - STORE & WAREHOUSE SERVICE
// Part 17: Complete Store and Warehouse Management System
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  StoreMaster, BinMaster, StockLedgerEntry, MaterialIssue, MaterialIssueItem,
  MaterialReturn, MaterialReturnItem, StockTransfer, StockTransferItem,
  StockAdjustment, StockAdjustmentItem, StockReservation, StockReservationItem,
  StockBalance, MinMaxStockConfig, ReorderAlert, DeadStockAnalysis,
  SlowMovingAnalysis, StockAgeingAnalysis, MaterialReconciliation,
  StoreDashboardKPIs, StockValuationConfig, StockTransactionType,
  WarehouseType, IssueStatus, ReturnStatus, TransferStatus,
  AdjustmentStatus, ReservationStatus, AdjustmentReason
} from '../types/store';

export class StoreService {
  private static instance: StoreService;
  
  private stores: Map<string, StoreMaster> = new Map();
  private bins: Map<string, BinMaster> = new Map();
  private stockLedger: Map<string, StockLedgerEntry> = new Map();
  private materialIssues: Map<string, MaterialIssue> = new Map();
  private materialReturns: Map<string, MaterialReturn> = new Map();
  private stockTransfers: Map<string, StockTransfer> = new Map();
  private stockAdjustments: Map<string, StockAdjustment> = new Map();
  private stockReservations: Map<string, StockReservation> = new Map();
  private stockBalances: Map<string, StockBalance> = new Map();
  private minMaxConfigs: Map<string, MinMaxStockConfig> = new Map();
  private reorderAlerts: Map<string, ReorderAlert> = new Map();
  private reconciliations: Map<string, MaterialReconciliation> = new Map();
  private valuationConfigs: Map<string, StockValuationConfig> = new Map();

  private constructor() {}

  static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  // ============================================================
  // STORE MANAGEMENT
  // ============================================================

  createStore(data: Omit<StoreMaster, 'id' | 'createdAt' | 'updatedAt'>): StoreMaster {
    const store: StoreMaster = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.stores.set(store.id, store);
    return store;
  }

  getStore(id: string): StoreMaster | undefined {
    return this.stores.get(id);
  }

  getStores(companyId: string, filters?: { projectId?: string; warehouseType?: WarehouseType }): StoreMaster[] {
    let stores = Array.from(this.stores.values()).filter(s => s.companyId === companyId);
    if (filters?.projectId) {
      stores = stores.filter(s => s.projectId === filters.projectId);
    }
    if (filters?.warehouseType) {
      stores = stores.filter(s => s.warehouseType === filters.warehouseType);
    }
    return stores;
  }

  updateStore(id: string, data: Partial<StoreMaster>): StoreMaster | null {
    const store = this.stores.get(id);
    if (!store) return null;
    
    const updated = { ...store, ...data, updatedAt: new Date().toISOString() };
    this.stores.set(id, updated);
    return updated;
  }

  // ============================================================
  // BIN MANAGEMENT
  // ============================================================

  createBin(data: Omit<BinMaster, 'id' | 'createdAt' | 'updatedAt'>): BinMaster {
    const bin: BinMaster = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bins.set(bin.id, bin);
    return bin;
  }

  getBin(id: string): BinMaster | undefined {
    return this.bins.get(id);
  }

  getBins(storeId: string): BinMaster[] {
    return Array.from(this.bins.values()).filter(b => b.storeId === storeId);
  }

  updateBin(id: string, data: Partial<BinMaster>): BinMaster | null {
    const bin = this.bins.get(id);
    if (!bin) return null;
    
    const updated = { ...bin, ...data, updatedAt: new Date().toISOString() };
    this.bins.set(id, updated);
    return updated;
  }

  // ============================================================
  // STOCK BALANCE MANAGEMENT
  // ============================================================

  getStockBalance(materialId: string, storeId: string, batchNumber?: string, binId?: string): StockBalance | undefined {
    const key = this.getStockBalanceKey(materialId, storeId, batchNumber, binId);
    return this.stockBalances.get(key);
  }

  updateStockBalance(
    materialId: string,
    storeId: string,
    quantity: number,
    rate: number,
    transactionType: StockTransactionType,
    batchNumber?: string,
    binId?: string
  ): StockBalance {
    const key = this.getStockBalanceKey(materialId, storeId, batchNumber, binId);
    let balance = this.stockBalances.get(key);

    if (!balance) {
      balance = {
        id: uuidv4(),
        companyId: '', // Will be set from material
        materialId,
        materialCode: '', // Will be set from material
        materialName: '', // Will be set from material
        batchNumber,
        storeId,
        binId,
        physicalQuantity: 0,
        reservedQuantity: 0,
        availableQuantity: 0,
        uom: '', // Will be set from material
        rate: 0,
        value: 0,
        valuationMethod: 'WEIGHTED_AVERAGE',
        updatedAt: new Date().toISOString(),
      };
    }

    // Update quantities based on transaction type
    switch (transactionType) {
      case 'RECEIPT':
      case 'RETURN':
        balance.physicalQuantity += quantity;
        break;
      case 'ISSUE':
      case 'CONSUMPTION':
      case 'DAMAGE':
      case 'REJECTION':
        balance.physicalQuantity -= quantity;
        break;
      case 'ADJUSTMENT':
        balance.physicalQuantity = quantity; // Direct set
        break;
      case 'TRANSFER':
        // Handled separately for from/to locations
        break;
    }

    // Calculate rate based on valuation method
    const valuationConfig = this.valuationConfigs.get(materialId);
    const method = valuationConfig?.valuationMethod || 'WEIGHTED_AVERAGE';
    
    if (method === 'WEIGHTED_AVERAGE') {
      if (transactionType === 'RECEIPT' || transactionType === 'RETURN') {
        const totalValue = (balance.physicalQuantity - quantity) * balance.rate + quantity * rate;
        balance.rate = balance.physicalQuantity > 0 ? totalValue / balance.physicalQuantity : rate;
      }
    } else if (method === 'FIFO') {
      // FIFO implementation would be more complex
      balance.rate = rate;
    }

    balance.value = balance.physicalQuantity * balance.rate;
    balance.availableQuantity = balance.physicalQuantity - balance.reservedQuantity;
    balance.lastMovementDate = new Date().toISOString();
    balance.updatedAt = new Date().toISOString();

    this.stockBalances.set(key, balance);
    return balance;
  }

  reserveStock(materialId: string, storeId: string, quantity: number, batchNumber?: string, binId?: string): boolean {
    const balance = this.getStockBalance(materialId, storeId, batchNumber, binId);
    if (!balance || balance.availableQuantity < quantity) {
      return false;
    }

    balance.reservedQuantity += quantity;
    balance.availableQuantity = balance.physicalQuantity - balance.reservedQuantity;
    balance.updatedAt = new Date().toISOString();

    const key = this.getStockBalanceKey(materialId, storeId, batchNumber, binId);
    this.stockBalances.set(key, balance);
    return true;
  }

  releaseReservation(materialId: string, storeId: string, quantity: number, batchNumber?: string, binId?: string): void {
    const balance = this.getStockBalance(materialId, storeId, batchNumber, binId);
    if (!balance) return;

    balance.reservedQuantity = Math.max(0, balance.reservedQuantity - quantity);
    balance.availableQuantity = balance.physicalQuantity - balance.reservedQuantity;
    balance.updatedAt = new Date().toISOString();

    const key = this.getStockBalanceKey(materialId, storeId, batchNumber, binId);
    this.stockBalances.set(key, balance);
  }

  private getStockBalanceKey(materialId: string, storeId: string, batchNumber?: string, binId?: string): string {
    return `${materialId}_${storeId}_${batchNumber || 'none'}_${binId || 'none'}`;
  }

  // ============================================================
  // STOCK LEDGER
  // ============================================================

  addLedgerEntry(data: Omit<StockLedgerEntry, 'id' | 'createdAt'>): StockLedgerEntry {
    const entry: StockLedgerEntry = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.stockLedger.set(entry.id, entry);
    return entry;
  }

  getLedgerEntries(filters?: { materialId?: string; storeId?: string; transactionType?: StockTransactionType; fromDate?: string; toDate?: string }): StockLedgerEntry[] {
    let entries = Array.from(this.stockLedger.values());
    
    if (filters?.materialId) {
      entries = entries.filter(e => e.materialId === filters.materialId);
    }
    if (filters?.storeId) {
      entries = entries.filter(e => 
        (e.fromLocation?.storeId === filters.storeId) || 
        (e.toLocation?.storeId === filters.storeId)
      );
    }
    if (filters?.transactionType) {
      entries = entries.filter(e => e.transactionType === filters.transactionType);
    }
    if (filters?.fromDate) {
      entries = entries.filter(e => e.transactionDate >= filters.fromDate!);
    }
    if (filters?.toDate) {
      entries = entries.filter(e => e.transactionDate <= filters.toDate!);
    }

    return entries.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  // ============================================================
  // MATERIAL ISSUE
  // ============================================================

  createMaterialIssue(data: Omit<MaterialIssue, 'id' | 'createdAt' | 'updatedAt' | 'issueNumber'>): MaterialIssue {
    const issue: MaterialIssue = {
      ...data,
      id: uuidv4(),
      issueNumber: this.generateIssueNumber(data.companyId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.materialIssues.set(issue.id, issue);
    return issue;
  }

  getMaterialIssue(id: string): MaterialIssue | undefined {
    return this.materialIssues.get(id);
  }

  getMaterialIssues(companyId: string, filters?: { storeId?: string; status?: IssueStatus }): MaterialIssue[] {
    let issues = Array.from(this.materialIssues.values()).filter(i => i.companyId === companyId);
    if (filters?.storeId) {
      issues = issues.filter(i => i.storeId === filters.storeId);
    }
    if (filters?.status) {
      issues = issues.filter(i => i.status === filters.status);
    }
    return issues;
  }

  approveMaterialIssue(id: string, approverId: string, approverName: string): MaterialIssue | null {
    const issue = this.materialIssues.get(id);
    if (!issue || issue.status !== 'PENDING_APPROVAL') return null;

    issue.status = 'APPROVED';
    issue.approverId = approverId;
    issue.approverName = approverName;
    issue.approvedAt = new Date().toISOString();
    issue.updatedAt = new Date().toISOString();

    return issue;
  }

  issueMaterial(id: string, storeKeeperId: string, storeKeeperName: string): MaterialIssue | null {
    const issue = this.materialIssues.get(id);
    if (!issue || issue.status !== 'APPROVED') return null;

    // Check stock availability and issue each item
    for (const item of issue.items) {
      const balance = this.getStockBalance(item.materialId, issue.storeId, item.batchNumber);
      if (!balance || balance.availableQuantity < item.requestedQuantity) {
        return null; // Insufficient stock
      }

      // Update stock balance
      this.updateStockBalance(
        item.materialId,
        issue.storeId,
        item.requestedQuantity,
        balance.rate,
        'ISSUE',
        item.batchNumber,
        item.binId
      );

      // Add ledger entry
      this.addLedgerEntry({
        companyId: issue.companyId,
        transactionId: uuidv4(),
        transactionDate: new Date().toISOString(),
        materialId: item.materialId,
        materialCode: item.materialCode,
        materialName: item.materialName,
        batchNumber: item.batchNumber,
        lotNumber: item.lotNumber,
        fromLocation: {
          companyId: issue.companyId,
          storeId: issue.storeId,
          binId: item.binId,
        },
        toLocation: {
          companyId: issue.companyId,
          projectId: issue.projectId,
          siteId: issue.siteId,
        },
        quantity: item.requestedQuantity,
        uom: item.uom,
        rate: balance.rate,
        value: item.requestedQuantity * balance.rate,
        transactionType: 'ISSUE',
        referenceId: issue.id,
        referenceNumber: issue.issueNumber,
        userId: storeKeeperId,
        userName: storeKeeperName,
      });

      item.issuedQuantity = item.requestedQuantity;
      item.value = item.requestedQuantity * balance.rate;
      item.status = 'ISSUED';
    }

    issue.status = 'ISSUED';
    issue.storeKeeperId = storeKeeperId;
    issue.storeKeeperName = storeKeeperName;
    issue.issuedAt = new Date().toISOString();
    issue.updatedAt = new Date().toISOString();

    return issue;
  }

  // ============================================================
  // MATERIAL RETURN
  // ============================================================

  createMaterialReturn(data: Omit<MaterialReturn, 'id' | 'createdAt' | 'updatedAt' | 'returnNumber'>): MaterialReturn {
    const returnData: MaterialReturn = {
      ...data,
      id: uuidv4(),
      returnNumber: this.generateReturnNumber(data.companyId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.materialReturns.set(returnData.id, returnData);
    return returnData;
  }

  getMaterialReturn(id: string): MaterialReturn | undefined {
    return this.materialReturns.get(id);
  }

  getMaterialReturns(companyId: string, filters?: { storeId?: string; status?: ReturnStatus }): MaterialReturn[] {
    let returns = Array.from(this.materialReturns.values()).filter(r => r.companyId === companyId);
    if (filters?.storeId) {
      returns = returns.filter(r => r.storeId === filters.storeId);
    }
    if (filters?.status) {
      returns = returns.filter(r => r.status === filters.status);
    }
    return returns;
  }

  acceptMaterialReturn(id: string, receivedById: string, receivedByName: string): MaterialReturn | null {
    const returnData = this.materialReturns.get(id);
    if (!returnData || returnData.status !== 'INSPECTED') return null;

    // Update stock for accepted quantities
    for (const item of returnData.items) {
      if (item.acceptedQuantity > 0) {
        const issue = this.materialIssues.get(returnData.issueId);
        const issueItem = issue?.items.find(i => i.id === item.issueItemId);
        const rate = issueItem ? issueItem.value / issueItem.issuedQuantity : 0;

        this.updateStockBalance(
          item.materialId,
          returnData.storeId,
          item.acceptedQuantity,
          rate,
          'RETURN',
          item.batchNumber,
          item.binId
        );

        this.addLedgerEntry({
          companyId: returnData.companyId,
          transactionId: uuidv4(),
          transactionDate: new Date().toISOString(),
          materialId: item.materialId,
          materialCode: item.materialCode,
          materialName: item.materialName,
          batchNumber: item.batchNumber,
          lotNumber: item.lotNumber,
          fromLocation: {
            companyId: returnData.companyId,
          },
          toLocation: {
            companyId: returnData.companyId,
            storeId: returnData.storeId,
            binId: item.binId,
          },
          quantity: item.acceptedQuantity,
          uom: item.uom,
          rate,
          value: item.acceptedQuantity * rate,
          transactionType: 'RETURN',
          referenceId: returnData.id,
          referenceNumber: returnData.returnNumber,
          userId: receivedById,
          userName: receivedByName,
        });
      }
    }

    returnData.status = 'COMPLETED';
    returnData.receivedById = receivedById;
    returnData.receivedByName = receivedByName;
    returnData.updatedAt = new Date().toISOString();

    return returnData;
  }

  // ============================================================
  // STOCK TRANSFER
  // ============================================================

  createStockTransfer(data: Omit<StockTransfer, 'id' | 'createdAt' | 'updatedAt' | 'transferNumber'>): StockTransfer {
    const transfer: StockTransfer = {
      ...data,
      id: uuidv4(),
      transferNumber: this.generateTransferNumber(data.companyId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.stockTransfers.set(transfer.id, transfer);
    return transfer;
  }

  getStockTransfer(id: string): StockTransfer | undefined {
    return this.stockTransfers.get(id);
  }

  getStockTransfers(companyId: string, filters?: { fromStoreId?: string; toStoreId?: string; status?: TransferStatus }): StockTransfer[] {
    let transfers = Array.from(this.stockTransfers.values()).filter(t => t.companyId === companyId);
    if (filters?.fromStoreId) {
      transfers = transfers.filter(t => t.fromStoreId === filters.fromStoreId);
    }
    if (filters?.toStoreId) {
      transfers = transfers.filter(t => t.toStoreId === filters.toStoreId);
    }
    if (filters?.status) {
      transfers = transfers.filter(t => t.status === filters.status);
    }
    return transfers;
  }

  dispatchTransfer(id: string, dispatchedById: string, dispatchedByName: string): StockTransfer | null {
    const transfer = this.stockTransfers.get(id);
    if (!transfer || transfer.status !== 'DRAFT') return null;

    // Check stock availability and deduct from source
    for (const item of transfer.items) {
      const balance = this.getStockBalance(item.materialId, transfer.fromStoreId, item.batchNumber, item.fromBinId);
      if (!balance || balance.availableQuantity < item.quantity) {
        return null;
      }

      this.updateStockBalance(
        item.materialId,
        transfer.fromStoreId,
        item.quantity,
        balance.rate,
        'TRANSFER',
        item.batchNumber,
        item.fromBinId
      );

      item.dispatchedQuantity = item.quantity;
    }

    transfer.status = 'DISPATCHED';
    transfer.dispatchedById = dispatchedById;
    transfer.dispatchedByName = dispatchedByName;
    transfer.dispatchedAt = new Date().toISOString();
    transfer.updatedAt = new Date().toISOString();

    return transfer;
  }

  receiveTransfer(id: string, receivedById: string, receivedByName: string): StockTransfer | null {
    const transfer = this.stockTransfers.get(id);
    if (!transfer || transfer.status !== 'DISPATCHED') return null;

    // Add stock to destination
    for (const item of transfer.items) {
      if (item.dispatchedQuantity > 0) {
        const fromBalance = this.getStockBalance(item.materialId, transfer.fromStoreId, item.batchNumber);
        const rate = fromBalance?.rate || 0;

        this.updateStockBalance(
          item.materialId,
          transfer.toStoreId,
          item.dispatchedQuantity,
          rate,
          'TRANSFER',
          item.batchNumber,
          item.toBinId
        );

        item.receivedQuantity = item.dispatchedQuantity;

        this.addLedgerEntry({
          companyId: transfer.companyId,
          transactionId: uuidv4(),
          transactionDate: new Date().toISOString(),
          materialId: item.materialId,
          materialCode: item.materialCode,
          materialName: item.materialName,
          batchNumber: item.batchNumber,
          lotNumber: item.lotNumber,
          fromLocation: {
            companyId: transfer.companyId,
            storeId: transfer.fromStoreId,
            binId: item.fromBinId,
          },
          toLocation: {
            companyId: transfer.companyId,
            storeId: transfer.toStoreId,
            binId: item.toBinId,
          },
          quantity: item.dispatchedQuantity,
          uom: item.uom,
          rate,
          value: item.dispatchedQuantity * rate,
          transactionType: 'TRANSFER',
          referenceId: transfer.id,
          referenceNumber: transfer.transferNumber,
          userId: receivedById,
          userName: receivedByName,
        });
      }
    }

    transfer.status = 'COMPLETED';
    transfer.receivedById = receivedById;
    transfer.receivedByName = receivedByName;
    transfer.receivedAt = new Date().toISOString();
    transfer.updatedAt = new Date().toISOString();

    return transfer;
  }

  // ============================================================
  // STOCK ADJUSTMENT
  // ============================================================

  createStockAdjustment(data: Omit<StockAdjustment, 'id' | 'createdAt' | 'updatedAt' | 'adjustmentNumber'>): StockAdjustment {
    const adjustment: StockAdjustment = {
      ...data,
      id: uuidv4(),
      adjustmentNumber: this.generateAdjustmentNumber(data.companyId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.stockAdjustments.set(adjustment.id, adjustment);
    return adjustment;
  }

  getStockAdjustment(id: string): StockAdjustment | undefined {
    return this.stockAdjustments.get(id);
  }

  getStockAdjustments(companyId: string, filters?: { storeId?: string; status?: AdjustmentStatus }): StockAdjustment[] {
    let adjustments = Array.from(this.stockAdjustments.values()).filter(a => a.companyId === companyId);
    if (filters?.storeId) {
      adjustments = adjustments.filter(a => a.storeId === filters.storeId);
    }
    if (filters?.status) {
      adjustments = adjustments.filter(a => a.status === filters.status);
    }
    return adjustments;
  }

  approveStockAdjustment(id: string, approvedById: string, approvedByName: string): StockAdjustment | null {
    const adjustment = this.stockAdjustments.get(id);
    if (!adjustment || adjustment.status !== 'PENDING_APPROVAL') return null;

    // Apply adjustments
    for (const item of adjustment.items) {
      this.updateStockBalance(
        item.materialId,
        adjustment.storeId,
        item.adjustedQuantity,
        0, // Rate will be calculated from existing balance
        'ADJUSTMENT',
        item.batchNumber,
        item.binId
      );

      this.addLedgerEntry({
        companyId: adjustment.companyId,
        transactionId: uuidv4(),
        transactionDate: new Date().toISOString(),
        materialId: item.materialId,
        materialCode: item.materialCode,
        materialName: item.materialName,
        batchNumber: item.batchNumber,
        lotNumber: item.lotNumber,
        toLocation: {
          companyId: adjustment.companyId,
          storeId: adjustment.storeId,
          binId: item.binId,
        },
        quantity: item.variance,
        uom: item.uom,
        rate: 0,
        value: 0,
        transactionType: 'ADJUSTMENT',
        referenceId: adjustment.id,
        referenceNumber: adjustment.adjustmentNumber,
        userId: approvedById,
        userName: approvedByName,
        remarks: `${adjustment.reason}: ${adjustment.reasonDescription}`,
      });
    }

    adjustment.status = 'COMPLETED';
    adjustment.approvedById = approvedById;
    adjustment.approvedByName = approvedByName;
    adjustment.approvedAt = new Date().toISOString();
    adjustment.updatedAt = new Date().toISOString();

    return adjustment;
  }

  // ============================================================
  // STOCK RESERVATION
  // ============================================================

  createStockReservation(data: Omit<StockReservation, 'id' | 'createdAt' | 'updatedAt' | 'reservationNumber'>): StockReservation | null {
    // Check stock availability
    for (const item of data.items) {
      const balance = this.getStockBalance(item.materialId, data.storeId, item.batchNumber, item.binId);
      if (!balance || balance.availableQuantity < item.reservedQuantity) {
        return null;
      }
    }

    const reservation: StockReservation = {
      ...data,
      id: uuidv4(),
      reservationNumber: this.generateReservationNumber(data.companyId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Reserve stock
    for (const item of reservation.items) {
      this.reserveStock(item.materialId, data.storeId, item.reservedQuantity, item.batchNumber, item.binId);
    }

    this.stockReservations.set(reservation.id, reservation);
    return reservation;
  }

  getStockReservation(id: string): StockReservation | undefined {
    return this.stockReservations.get(id);
  }

  getStockReservations(companyId: string, filters?: { projectId?: string; status?: ReservationStatus }): StockReservation[] {
    let reservations = Array.from(this.stockReservations.values()).filter(r => r.companyId === companyId);
    if (filters?.projectId) {
      reservations = reservations.filter(r => r.projectId === filters.projectId);
    }
    if (filters?.status) {
      reservations = reservations.filter(r => r.status === filters.status);
    }
    return reservations;
  }

  // ============================================================
  // MIN/MAX STOCK CONFIGURATION
  // ============================================================

  setMinMaxStockConfig(data: Omit<MinMaxStockConfig, 'id' | 'createdAt' | 'updatedAt'>): MinMaxStockConfig {
    const key = `${data.materialId}_${data.storeId}`;
    let config = this.minMaxConfigs.get(key);

    if (config) {
      config = { ...config, ...data, updatedAt: new Date().toISOString() };
    } else {
      config = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    this.minMaxConfigs.set(key, config);
    return config;
  }

  getMinMaxStockConfig(materialId: string, storeId: string): MinMaxStockConfig | undefined {
    const key = `${materialId}_${storeId}`;
    return this.minMaxConfigs.get(key);
  }

  // ============================================================
  // REORDER ALERTS
  // ============================================================

  checkReorderAlerts(companyId: string): ReorderAlert[] {
    const alerts: ReorderAlert[] = [];
    const balances = Array.from(this.stockBalances.values()).filter(b => b.companyId === companyId);

    for (const balance of balances) {
      const config = this.getMinMaxStockConfig(balance.materialId, balance.storeId);
      if (config && balance.availableQuantity <= config.reorderLevel) {
        const store = this.getStore(balance.storeId);
        const alert: ReorderAlert = {
          id: uuidv4(),
          companyId,
          materialId: balance.materialId,
          materialCode: balance.materialCode,
          materialName: balance.materialName,
          storeId: balance.storeId,
          storeName: store?.storeName || '',
          currentStock: balance.availableQuantity,
          reorderLevel: config.reorderLevel,
          shortage: config.reorderLevel - balance.availableQuantity,
          uom: balance.uom,
          alertDate: new Date().toISOString(),
          isAcknowledged: false,
          status: 'ACTIVE',
        };
        alerts.push(alert);
      }
    }

    return alerts;
  }

  // ============================================================
  // DEAD STOCK ANALYSIS
  // ============================================================

  analyzeDeadStock(companyId: string, inactivityDays: number = 180): DeadStockAnalysis[] {
    const deadStock: DeadStockAnalysis[] = [];
    const balances = Array.from(this.stockBalances.values()).filter(b => b.companyId === companyId);
    const now = new Date();

    for (const balance of balances) {
      if (balance.lastMovementDate) {
        const lastMovement = new Date(balance.lastMovementDate);
        const daysInactive = Math.floor((now.getTime() - lastMovement.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysInactive >= inactivityDays && balance.physicalQuantity > 0) {
          const store = this.getStore(balance.storeId);
          deadStock.push({
            materialId: balance.materialId,
            materialCode: balance.materialCode,
            materialName: balance.materialName,
            storeId: balance.storeId,
            storeName: store?.storeName || '',
            quantity: balance.physicalQuantity,
            value: balance.value,
            uom: balance.uom,
            lastMovementDate: balance.lastMovementDate,
            daysInactive,
            batchNumber: balance.batchNumber,
            lotNumber: balance.lotNumber,
          });
        }
      }
    }

    return deadStock;
  }

  // ============================================================
  // SLOW MOVING ANALYSIS
  // ============================================================

  analyzeSlowMoving(companyId: string, periodMonths: number = 6): SlowMovingAnalysis[] {
    const slowMoving: SlowMovingAnalysis[] = [];
    const balances = Array.from(this.stockBalances.values()).filter(b => b.companyId === companyId);
    const ledgerEntries = this.getLedgerEntries();

    for (const balance of balances) {
      const issues = ledgerEntries.filter(e => 
        e.materialId === balance.materialId &&
        e.transactionType === 'ISSUE' &&
        new Date(e.transactionDate) >= new Date(Date.now() - periodMonths * 30 * 24 * 60 * 60 * 1000)
      );

      const issueFrequency = issues.length / periodMonths;
      const totalIssued = issues.reduce((sum, e) => sum + e.quantity, 0);
      const averageIssueQuantity = issues.length > 0 ? totalIssued / issues.length : 0;
      const daysOfStock = averageIssueQuantity > 0 ? balance.physicalQuantity / (averageIssueQuantity / 30) : 999;

      if (issueFrequency < 1 && balance.physicalQuantity > 0) {
        const store = this.getStore(balance.storeId);
        slowMoving.push({
          materialId: balance.materialId,
          materialCode: balance.materialCode,
          materialName: balance.materialName,
          storeId: balance.storeId,
          storeName: store?.storeName || '',
          quantity: balance.physicalQuantity,
          value: balance.value,
          uom: balance.uom,
          issueFrequency,
          averageIssueQuantity,
          daysOfStock,
        });
      }
    }

    return slowMoving;
  }

  // ============================================================
  // STOCK AGEING ANALYSIS
  // ============================================================

  analyzeStockAgeing(companyId: string): StockAgeingAnalysis[] {
    const ageing: StockAgeingAnalysis[] = [];
    const ledgerEntries = this.getLedgerEntries({ transactionType: 'RECEIPT' });
    const now = new Date();

    for (const entry of ledgerEntries) {
      if (entry.toLocation?.companyId === companyId) {
        const receiptDate = new Date(entry.transactionDate);
        const ageDays = Math.floor((now.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let ageCategory: StockAgeingAnalysis['ageCategory'];
        if (ageDays <= 30) ageCategory = '0-30';
        else if (ageDays <= 60) ageCategory = '31-60';
        else if (ageDays <= 90) ageCategory = '61-90';
        else if (ageDays <= 180) ageCategory = '91-180';
        else if (ageDays <= 365) ageCategory = '181-365';
        else ageCategory = '365+';

        const store = entry.toLocation.storeId ? this.getStore(entry.toLocation.storeId) : null;
        
        ageing.push({
          materialId: entry.materialId,
          materialCode: entry.materialCode,
          materialName: entry.materialName,
          storeId: entry.toLocation.storeId || '',
          storeName: store?.storeName || '',
          batchNumber: entry.batchNumber,
          lotNumber: entry.lotNumber,
          receiptDate: entry.transactionDate,
          quantity: entry.quantity,
          value: entry.value,
          uom: entry.uom,
          ageDays,
          ageCategory,
        });
      }
    }

    return ageing;
  }

  // ============================================================
  // MATERIAL RECONCILIATION
  // ============================================================

  createMaterialReconciliation(data: Omit<MaterialReconciliation, 'id' | 'createdAt' | 'updatedAt'>): MaterialReconciliation {
    const reconciliation: MaterialReconciliation = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.reconciliations.set(reconciliation.id, reconciliation);
    return reconciliation;
  }

  getMaterialReconciliation(id: string): MaterialReconciliation | undefined {
    return this.reconciliations.get(id);
  }

  getMaterialReconciliations(companyId: string, filters?: { projectId?: string; materialId?: string }): MaterialReconciliation[] {
    let reconciliations = Array.from(this.reconciliations.values()).filter(r => r.companyId === companyId);
    if (filters?.projectId) {
      reconciliations = reconciliations.filter(r => r.projectId === filters.projectId);
    }
    if (filters?.materialId) {
      reconciliations = reconciliations.filter(r => r.materialId === filters.materialId);
    }
    return reconciliations;
  }

  // ============================================================
  // STOCK VALUATION CONFIGURATION
  // ============================================================

  setValuationConfig(materialId: string, companyId: string, valuationMethod: 'WEIGHTED_AVERAGE' | 'FIFO', userId: string): StockValuationConfig {
    let config = this.valuationConfigs.get(materialId);

    if (config) {
      config.valuationMethod = valuationMethod;
      config.updatedAt = new Date().toISOString();
      config.updatedBy = userId;
    } else {
      config = {
        id: uuidv4(),
        companyId,
        materialId,
        valuationMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userId,
        updatedBy: userId,
      };
    }

    this.valuationConfigs.set(materialId, config);
    return config;
  }

  getValuationConfig(materialId: string): StockValuationConfig | undefined {
    return this.valuationConfigs.get(materialId);
  }

  // ============================================================
  // DASHBOARD KPIs
  // ============================================================

  getStoreDashboardKPIs(companyId: string): StoreDashboardKPIs {
    const balances = Array.from(this.stockBalances.values()).filter(b => b.companyId === companyId);
    const stores = this.getStores(companyId);
    const issues = this.getMaterialIssues(companyId);
    const returns = this.getMaterialReturns(companyId);
    const transfers = this.getStockTransfers(companyId);
    const reconciliations = this.getMaterialReconciliations(companyId);

    const totalStockValue = balances.reduce((sum, b) => sum + b.value, 0);
    const lowStockItems = balances.filter(b => {
      const config = this.getMinMaxStockConfig(b.materialId, b.storeId);
      return config && b.availableQuantity <= config.reorderLevel && b.availableQuantity > 0;
    }).length;
    const negativeStockItems = balances.filter(b => b.physicalQuantity < 0).length;
    const excessStockItems = balances.filter(b => {
      const config = this.getMinMaxStockConfig(b.materialId, b.storeId);
      return config && b.physicalQuantity > config.maximumStock;
    }).length;

    const deadStock = this.analyzeDeadStock(companyId);
    const deadStockValue = deadStock.reduce((sum, d) => sum + d.value, 0);

    const slowMoving = this.analyzeSlowMoving(companyId);
    const slowMovingValue = slowMoving.reduce((sum, s) => sum + s.value, 0);

    const pendingGRN = 0; // Would integrate with PO module
    const pendingQC = 0; // Would integrate with QC module
    const pendingIssues = issues.filter(i => i.status === 'PENDING_APPROVAL' || i.status === 'APPROVED').length;
    const pendingReturns = returns.filter(r => r.status === 'SUBMITTED' || r.status === 'INSPECTED').length;
    const pendingTransfers = transfers.filter(t => t.status === 'DISPATCHED' || t.status === 'IN_TRANSIT').length;
    const pendingReconciliation = reconciliations.filter(r => r.status === 'DRAFT' || r.status === 'SUBMITTED').length;

    const reorderAlerts = this.checkReorderAlerts(companyId).length;

    return {
      totalStockValue,
      lowStockItems,
      negativeStockItems,
      excessStockItems,
      deadStockValue,
      slowMovingValue,
      pendingGRN,
      pendingQC,
      pendingIssues,
      pendingReturns,
      pendingTransfers,
      pendingReconciliation,
      totalMaterials: new Set(balances.map(b => b.materialId)).size,
      totalStores: stores.length,
      reorderAlerts,
    };
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  private generateIssueNumber(companyId: string): string {
    const count = Array.from(this.materialIssues.values()).filter(i => i.companyId === companyId).length + 1;
    return `MI-${companyId.substring(0, 3).toUpperCase()}-${String(count).padStart(5, '0')}`;
  }

  private generateReturnNumber(companyId: string): string {
    const count = Array.from(this.materialReturns.values()).filter(r => r.companyId === companyId).length + 1;
    return `MR-${companyId.substring(0, 3).toUpperCase()}-${String(count).padStart(5, '0')}`;
  }

  private generateTransferNumber(companyId: string): string {
    const count = Array.from(this.stockTransfers.values()).filter(t => t.companyId === companyId).length + 1;
    return `ST-${companyId.substring(0, 3).toUpperCase()}-${String(count).padStart(5, '0')}`;
  }

  private generateAdjustmentNumber(companyId: string): string {
    const count = Array.from(this.stockAdjustments.values()).filter(a => a.companyId === companyId).length + 1;
    return `SA-${companyId.substring(0, 3).toUpperCase()}-${String(count).padStart(5, '0')}`;
  }

  private generateReservationNumber(companyId: string): string {
    const count = Array.from(this.stockReservations.values()).filter(r => r.companyId === companyId).length + 1;
    return `SR-${companyId.substring(0, 3).toUpperCase()}-${String(count).padStart(5, '0')}`;
  }

  getAllStockBalances(companyId: string): StockBalance[] {
    return Array.from(this.stockBalances.values()).filter(b => b.companyId === companyId);
  }
}

export const storeService = StoreService.getInstance();

// ============================================================
// BUILDCORE ERP - STORE & WAREHOUSE DASHBOARD
// Part 17: Complete Store and Warehouse Management System
// ============================================================

import React, { useEffect } from 'react';
import { useStoreStore } from '../../store/storeStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  Package, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, 
  Clock, DollarSign, BarChart3, Warehouse, AlertCircle
} from 'lucide-react';

export function StoreDashboard() {
  const { user } = useAuthStore();
  const { 
    dashboardKPIs,
    stores,
    stockBalances,
    reorderAlerts,
    deadStock,
    slowMoving,
    initialize,
    loadDashboardKPIs,
  } = useStoreStore();

  useEffect(() => {
    if (user) {
      initialize(user.companyId);
      loadDashboardKPIs(user.companyId);
    }
  }, [user]);

  if (!dashboardKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store & Warehouse Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Complete inventory management and stock control
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.totalStockValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.totalMaterials} materials
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Stores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalStores}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Active warehouses
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Warehouse className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.lowStockItems}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Below reorder level
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reorder Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.reorderAlerts}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pending reorder
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dead Stock Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.deadStockValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {deadStock.length} items
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Slow Moving Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.slowMovingValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {slowMoving.length} items
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Issues</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting approval/issue
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Transfers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingTransfers}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                In transit/dispatched
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Normal Stock</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.totalMaterials - dashboardKPIs.lowStockItems - dashboardKPIs.excessStockItems}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Low Stock</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.lowStockItems}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Excess Stock</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.excessStockItems}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Negative Stock</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.negativeStockItems}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Operations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pending GRN</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.pendingGRN}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pending QC</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.pendingQC}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pending Returns</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.pendingReturns}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pending Reconciliation</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.pendingReconciliation}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Reorder Alerts */}
      {reorderAlerts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reorder Alerts</h3>
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded">
              {reorderAlerts.length} alerts
            </span>
          </div>
          <div className="space-y-2">
            {reorderAlerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.materialName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{alert.storeName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {alert.currentStock} {alert.uom}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Reorder: {alert.reorderLevel} {alert.uom}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Dead Stock */}
      {deadStock.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dead Stock Analysis</h3>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded">
              {deadStock.length} items
            </span>
          </div>
          <div className="space-y-2">
            {deadStock.slice(0, 5).map(item => (
              <div key={item.materialId} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.materialName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.storeName} · {item.daysInactive} days inactive
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.value)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.quantity} {item.uom}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Slow Moving Stock */}
      {slowMoving.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Slow Moving Stock</h3>
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded">
              {slowMoving.length} items
            </span>
          </div>
          <div className="space-y-2">
            {slowMoving.slice(0, 5).map(item => (
              <div key={item.materialId} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.materialName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.storeName} · {item.issueFrequency.toFixed(1)} issues/month
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.value)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.daysOfStock.toFixed(0)} days of stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Store List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stores & Warehouses</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {stores.length} stores
          </span>
        </div>
        <div className="space-y-2">
          {stores.slice(0, 5).map(store => {
            const storeBalances = stockBalances.filter(b => b.storeId === store.id);
            const storeValue = storeBalances.reduce((sum, b) => sum + b.value, 0);
            
            return (
              <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Warehouse className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{store.storeName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {store.warehouseType} · {storeBalances.length} materials
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(storeValue)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Stock value
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

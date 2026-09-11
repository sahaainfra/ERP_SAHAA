// ============================================================
// BUILDCORE ERP - PO DASHBOARD
// Part 16: Purchase Order Dashboard Component
// ============================================================

import React, { useEffect } from 'react';
import { usePOStore } from '../../store/poStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  ShoppingCart, Package, FileText, AlertTriangle, 
  CheckCircle2, Clock, TrendingUp, DollarSign
} from 'lucide-react';

export function PODashboard() {
  const { user } = useAuthStore();
  const { 
    dashboardKPIs,
    purchaseOrders,
    initialize,
    loadDashboardKPIs,
  } = usePOStore();

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
          <p className="text-gray-600">Loading purchase order data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Order Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Complete purchase order and delivery lifecycle management
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open PO</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.openPO}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Active purchase orders
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open PO Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.openPOValue / 100000).toFixed(1)} L
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pending delivery value
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Delivered Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.deliveredValue / 100000).toFixed(1)} L
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Materials received
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Balance Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.balanceValue / 100000).toFixed(1)} L
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pending delivery
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.overdueDeliveries}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Past due date
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending GRN</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingGRN}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting receipt
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending QC</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingQC}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Quality check pending
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">3-Way Mismatch</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.threeWayMismatch}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PO-GRN-Invoice mismatch
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total PO Value</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{(dashboardKPIs.totalPOValue / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Delivery Time</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.averageDeliveryTime} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vendor Performance</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.vendorPerformanceScore}%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PO Pipeline</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Open POs</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dashboardKPIs.openPO}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(dashboardKPIs.openPO / Math.max(dashboardKPIs.openPO, 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending GRN</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dashboardKPIs.pendingGRN}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(dashboardKPIs.pendingGRN / Math.max(dashboardKPIs.openPO, 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending QC</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dashboardKPIs.pendingQC}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(dashboardKPIs.pendingQC / Math.max(dashboardKPIs.pendingGRN, 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Invoice Pending</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dashboardKPIs.invoicePending}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(dashboardKPIs.invoicePending / Math.max(dashboardKPIs.pendingGRN, 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Purchase Orders */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Purchase Orders</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {purchaseOrders.length} total
          </span>
        </div>
        <div className="space-y-3">
          {purchaseOrders.slice(0, 5).map(po => (
            <div key={po.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {po.poNumber}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    po.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    po.status === 'ISSUED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    po.status === 'PARTIALLY_RECEIVED' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    po.status === 'RECEIVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {po.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Vendor: {po.vendorName}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Value: ₹{(po.grandTotal / 1000).toFixed(1)}K</span>
                  <span>Items: {po.items.length}</span>
                  <span>Date: {new Date(po.poDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// BUILDCORE ERP - PROCUREMENT DASHBOARD
// Part 15: Complete End-to-End Procurement Module
// ============================================================

import React, { useEffect } from 'react';
import { useProcurementStore } from '../../store/procurementStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  ShoppingCart, FileText, FileCheck, Clock, AlertTriangle, 
  TrendingUp, DollarSign, Package, CheckCircle2, XCircle
} from 'lucide-react';

export function ProcurementDashboard() {
  const { user } = useAuthStore();
  const { 
    dashboardKPIs,
    materialRequisitions,
    purchaseRequisitions,
    rfqs,
    purchaseOrders,
    initialize,
    loadDashboardKPIs,
  } = useProcurementStore();

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
          <p className="text-gray-600">Loading procurement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procurement Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          End-to-end procurement management and tracking
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open MR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.openMR}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Material requisitions
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open PR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.openPR}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Purchase requisitions
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active RFQ</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.activeRFQ}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Requests for quotation
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approval Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.approvalPending}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting approval
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quotation Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.quotationPending}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting vendor quotes
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FileCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">PO Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.poPending}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Purchase orders issued
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Delayed Procurement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.delayedProcurement}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Past delivery date
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.totalSavings / 100000).toFixed(1)} L
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Procurement savings
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Procurement Value & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Procurement Value</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Procurement Value</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{(dashboardKPIs.totalProcurementValue / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Procurement Time</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.averageProcurementTime} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">On-Time Delivery</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.onTimeDeliveryPercent.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Procurement Pipeline</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Material Requisitions</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {materialRequisitions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(materialRequisitions.length / 100) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Purchase Requisitions</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {purchaseRequisitions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(purchaseRequisitions.length / 100) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">RFQs</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {rfqs.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(rfqs.length / 100) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Purchase Orders</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {purchaseOrders.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(purchaseOrders.length / 100) * 100}%` }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Procurement Activity</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {materialRequisitions.length + purchaseRequisitions.length + rfqs.length + purchaseOrders.length} total
          </span>
        </div>
        <div className="space-y-3">
          {[...materialRequisitions.slice(0, 2), ...purchaseRequisitions.slice(0, 2), ...rfqs.slice(0, 1)].slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {'mrNumber' in item ? item.mrNumber : 'prNumber' in item ? item.prNumber : 'rfqNumber' in item ? item.rfqNumber : ''}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    item.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    item.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {'materialName' in item ? item.materialName : 'projectName' in item ? item.projectName : ''}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Required: {new Date((item as any).requiredDate || (item as any).quotationDeadline || (item as any).createdAt).toLocaleDateString()}</span>
                  <span>Created: {new Date((item as any).createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

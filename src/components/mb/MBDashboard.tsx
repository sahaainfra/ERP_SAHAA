// ============================================================
// BUILDCORE ERP - MEASUREMENT BOOK DASHBOARD
// Part 21: Advanced Measurement Book (MB) / e-MB Module
// ============================================================

import React, { useEffect } from 'react';
import { useMBStore } from '../../store/mbStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  FileText, CheckCircle, Clock, AlertTriangle, TrendingUp,
  Package, DollarSign, Calendar
} from 'lucide-react';

export function MBDashboard() {
  const { dashboardKPIs, loadDashboardKPIs, isLoading } = useMBStore();

  useEffect(() => {
    const companyId = 'COMPANY_001'; // Would come from auth context
    loadDashboardKPIs(companyId);
  }, []);

  if (isLoading || !dashboardKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Measurement Book Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of all measurement books and key metrics
          </p>
        </div>
        <Button variant="primary" icon={<FileText className="w-4 h-4" />}>
          Create New MB
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total MB</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalMB}
              </p>
              <p className="text-xs text-gray-500 mt-1">All measurement books</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Draft MB</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.draftMB}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pending submission</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingMB}
              </p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Certified MB</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.certifiedMB}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ready for billing</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quantity KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Quantity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.currentQuantity.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Current period measurement</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cumulative Quantity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.cumulativeQuantity.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total measured to date</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Billing Ready</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.billingReadyQuantity.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ready for RA bill</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Excess Quantity</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {dashboardKPIs.excessQuantity.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Requires approval</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Value KPI */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Measured Value</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              ₹{dashboardKPIs.totalValue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total value of all measurements</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>

      {/* Status Distribution */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">MB Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Draft</span>
              <StatusBadge status="DRAFT" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.draftMB}</p>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <StatusBadge status="SUBMITTED" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.pendingMB}</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
              <StatusBadge status="APPROVED" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.approvedMB}</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Certified</span>
              <StatusBadge status="CERTIFIED" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.certifiedMB}</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">MB Created</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">MB/PROJ001/2024/000001</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</p>
              <p className="text-xs text-gray-500">By John Doe</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">MB Certified</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">MB/PROJ001/2024/000002</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">5 hours ago</p>
              <p className="text-xs text-gray-500">By Client</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">MB Submitted</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">MB/PROJ001/2024/000003</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">1 day ago</p>
              <p className="text-xs text-gray-500">By Site Engineer</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

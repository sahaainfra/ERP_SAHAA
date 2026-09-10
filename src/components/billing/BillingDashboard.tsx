// ============================================================
// BUILDCORE ERP - BILLING DASHBOARD
// Part 22: RA Bill / Client Billing / Subcontractor Billing
// ============================================================

import React, { useEffect } from 'react';
import { useBillingStore } from '../../store/billingStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  FileText, CheckCircle, Clock, AlertTriangle, TrendingUp,
  DollarSign, Calendar, CreditCard
} from 'lucide-react';

export function BillingDashboard() {
  const { dashboardKPIs, loadDashboardKPIs, isLoading } = useBillingStore();

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of all billing activities and financial metrics
          </p>
        </div>
        <Button variant="primary" icon={<FileText className="w-4 h-4" />}>
          Create New Bill
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bills Prepared</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.billsPrepared}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total bills created</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingApproval}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Certified</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.certified}
              </p>
              <p className="text-xs text-gray-500 mt-1">Client certified</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.paid}
              </p>
              <p className="text-xs text-gray-500 mt-1">Payment received</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                ₹{dashboardKPIs.outstanding.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pending payment</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Retention</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{dashboardKPIs.retention.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Retention amount</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Billing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{dashboardKPIs.monthlyBilling.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Current month</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cumulative Billing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{dashboardKPIs.cumulativeBilling.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total billed to date</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Draft</span>
              <StatusBadge status="DRAFT" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {dashboardKPIs.billsPrepared - dashboardKPIs.pendingApproval - dashboardKPIs.certified - dashboardKPIs.paid}
            </p>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <StatusBadge status="SUBMITTED" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.pendingApproval}</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Certified</span>
              <StatusBadge status="CERTIFIED" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.certified}</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Paid</span>
              <StatusBadge status="PAID" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardKPIs.paid}</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Billing Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">RA Bill Created</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">RA-2024-000001</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">₹5,00,000</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Bill Certified</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">RA-2024-000002</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">₹8,50,000</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Received</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">RA-2024-000003</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">₹12,00,000</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// BUILDCORE ERP - BOQ DASHBOARD
// Part 10: Complete BOQ and Estimation Management System
// ============================================================

import React, { useEffect } from 'react';
import { useBOQStore } from '../../store/boqStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  FileText, Package, Calculator, TrendingUp, 
  DollarSign, BarChart3, AlertTriangle, CheckCircle2
} from 'lucide-react';

export function BOQDashboard() {
  const { user } = useAuthStore();
  const { 
    initialize,
    boqs,
    dashboardKPIs,
    loadDashboardKPIs,
  } = useBOQStore();

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
          <p className="text-gray-600">Loading BOQ data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BOQ & Estimation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Bill of Quantities and construction estimation management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total BOQs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalBOQs}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.totalBOQItems} items
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total BOQ Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.totalBOQValue / 10000000).toFixed(0)} Cr
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Estimated: ₹{(dashboardKPIs.estimatedCost / 10000000).toFixed(0)} Cr
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Margin</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.marginPercent.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ₹{(dashboardKPIs.margin / 100000).toFixed(0)} L
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingApprovals}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.missingRates} missing rates
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Validation Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.validationErrors}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Errors</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.validationWarnings}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Warnings</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.revisionCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Revisions</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {boqs.filter(b => b.status === 'APPROVED' || b.status === 'FROZEN').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
            </div>
          </div>
        </Card>
      </div>

      {/* BOQ List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">BOQ Register</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {boqs.length} BOQs
          </span>
        </div>
        <div className="space-y-3">
          {boqs.map(boq => (
            <div key={boq.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {boq.boqNumber}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    boq.status === 'FROZEN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    boq.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    boq.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {boq.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {boq.title}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Items: {boq.totalItems}</span>
                  <span>Value: ₹{(boq.totalAmount / 100000).toFixed(0)} L</span>
                  <span>Revision: {boq.revision}</span>
                  <span>Type: {boq.revisionType.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

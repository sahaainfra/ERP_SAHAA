// ============================================================
// BUILDCORE ERP - RATE LIBRARY DASHBOARD
// Part 09: Professional Rate Library and Rate Analysis Engine
// ============================================================

import React, { useEffect } from 'react';
import { useRateStore } from '../../store/rateStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  BookOpen, Package, Users, Calculator, TrendingUp, 
  DollarSign, BarChart3, FileText, Clock, CheckCircle2
} from 'lucide-react';

export function RateDashboard() {
  const { user } = useAuthStore();
  const { 
    initialize,
    rateLibraries,
    resources,
    rateAnalyses,
    estimates,
    dashboardKPIs,
    loadDashboardKPIs,
  } = useRateStore();

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
          <p className="text-gray-600">Loading rate data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rate Library & Analysis</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Professional rate management and construction estimation engine
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rate Libraries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {rateLibraries.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {rateLibraries.filter(l => l.isOfficial).length} official
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Resources</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {resources.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Materials, Labour, Plant
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Rate Analyses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {rateAnalyses.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {rateAnalyses.filter(a => a.isTemplate).length} templates
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalEstimates}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ₹{(dashboardKPIs.totalEstimateValue / 10000000).toFixed(0)} Cr value
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.pendingApproval}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending Approval</p>
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
                {dashboardKPIs.tenderEstimates}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tender Estimates</p>
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
                {dashboardKPIs.approvedEstimates}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(dashboardKPIs.averageRate / 100000).toFixed(0)}L
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Estimate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cost Component Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost Component Breakdown</h3>
        <div className="space-y-3">
          {dashboardKPIs.topCostComponents.map((component, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{component.name}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {component.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' :
                    'bg-pink-500'
                  }`}
                  style={{ width: `${component.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rate Libraries */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rate Libraries</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {rateLibraries.length} libraries
          </span>
        </div>
        <div className="space-y-3">
          {rateLibraries.map(library => (
            <div key={library.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {library.libraryName}
                  </p>
                  {library.isOfficial && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
                      Official
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Authority: {library.authority}</span>
                  <span>Year: {library.year}</span>
                  <span>Items: {library.itemCount}</span>
                  <span>Category: {library.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Resources Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resources</h3>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
            {resources.length} resources
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'MATERIAL', label: 'Materials', color: 'bg-blue-500' },
            { type: 'LABOUR', label: 'Labour', color: 'bg-green-500' },
            { type: 'PLANT', label: 'Plant', color: 'bg-purple-500' },
            { type: 'SUBCONTRACT', label: 'Subcontract', color: 'bg-orange-500' },
          ].map((item, i) => {
            const count = resources.filter(r => r.resourceType === item.type).length;
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

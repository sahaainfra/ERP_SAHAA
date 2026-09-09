// ============================================================
// BUILDCORE ERP - COMMERCIAL DASHBOARD
// Part 12: Complete Commercial Change-Control System
// ============================================================

import React, { useEffect, useState } from 'react';
import { useCommercialStore } from '../../store/commercialStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  FileText, DollarSign, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Calendar, AlertCircle, Activity
} from 'lucide-react';

export function CommercialDashboard() {
  const { user } = useAuthStore();
  const { 
    dashboardKPIs,
    alerts,
    loadDashboardKPIs,
    acknowledgeAlert,
  } = useCommercialStore();

  const [selectedContractId] = useState('contract_001'); // Demo contract
  const [selectedProjectId] = useState('proj_001'); // Demo project

  useEffect(() => {
    if (user && selectedProjectId && selectedContractId) {
      loadDashboardKPIs(selectedProjectId, selectedContractId);
    }
  }, [user, selectedProjectId, selectedContractId, loadDashboardKPIs]);

  if (!dashboardKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading commercial data...</p>
        </div>
      </div>
    );
  }

  const unacknowledgedAlerts = alerts.filter(a => !a.isAcknowledged);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Commercial Change Control</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Variations, claims, EOT, and commercial impact management
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Variations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalVariations}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.pendingVariations} pending
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Variation Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.variationValue / 100000).toFixed(0)} L
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.approvedVariations} approved
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Claims</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalClaims}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.pendingClaims} pending
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Claim Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.claimValue / 100000).toFixed(0)} L
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.approvedClaims} approved
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">EOT Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.eotRequests}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.approvedEOT} approved
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">EOT Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalEOTDays}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Approved extension
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Delay Days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.delayDays}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total delays
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Potential Recovery</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.potentialRecovery / 100000).toFixed(0)} L
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From approved claims
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.pendingExtraItems}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending Extra Items</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(dashboardKPIs.extraItemValue / 100000).toFixed(0)} L
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Extra Item Value</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.deviationAlerts}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deviation Alerts</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {unacknowledgedAlerts.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Alerts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Claim Ageing Analysis */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Claim Ageing Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardKPIs.claimAgeing.map((bucket, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{bucket.bucket} days</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{bucket.count}</p>
              <p className="text-xs text-gray-500 mt-1">
                ₹{(bucket.value / 100000).toFixed(0)} L
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h3>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded">
              {unacknowledgedAlerts.length} alerts
            </span>
          </div>
          <div className="space-y-3">
            {unacknowledgedAlerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30' :
                  alert.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30' :
                  alert.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                    alert.severity === 'HIGH' ? 'text-orange-600 dark:text-orange-400' :
                    alert.severity === 'MEDIUM' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                  {alert.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(alert.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => user && acknowledgeAlert(alert.id, user.id)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

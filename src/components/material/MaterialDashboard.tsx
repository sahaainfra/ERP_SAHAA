// ============================================================
// BUILDCORE ERP - MATERIAL DASHBOARD
// Part 13: Central Material Master and Material Management Engine
// ============================================================

import React, { useEffect } from 'react';
import { useMaterialStore } from '../../store/materialStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  Package, CheckCircle2, Clock, AlertTriangle, 
  FolderTree, Users, Bell, FileWarning, Shield, AlertCircle
} from 'lucide-react';

export function MaterialDashboard() {
  const { user } = useAuthStore();
  const { 
    materials,
    dashboardKPIs,
    rateAlerts,
    initialize,
    loadDashboardKPIs,
  } = useMaterialStore();

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
          <p className="text-gray-600">Loading material data...</p>
        </div>
      </div>
    );
  }

  const unacknowledgedAlerts = rateAlerts.filter(a => !a.isAcknowledged);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Material Master</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Central material management and cataloging system
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Materials</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalMaterials}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.approvedMaterials} approved
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingApproval}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting review
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Blocked Materials</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.blockedMaterials}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cannot be used
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Rate Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.rateAlerts}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Unacknowledged
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalCategories}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Material categories
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FolderTree className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">With Vendors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.materialsWithVendors}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.materialsWithoutVendors} without vendors
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hazardous</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.hazardousMaterials}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Require MSDS
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Require QC</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.materialsRequiringQC}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Quality inspection
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FolderTree className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.totalGroups}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Material Groups</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FileWarning className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.expiringDocuments}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Expiring Documents</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Rate Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rate Alerts</h3>
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded">
              {unacknowledgedAlerts.length} alerts
            </span>
          </div>
          <div className="space-y-3">
            {unacknowledgedAlerts.slice(0, 5).map(alert => {
              const material = materials.find(m => m.id === alert.materialId);
              return (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30' :
                    alert.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <AlertCircle className={`w-5 h-5 ${
                      alert.severity === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                      alert.severity === 'HIGH' ? 'text-orange-600 dark:text-orange-400' :
                      alert.severity === 'MEDIUM' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {material?.materialName || 'Unknown Material'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Current: ₹{alert.currentRate.toFixed(2)}</span>
                      {alert.previousRate && (
                        <span>Previous: ₹{alert.previousRate.toFixed(2)}</span>
                      )}
                      {alert.variancePercent !== undefined && (
                        <span className={alert.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}>
                          {alert.variancePercent > 0 ? '+' : ''}{alert.variancePercent.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Materials */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Materials</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {materials.length} total
          </span>
        </div>
        <div className="space-y-3">
          {materials.slice(0, 5).map(material => (
            <div key={material.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {material.materialName}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    material.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    material.status === 'BLOCKED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    material.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {material.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {material.materialCode} · {material.materialCategory}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>UOM: {material.primaryUOM}</span>
                  {material.brand && <span>Brand: {material.brand}</span>}
                  <span>Vendors: {material.approvedVendors.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

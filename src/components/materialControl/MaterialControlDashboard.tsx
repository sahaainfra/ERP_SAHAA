// ============================================================
// BUILDCORE ERP - MATERIAL CONTROL DASHBOARD
// Part 19: Advanced Material Control and Cost-Analytics Engine
// ============================================================

import React, { useEffect } from 'react';
import { useMaterialControlStore } from '../../store/materialControlStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  Package, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  DollarSign, BarChart3, Target, AlertCircle, Clock,
  RefreshCw, Eye, Edit, Plus
} from 'lucide-react';

export function MaterialControlDashboard() {
  const {
    dashboardKPIs,
    consumptions,
    variances,
    wastages,
    reconciliations,
    forecasts,
    procurementPlans,
    losses,
    damages,
    alerts,
    isLoading,
    loadDashboardKPIs,
    loadConsumptions,
    loadVariances,
    loadWastages,
    loadReconciliations,
    loadForecasts,
    loadProcurementPlans,
    loadLosses,
    loadDamages,
    loadAlerts,
    acknowledgeAlert,
    projectId
  } = useMaterialControlStore();

  useEffect(() => {
    // Load all data
    const companyId = 'company-001'; // This would come from auth context
    const currentProjectId = projectId || 'project-001'; // This would come from context

    loadDashboardKPIs(companyId, currentProjectId);
    loadConsumptions();
    loadVariances();
    loadWastages();
    loadReconciliations();
    loadForecasts();
    loadProcurementPlans();
    loadLosses();
    loadDamages();
    loadAlerts(companyId);
  }, [projectId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const getVarianceColor = (variancePercent: number) => {
    if (variancePercent > 10) return 'text-red-600 bg-red-50';
    if (variancePercent > 5) return 'text-orange-600 bg-orange-50';
    if (variancePercent < -5) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading && !dashboardKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading material control data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Material Control & Cost Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Advanced material tracking, variance analysis, and cost optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New Entry
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {dashboardKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Material Budget</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(dashboardKPIs.materialBudget)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total allocated budget
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Consumed Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(dashboardKPIs.consumedValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((dashboardKPIs.consumedValue / dashboardKPIs.materialBudget) * 100).toFixed(1)}% of budget
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Variance</p>
                <p className={`text-2xl font-bold mt-1 ${dashboardKPIs.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {dashboardKPIs.variancePercent > 0 ? '+' : ''}{dashboardKPIs.variancePercent.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(Math.abs(dashboardKPIs.varianceValue))} {dashboardKPIs.varianceValue > 0 ? 'over' : 'under'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${dashboardKPIs.variancePercent > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                <TrendingDown className={`w-6 h-6 ${dashboardKPIs.variancePercent > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wastage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardKPIs.wastagePercent.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(dashboardKPIs.wastageValue)} value
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Second Row KPIs */}
      {dashboardKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatNumber(dashboardKPIs.totalMaterials)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Active materials
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Critical Stock</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {dashboardKPIs.criticalStock}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Materials at critical level
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {dashboardKPIs.lowStock}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Below reorder level
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dead Stock</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {dashboardKPIs.deadStock}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  No movement {'>'}180 days
                </p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h3>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
              {alerts.filter(a => !a.isAcknowledged).length}
            </span>
          </div>
          <div className="space-y-2">
            {alerts.filter(a => !a.isAcknowledged).slice(0, 5).map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <p className="text-sm font-medium">{alert.title}</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-6">
                      {alert.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id, 'current-user')}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Consumption & Variance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Consumption</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {consumptions.slice(0, 5).map(consumption => (
              <div key={consumption.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {consumption.materialName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {consumption.netConsumption} {consumption.uom} consumed
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getVarianceColor(consumption.variancePercent)}`}>
                    {consumption.variancePercent > 0 ? '+' : ''}{consumption.variancePercent.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500">vs theoretical</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Variance Analysis</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {variances.slice(0, 5).map(variance => (
              <div key={variance.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {variance.materialName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Period: {variance.period}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getVarianceColor(variance.variancePercent)}`}>
                    {variance.variancePercent > 0 ? '+' : ''}{variance.variancePercent.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {variance.variance > 0 ? 'Excess' : 'Shortage'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Forecasts & Procurement Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Material Forecasts</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {forecasts.slice(0, 5).map(forecast => (
              <div key={forecast.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {forecast.materialName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Required: {forecast.requiredQuantity} {forecast.uom}
                    </p>
                  </div>
                  {forecast.shortageFlag && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        Shortage: {forecast.potentialShortage} {forecast.uom}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expected: {new Date(forecast.expectedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procurement Plans</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {procurementPlans.slice(0, 5).map(plan => (
              <div key={plan.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.materialName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Suggested: {plan.suggestedProcurement} {plan.uom}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={plan.priority} />
                    {plan.estimatedValue && (
                      <p className="text-xs text-gray-500 mt-1">
                        Est: {formatCurrency(plan.estimatedValue)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Losses & Damages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Material Losses</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {losses.slice(0, 5).map(loss => (
              <div key={loss.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {loss.materialName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {loss.quantity} {loss.uom} - {loss.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {formatCurrency(loss.estimatedValue)}
                    </p>
                    <StatusBadge status={loss.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Material Damages</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {damages.slice(0, 5).map(damage => (
              <div key={damage.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {damage.materialName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {damage.quantity} {damage.uom} - {damage.damageType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {formatCurrency(damage.estimatedValue)}
                    </p>
                    <StatusBadge status={damage.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reconciliation Status */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reconciliation Status</h3>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Reconciled</p>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {reconciliations.filter(r => r.status === 'RECONCILED').length}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Pending</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {reconciliations.filter(r => r.status === 'PENDING').length}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Discrepancy</p>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {reconciliations.filter(r => r.status === 'DISCREPANCY').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// BUILDCORE ERP - PLANNING DASHBOARD
// Part 07: Advanced Construction Planning & Project Controls
// ============================================================

import React, { useEffect } from 'react';
import { usePlanningStore } from '../../store/planningStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  Calendar, TrendingUp, AlertTriangle, CheckCircle2, Clock, 
  Target, Activity, DollarSign, BarChart3, Flag, AlertCircle
} from 'lucide-react';

export function PlanningDashboard() {
  const { user } = useAuthStore();
  const { 
    initialize, 
    selectedProjectId, 
    dashboardKPIs, 
    activities, 
    milestones, 
    constraints,
    loadDashboardKPIs,
    calculatePhysicalProgress,
    calculateFinancialProgress,
    calculateScheduleVariance,
    calculateEarnedValue
  } = usePlanningStore();

  useEffect(() => {
    if (user && selectedProjectId) {
      initialize(user.companyId, selectedProjectId, user.id);
      // Load calculations for demo project (Mumbai-Pune Expressway)
      loadDashboardKPIs(selectedProjectId, 4850000000);
      calculatePhysicalProgress(selectedProjectId);
      calculateFinancialProgress(selectedProjectId, 4850000000);
      calculateScheduleVariance(selectedProjectId);
      calculateEarnedValue(selectedProjectId, 4850000000);
    }
  }, [user, selectedProjectId]);

  if (!dashboardKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading planning data...</p>
        </div>
      </div>
    );
  }

  const criticalActivities = activities.filter(a => a.isCritical);
  const delayedActivities = activities.filter(a => a.isDelayed);
  const upcomingMilestones = milestones.filter(m => !m.isAchieved && m.status !== 'DELAYED').slice(0, 5);
  const openConstraints = constraints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planning Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Advanced construction planning and project controls
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Planned Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.plannedProgress.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Actual Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.actualProgress.toFixed(1)}%
              </p>
              <p className={`text-xs mt-1 ${dashboardKPIs.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dashboardKPIs.variance >= 0 ? '+' : ''}{dashboardKPIs.variance.toFixed(1)}%
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Schedule Variance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.scheduleVarianceDays.toFixed(0)} days
              </p>
              <p className={`text-xs mt-1 ${dashboardKPIs.scheduleVarianceDays <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dashboardKPIs.scheduleVarianceDays <= 0 ? 'On track' : 'Delayed'}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Cost Performance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.cpi.toFixed(2)}
              </p>
              <p className={`text-xs mt-1 ${dashboardKPIs.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                {dashboardKPIs.cpi >= 1 ? 'Under budget' : 'Over budget'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Flag className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.criticalActivities}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Critical Activities</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.delayedActivities}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Delayed Activities</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.upcomingMilestones}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming Milestones</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.openConstraints}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Open Constraints</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Critical Activities</h3>
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded">
              {criticalActivities.length}
            </span>
          </div>
          <div className="space-y-3">
            {criticalActivities.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Flag className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.activityCode} - {activity.activityName}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Progress: {activity.progress}%</span>
                    <span>Duration: {activity.duration} days</span>
                    {activity.isDelayed && (
                      <span className="text-red-600 dark:text-red-400 font-medium">Delayed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Milestones */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Milestones</h3>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
              {upcomingMilestones.length}
            </span>
          </div>
          <div className="space-y-3">
            {upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {milestone.milestoneName}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Baseline: {new Date(milestone.baselineDate).toLocaleDateString()}</span>
                    <span>Forecast: {new Date(milestone.forecastDate).toLocaleDateString()}</span>
                    {milestone.varianceDays > 0 && (
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        +{milestone.varianceDays} days
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Open Constraints */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Open Constraints</h3>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded">
              {openConstraints.length}
            </span>
          </div>
          <div className="space-y-3">
            {openConstraints.slice(0, 5).map(constraint => (
              <div key={constraint.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {constraint.constraintType}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {constraint.constraintDescription}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Owner: {constraint.ownerName}</span>
                    <span>Required by: {new Date(constraint.requiredBy).toLocaleDateString()}</span>
                    <span className={`font-medium ${
                      constraint.impact === 'CRITICAL' ? 'text-red-600 dark:text-red-400' :
                      constraint.impact === 'MAJOR' ? 'text-orange-600 dark:text-orange-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {constraint.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Schedule Performance Index (SPI)</span>
                <span className={`text-sm font-bold ${dashboardKPIs.spi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardKPIs.spi.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${dashboardKPIs.spi >= 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(dashboardKPIs.spi * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cost Performance Index (CPI)</span>
                <span className={`text-sm font-bold ${dashboardKPIs.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardKPIs.cpi.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${dashboardKPIs.cpi >= 1 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(dashboardKPIs.cpi * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Productivity</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {dashboardKPIs.averageProductivity.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${Math.min(dashboardKPIs.averageProductivity * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Forecast Completion</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(dashboardKPIs.forecastCompletionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

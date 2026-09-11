// ============================================================
// BUILDCORE ERP - BUSINESS INTELLIGENCE DASHBOARD
// Part 05: Real-Time Management Dashboard & Business Intelligence
// ============================================================

import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAuthStore } from '../../store';
import { KPICard } from './widgets/KPICard';
import { SCurveChart } from './widgets/SCurveChart';
import { TrendChart } from './widgets/TrendChart';
import { ProfitabilityPanel } from './widgets/ProfitabilityPanel';
import { AlertCenter } from './widgets/AlertCenter';
import { ActivityFeed } from './widgets/ActivityFeed';
import { RefreshCw, Download, Calendar, Filter } from 'lucide-react';
import type { DashboardRoleType } from '../../types/dashboard';

export const BIDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const {
    currentDashboard,
    superAdminKPIs,
    directorKPIs,
    projectManagerKPIs,
    siteEngineerKPIs,
    sCurveData,
    trendData,
    projectProfitability,
    alerts,
    alertCounts,
    isRefreshing,
    lastUpdated,
    loadDashboard,
    loadSuperAdminKPIs,
    loadDirectorKPIs,
    loadProjectManagerKPIs,
    loadSiteEngineerKPIs,
    loadSCurveData,
    loadTrendData,
    loadProjectProfitability,
    loadAlerts,
    refreshAll,
  } = useDashboardStore();

  const [selectedRole, setSelectedRole] = useState<DashboardRoleType>('DIRECTOR');
  const [selectedProject, setSelectedProject] = useState<string>('proj_001');
  const [trendPeriod, setTrendPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');

  useEffect(() => {
    if (user) {
      // Determine default role based on user designation
      const defaultRole = getRoleForUser(user.designation);
      setSelectedRole(defaultRole);
      
      // Initial load
      refreshAll(user.companyId, defaultRole);
      loadSCurveData(selectedProject);
      loadTrendData('TOTAL_CONTRACT_VALUE', trendPeriod);
      loadProjectProfitability(selectedProject);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshAll(user.companyId, selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    loadSCurveData(selectedProject);
    loadProjectProfitability(selectedProject);
  }, [selectedProject]);

  useEffect(() => {
    loadTrendData('TOTAL_CONTRACT_VALUE', trendPeriod);
  }, [trendPeriod]);

  const getRoleForUser = (designation?: string): DashboardRoleType => {
    if (!designation) return 'DIRECTOR';
    
    const desig = designation.toLowerCase();
    if (desig.includes('admin') || desig.includes('super')) {
      return 'SUPER_ADMIN';
    }
    if (desig.includes('director') || desig.includes('management') || desig.includes('ceo') || desig.includes('md')) {
      return 'DIRECTOR';
    }
    if (desig.includes('project manager') || desig.includes('pm')) {
      return 'PROJECT_MANAGER';
    }
    if (desig.includes('site engineer') || desig.includes('engineer')) {
      return 'SITE_ENGINEER';
    }
    return 'DIRECTOR';
  };

  const handleRefresh = () => {
    if (user) {
      refreshAll(user.companyId, selectedRole);
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting dashboard...');
  };

  const renderRoleKPIs = () => {
    switch (selectedRole) {
      case 'SUPER_ADMIN':
        return superAdminKPIs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Companies"
              value={superAdminKPIs.totalCompanies}
              icon="building"
              color="blue"
            />
            <KPICard
              title="Active Users"
              value={superAdminKPIs.activeUsers}
              subtitle={`of ${superAdminKPIs.totalUsers} total`}
              icon="users"
              color="green"
            />
            <KPICard
              title="Total Projects"
              value={superAdminKPIs.totalProjects}
              icon="folder"
              color="purple"
            />
            <KPICard
              title="Pending Approvals"
              value={superAdminKPIs.pendingApprovals}
              icon="clock"
              color="orange"
            />
            <KPICard
              title="Security Alerts"
              value={superAdminKPIs.securityAlerts}
              icon="shield"
              color="red"
            />
            <KPICard
              title="Failed Logins Today"
              value={superAdminKPIs.failedLoginsToday}
              icon="alert-triangle"
              color="yellow"
            />
            <KPICard
              title="Workflow Bottlenecks"
              value={superAdminKPIs.workflowBottlenecks}
              icon="alert-circle"
              color="orange"
            />
            <KPICard
              title="System Health"
              value={superAdminKPIs.systemHealth}
              icon="activity"
              color={superAdminKPIs.systemHealth === 'HEALTHY' ? 'green' : 'red'}
            />
          </div>
        ) : null;

      case 'DIRECTOR':
        return directorKPIs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Contract Value"
              value={directorKPIs.totalContractValue}
              format="currency"
              icon="trending-up"
              color="blue"
            />
            <KPICard
              title="Work Executed"
              value={directorKPIs.workExecuted}
              format="currency"
              icon="check-circle"
              color="green"
            />
            <KPICard
              title="Certified Billing"
              value={directorKPIs.certifiedBilling}
              format="currency"
              icon="file-text"
              color="purple"
            />
            <KPICard
              title="Collections"
              value={directorKPIs.collections}
              format="currency"
              icon="dollar-sign"
              color="emerald"
            />
            <KPICard
              title="Outstanding Receivables"
              value={directorKPIs.outstandingReceivables}
              format="currency"
              icon="alert-circle"
              color="orange"
            />
            <KPICard
              title="Cash/Bank Balance"
              value={directorKPIs.cashBankBalance}
              format="currency"
              icon="wallet"
              color="teal"
            />
            <KPICard
              title="Physical Progress"
              value={directorKPIs.physicalProgress}
              format="percent"
              icon="bar-chart"
              color="blue"
            />
            <KPICard
              title="Financial Progress"
              value={directorKPIs.financialProgress}
              format="percent"
              icon="trending-up"
              color="green"
            />
            <KPICard
              title="Project Profitability"
              value={directorKPIs.projectProfitability}
              format="percent"
              icon="pie-chart"
              color="purple"
            />
            <KPICard
              title="Safety Score"
              value={directorKPIs.safetyScore}
              format="number"
              icon="shield"
              color="green"
            />
            <KPICard
              title="Quality Score"
              value={directorKPIs.qualityScore}
              format="number"
              icon="award"
              color="blue"
            />
            <KPICard
              title="Delayed Projects"
              value={directorKPIs.delayedProjects}
              icon="alert-triangle"
              color={directorKPIs.delayedProjects > 0 ? 'red' : 'green'}
            />
          </div>
        ) : null;

      case 'PROJECT_MANAGER':
        return projectManagerKPIs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Project Progress"
              value={projectManagerKPIs.projectProgress}
              format="percent"
              icon="trending-up"
              color="blue"
            />
            <KPICard
              title="Contract Value"
              value={projectManagerKPIs.contractValue}
              format="currency"
              icon="file-text"
              color="purple"
            />
            <KPICard
              title="BOQ Execution"
              value={projectManagerKPIs.boqExecution}
              format="percent"
              icon="check-square"
              color="green"
            />
            <KPICard
              title="Billing"
              value={projectManagerKPIs.billing}
              format="currency"
              icon="dollar-sign"
              color="emerald"
            />
            <KPICard
              title="Receivables"
              value={projectManagerKPIs.receivables}
              format="currency"
              icon="alert-circle"
              color="orange"
            />
            <KPICard
              title="Manpower"
              value={projectManagerKPIs.manpower}
              icon="users"
              color="blue"
            />
            <KPICard
              title="Attendance"
              value={projectManagerKPIs.attendance}
              format="percent"
              icon="user-check"
              color="green"
            />
            <KPICard
              title="Plant Count"
              value={projectManagerKPIs.plant}
              icon="truck"
              color="purple"
            />
            <KPICard
              title="Quality Score"
              value={projectManagerKPIs.quality}
              format="number"
              icon="award"
              color="blue"
            />
            <KPICard
              title="Safety Score"
              value={projectManagerKPIs.safety}
              format="number"
              icon="shield"
              color="green"
            />
            <KPICard
              title="Open Issues"
              value={projectManagerKPIs.issues}
              icon="alert-triangle"
              color={projectManagerKPIs.issues > 5 ? 'red' : 'orange'}
            />
            <KPICard
              title="Pending Approvals"
              value={projectManagerKPIs.approvals}
              icon="clock"
              color="orange"
            />
          </div>
        ) : null;

      case 'SITE_ENGINEER':
        return siteEngineerKPIs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Today's Activities"
              value={siteEngineerKPIs.todaysActivities}
              icon="activity"
              color="blue"
            />
            <KPICard
              title="Planned Quantity"
              value={siteEngineerKPIs.plannedQuantity}
              format="number"
              icon="target"
              color="purple"
            />
            <KPICard
              title="Executed Quantity"
              value={siteEngineerKPIs.executedQuantity}
              format="number"
              icon="check-circle"
              color="green"
            />
            <KPICard
              title="Productivity"
              value={siteEngineerKPIs.productivity}
              format="percent"
              icon="trending-up"
              color="emerald"
            />
            <KPICard
              title="Labour Strength"
              value={siteEngineerKPIs.labourStrength}
              icon="users"
              color="blue"
            />
            <KPICard
              title="Attendance"
              value={siteEngineerKPIs.attendance}
              format="percent"
              icon="user-check"
              color="green"
            />
            <KPICard
              title="Material Availability"
              value={siteEngineerKPIs.materialAvailability}
              format="percent"
              icon="package"
              color="purple"
            />
            <KPICard
              title="Plant Availability"
              value={siteEngineerKPIs.plantAvailability}
              format="percent"
              icon="truck"
              color="teal"
            />
            <KPICard
              title="Inspections"
              value={siteEngineerKPIs.inspections}
              icon="search"
              color="blue"
            />
            <KPICard
              title="WIR/MIR"
              value={siteEngineerKPIs.wirMir}
              icon="file-text"
              color="purple"
            />
            <KPICard
              title="Safety Observations"
              value={siteEngineerKPIs.safetyObservations}
              icon="shield"
              color="orange"
            />
            <KPICard
              title="Pending Instructions"
              value={siteEngineerKPIs.pendingInstructions}
              icon="alert-circle"
              color={siteEngineerKPIs.pendingInstructions > 5 ? 'red' : 'orange'}
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time insights and analytics • Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Role Selector */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as DashboardRoleType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="DIRECTOR">Director</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="SITE_ENGINEER">Site Engineer</option>
            </select>

            {/* Project Selector (for PM and Site Engineer) */}
            {(selectedRole === 'PROJECT_MANAGER' || selectedRole === 'SITE_ENGINEER') && (
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="proj_001">Mumbai-Pune Expressway</option>
                <option value="proj_002">Chennai Metro</option>
                <option value="proj_003">Godavari Bridge</option>
              </select>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Export"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Critical</p>
              <p className="text-2xl font-bold text-red-900">{alertCounts.critical}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">⚠</span>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">High</p>
              <p className="text-2xl font-bold text-orange-900">{alertCounts.high}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xl">⚡</span>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Medium</p>
              <p className="text-2xl font-bold text-yellow-900">{alertCounts.medium}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⚠</span>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Low</p>
              <p className="text-2xl font-bold text-blue-900">{alertCounts.low}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">ℹ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific KPIs */}
      {renderRoleKPIs()}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* S-Curve Chart */}
        {sCurveData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Progress (S-Curve)</h3>
            <SCurveChart data={sCurveData} />
          </div>
        )}

        {/* Trend Chart */}
        {trendData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contract Value Trend</h3>
              <select
                value={trendPeriod}
                onChange={(e) => setTrendPeriod(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <TrendChart data={trendData} />
          </div>
        )}
      </div>

      {/* Profitability & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Profitability */}
        {projectProfitability && (
          <ProfitabilityPanel data={projectProfitability} />
        )}

        {/* Alert Center */}
        <AlertCenter alerts={alerts} />
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
};

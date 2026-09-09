// ============================================================
// BUILDCORE ERP - QUALITY DASHBOARD
// Part 18: Material Quality Control System
// ============================================================

import React, { useEffect } from 'react';
import { useQualityStore } from '../../store/qualityStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  ClipboardCheck, CheckCircle, XCircle, AlertTriangle, Clock,
  FileText, FlaskConical, ShieldAlert, Award, TrendingUp,
  Filter, Plus, Eye, Edit
} from 'lucide-react';

export function QualityDashboard() {
  const {
    dashboardKPIs,
    mirs,
    tests,
    ncrs,
    alerts,
    companyId,
    mirStatusFilter,
    testStatusFilter,
    ncrStatusFilter,
    loadDashboardKPIs,
    setMIRStatusFilter,
    setTestStatusFilter,
    setNCRStatusFilter,
  } = useQualityStore();

  useEffect(() => {
    if (companyId) {
      loadDashboardKPIs(companyId);
    }
  }, [companyId, loadDashboardKPIs]);

  if (!dashboardKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading quality data...</p>
        </div>
      </div>
    );
  }

  const pendingMIRs = mirs.filter(m => m.status === 'PENDING').slice(0, 5);
  const openNCRs = ncrs.filter(n => n.status === 'OPEN' || n.status === 'UNDER_INVESTIGATION').slice(0, 5);
  const failedTests = tests.filter(t => t.status === 'FAILED').slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quality Control</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Material inspection and quality management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New MIR
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending MIR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingMIR}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting inspection
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <ClipboardCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Accepted</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.acceptedMIR}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Materials approved
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.rejectedMIR}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Materials rejected
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open NCR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.openNCR}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Non-conformances
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Test Failures</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.testFailures}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Failed tests
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FlaskConical className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.pendingTests}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Tests in progress
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FlaskConical className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Acceptance Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.overallAcceptanceRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Overall acceptance
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Vendor Quality</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.vendorQualityScore.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Average score
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Third Row KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Conditional</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.conditionalMIR}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Conditional acceptance
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expiring Certificates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.expiringCertificates}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Within 30 days
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Calibration Due</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.calibrationDue}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Equipment calibration
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Inspection Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.averageInspectionTime.toFixed(1)}h
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Average time
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          <select
            value={mirStatusFilter || ''}
            onChange={(e) => setMIRStatusFilter(e.target.value as any || null)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="">All MIR Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="CONDITIONALLY_ACCEPTED">Conditional</option>
          </select>
          <select
            value={testStatusFilter || ''}
            onChange={(e) => setTestStatusFilter(e.target.value as any || null)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="">All Test Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PASSED">Passed</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            value={ncrStatusFilter || ''}
            onChange={(e) => setNCRStatusFilter(e.target.value as any || null)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="">All NCR Status</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="CORRECTIVE_ACTION">Corrective Action</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </Card>

      {/* Pending MIRs */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Material Inspection Requests</h3>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {pendingMIRs.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No pending MIRs</p>
          ) : (
            pendingMIRs.map(mir => (
              <div key={mir.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mir.mirNumber}</p>
                    <StatusBadge status={mir.status} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {mir.materialName} from {mir.vendorName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {mir.projectName} · {new Date(mir.inspectionDate).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" icon={<Edit className="w-4 h-4" />}>
                  Inspect
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Open NCRs */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Open Non-Conformance Reports</h3>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {openNCRs.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No open NCRs</p>
          ) : (
            openNCRs.map(ncr => (
              <div key={ncr.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ncr.ncrNumber}</p>
                    <StatusBadge status={ncr.status} />
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      ncr.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      ncr.severity === 'MAJOR' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {ncr.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {ncr.materialName} from {ncr.vendorName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {ncr.projectName} · {ncr.nonConformanceType}
                  </p>
                </div>
                <Button variant="outline" size="sm" icon={<Edit className="w-4 h-4" />}>
                  Resolve
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Failed Tests */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Test Failures</h3>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {failedTests.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No failed tests</p>
          ) : (
            failedTests.map(test => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{test.testId}</p>
                    <StatusBadge status={test.status} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {test.testName} - {test.materialName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Standard: {test.testStandard} · Result: {test.result} {test.resultUnit}
                  </p>
                </div>
                <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
                  View
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

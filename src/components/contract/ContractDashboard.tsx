// ============================================================
// BUILDCORE ERP - CONTRACT DASHBOARD
// Part 11: Complete Contract Management Module
// ============================================================

import React, { useEffect } from 'react';
import { useContractStore } from '../../store/contractStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  FileText, DollarSign, TrendingUp, AlertTriangle, 
  CheckCircle2, Clock, Shield, Award
} from 'lucide-react';

export function ContractDashboard() {
  const { user } = useAuthStore();
  const { 
    initialize,
    contracts,
    dashboardKPIs,
    loadDashboardKPIs,
  } = useContractStore();

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
          <p className="text-gray-600">Loading contract data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contract Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Complete contractual lifecycle management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalContracts}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.activeContracts} active
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Contract Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.totalContractValue / 10000000).toFixed(0)} Cr
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Revised: ₹{(dashboardKPIs.totalRevisedValue / 10000000).toFixed(0)} Cr
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Executed Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.totalExecutedValue / 10000000).toFixed(0)} Cr
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Certified: ₹{(dashboardKPIs.totalCertifiedValue / 10000000).toFixed(0)} Cr
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.totalOutstandingValue / 10000000).toFixed(0)} Cr
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Variations: ₹{(dashboardKPIs.totalVariations / 100000).toFixed(0)} L
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(dashboardKPIs.totalBG / 100000).toFixed(0)} L
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bank Guarantees</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(dashboardKPIs.totalRetention / 100000).toFixed(0)} L
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Retention</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.pendingMilestones}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending Milestones</p>
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
                {dashboardKPIs.overdueObligations}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overdue Obligations</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.expiringBG}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">BG Expiring (30 days)</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.expiringPG}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PG Expiring (30 days)</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.contractsInDLP}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In DLP Period</p>
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
                ₹{(dashboardKPIs.totalAdvance / 100000).toFixed(0)} L
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Advance Balance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contract List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contract Register</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {contracts.length} contracts
          </span>
        </div>
        <div className="space-y-3">
          {contracts.map(contract => (
            <div key={contract.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {contract.contractNumber}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    contract.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    contract.status === 'DLP_PERIOD' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    contract.status === 'CLOSED' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {contract.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {contract.projectName}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Client: {contract.client}</span>
                  <span>Value: ₹{(contract.contractValue / 10000000).toFixed(0)} Cr</span>
                  <span>Type: {contract.contractType.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

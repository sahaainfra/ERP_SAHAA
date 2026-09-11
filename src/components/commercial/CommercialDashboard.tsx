// ============================================================
// BUILDCORE ERP - COMMERCIAL DASHBOARD
// Part 23: Commercial Management / Receivables / Claims
// ============================================================

import React, { useEffect } from 'react';
import { useCommercialStore } from '../../store/commercialStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  FileText, CheckCircle, Clock, AlertTriangle, TrendingUp,
  DollarSign, Calendar, CreditCard, Target, TrendingDown
} from 'lucide-react';

export function CommercialDashboard() {
  const { 
    dashboardKPIs, 
    loadCommercialDashboardKPIs, 
    isLoading 
  } = useCommercialStore();

  useEffect(() => {
    const companyId = 'COMPANY_001'; // Would come from auth context
    loadCommercialDashboardKPIs(companyId);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Commercial Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of commercial performance and risk management
          </p>
        </div>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contract Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.contractValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total contract value</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Billing Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.billingValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total billed amount</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Certification Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.certificationValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Certified by client</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Collection Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.collectionValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Amount collected</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {formatCurrency(dashboardKPIs.outstandingValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pending collection</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Claims Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.claimsValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total claims amount</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Variations Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.variationsValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Variation amounts</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Retention Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(dashboardKPIs.retentionValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Retention amount</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Collection Performance */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Collection Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Target Amount</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(dashboardKPIs.collectionPerformance.targetAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Collected Amount</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(dashboardKPIs.collectionPerformance.collectedAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${dashboardKPIs.collectionPerformance.collectionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {dashboardKPIs.collectionPerformance.collectionPercentage.toFixed(1)}% collected
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overdue Amount</span>
              <span className="text-sm font-semibold text-orange-600">
                {formatCurrency(dashboardKPIs.collectionPerformance.overdueAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${(dashboardKPIs.collectionPerformance.overdueAmount / dashboardKPIs.collectionPerformance.targetAmount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Receivable Ageing */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receivable Ageing</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ageing Bucket</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Count</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Amount</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {dashboardKPIs.receivableAgeing.map((bucket, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{bucket.bucketName}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{bucket.count}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                    {formatCurrency(bucket.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                    {bucket.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Claim Status Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Claim Status Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Count</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboardKPIs.claimStatus.map((status, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <StatusBadge status={status.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{status.count}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                    {formatCurrency(status.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Commercial Risk Score */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commercial Risk Score</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={
                  dashboardKPIs.commercialRiskScore >= 80 ? '#10b981' :
                  dashboardKPIs.commercialRiskScore >= 60 ? '#f59e0b' :
                  '#ef4444'
                }
                strokeWidth="10"
                strokeDasharray={`${(dashboardKPIs.commercialRiskScore / 100) * 283} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {dashboardKPIs.commercialRiskScore}
                </p>
                <p className="text-xs text-gray-500">Risk Score</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {dashboardKPIs.commercialRiskScore >= 80 ? 'Low Risk' :
             dashboardKPIs.commercialRiskScore >= 60 ? 'Medium Risk' :
             'High Risk'}
          </p>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// BUILDCORE ERP - TENDER DASHBOARD
// Part 08: Complete Tender Management Module
// ============================================================

import React, { useEffect } from 'react';
import { useTenderStore } from '../../store/tenderStore';
import { useAuthStore } from '../../store';
import { Card } from '../ui';
import { 
  FileText, Calendar, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, Target, DollarSign, BarChart3, Award, XCircle
} from 'lucide-react';

export function TenderDashboard() {
  const { user } = useAuthStore();
  const { 
    initialize,
    tenders,
    dashboardKPIs,
    loadDashboardKPIs,
  } = useTenderStore();

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
          <p className="text-gray-600">Loading tender data...</p>
        </div>
      </div>
    );
  }

  const openTenders = tenders.filter(t => 
    ['IDENTIFIED', 'UNDER_REVIEW', 'ELIGIBILITY_CHECK', 'ESTIMATION', 'BID_NO_BID', 'APPROVED'].includes(t.status)
  );

  const recentTenders = tenders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tender Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete tender lifecycle management and tracking
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open Tenders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.openTenders}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.closingSoon} closing soon
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.pipeline / 10000000).toFixed(0)} Cr
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Estimated value
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.winRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardKPIs.won} won / {dashboardKPIs.lost} lost
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.bidNoBidPending + dashboardKPIs.estimatePending + dashboardKPIs.approvalPending}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Require attention
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
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.bidNoBidPending}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bid/No-Bid Pending</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.estimatePending}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Estimation Pending</p>
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
                {dashboardKPIs.submitted}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(dashboardKPIs.lostValue / 10000000).toFixed(0)} Cr
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lost Value</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tenders */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tenders</h3>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
            {tenders.length} total
          </span>
        </div>
        <div className="space-y-3">
          {recentTenders.map(tender => (
            <div key={tender.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {tender.tenderNumber}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    tender.status === 'WON' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    tender.status === 'LOST' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    tender.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {tender.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {tender.tenderTitle}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Client: {tender.client}</span>
                  <span>Value: ₹{(tender.estimatedCost / 10000000).toFixed(0)} Cr</span>
                  <span>Deadline: {new Date(tender.submissionDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Status Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tender Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Identified', count: tenders.filter(t => t.status === 'IDENTIFIED').length, color: 'bg-gray-500' },
            { label: 'Estimation', count: tenders.filter(t => t.status === 'ESTIMATION').length, color: 'bg-blue-500' },
            { label: 'Bid/No-Bid', count: tenders.filter(t => t.status === 'BID_NO_BID').length, color: 'bg-yellow-500' },
            { label: 'Submitted', count: tenders.filter(t => t.status === 'SUBMITTED').length, color: 'bg-indigo-500' },
            { label: 'Won', count: tenders.filter(t => t.status === 'WON').length, color: 'bg-green-500' },
            { label: 'Lost', count: tenders.filter(t => t.status === 'LOST').length, color: 'bg-red-500' },
            { label: 'Cancelled', count: tenders.filter(t => t.status === 'CANCELLED').length, color: 'bg-gray-400' },
            { label: 'Total', count: tenders.length, color: 'bg-purple-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

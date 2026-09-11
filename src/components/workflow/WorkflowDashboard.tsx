// ============================================================
// BUILDCORE ERP - WORKFLOW DASHBOARD
// Part 04: Enterprise Workflow & Approval Engine
// ============================================================

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Users, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui';
import { useWorkflowStore } from '../../store/workflowStore';
import { useAuthStore } from '../../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function WorkflowDashboard() {
  const { user } = useAuthStore();
  const { dashboardKPIs, instances, refresh } = useWorkflowStore();

  useEffect(() => {
    if (user) {
      refresh(user.companyId, user.id);
    }
  }, [user, refresh]);

  if (!user || !dashboardKPIs) return null;

  // Prepare chart data
  const statusData = [
    { name: 'Approved', value: instances.filter(i => i.status === 'APPROVED').length, color: '#10b981' },
    { name: 'Pending', value: instances.filter(i => i.status === 'PENDING_APPROVAL').length, color: '#3b82f6' },
    { name: 'Rejected', value: instances.filter(i => i.status === 'REJECTED').length, color: '#ef4444' },
    { name: 'Returned', value: instances.filter(i => i.status === 'RETURNED').length, color: '#f59e0b' },
    { name: 'Query', value: instances.filter(i => i.status === 'QUERY_RAISED').length, color: '#8b5cf6' },
  ];

  const moduleData = [
    { module: 'Procurement', count: instances.filter(i => i.entityType === 'PROCUREMENT').length },
    { module: 'HR', count: instances.filter(i => i.entityType === 'HR').length },
    { module: 'Billing', count: instances.filter(i => i.entityType === 'BILLING').length },
    { module: 'Finance', count: instances.filter(i => i.entityType === 'FINANCE').length },
  ];

  const trendData = [
    { day: 'Mon', approved: 12, submitted: 15 },
    { day: 'Tue', approved: 19, submitted: 22 },
    { day: 'Wed', approved: 15, submitted: 18 },
    { day: 'Thu', approved: 22, submitted: 25 },
    { day: 'Fri', approved: 18, submitted: 20 },
    { day: 'Sat', approved: 8, submitted: 10 },
    { day: 'Sun', approved: 5, submitted: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {dashboardKPIs.pendingApprovals}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Awaiting your action
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved Today</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {dashboardKPIs.approvedToday}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from yesterday
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {dashboardKPIs.overdue}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Requires immediate attention
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Approval Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {dashboardKPIs.averageApprovalTime}h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Across all workflows
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Approval Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Approval Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
                <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2} name="Submitted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Module-wise Distribution */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Approvals by Module
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moduleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="module" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottlenecks */}
      {dashboardKPIs.bottlenecks.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Approval Bottlenecks
          </h3>
          <div className="space-y-3">
            {dashboardKPIs.bottlenecks.map((bottleneck, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bottleneck.approverName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {bottleneck.pendingCount} pending approvals
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {bottleneck.averageDelay}h
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg. delay</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.queries}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open Queries</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.rejected}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.returned}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Returned</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardKPIs.escalated}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Escalated</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// BUILDCORE ERP - COMMAND CENTER DASHBOARD
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, DollarSign, Truck, Users, HardHat, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight,
  Activity, FileText, BarChart3, Calendar, Zap, Shield,
  Package, Wrench, Beaker, ClipboardList, CircleDot
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, KpiCard, StatusBadge, ProgressBar, Button } from '../ui';
import { useDataStore, useAuthStore } from '../../store';
import { formatCurrency, formatTimeAgo } from '../ui';
import type { Project, ActivityItem } from '../../types';

// ============================================================
// DASHBOARD
// ============================================================
export function Dashboard() {
  const { projects, activities } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    useDataStore.getState().initializeDemoData();
  }, []);

  const totalContractValue = projects.reduce((sum, p) => sum + p.contractValue, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;

  // Revenue trend data
  const revenueData = [
    { month: 'Oct', revenue: 42, billing: 38 },
    { month: 'Nov', revenue: 55, billing: 48 },
    { month: 'Dec', revenue: 48, billing: 52 },
    { month: 'Jan', revenue: 62, billing: 58 },
    { month: 'Feb', revenue: 71, billing: 65 },
    { month: 'Mar', revenue: 85, billing: 78 },
  ];

  // Project distribution by type
  const projectTypeData = [
    { name: 'Road', value: 2, color: '#3b82f6' },
    { name: 'Metro', value: 1, color: '#8b5cf6' },
    { name: 'Bridge', value: 1, color: '#10b981' },
    { name: 'EPC', value: 1, color: '#f59e0b' },
    { name: 'Dam', value: 1, color: '#06b6d4' },
  ];

  // Procurement status
  const procurementData = [
    { category: 'PR', pending: 12, approved: 28, total: 40 },
    { category: 'PO', pending: 8, approved: 35, total: 43 },
    { category: 'RFQ', pending: 5, approved: 18, total: 23 },
    { category: 'GRN', pending: 15, approved: 67, total: 82 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good {getGreeting()}, {user?.firstName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening across your projects today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">FY 2025-26</span>
          </div>
          <Button variant="outline" size="sm" icon={<BarChart3 className="w-4 h-4" />}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Contract Value"
          value={formatCurrency(totalContractValue)}
          change={12.5}
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
          subtitle={`${projects.length} active projects`}
        />
        <KpiCard
          title="Revenue This Quarter"
          value="₹85.2 Cr"
          change={8.3}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          subtitle="Q4 FY 2025-26"
        />
        <KpiCard
          title="Pending Approvals"
          value="23"
          change={-5.2}
          icon={<Clock className="w-5 h-5" />}
          color="orange"
          subtitle="8 urgent, 15 normal"
        />
        <KpiCard
          title="Active Workforce"
          value="2,847"
          change={3.1}
          icon={<Users className="w-5 h-5" />}
          color="purple"
          subtitle="Across 5 project sites"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Progress', value: `${avgProgress.toFixed(0)}%`, icon: <Activity className="w-4 h-4" />, color: 'text-blue-600' },
          { label: 'Open RFQs', value: '5', icon: <Truck className="w-4 h-4" />, color: 'text-orange-600' },
          { label: 'Safety Score', value: '94/100', icon: <Shield className="w-4 h-4" />, color: 'text-green-600' },
          { label: 'Material Issues', value: '3', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600' },
        ].map((kpi, i) => (
          <Card key={i} padding="sm" className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{kpi.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Revenue & Billing Trend</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last 6 months (₹ in Crores)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-500">Billing</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBilling" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="billing" stroke="#10b981" strokeWidth={2.5} fill="url(#colorBilling)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Project Distribution */}
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Project Portfolio</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">By project type</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {projectTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {projectTypeData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Projects & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <Card className="lg:col-span-2" padding="none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Projects</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{projects.length} projects in progress</p>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {projects.map((project) => (
              <div key={project.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{project.name}</h4>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 uppercase">
                        {project.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{project.clientName} · {project.location}</p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Contract: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(project.contractValue)}</span>
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Spent: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(project.spent)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-32 flex-shrink-0">
                    <ProgressBar value={project.progress} color={project.progress > 50 ? 'green' : project.progress > 20 ? 'blue' : 'orange'} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card padding="none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent transactions</p>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-[480px] overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-gray-400">{activity.user}</span>
                      <span className="text-[11px] text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-[11px] text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                      {activity.status && <StatusBadge status={activity.status} size="sm" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Procurement & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Procurement Overview */}
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Procurement Pipeline</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Document status overview</p>
          <div className="space-y-4">
            {procurementData.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                  <span className="text-xs text-gray-500">{item.approved}/{item.total} completed</span>
                </div>
                <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <div
                    className="bg-green-500 rounded-full transition-all duration-700"
                    style={{ width: `${(item.approved / item.total) * 100}%` }}
                  />
                  <div
                    className="bg-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: `${(item.pending / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New PR', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
              { label: 'Create RFQ', icon: <Truck className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
              { label: 'Site Report', icon: <ClipboardList className="w-5 h-5" />, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
              { label: 'Upload Drawing', icon: <Package className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
              { label: 'Record GRN', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
              { label: 'Safety Check', icon: <Shield className="w-5 h-5" />, color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
            ].map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all text-left"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Alerts */}
          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Alerts</h4>
            <div className="space-y-2">
              {[
                { text: 'Cement stock below minimum at Site A', severity: 'high' },
                { text: 'Bridge milestone delayed by 5 days', severity: 'high' },
                { text: 'Trade license expiring in 15 days', severity: 'medium' },
              ].map((alert, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                  alert.severity === 'high' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{alert.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* System Status Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
          <span>API v1.0</span>
          <span>Last sync: Just now</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>BuildCore ERP v0.1.0</span>
          <span>Part 01 of 30</span>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getActivityIcon(type: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    approval: <CheckCircle2 className="w-3.5 h-3.5" />,
    submission: <FileText className="w-3.5 h-3.5" />,
    delivery: <Truck className="w-3.5 h-3.5" />,
    query: <AlertTriangle className="w-3.5 h-3.5" />,
    creation: <Zap className="w-3.5 h-3.5" />,
    safety: <Shield className="w-3.5 h-3.5" />,
    payment: <DollarSign className="w-3.5 h-3.5" />,
    document: <Package className="w-3.5 h-3.5" />,
  };
  return icons[type] || <CircleDot className="w-3.5 h-3.5" />;
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    approval: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    submission: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    delivery: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    query: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    creation: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    safety: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    payment: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    document: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  };
  return colors[type] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
}

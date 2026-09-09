// ============================================================
// BUILDCORE ERP - SETTINGS / SYSTEM ARCHITECTURE PAGE
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Database, Workflow, Bell, FileText, Search, Calculator,
  Hash, Activity, BarChart3, Globe, HardDrive, Cpu, Clock,
  Users, Lock, Key, Server, CheckCircle2, Circle, Settings as SettingsIcon,
  ChevronRight, Layers, GitBranch, Eye, Sun, Moon, Monitor
} from 'lucide-react';
import { Card, Button, StatusBadge } from '../ui';
import { useThemeStore, useAuthStore } from '../../store';
import { auditService } from '../../services';

export function SettingsPage() {
  const { mode, setMode } = useThemeStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'architecture', label: 'Architecture', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Log', icon: <Eye className="w-4 h-4" /> },
    { id: 'numbering', label: 'Numbering', icon: <Hash className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  const coreServices = [
    { name: 'Authentication Service', icon: <Lock className="w-4 h-4" />, status: 'ACTIVE', description: 'Session management, MFA-ready, password policies' },
    { name: 'RBAC Authorization Engine', icon: <Shield className="w-4 h-4" />, status: 'ACTIVE', description: 'Role-based access with project/site level permissions' },
    { name: 'Workflow Engine', icon: <Workflow className="w-4 h-4" />, status: 'ACTIVE', description: 'Configurable multi-level approval workflows' },
    { name: 'Notification Engine', icon: <Bell className="w-4 h-4" />, status: 'ACTIVE', description: 'In-app, email-ready, push-ready, SMS-ready' },
    { name: 'Document Engine', icon: <FileText className="w-4 h-4" />, status: 'ACTIVE', description: 'Upload, version, approve, metadata management' },
    { name: 'Audit Engine', icon: <Activity className="w-4 h-4" />, status: 'ACTIVE', description: 'Complete audit trail for all operations' },
    { name: 'Search Engine', icon: <Search className="w-4 h-4" />, status: 'ACTIVE', description: 'Enterprise-wide search with permission filtering' },
    { name: 'Calculation Engine', icon: <Calculator className="w-4 h-4" />, status: 'ACTIVE', description: 'GST, TDS, retention, escalation, wastage' },
    { name: 'Numbering Engine', icon: <Hash className="w-4 h-4" />, status: 'ACTIVE', description: 'Configurable document numbering sequences' },
    { name: 'Status Engine', icon: <GitBranch className="w-4 h-4" />, status: 'ACTIVE', description: '19 configurable transaction statuses' },
    { name: 'API Service', icon: <Globe className="w-4 h-4" />, status: 'ACTIVE', description: 'REST/JSON API foundation with validation' },
    { name: 'Dashboard/KPI Engine', icon: <BarChart3 className="w-4 h-4" />, status: 'ACTIVE', description: 'Real-time KPIs and analytics' },
  ];

  const auditLogs = auditService.getLogs().slice(0, 15);

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Core platform configuration and system architecture</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* System Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12/12</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Core Services Active</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Part 01</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">of 30 Parts Built</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Demo Users Configured</p>
              </div>
            </Card>
          </div>

          {/* Core Services Grid */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Core Services</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All foundational services that Parts 02-30 will reuse</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-700">
              {coreServices.map((service, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{service.name}</p>
                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Enterprise Hierarchy */}
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Enterprise Hierarchy</h3>
            <div className="flex flex-wrap items-center gap-2">
              {['Company', 'Business Unit', 'Branch', 'Department', 'Project', 'Package', 'Site', 'Area/Structure', 'Work Front', 'WBS', 'Activity', 'Cost Code'].map((level, i) => (
                <React.Fragment key={level}>
                  <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-300">
                    {level}
                  </div>
                  {i < 11 && <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Every transaction is traceable to the relevant organizational objects in this hierarchy.
            </p>
          </Card>
        </div>
      )}

      {/* Architecture Tab */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">System Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { layer: 'Presentation', items: ['React 18', 'Tailwind CSS 4', 'Framer Motion', 'Recharts'], color: 'blue' },
                { layer: 'State Management', items: ['Zustand', 'Persistent Store', 'Theme Engine', 'Auth State'], color: 'purple' },
                { layer: 'Services', items: ['Auth', 'RBAC', 'Workflow', 'Audit', 'Search', 'Calculation', 'Numbering', 'Notification', 'Document'], color: 'green' },
                { layer: 'Data Layer', items: ['Type-safe Models', 'API Foundation', 'Pagination', 'Caching-ready'], color: 'orange' },
              ].map((layer, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 border-dashed border-${layer.color}-200 dark:border-${layer.color}-800/50 bg-${layer.color}-50/50 dark:bg-${layer.color}-900/10`}>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{layer.layer}</h4>
                  <div className="space-y-1.5">
                    {layer.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Database Principles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Normalized Structure', desc: 'Primary keys, foreign keys, unique constraints, indexes' },
                { title: 'Audit Columns', desc: 'Created/updated timestamps, created/updated by on every record' },
                { title: 'Soft Deletion', desc: 'deleted_at, deleted_by, deletion_reason - never permanent delete' },
                { title: 'Multi-tenancy', desc: 'Company ID, Project ID, Site ID on all transactions' },
                { title: 'Version Control', desc: 'Version number on all configurable records' },
                { title: 'Financial Integrity', desc: 'Approved financial transactions are never permanently deleted' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Transaction Status Engine</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'QUERY_RAISED', 'CORRECTION_REQUIRED',
                'RESUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'RETURNED',
                'FORWARDED', 'ESCALATED', 'POSTED', 'PARTIALLY_COMPLETED', 'COMPLETED',
                'CANCELLED', 'ON_HOLD', 'CLOSED', 'REOPENED'
              ].map(status => (
                <StatusBadge key={status} status={status} size="md" />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              19 configurable statuses with controlled transitions based on permissions and workflow rules.
            </p>
          </Card>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-fade-in">
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Audit Trail</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete audit log of all system operations</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Activity className="w-4 h-4" />
                <span>{auditLogs.length} entries</span>
              </div>
            </div>
            {auditLogs.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {auditLogs.map(log => (
                  <div key={log.id} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Activity className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{log.action.replace(/_/g, ' ')}</span>
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{log.entityType}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          by {log.userName} · {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status="APPROVED" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Activity className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500">No audit entries yet. Perform actions to see the audit trail.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Numbering Tab */}
      {activeTab === 'numbering' && (
        <div className="space-y-4 animate-fade-in">
          <Card padding="none">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Document Numbering Configuration</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configurable sequences for all document types</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Module</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Format</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Example</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reset</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {[
                    { module: 'PROJECT', format: 'PROJECT-2026-0001', example: 'PROJECT-2026-0047', reset: 'Yearly' },
                    { module: 'PR', format: 'PR-2026-000001', example: 'PR-2026-000123', reset: 'Yearly' },
                    { module: 'RFQ', format: 'RFQ-2026-000001', example: 'RFQ-2026-000089', reset: 'Yearly' },
                    { module: 'PO', format: 'PO-2026-000001', example: 'PO-2026-000012', reset: 'Yearly' },
                    { module: 'GRN', format: 'GRN-2026-000001', example: 'GRN-2026-000045', reset: 'Yearly' },
                    { module: 'MR', format: 'MR-2026-000001', example: 'MR-2026-000067', reset: 'Yearly' },
                    { module: 'MB', format: 'MB-2026-000001', example: 'MB-2026-000023', reset: 'Yearly' },
                    { module: 'RAB', format: 'RAB-2026-000001', example: 'RAB-2026-000012', reset: 'Yearly' },
                    { module: 'PAY', format: 'PAY-2026-000001', example: 'PAY-2026-000045', reset: 'Yearly' },
                    { module: 'JV', format: 'JV-2026-000001', example: 'JV-2026-000034', reset: 'Yearly' },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.module}</td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 font-mono text-xs">{item.format}</td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 font-mono text-xs">{item.example}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{item.reset}</td>
                      <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="flex gap-3">
              {[
                { mode: 'light' as const, label: 'Light', icon: <Sun className="w-5 h-5" /> },
                { mode: 'dark' as const, label: 'Dark', icon: <Moon className="w-5 h-5" /> },
                { mode: 'system' as const, label: 'System', icon: <Monitor className="w-5 h-5" /> },
              ].map(opt => (
                <button
                  key={opt.mode}
                  onClick={() => setMode(opt.mode)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    mode === opt.mode
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {opt.icon}
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">User Profile</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.designation}</p>
                <p className="text-xs text-gray-400 mt-1">{user?.email} · {user?.employeeId}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
            <div className="space-y-3">
              {[
                { label: 'Password Hashing', desc: 'bcrypt with salt rounds', active: true },
                { label: 'Session Management', desc: '8-hour sessions with refresh tokens', active: true },
                { label: 'Account Lockout', desc: 'After 5 failed attempts', active: true },
                { label: 'MFA (Multi-Factor Auth)', desc: 'Architecture ready, can be enabled per user', active: false },
                { label: 'Rate Limiting', desc: 'API rate limiting configured', active: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${item.active ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}



// ============================================================
// BUILDCORE ERP - SECURITY MANAGEMENT PAGE
// Part 03: User, Role, Permission & Security Management
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Shield, Key, Lock, Unlock, Eye, Edit, Plus, Search,
  Filter, Download, Printer, CheckCircle2, XCircle, AlertTriangle,
  Clock, TrendingUp, Activity, Monitor, Smartphone, Globe,
  ChevronRight, ChevronDown, ArrowLeft, UserCheck, UserX,
  FileText, AlertCircle, Zap, Target, Award, Calendar
} from 'lucide-react';
import { Card, Button, StatusBadge, Input } from '../ui';
import { useSecurityStore } from '../../store/securityStore';
import { useAuthStore } from '../../store';
import type { UserMaster, RoleMaster } from '../../types/security';

export function SecurityPage() {
  const { user } = useAuthStore();
  const { initialize, initialized } = useSecurityStore();

  useEffect(() => {
    if (!initialized && user) {
      initialize(user.companyId);
    }
  }, [user, initialized, initialize]);

  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
    { id: 'roles', label: 'Role Management', icon: <Shield className="w-4 h-4" /> },
    { id: 'approvals', label: 'Approval Center', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'security', label: 'Security Dashboard', icon: <Lock className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Monitor className="w-4 h-4" /> },
    { id: 'history', label: 'Login History', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Authorization</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">User, Role, Permission & Security Management</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
          Add User
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
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

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === 'users' && <UserManagementTab />}
        {activeTab === 'roles' && <RoleManagementTab />}
        {activeTab === 'approvals' && <ApprovalCenterTab />}
        {activeTab === 'security' && <SecurityDashboardTab />}
        {activeTab === 'sessions' && <SessionsTab />}
        {activeTab === 'history' && <LoginHistoryTab />}
      </motion.div>
    </div>
  );
}

// ============================================================
// USER MANAGEMENT TAB
// ============================================================
function UserManagementTab() {
  const { users } = useSecurityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserMaster | null>(null);

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedUser) {
    return <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name, email, or employee ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Projects</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors" onClick={() => setSelectedUser(user)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{user.roleName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{user.departmentName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{user.projectAssignments.length}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={user.status === 'ACTIVE' ? 'APPROVED' : user.status === 'LOCKED' ? 'REJECTED' : 'ON_HOLD'} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function UserDetail({ user, onBack }: { user: UserMaster; onBack: () => void }) {
  const { lockUser, unlockUser } = useSecurityStore();

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
              <StatusBadge status={user.status === 'ACTIVE' ? 'APPROVED' : user.status === 'LOCKED' ? 'REJECTED' : 'ON_HOLD'} size="md" />
            </div>
            <p className="text-sm text-gray-500">{user.designationName} · {user.departmentName}</p>
            <p className="text-xs text-gray-400 mt-1">EMP: {user.employeeId} · Login: {user.loginId}</p>
          </div>
          <div className="flex gap-2">
            {user.status === 'ACTIVE' ? (
              <Button variant="outline" size="sm" icon={<Lock className="w-4 h-4" />} onClick={() => lockUser(user.id)}>
                Lock User
              </Button>
            ) : (
              <Button variant="outline" size="sm" icon={<Unlock className="w-4 h-4" />} onClick={() => unlockUser(user.id)}>
                Unlock User
              </Button>
            )}
            <Button variant="primary" size="sm" icon={<Edit className="w-4 h-4" />}>
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Contact Information</h4>
            {[
              { label: 'Email', value: user.email },
              { label: 'Mobile', value: user.mobile },
              { label: 'Reporting Manager', value: user.reportingManagerName || 'N/A' },
              { label: 'Backup Approver', value: user.backupApproverName || 'N/A' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Security</h4>
            {[
              { label: 'Last Login', value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never' },
              { label: 'Last Login IP', value: user.lastLoginIp || 'N/A' },
              { label: 'MFA Enabled', value: user.mfaEnabled ? 'Yes' : 'No' },
              { label: 'Failed Attempts', value: user.failedLoginAttempts.toString() },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Financial Authority</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-gray-500">Max Recommendation</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{(user.financialAuthority.maxRecommendation / 100000).toFixed(0)}L</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-gray-500">Max Approval</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{(user.financialAuthority.maxApproval / 100000).toFixed(0)}L</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-gray-500">Max Payment</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{(user.financialAuthority.maxPayment / 100000).toFixed(0)}L</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Project Assignments</h4>
          <div className="space-y-2">
            {user.projectAssignments.map((pa, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{pa.projectName}</p>
                  <p className="text-xs text-gray-500">Assigned: {new Date(pa.assignedDate).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  pa.accessLevel === 'FULL' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  pa.accessLevel === 'EDIT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  pa.accessLevel === 'VIEW' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {pa.accessLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// ROLE MANAGEMENT TAB
// ============================================================
function RoleManagementTab() {
  const { roles } = useSecurityStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Role Management</h3>
          <p className="text-xs text-gray-500 mt-0.5">{roles.length} roles configured</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Role</Button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {roles.map(role => (
          <div key={role.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{role.roleName}</h4>
                  <span className="text-xs font-mono text-gray-400">{role.roleCode}</span>
                  {role.isSystem && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">System</span>}
                </div>
                <p className="text-xs text-gray-500 mb-2">{role.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{role.permissions.length} permissions</span>
                  <span>{role.moduleAccess.length} modules</span>
                  <span>{role.financialLimits.length} financial limits</span>
                </div>
              </div>
              <StatusBadge status="APPROVED" size="sm" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// APPROVAL CENTER TAB
// ============================================================
function ApprovalCenterTab() {
  const { pendingApprovals } = useSecurityStore();
  const { user } = useAuthStore();

  return (
    <div className="space-y-4">
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Pending Approvals</h3>
          <p className="text-xs text-gray-500 mt-0.5">{pendingApprovals.length} items awaiting your approval</p>
        </div>
        {pendingApprovals.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {pendingApprovals.map(item => (
              <div key={item.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.documentNumber}</h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{item.documentTypeName}</span>
                      <StatusBadge status={item.slaStatus === 'ON_TIME' ? 'APPROVED' : item.slaStatus === 'AT_RISK' ? 'ON_HOLD' : 'REJECTED'} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{item.projectName} · Requested by {item.requesterName}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Amount: ₹{(item.amount / 100000).toFixed(2)}L</span>
                      <span>Age: {item.age} days</span>
                      <span>Priority: {item.priority}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Query</Button>
                    <Button variant="outline" size="sm">Reject</Button>
                    <Button variant="primary" size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">No pending approvals</p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// SECURITY DASHBOARD TAB
// ============================================================
function SecurityDashboardTab() {
  const { securityDashboardKPIs } = useSecurityStore();

  if (!securityDashboardKPIs) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Users', value: securityDashboardKPIs.activeUsers, icon: <UserCheck className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
          { label: 'Locked Accounts', value: securityDashboardKPIs.lockedAccounts, icon: <Lock className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
          { label: 'Failed Logins Today', value: securityDashboardKPIs.failedLoginsToday, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
          { label: 'Active Sessions', value: securityDashboardKPIs.activeSessions, icon: <Monitor className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Pending Approvals', value: securityDashboardKPIs.pendingApprovals, icon: <Clock className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        ].map((kpi, i) => (
          <Card key={i} padding="sm">
            <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color} w-fit mb-2`}>{kpi.icon}</div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Security Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Account Status Distribution</h4>
            <div className="space-y-2">
              {[
                { label: 'Active', value: securityDashboardKPIs.activeUsers, color: 'bg-green-500' },
                { label: 'Inactive', value: securityDashboardKPIs.inactiveUsers, color: 'bg-gray-400' },
                { label: 'Locked', value: securityDashboardKPIs.lockedAccounts, color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Approval Status</h4>
            <div className="space-y-2">
              {[
                { label: 'Pending', value: securityDashboardKPIs.pendingApprovals, color: 'bg-yellow-500' },
                { label: 'Overdue', value: securityDashboardKPIs.overdueApprovals, color: 'bg-red-500' },
                { label: 'Active Delegations', value: securityDashboardKPIs.activeDelegations, color: 'bg-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// SESSIONS TAB
// ============================================================
function SessionsTab() {
  const { activeSessions, revokeSession } = useSecurityStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
        <p className="text-xs text-gray-500 mt-0.5">{activeSessions.length} active sessions</p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {activeSessions.map(session => (
          <div key={session.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  {session.deviceInfo.includes('Mobile') ? <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{session.deviceInfo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">IP: {session.ipAddress} · {session.location || 'Unknown location'}</p>
                  <p className="text-xs text-gray-400 mt-1">Started: {new Date(session.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Last activity: {new Date(session.lastActivityAt).toLocaleString()}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => revokeSession(session.id)}>
                Revoke
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// LOGIN HISTORY TAB
// ============================================================
function LoginHistoryTab() {
  const { loginHistory } = useSecurityStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Login History</h3>
          <p className="text-xs text-gray-500 mt-0.5">Recent login attempts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />}>Print</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">IP Address</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Device</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {loginHistory.slice(0, 20).map(log => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{log.loginId}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(log.loginTime).toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{log.ipAddress}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">{log.userAgent}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={log.status === 'SUCCESS' ? 'APPROVED' : log.status === 'FAILED' ? 'REJECTED' : 'ON_HOLD'} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

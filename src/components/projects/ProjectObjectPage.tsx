// ============================================================
// BUILDCORE ERP - PROJECT OBJECT PAGE
// Part 06: Project Management & Construction Execution
// Central project page with 27 tabs
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Building2, MapPin, Calendar, DollarSign, Users, TrendingUp,
  CheckCircle2, AlertTriangle, Clock, FileText, Briefcase, Package,
  ClipboardList, Shield, HardHat, Wrench, Beaker, FolderTree,
  Mail, MessageSquare, AlertCircle, Target, BarChart3, History,
  ChevronRight, ChevronDown, Plus, Edit, Download, Printer, Eye,
  Activity, Zap, Award, Truck, Scale, FileCheck, Flag,
  Layers, GitBranch, CircleDot, DollarSign as Dollar
} from 'lucide-react';
import { Card, Button, StatusBadge, ProgressBar } from '../ui';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store';
import { formatCurrency, formatTimeAgo } from '../ui';
import type { ProjectMaster, WBS, WorkFront, BOQItem, RiskEntry, IssueEntry, DelayEntry, Correspondence, Meeting } from '../../types/project';

// ============================================================
// PROJECT OBJECT PAGE
// ============================================================
export function ProjectObjectPage() {
  const { user } = useAuthStore();
  const { projects, selectedProject, selectProject, clearSelection, initialize } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      initialize(user.companyId, user.id);
    }
  }, [user, initialize]);

  // If no project selected, show project list
  if (!selectedProjectId || !selectedProject) {
    return (
      <ProjectList
        projects={projects}
        onSelect={(id) => {
          setSelectedProjectId(id);
          selectProject(id);
        }}
      />
    );
  }

  return (
    <ProjectDetail
      project={selectedProject}
      onBack={() => {
        setSelectedProjectId(null);
        clearSelection();
      }}
    />
  );
}

// ============================================================
// PROJECT LIST
// ============================================================
function ProjectList({ projects, onSelect }: { projects: ProjectMaster[]; onSelect: (id: string) => void }) {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {projects.length} active projects · Central hub for all project operations
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map(project => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card hover onClick={() => onSelect(project.id)} padding="none">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                        {project.projectType.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{project.projectCode}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{project.projectName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{project.client} · {project.location.city}</p>
                  </div>
                  <HealthBadge health={project.health.overall} />
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{project.progress}%</span>
                  </div>
                  <ProgressBar
                    value={project.progress}
                    color={project.progress > 50 ? 'green' : project.progress > 20 ? 'blue' : 'orange'}
                    showLabel={false}
                    size="sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">Contract Value</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(project.contractValue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase">Score</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{project.health.score}/100</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PROJECT DETAIL (with tabs)
// ============================================================
function ProjectDetail({ project, onBack }: { project: ProjectMaster; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'contract', label: 'Contract', icon: <FileText className="w-4 h-4" /> },
    { id: 'boq', label: 'BOQ', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'wbs', label: 'WBS', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'planning', label: 'Planning', icon: <Calendar className="w-4 h-4" /> },
    { id: 'execution', label: 'Execution', icon: <HardHat className="w-4 h-4" /> },
    { id: 'procurement', label: 'Procurement', icon: <Truck className="w-4 h-4" /> },
    { id: 'materials', label: 'Materials', icon: <Package className="w-4 h-4" /> },
    { id: 'store', label: 'Store', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <Dollar className="w-4 h-4" /> },
    { id: 'accounts', label: 'Accounts', icon: <Dollar className="w-4 h-4" /> },
    { id: 'hr', label: 'HR', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Users className="w-4 h-4" /> },
    { id: 'plant', label: 'Plant', icon: <Wrench className="w-4 h-4" /> },
    { id: 'rmc', label: 'RMC', icon: <Beaker className="w-4 h-4" /> },
    { id: 'quality', label: 'Quality', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety', icon: <Shield className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'correspondence', label: 'Correspondence', icon: <Mail className="w-4 h-4" /> },
    { id: 'meetings', label: 'Meetings', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'issues', label: 'Issues', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'risks', label: 'Risks', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'claims', label: 'Claims', icon: <FileText className="w-4 h-4" /> },
    { id: 'eot', label: 'EOT', icon: <Clock className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-gray-400">{project.projectCode}</span>
                <StatusBadge status="APPROVED" size="sm" />
                <HealthBadge health={project.health.overall} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.projectName}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {project.client} · {project.location.city}, {project.location.state}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location.address}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(project.startDate).toLocaleDateString('en-IN')} → {new Date(project.originalCompletionDate).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
            <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />}>Print</Button>
            <Button variant="primary" size="sm" icon={<Edit className="w-4 h-4" />}>Edit</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
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

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === 'overview' && <OverviewTab project={project} />}
        {activeTab === 'contract' && <ContractTab project={project} />}
        {activeTab === 'boq' && <BOQTab project={project} />}
        {activeTab === 'wbs' && <WBSTab project={project} />}
        {activeTab === 'execution' && <ExecutionTab project={project} />}
        {activeTab === 'risks' && <RisksTab project={project} />}
        {activeTab === 'issues' && <IssuesTab project={project} />}
        {activeTab === 'correspondence' && <CorrespondenceTab project={project} />}
        {activeTab === 'meetings' && <MeetingsTab project={project} />}
        {activeTab === 'reports' && <ReportsTab project={project} />}
        {!['overview', 'contract', 'boq', 'wbs', 'execution', 'risks', 'issues', 'correspondence', 'meetings', 'reports'].includes(activeTab) && (
          <ModulePlaceholder tab={activeTab} />
        )}
      </motion.div>
    </div>
  );
}

// ============================================================
// HEALTH BADGE
// ============================================================
function HealthBadge({ health }: { health: 'GREEN' | 'AMBER' | 'RED' }) {
  const colors = {
    GREEN: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    AMBER: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    RED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded ${colors[health]}`}>
      {health}
    </span>
  );
}

// ============================================================
// OVERVIEW TAB
// ============================================================
function OverviewTab({ project }: { project: ProjectMaster }) {
  const { analytics, teamMembers, wbsItems, risks, issues, delays } = useProjectStore();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card padding="sm">
          <p className="text-xs text-gray-500">Contract Value</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(project.contractValue)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Revised Value</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(project.revisedValue || project.contractValue)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Work Executed</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(project.budget.actualCost)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Physical Progress</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{project.progress}%</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Cost Variance</p>
          <p className={`text-lg font-bold mt-1 ${project.budget.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {project.budget.variancePercent > 0 ? '+' : ''}{project.budget.variancePercent.toFixed(1)}%
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Health Score</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{project.health.score}/100</p>
        </Card>
      </div>

      {/* Project Health */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Project Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Schedule', value: project.health.schedule },
            { label: 'Cost', value: project.health.cost },
            { label: 'Quality', value: project.health.quality },
            { label: 'Safety', value: project.health.safety },
            { label: 'Billing', value: project.health.billing },
            { label: 'Procurement', value: project.health.procurement },
            { label: 'Resources', value: project.health.resources },
            { label: 'Overall', value: project.health.overall },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <HealthBadge health={item.value} />
            </div>
          ))}
        </div>
      </Card>

      {/* Budget vs Actual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Budget Analysis</h3>
          <div className="space-y-3">
            {[
              { label: 'Original Budget', value: project.budget.originalBudget, color: 'bg-blue-500' },
              { label: 'Revised Budget', value: project.budget.revisedBudget, color: 'bg-indigo-500' },
              { label: 'Committed Cost', value: project.budget.committedCost, color: 'bg-purple-500' },
              { label: 'Actual Cost', value: project.budget.actualCost, color: 'bg-green-500' },
              { label: 'Forecast Cost', value: project.budget.forecastCost, color: 'bg-orange-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.value)}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(item.value / project.budget.revisedBudget) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Cost Breakdown</h3>
          {analytics?.costAnalysis && (
            <div className="space-y-2">
              {[
                { label: 'Material', value: analytics.costAnalysis.costBreakdown.material, color: 'bg-blue-500' },
                { label: 'Labour', value: analytics.costAnalysis.costBreakdown.labour, color: 'bg-green-500' },
                { label: 'Plant', value: analytics.costAnalysis.costBreakdown.plant, color: 'bg-purple-500' },
                { label: 'Subcontract', value: analytics.costAnalysis.costBreakdown.subcontract, color: 'bg-orange-500' },
                { label: 'Overhead', value: analytics.costAnalysis.costBreakdown.overhead, color: 'bg-pink-500' },
              ].map((item, i) => {
                const total = Object.values(analytics.costAnalysis.costBreakdown).reduce((a, b) => a + b, 0);
                const percent = (item.value / total) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.value)}</span>
                    <span className="text-xs text-gray-500 w-12 text-right">{percent.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* WBS Progress, Risks, Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="none">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">WBS Progress</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-80 overflow-y-auto">
            {wbsItems.filter(w => w.level === 1).map(wbs => (
              <div key={wbs.id} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{wbs.wbsName}</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{wbs.progress}%</span>
                </div>
                <ProgressBar value={wbs.progress} showLabel={false} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Risks</h3>
            <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">{risks.length}</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-80 overflow-y-auto">
            {risks.map(risk => (
              <div key={risk.id} className="px-5 py-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    risk.riskScore >= 15 ? 'text-red-500' : risk.riskScore >= 8 ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{risk.riskTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Score: {risk.riskScore} · {risk.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Open Issues</h3>
            <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">{issues.filter(i => i.status !== 'CLOSED').length}</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-80 overflow-y-auto">
            {issues.map(issue => (
              <div key={issue.id} className="px-5 py-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    issue.priority === 'CRITICAL' ? 'text-red-500' :
                    issue.priority === 'HIGH' ? 'text-orange-500' :
                    issue.priority === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.issueTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{issue.priority} · {issue.ownerName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Project Team</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {teamMembers.map(member => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {member.userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.userName}</p>
                <p className="text-xs text-gray-500">{member.role.replace(/_/g, ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// CONTRACT TAB
// ============================================================
function ContractTab({ project }: { project: ProjectMaster }) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Contract Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Contract Information</h4>
          {[
            { label: 'Contract Number', value: project.contractNumber || 'N/A' },
            { label: 'Tender Number', value: project.tenderNumber || 'N/A' },
            { label: 'LOA Number', value: project.loaNumber || 'N/A' },
            { label: 'Work Order', value: project.workOrderNumber || 'N/A' },
            { label: 'Agreement', value: project.agreementNumber || 'N/A' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-mono text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Parties</h4>
          {[
            { label: 'Client', value: project.client },
            { label: 'Employer', value: project.employer || 'N/A' },
            { label: 'Consultant', value: project.consultant || 'N/A' },
            { label: 'Authority', value: project.authority || 'N/A' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Financial Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-500">Contract Value</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(project.contractValue)}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-gray-500">Revised Value</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(project.revisedValue || project.contractValue)}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-xs text-gray-500">GST</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{project.gstPercent || 0}%</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-gray-500">EOT / DLP</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{project.eotDays || 0} / {project.dlpDays || 0} days</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// BOQ TAB
// ============================================================
function BOQTab({ project }: { project: ProjectMaster }) {
  const { boqItems } = useProjectStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Bill of Quantities</h3>
          <p className="text-xs text-gray-500 mt-0.5">{boqItems.length} items · Linked to WBS and cost codes</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add BOQ Item</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">UOM</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Qty</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rate</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Executed</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {boqItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{item.boqCode}</td>
                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white max-w-xs truncate">{item.description}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{item.uomName}</td>
                <td className="px-5 py-3 text-sm text-right text-gray-900 dark:text-white">{item.quantity.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm text-right text-gray-900 dark:text-white">₹{item.rate.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">{formatCurrency(item.amount)}</td>
                <td className="px-5 py-3 text-sm text-right text-gray-600 dark:text-gray-400">{item.executedQuantity.toLocaleString()}</td>
                <td className="px-5 py-3 w-32">
                  <ProgressBar value={(item.executedQuantity / item.quantity) * 100} showLabel={true} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// WBS TAB
// ============================================================
function WBSTab({ project }: { project: ProjectMaster }) {
  const { wbsItems } = useProjectStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Work Breakdown Structure</h3>
          <p className="text-xs text-gray-500 mt-0.5">Project → Package → Structure → Area → Work Front → Activity</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add WBS Element</Button>
      </div>
      <div className="p-5">
        <div className="space-y-1">
          {wbsItems.filter(w => w.level === 1).map(wbs => (
            <WBSNode key={wbs.id} wbs={wbs} allWBS={wbsItems} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function WBSNode({ wbs, allWBS }: { wbs: WBS; allWBS: WBS[] }) {
  const [open, setOpen] = useState(true);
  const children = allWBS.filter(w => w.parentId === wbs.id);

  const typeColors: Record<string, string> = {
    PACKAGE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    STRUCTURE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    AREA: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    WORK_FRONT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    ACTIVITY: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    SUB_ACTIVITY: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div>
      <button
        onClick={() => children.length > 0 && setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 text-left"
        style={{ paddingLeft: `${(wbs.level - 1) * 20 + 12}px` }}
      >
        {children.length > 0 ? (
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`} />
        ) : (
          <div className="w-3.5" />
        )}
        <span className="text-xs font-mono text-gray-500">{wbs.wbsCode}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{wbs.wbsName}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeColors[wbs.wbsType] || typeColors.SUB_ACTIVITY}`}>
          {wbs.wbsType.replace(/_/g, ' ')}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">{formatCurrency(wbs.budget)}</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">{wbs.progress}%</span>
        </div>
      </button>
      {open && children.map(child => <WBSNode key={child.id} wbs={child} allWBS={allWBS} />)}
    </div>
  );
}

// ============================================================
// EXECUTION TAB
// ============================================================
function ExecutionTab({ project }: { project: ProjectMaster }) {
  const { workFronts } = useProjectStore();

  return (
    <div className="space-y-6">
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Work Fronts</h3>
            <p className="text-xs text-gray-500 mt-0.5">Active execution areas with planned vs actual quantities</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Work Front</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Engineer</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Planned</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actual</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {workFronts.map(wf => (
                <tr key={wf.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{wf.workFrontCode}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{wf.workFrontName}</td>
                  <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{wf.workFrontType.replace(/_/g, ' ')}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{wf.responsibleEngineerName}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-900 dark:text-white">{wf.plannedQuantity.toLocaleString()} {wf.uomName}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-900 dark:text-white">{wf.actualQuantity.toLocaleString()} {wf.uomName}</td>
                  <td className="px-5 py-3 w-32">
                    <ProgressBar value={(wf.actualQuantity / wf.plannedQuantity) * 100} showLabel={true} size="sm" />
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={wf.status === 'IN_PROGRESS' ? 'SUBMITTED' : wf.status === 'COMPLETED' ? 'APPROVED' : 'DRAFT'} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// RISKS TAB
// ============================================================
function RisksTab({ project }: { project: ProjectMaster }) {
  const { risks } = useProjectStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Risk Register</h3>
          <p className="text-xs text-gray-500 mt-0.5">{risks.length} risks identified · Probability × Impact scoring</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Risk</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Risk</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Probability</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Impact</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Owner</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {risks.map(risk => (
              <tr key={risk.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{risk.riskTitle}</td>
                <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{risk.category}</span></td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{risk.probability.replace(/_/g, ' ')}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{risk.impact}</td>
                <td className="px-5 py-3">
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                    risk.riskScore >= 15 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    risk.riskScore >= 8 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {risk.riskScore}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{risk.ownerName}</td>
                <td className="px-5 py-3"><StatusBadge status={risk.status === 'MITIGATING' ? 'SUBMITTED' : risk.status === 'MONITORING' ? 'PENDING_APPROVAL' : 'DRAFT'} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// ISSUES TAB
// ============================================================
function IssuesTab({ project }: { project: ProjectMaster }) {
  const { issues } = useProjectStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Issue Register</h3>
          <p className="text-xs text-gray-500 mt-0.5">{issues.length} issues tracked</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Issue</Button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {issues.map(issue => (
          <div key={issue.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                issue.priority === 'CRITICAL' ? 'text-red-500' :
                issue.priority === 'HIGH' ? 'text-orange-500' :
                issue.priority === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{issue.issueTitle}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    issue.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    issue.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                    issue.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {issue.priority}
                  </span>
                </div>
                {issue.description && <p className="text-xs text-gray-500 mb-2">{issue.description}</p>}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Owner: {issue.ownerName}</span>
                  <span>Raised: {new Date(issue.raisedDate).toLocaleDateString()}</span>
                  {issue.dueDate && <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>}
                  <StatusBadge status={issue.status === 'OPEN' ? 'DRAFT' : issue.status === 'IN_PROGRESS' ? 'SUBMITTED' : 'APPROVED'} size="sm" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// CORRESPONDENCE TAB
// ============================================================
function CorrespondenceTab({ project }: { project: ProjectMaster }) {
  const { correspondence } = useProjectStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Correspondence</h3>
          <p className="text-xs text-gray-500 mt-0.5">{correspondence.length} letters tracked</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>New Letter</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Letter #</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">From / To</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {correspondence.map(corr => (
              <tr key={corr.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{corr.letterNumber}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(corr.letterDate).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{corr.fromParty} → {corr.toParty}</td>
                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{corr.subject}</td>
                <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{corr.correspondenceType}</span></td>
                <td className="px-5 py-3"><StatusBadge status={corr.status === 'SENT' ? 'SUBMITTED' : corr.status === 'RECEIVED' ? 'PENDING_APPROVAL' : 'DRAFT'} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// MEETINGS TAB
// ============================================================
function MeetingsTab({ project }: { project: ProjectMaster }) {
  const { meetings } = useProjectStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Meetings</h3>
          <p className="text-xs text-gray-500 mt-0.5">{meetings.length} meetings with action items</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Schedule Meeting</Button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {meetings.map(meeting => (
          <div key={meeting.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{meeting.meetingTitle}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(meeting.meetingDate).toLocaleDateString()} at {meeting.meetingTime} · {meeting.location}
                </p>
              </div>
              <StatusBadge status={meeting.status === 'COMPLETED' ? 'APPROVED' : meeting.status === 'SCHEDULED' ? 'SUBMITTED' : 'DRAFT'} size="sm" />
            </div>
            {meeting.minutes && <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{meeting.minutes}</p>}
            {meeting.actionItems.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Action Items:</p>
                <div className="space-y-1">
                  {meeting.actionItems.map(ai => (
                    <div key={ai.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${ai.status === 'COMPLETED' ? 'bg-green-500' : ai.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      <span className="text-gray-600 dark:text-gray-400 flex-1">{ai.description}</span>
                      <span className="text-gray-500">{ai.ownerName}</span>
                      <span className="text-gray-400">Due: {new Date(ai.dueDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// REPORTS TAB
// ============================================================
function ReportsTab({ project }: { project: ProjectMaster }) {
  const reports = [
    { name: 'Project Summary', description: 'Complete project overview with KPIs', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'WBS Progress', description: 'Hierarchical progress report', icon: <FolderTree className="w-5 h-5" /> },
    { name: 'BOQ Progress', description: 'Bill of quantities execution', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'Daily Progress', description: 'Day-wise execution report', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Productivity Report', description: 'Labour and plant productivity', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Delay Register', description: 'All delays with analysis', icon: <Clock className="w-5 h-5" /> },
    { name: 'Risk Register', description: 'Risk analysis and mitigation', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Issue Register', description: 'Open and closed issues', icon: <AlertCircle className="w-5 h-5" /> },
    { name: 'Correspondence', description: 'All project letters', icon: <Mail className="w-5 h-5" /> },
    { name: 'Meeting Actions', description: 'Action items tracker', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Project Cost', description: 'Cost analysis and variance', icon: <Dollar className="w-5 h-5" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((report, i) => (
        <Card key={i} hover>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              {report.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{report.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{report.description}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1">View</Button>
            <Button variant="outline" size="sm" icon={<Download className="w-3 h-3" />}>PDF</Button>
            <Button variant="outline" size="sm" icon={<Download className="w-3 h-3" />}>Excel</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// MODULE PLACEHOLDER
// ============================================================
function ModulePlaceholder({ tab }: { tab: string }) {
  const tabNames: Record<string, string> = {
    planning: 'Planning & Scheduling',
    procurement: 'Procurement',
    materials: 'Materials',
    store: 'Store Management',
    billing: 'Billing & RA Bills',
    accounts: 'Accounts',
    hr: 'Human Resources',
    attendance: 'Attendance',
    plant: 'Plant & Machinery',
    rmc: 'RMC Plant',
    quality: 'QA/QC',
    safety: 'Safety/HSE',
    documents: 'Documents',
    claims: 'Claims',
    eot: 'Extension of Time',
    audit: 'Audit Trail',
  };

  return (
    <Card>
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🚧</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tabNames[tab] || tab}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
          This module will be available in upcoming parts. The foundation is ready and integrated with the project object.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Coming in Parts 07-30</span>
        </div>
      </div>
    </Card>
  );
}

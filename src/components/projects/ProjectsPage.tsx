// ============================================================
// BUILDCORE ERP - PROJECTS PAGE
// Demonstrates Enterprise Hierarchy & Project Management
// ============================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Calendar, DollarSign, Users, TrendingUp,
  ChevronRight, Filter, Plus, Search, Grid3X3, List,
  ArrowUpRight, Clock, CheckCircle2, AlertTriangle, HardHat
} from 'lucide-react';
import { Card, Button, StatusBadge, ProgressBar, Input } from '../ui';
import { useDataStore } from '../../store';
import { formatCurrency } from '../ui';
import type { Project } from '../../types';

export function ProjectsPage() {
  const { projects } = useDataStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const projectTypeColors: Record<string, string> = {
    ROAD: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    METRO: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    BRIDGE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    EPC: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    DAM: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    TUNNEL: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    BUILDING: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    WATER_INFRA: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  };

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {projects.length} active projects · {formatCurrency(projects.reduce((s, p) => s + p.contractValue, 0))} total value
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, code, client, or type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" icon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Hierarchy Breadcrumb */}
      <Card padding="sm">
        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            BuildCore Infrastructure
          </span>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded font-medium text-blue-700 dark:text-blue-300 whitespace-nowrap">
            All Projects ({projects.length})
          </span>
          <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 whitespace-nowrap">Package → Site → Area → WBS → Activity → Cost Code</span>
        </div>
      </Card>

      {/* Project Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover onClick={() => setSelectedProject(project)} padding="none">
                <div className="p-5">
                  {/* Project Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${projectTypeColors[project.type] || 'bg-gray-100 text-gray-600'}`}>
                          {project.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{project.code}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{project.name}</h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>

                  {/* Client & Location */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.clientName}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
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

                  {/* Financials */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Contract Value</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(project.contractValue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase">Spent</p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{formatCurrency(project.spent)}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    <span>→</span>
                    <span>{new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <StatusBadge status="APPROVED" size="sm" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Value</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filteredProjects.map(project => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedProject(project)}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.code} · {project.location}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{project.clientName}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${projectTypeColors[project.type] || 'bg-gray-100 text-gray-600'}`}>
                        {project.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(project.contractValue)}</td>
                    <td className="px-5 py-4 w-32">
                      <ProgressBar value={project.progress} showLabel={true} size="sm" />
                    </td>
                    <td className="px-5 py-4"><StatusBadge status="APPROVED" size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// PROJECT DETAIL VIEW
// ============================================================
function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      {/* Back Button & Header */}
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Projects
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">{project.code}</span>
              <StatusBadge status="APPROVED" size="sm" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.clientName} · {project.location}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="primary" size="sm">New Transaction</Button>
          </div>
        </div>
      </div>

      {/* Project Hierarchy */}
      <Card padding="sm">
        <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
          {['Company', 'Business Unit', 'Project', 'Package', 'Site', 'Area', 'WBS', 'Activity', 'Cost Code'].map((level, i) => (
            <React.Fragment key={level}>
              <span className={`px-2 py-1 rounded font-medium whitespace-nowrap ${
                i <= 2 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {level}
              </span>
              {i < 8 && <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">Contract Value</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(project.contractValue)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">Spent to Date</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(project.spent)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{project.progress}%</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 dark:text-gray-400">Timeline</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))} months left
          </p>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Project Details</h3>
          <div className="space-y-3">
            {[
              { label: 'Project Type', value: project.type.replace('_', ' ') },
              { label: 'Client', value: project.clientName },
              { label: 'Location', value: project.location },
              { label: 'Start Date', value: new Date(project.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'End Date', value: new Date(project.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'Budget Utilization', value: `${((project.spent / project.budget) * 100).toFixed(1)}%` },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Budget vs Actual</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-600 dark:text-gray-400">Budget Utilization</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{((project.spent / project.budget) * 100).toFixed(1)}%</span>
              </div>
              <ProgressBar value={project.spent} max={project.budget} color="blue" showLabel={false} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-600 dark:text-gray-400">Physical Progress</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} color="green" showLabel={false} />
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Remaining Budget</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(project.budget - project.spent)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Variance</p>
                  <p className={`text-lg font-bold ${project.progress > (project.spent / project.budget) * 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {(project.progress - (project.spent / project.budget) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Access Points */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Project Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'Procurement', icon: '🚚', count: 45 },
            { label: 'Billing', icon: '💰', count: 12 },
            { label: 'Inventory', icon: '📦', count: 89 },
            { label: 'Labour', icon: '👷', count: 234 },
            { label: 'Plant', icon: '🔧', count: 18 },
            { label: 'Quality', icon: '✅', count: 56 },
            { label: 'Safety', icon: '🛡️', count: 34 },
            { label: 'Documents', icon: '📁', count: 127 },
          ].map((mod, i) => (
            <button key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all text-left">
              <span className="text-xl">{mod.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{mod.label}</p>
                <p className="text-xs text-gray-400">{mod.count} records</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

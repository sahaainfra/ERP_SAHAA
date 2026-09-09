// ============================================================
// BUILDCORE ERP - SIDEBAR NAVIGATION
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, HardHat, Truck, FileText, DollarSign,
  Users, Package, ClipboardList, Shield, BarChart3, Settings,
  ChevronLeft, ChevronRight, FolderTree, Wrench, Beaker,
  Calendar, FileCheck, Scale
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useThemeStore } from '../../store';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  activeModule: string;
  onModuleChange: (module: string) => void;
  onToggle: () => void;
  onMobileClose: () => void;
}

const navGroups = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'bi', label: 'BI Dashboard', icon: BarChart3 },
      { id: 'projects', label: 'Projects', icon: Building2 },
      { id: 'planning', label: 'Planning', icon: Calendar },
      { id: 'tender', label: 'Tender', icon: FileText },
      { id: 'rate', label: 'Rate Library', icon: FileText },
      { id: 'boq', label: 'BOQ & Estimation', icon: FileText },
      { id: 'sites', label: 'Sites', icon: HardHat },
    ]
  },
  {
    label: 'Workflow',
    items: [
      { id: 'approvals', label: 'Approval Center', icon: FileCheck },
      { id: 'workflow', label: 'Workflow Dashboard', icon: BarChart3 },
    ]
  },
  {
    label: 'Enterprise',
    items: [
      { id: 'admin', label: 'Admin Settings', icon: Settings },
      { id: 'security', label: 'Security & Users', icon: Shield },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'procurement', label: 'Procurement', icon: Truck },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'materials', label: 'Material Master', icon: Package },
      { id: 'vendors', label: 'Vendor Management', icon: Users },
      { id: 'plant', label: 'Plant & Machinery', icon: Wrench },
      { id: 'rmc', label: 'RMC Plant', icon: Beaker },
      { id: 'labour', label: 'Labour', icon: Users },
    ]
  },
  {
    label: 'Finance',
    items: [
      { id: 'contracts', label: 'Contracts', icon: FileText },
      { id: 'commercial', label: 'Commercial Changes', icon: DollarSign },
      { id: 'billing', label: 'Billing & RA Bills', icon: ClipboardList },
      { id: 'finance', label: 'Finance & Accounts', icon: DollarSign },
      { id: 'budget', label: 'Budget & Cost', icon: BarChart3 },
    ]
  },
  {
    label: 'Compliance',
    items: [
      { id: 'quality', label: 'Quality (QA/QC)', icon: FileCheck },
      { id: 'safety', label: 'Safety (HSE)', icon: Shield },
      { id: 'legal', label: 'Legal & Compliance', icon: Scale },
    ]
  },
  {
    label: 'Administration',
    items: [
      { id: 'documents', label: 'Documents', icon: FolderTree },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'approvals', label: 'Approvals', icon: Calendar },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  },
];

export function Sidebar({ collapsed, mobileOpen, activeModule, onModuleChange, onToggle, onMobileClose }: SidebarProps) {
  const { resolvedTheme } = useThemeStore();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed ? (
          <Logo variant="compact" theme={resolvedTheme} />
        ) : (
          <Logo variant="icon" />
        )}
        {!collapsed && (
          <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:block">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onModuleChange(item.id); onMobileClose(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    {!collapsed && <span>{item.label}</span>}
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        {collapsed ? (
          <button onClick={onToggle} className="w-full flex justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              BC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">BuildCore Infra</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">FY 2025-26</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-2xl"
          >
            <NavContent />
          </motion.aside>
        </div>
      )}
    </>
  );
}

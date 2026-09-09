// ============================================================
// BUILDCORE ERP - ADMIN SETTINGS PAGE
// Part 02: Enterprise Organization & Financial Structure
// Complete admin configuration interface
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Briefcase, MapPin, Users, Award, Calendar, Lock,
  DollarSign, Percent, Ruler, CreditCard, FolderTree, FileText,
  GitBranch, ShieldCheck, Hash, History, ChevronRight, ChevronDown,
  Plus, Edit, Eye, Search, Filter, Download, Printer, Check,
  AlertCircle, X, Save, RefreshCw, ArrowLeft, Layers, Globe,
  Clock, TrendingUp, BarChart3, Package, Truck, HardHat, AlertTriangle
} from 'lucide-react';
import { Card, Button, StatusBadge, Input, Select } from '../ui';
import { useMasterDataStore } from '../../store/masterStore';
import { useAuthStore } from '../../store';
import { formatCurrency } from '../ui';
import type {
  CompanyMaster, BusinessUnitMaster, BranchMaster, DepartmentMaster,
  DesignationMaster, FinancialYear, AccountingPeriod, CurrencyMaster,
  TaxMaster, UOMMaster, PaymentTermsMaster, CostCodeMaster,
  DocumentTypeMaster, StatusMaster, ApprovalAuthorityMaster,
  MasterDataChangeLog
} from '../../types/master';

// ============================================================
// MAIN ADMIN PAGE
// ============================================================
export function AdminPage() {
  const { user } = useAuthStore();
  const { initialize, initialized } = useMasterDataStore();

  useEffect(() => {
    if (!initialized && user) {
      initialize(user.companyId, user.id);
    }
  }, [user, initialized, initialize]);

  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company', icon: <Building2 className="w-4 h-4" /> },
    { id: 'org', label: 'Organization', icon: <Layers className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial Year', icon: <Calendar className="w-4 h-4" /> },
    { id: 'currency', label: 'Currency', icon: <Globe className="w-4 h-4" /> },
    { id: 'tax', label: 'Tax', icon: <Percent className="w-4 h-4" /> },
    { id: 'uom', label: 'UOM', icon: <Ruler className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment Terms', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'costcode', label: 'Cost Codes', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'doctype', label: 'Document Types', icon: <FileText className="w-4 h-4" /> },
    { id: 'approval', label: 'Approval Authority', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'numbering', label: 'Number Series', icon: <Hash className="w-4 h-4" /> },
    { id: 'history', label: 'Change History', icon: <History className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Company Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enterprise Organization & Financial Structure Configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            New Master
          </Button>
        </div>
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
        {activeTab === 'company' && <CompanyTab />}
        {activeTab === 'org' && <OrganizationTab />}
        {activeTab === 'financial' && <FinancialYearTab />}
        {activeTab === 'currency' && <CurrencyTab />}
        {activeTab === 'tax' && <TaxTab />}
        {activeTab === 'uom' && <UOMTab />}
        {activeTab === 'payment' && <PaymentTermsTab />}
        {activeTab === 'costcode' && <CostCodeTab />}
        {activeTab === 'doctype' && <DocumentTypeTab />}
        {activeTab === 'approval' && <ApprovalAuthorityTab />}
        {activeTab === 'numbering' && <NumberSeriesTab />}
        {activeTab === 'history' && <ChangeHistoryTab />}
        {activeTab === 'dashboard' && <CompanyDashboardTab />}
      </motion.div>
    </div>
  );
}

// ============================================================
// TAB: COMPANY MASTER
// ============================================================
function CompanyTab() {
  const { companies } = useMasterDataStore();
  const [selected, setSelected] = useState<CompanyMaster | null>(null);

  if (selected) {
    return <CompanyDetail company={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-4">
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Company Master</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{companies.length} companies registered</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Company</Button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {companies.map(company => (
            <div key={company.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors" onClick={() => setSelected(company)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {company.companyCode.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{company.legalName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{company.tradeName} · {company.companyType.replace(/_/g, ' ')}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>GSTIN: <span className="font-mono">{company.gstin}</span></span>
                      <span>PAN: <span className="font-mono">{company.panNumber}</span></span>
                      <span>CIN: <span className="font-mono">{company.cinNumber || 'N/A'}</span></span>
                    </div>
                  </div>
                </div>
                <StatusBadge status="APPROVED" size="sm" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CompanyDetail({ company, onBack }: { company: CompanyMaster; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
            {company.companyCode.slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{company.legalName}</h2>
              <StatusBadge status="APPROVED" size="md" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{company.tradeName} · {company.companyType.replace(/_/g, ' ')}</p>
            <p className="text-xs text-gray-400 mt-1">Code: {company.companyCode} · Reg: {company.registrationNumber}</p>
          </div>
          <Button variant="outline" size="sm" icon={<Edit className="w-4 h-4" />}>Edit</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Tax & Legal</h4>
            {[
              { label: 'GSTIN', value: company.gstin },
              { label: 'PAN', value: company.panNumber },
              { label: 'TAN', value: company.tanNumber || 'N/A' },
              { label: 'CIN', value: company.cinNumber || 'N/A' },
              { label: 'MSME/Udyam', value: company.msmeUdyam || 'N/A' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-mono text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Contact</h4>
            {[
              { label: 'Phone', value: company.contactNumber },
              { label: 'Email', value: company.email },
              { label: 'Website', value: company.website || 'N/A' },
              { label: 'Signatory', value: company.authorizedSignatory },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Registered Address</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {company.registeredAddress.line1}, {company.registeredAddress.line2}, {company.registeredAddress.city} - {company.registeredAddress.pin}, {company.registeredAddress.state}, {company.registeredAddress.country}
          </p>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Bank Accounts</h4>
          <div className="space-y-2">
            {company.bankAccounts.map(bank => (
              <div key={bank.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{bank.bankName} - {bank.branchName}</p>
                  <p className="text-xs text-gray-500 font-mono">A/C: {bank.accountNumber} · IFSC: {bank.ifscCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300">{bank.accountType}</span>
                  {bank.isDefault && <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Default</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// TAB: ORGANIZATION TREE
// ============================================================
function OrganizationTab() {
  const { companies, businessUnits, branches, departments } = useMasterDataStore();

  return (
    <div className="space-y-4">
      {/* Org Tree */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Organization Hierarchy</h3>
        <div className="space-y-2">
          {companies.map(company => (
            <TreeNode key={company.id} label={company.legalName} sublabel={company.companyCode} icon={<Building2 className="w-4 h-4 text-blue-500" />} level={0} defaultOpen>
              {businessUnits.filter(bu => bu.companyId === company.id).map(bu => (
                <TreeNode key={bu.id} label={bu.name} sublabel={bu.code} icon={<Briefcase className="w-4 h-4 text-purple-500" />} level={1}>
                  {branches.filter(br => br.businessUnitId === bu.id).map(br => (
                    <TreeNode key={br.id} label={br.branchName} sublabel={br.branchCode} icon={<MapPin className="w-4 h-4 text-green-500" />} level={2}>
                      {departments.filter(d => d.companyId === company.id).slice(0, 5).map(dept => (
                        <TreeNode key={dept.id} label={dept.departmentName} sublabel={dept.departmentCode} icon={<Users className="w-4 h-4 text-orange-500" />} level={3} isLeaf />
                      ))}
                      {departments.filter(d => d.companyId === company.id).length > 5 && (
                        <div className="pl-6 py-1 text-xs text-gray-400">+ {departments.filter(d => d.companyId === company.id).length - 5} more departments</div>
                      )}
                    </TreeNode>
                  ))}
                </TreeNode>
              ))}
            </TreeNode>
          ))}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-blue-600">{companies.length}</p>
          <p className="text-xs text-gray-500 mt-1">Companies</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-purple-600">{businessUnits.length}</p>
          <p className="text-xs text-gray-500 mt-1">Business Units</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-green-600">{branches.length}</p>
          <p className="text-xs text-gray-500 mt-1">Branches</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-orange-600">{departments.length}</p>
          <p className="text-xs text-gray-500 mt-1">Departments</p>
        </Card>
      </div>

      {/* Business Units Table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Business Units</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Head</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {businessUnits.map(bu => (
                <tr key={bu.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{bu.code}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{bu.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{bu.headName || '-'}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{bu.description || '-'}</td>
                  <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Departments Table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Departments</h3>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-gray-800">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {departments.map(dept => (
                <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-2.5 text-sm font-mono text-gray-600 dark:text-gray-400">{dept.departmentCode}</td>
                  <td className="px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-white">{dept.departmentName}</td>
                  <td className="px-5 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded ${dept.isSystem ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                      {dept.isSystem ? 'System' : 'Custom'}
                    </span>
                  </td>
                  <td className="px-5 py-2.5"><StatusBadge status="APPROVED" size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Tree Node Component
function TreeNode({ label, sublabel, icon, level, children, isLeaf, defaultOpen }: { label: string; sublabel?: string; icon?: React.ReactNode; level: number; children?: React.ReactNode; isLeaf?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const pl = level * 24;

  return (
    <div>
      <button
        onClick={() => !isLeaf && setOpen(!open)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors text-left`}
        style={{ paddingLeft: `${pl + 12}px` }}
      >
        {!isLeaf && (
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`} />
        )}
        {isLeaf && <div className="w-3.5" />}
        {icon}
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        {sublabel && <span className="text-xs text-gray-400 font-mono">({sublabel})</span>}
      </button>
      {open && children && <div>{children}</div>}
    </div>
  );
}

// ============================================================
// TAB: FINANCIAL YEAR & PERIOD CONTROL
// ============================================================
function FinancialYearTab() {
  const { financialYears, accountingPeriods, updateFY, updatePeriod } = useMasterDataStore();
  const { user } = useAuthStore();
  const [selectedFY, setSelectedFY] = useState<string>(financialYears.find(f => f.isCurrent)?.id || '');

  const periods = accountingPeriods.filter(p => p.financialYearId === selectedFY);

  return (
    <div className="space-y-4">
      {/* Financial Years */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Financial Years</h3>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add FY</Button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {financialYears.map(fy => (
            <div key={fy.id} className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-colors ${fy.isCurrent ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`} onClick={() => setSelectedFY(fy.id)}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fy.isCurrent ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Calendar className={`w-5 h-5 ${fy.isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{fy.fyName}</h4>
                    {fy.isCurrent && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">CURRENT</span>}
                    {fy.isClosed && <span className="text-[10px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded font-medium">CLOSED</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(fy.startDate).toLocaleDateString('en-IN')} → {new Date(fy.endDate).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </Card>

      {/* Period Control */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Period Control - {financialYears.find(f => f.id === selectedFY)?.fyName}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Manage accounting periods. Posting is only allowed in OPEN periods.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 p-5">
          {periods.map(period => (
            <div key={period.id} className={`p-3 rounded-xl border-2 transition-all ${
              period.status === 'OPEN' ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' :
              period.status === 'CLOSED' ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800' :
              'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">P{period.periodNumber}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${
                  period.status === 'OPEN' ? 'bg-green-500' : period.status === 'CLOSED' ? 'bg-gray-400' : 'bg-red-500'
                }`} />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{period.periodName}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{period.status}</p>
              <div className="mt-2 flex gap-1">
                {period.status === 'CLOSED' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); updatePeriod(period.id, { status: 'OPEN' }, user?.id || '', 'Reopened for adjustment'); }}
                    className="text-[10px] px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Reopen
                  </button>
                )}
                {period.status === 'OPEN' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); updatePeriod(period.id, { status: 'CLOSED' }, user?.id || ''); }}
                    className="text-[10px] px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// TAB: CURRENCY
// ============================================================
function CurrencyTab() {
  const { currencies } = useMasterDataStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Currency Master</h3>
          <p className="text-xs text-gray-500 mt-0.5">Multi-currency support with exchange rates</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Currency</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Symbol</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Decimals</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Base</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rate (→ INR)</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {currencies.map(cur => (
              <tr key={cur.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-3 text-sm font-mono font-medium text-gray-900 dark:text-white">{cur.currencyCode}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{cur.currencyName}</td>
                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white font-medium">{cur.symbol}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{cur.decimalPlaces}</td>
                <td className="px-5 py-3">{cur.isBase ? <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Base</span> : '-'}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{cur.exchangeRates[0] ? `1 ${cur.currencyCode} = ₹${cur.exchangeRates[0].rate}` : '-'}</td>
                <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// TAB: TAX
// ============================================================
function TaxTab() {
  const { taxes } = useMasterDataStore();
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? taxes : taxes.filter(t => t.taxType === filter);
  const types = ['ALL', 'GST', 'CGST', 'SGST', 'IGST', 'CESS', 'TDS', 'TCS'];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === type ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Tax Master</h3>
            <p className="text-xs text-gray-500 mt-0.5">Configurable tax rates with effective dates. No hard-coded percentages.</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Tax</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rate</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Effective From</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filtered.map(tax => (
                <tr key={tax.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{tax.taxCode}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{tax.taxName}</td>
                  <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{tax.taxType}</span></td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white">{tax.rate}%</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(tax.effectiveFrom).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
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
// TAB: UOM
// ============================================================
function UOMTab() {
  const { uoms } = useMasterDataStore();
  const [filter, setFilter] = useState('ALL');
  const categories = ['ALL', 'COUNT', 'WEIGHT', 'VOLUME', 'LENGTH', 'AREA', 'TIME'];
  const filtered = filter === 'ALL' ? uoms : uoms.filter(u => u.uomCategory === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
            {cat}
          </button>
        ))}
      </div>

      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Unit of Measurement</h3>
            <p className="text-xs text-gray-500 mt-0.5">Configurable UOMs with conversion factors</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add UOM</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Decimals</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Conversions</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filtered.map(uom => (
                <tr key={uom.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-sm font-mono font-medium text-gray-900 dark:text-white">{uom.uomCode}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{uom.uomName}</td>
                  <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{uom.uomCategory}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{uom.decimalPlaces}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{uom.conversions.length} rules</td>
                  <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Conversion Rules */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Active Conversion Rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {uoms.filter(u => u.conversions.length > 0).flatMap(uom =>
            uom.conversions.map(conv => {
              const toUOM = uoms.find(u => u.id === conv.toUOMId);
              return (
                <div key={conv.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-xs">
                  <span className="font-mono font-medium text-gray-900 dark:text-white">1 {uom.uomCode}</span>
                  <span className="text-gray-400">=</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-white">{conv.conversionFactor} {toUOM?.uomCode || '?'}</span>
                  {conv.isBidirectional && <span className="text-[9px] px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded">↔</span>}
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// TAB: PAYMENT TERMS
// ============================================================
function PaymentTermsTab() {
  const { paymentTerms } = useMasterDataStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Payment Terms</h3>
          <p className="text-xs text-gray-500 mt-0.5">Credit days, milestones, retention, and advance configurations</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Terms</Button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {paymentTerms.map(pt => (
          <div key={pt.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{pt.termsName}</h4>
                  <span className="text-[10px] font-mono text-gray-400">{pt.termsCode}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{pt.paymentType.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Credit: {pt.creditDays} days {pt.retentionPercent ? `· Retention: ${pt.retentionPercent}%` : ''} {pt.advancePercent ? `· Advance: ${pt.advancePercent}%` : ''}</p>
              </div>
              <StatusBadge status="APPROVED" size="sm" />
            </div>
            {pt.milestones && pt.milestones.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pt.milestones.map(ms => (
                  <div key={ms.id} className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <span className="font-medium text-blue-700 dark:text-blue-300">{ms.percent}%</span>
                    <span className="text-blue-600 dark:text-blue-400">{ms.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// TAB: COST CODES
// ============================================================
function CostCodeTab() {
  const { costCodes } = useMasterDataStore();
  const topLevel = costCodes.filter(c => c.level === 1);

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Cost Code Master</h3>
          <p className="text-xs text-gray-500 mt-0.5">Hierarchical cost codes for project cost tracking</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Cost Code</Button>
      </div>
      <div className="p-5">
        <div className="space-y-1">
          {topLevel.map(cc => (
            <CostCodeNode key={cc.id} code={cc} allCodes={costCodes} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function CostCodeNode({ code, allCodes }: { code: CostCodeMaster; allCodes: CostCodeMaster[] }) {
  const [open, setOpen] = useState(true);
  const children = allCodes.filter(c => c.parentId === code.id);
  const categoryColors: Record<string, string> = {
    MATERIAL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    LABOUR: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    PLANT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    OVERHEAD: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    SUBCONTRACT: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  };

  return (
    <div>
      <button onClick={() => children.length > 0 && setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 text-left" style={{ paddingLeft: `${(code.level - 1) * 20 + 12}px` }}>
        {children.length > 0 ? <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`} /> : <div className="w-3.5" />}
        <span className="text-sm font-mono text-gray-500">{code.costCode}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{code.costCodeName}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${categoryColors[code.category] || 'bg-gray-100 text-gray-600'}`}>{code.category}</span>
      </button>
      {open && children.map(child => <CostCodeNode key={child.id} code={child} allCodes={allCodes} />)}
    </div>
  );
}

// ============================================================
// TAB: DOCUMENT TYPES
// ============================================================
function DocumentTypeTab() {
  const { documentTypes } = useMasterDataStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Document Type Master</h3>
          <p className="text-xs text-gray-500 mt-0.5">Configure document types with workflows, numbering, and posting behavior</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Type</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Module</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Attachments</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Financial</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {documentTypes.map(dt => (
              <tr key={dt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-3 text-sm font-mono font-medium text-gray-900 dark:text-white">{dt.docTypeCode}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{dt.docTypeName}</td>
                <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 capitalize">{dt.module}</span></td>
                <td className="px-5 py-3 text-sm text-gray-500">{dt.requiredAttachments} required</td>
                <td className="px-5 py-3">
                  {dt.financialPosting ? (
                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">{dt.postingType}</span>
                  ) : <span className="text-xs text-gray-400">No</span>}
                </td>
                <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// TAB: APPROVAL AUTHORITY
// ============================================================
function ApprovalAuthorityTab() {
  const { approvalAuthorities } = useMasterDataStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Approval Authority Matrix</h3>
          <p className="text-xs text-gray-500 mt-0.5">Financial limits and approval levels per user/role/department</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Authority</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Transaction</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Level</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Financial Limit</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {approvalAuthorities.map(aa => (
              <tr key={aa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{aa.userName}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{aa.roleName}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{aa.departmentName}</td>
                <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{aa.transactionType}</span></td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">L{aa.approvalLevel}</td>
                <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(aa.financialLimit)}</td>
                <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// TAB: NUMBER SERIES
// ============================================================
function NumberSeriesTab() {
  const { documentTypes } = useMasterDataStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Number Series Configuration</h3>
          <p className="text-xs text-gray-500 mt-0.5">Document numbering with prefix, year, sequence, and reset frequency</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Add Series</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Document</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Format</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Example</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reset</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {documentTypes.map(dt => {
              const year = new Date().getFullYear();
              const example = `${dt.docTypeCode}-${year}-000001`;
              return (
                <tr key={dt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{dt.docTypeName}</td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{dt.docTypeCode}-{'{YYYY}'}-{'{SEQ}'}</td>
                  <td className="px-5 py-3 text-sm font-mono text-blue-600 dark:text-blue-400">{example}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">Yearly</td>
                  <td className="px-5 py-3"><StatusBadge status="APPROVED" size="sm" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// TAB: CHANGE HISTORY
// ============================================================
function ChangeHistoryTab() {
  const { changeLogs } = useMasterDataStore();

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Master Data Change History</h3>
          <p className="text-xs text-gray-500 mt-0.5">Complete audit trail of all master data modifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />}>Print</Button>
        </div>
      </div>
      {changeLogs.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-[500px] overflow-y-auto">
          {changeLogs.slice(0, 50).map(log => (
            <div key={log.id} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <History className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{log.fieldName}</span>
                    <span className="text-xs text-gray-400">on</span>
                    <span className="text-sm text-gray-500">{log.entityName}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-red-500 line-through">{log.previousValue.slice(0, 30)}</span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="text-xs text-green-600">{log.newValue.slice(0, 30)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">by {log.changedByName} · {new Date(log.changedAt).toLocaleString()} · Reason: {log.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <History className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500">No change history recorded yet</p>
          <p className="text-xs text-gray-400 mt-1">Changes to master data will be tracked here</p>
        </div>
      )}
    </Card>
  );
}

// ============================================================
// TAB: COMPANY DASHBOARD
// ============================================================
function CompanyDashboardTab() {
  const { dashboardKPIs, companies } = useMasterDataStore();
  const company = companies[0];

  if (!dashboardKPIs || !company) return null;

  const fyProgress = (dashboardKPIs.fyAchieved / dashboardKPIs.fyTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            {company.companyCode.slice(0, 2)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{company.legalName}</h2>
            <p className="text-sm text-gray-500">{company.tradeName} · FY 2025-26</p>
          </div>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Active Projects', value: dashboardKPIs.activeProjects, icon: <Building2 className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Contract Value', value: formatCurrency(dashboardKPIs.totalContractValue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
          { label: 'Billing YTD', value: formatCurrency(dashboardKPIs.totalBilling), icon: <BarChart3 className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { label: 'Receivables', value: formatCurrency(dashboardKPIs.totalReceivables), icon: <DollarSign className="w-5 h-5" />, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
          { label: 'Payables', value: formatCurrency(dashboardKPIs.totalPayables), icon: <CreditCard className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
          { label: 'Cash/Bank', value: formatCurrency(dashboardKPIs.cashBankBalance), icon: <DollarSign className="w-5 h-5" />, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30' },
        ].map((kpi, i) => (
          <Card key={i} padding="sm">
            <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color} w-fit mb-2`}>{kpi.icon}</div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Open POs', value: dashboardKPIs.openPOs, icon: <Truck className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Stock Value', value: formatCurrency(dashboardKPIs.stockValue), icon: <Package className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
          { label: 'Manpower', value: dashboardKPIs.totalManpower.toLocaleString(), icon: <Users className="w-5 h-5" />, color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
          { label: 'Active Plant', value: dashboardKPIs.activePlant, icon: <HardHat className="w-5 h-5" />, color: 'text-lime-600', bg: 'bg-lime-100 dark:bg-lime-900/30' },
          { label: 'Open Risks', value: dashboardKPIs.openRisks, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
          { label: 'Pending Approvals', value: dashboardKPIs.pendingApprovals, icon: <Clock className="w-5 h-5" />, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        ].map((kpi, i) => (
          <Card key={i} padding="sm">
            <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color} w-fit mb-2`}>{kpi.icon}</div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* FY Progress */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Financial Year Performance</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">FY Target: {formatCurrency(dashboardKPIs.fyTarget)}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Achieved: {formatCurrency(dashboardKPIs.fyAchieved)} ({fyProgress.toFixed(1)}%)</span>
        </div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min(fyProgress, 100)}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>Apr 2025</span>
          <span>Mar 2026</span>
        </div>
      </Card>
    </div>
  );
}

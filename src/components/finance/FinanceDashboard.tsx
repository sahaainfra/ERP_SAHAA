// ============================================================
// BUILDCORE ERP - FINANCE DASHBOARD
// Part 24: Complete Finance & Accounts Module
// ============================================================

import React, { useEffect } from 'react';
import { useFinanceStore } from '../../store/financeStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet,
  Receipt, PieChart, BarChart3, Activity, AlertCircle
} from 'lucide-react';

export function FinanceDashboard() {
  const {
    accountsPayable,
    accountsReceivable,
    bankAccounts,
    projectBudgets,
    loadAccountsPayable,
    loadAccountsReceivable,
    loadBankAccounts,
    loadProjectBudgets
  } = useFinanceStore();

  useEffect(() => {
    const companyId = 'COMPANY_001'; // Would come from auth context
    loadAccountsPayable(companyId);
    loadAccountsReceivable(companyId);
    loadBankAccounts(companyId);
    loadProjectBudgets('');
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate totals
  const totalAP = accountsPayable.reduce((sum, ap) => sum + ap.outstandingAmount, 0);
  const totalAR = accountsReceivable.reduce((sum, ar) => sum + ar.outstandingAmount, 0);
  const totalBankBalance = bankAccounts.reduce((sum, ba) => sum + ba.balance, 0);
  const totalBudget = projectBudgets.reduce((sum, pb) => sum + pb.budgetAmount, 0);
  const totalActual = projectBudgets.reduce((sum, pb) => sum + pb.actualAmount, 0);
  const budgetVariance = totalBudget - totalActual;
  const budgetVariancePercent = totalBudget > 0 ? (budgetVariance / totalBudget) * 100 : 0;

  // AP Ageing
  const apCurrent = accountsPayable.filter(ap => {
    const days = Math.floor((Date.now() - new Date(ap.invoiceDate).getTime()) / (1000 * 60 * 60 * 24));
    return days <= 30;
  }).reduce((sum, ap) => sum + ap.outstandingAmount, 0);

  const ap31To60 = accountsPayable.filter(ap => {
    const days = Math.floor((Date.now() - new Date(ap.invoiceDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 30 && days <= 60;
  }).reduce((sum, ap) => sum + ap.outstandingAmount, 0);

  const ap61To90 = accountsPayable.filter(ap => {
    const days = Math.floor((Date.now() - new Date(ap.invoiceDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 60 && days <= 90;
  }).reduce((sum, ap) => sum + ap.outstandingAmount, 0);

  const apOver90 = accountsPayable.filter(ap => {
    const days = Math.floor((Date.now() - new Date(ap.invoiceDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 90;
  }).reduce((sum, ap) => sum + ap.outstandingAmount, 0);

  // AR Ageing
  const arCurrent = accountsReceivable.filter(ar => {
    const days = Math.floor((Date.now() - new Date(ar.billDate).getTime()) / (1000 * 60 * 60 * 24));
    return days <= 30;
  }).reduce((sum, ar) => sum + ar.outstandingAmount, 0);

  const ar31To60 = accountsReceivable.filter(ar => {
    const days = Math.floor((Date.now() - new Date(ar.billDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 30 && days <= 60;
  }).reduce((sum, ar) => sum + ar.outstandingAmount, 0);

  const ar61To90 = accountsReceivable.filter(ar => {
    const days = Math.floor((Date.now() - new Date(ar.billDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 60 && days <= 90;
  }).reduce((sum, ar) => sum + ar.outstandingAmount, 0);

  const arOver90 = accountsReceivable.filter(ar => {
    const days = Math.floor((Date.now() - new Date(ar.billDate).getTime()) / (1000 * 60 * 60 * 24));
    return days > 90;
  }).reduce((sum, ar) => sum + ar.outstandingAmount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance & Accounts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete financial management and reporting
          </p>
        </div>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Bank Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(totalBankBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Accounts Receivable</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(totalAR)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Outstanding from clients</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Accounts Payable</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(totalAP)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Outstanding to vendors</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Budget Variance</p>
              <p className={`text-2xl font-bold mt-1 ${budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {budgetVariancePercent.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(Math.abs(budgetVariance))}</p>
            </div>
            <div className={`p-3 rounded-lg ${budgetVariance >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {budgetVariance >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* AP Ageing */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accounts Payable Ageing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current (0-30 days)</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(apCurrent)}</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">31-60 days</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(ap31To60)}</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">61-90 days</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(ap61To90)}</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Over 90 days</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(apOver90)}</p>
          </div>
        </div>
      </Card>

      {/* AR Ageing */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accounts Receivable Ageing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current (0-30 days)</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(arCurrent)}</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">31-60 days</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(ar31To60)}</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">61-90 days</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(ar61To90)}</p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Over 90 days</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(arOver90)}</p>
          </div>
        </div>
      </Card>

      {/* Bank Accounts */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bank Accounts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bank Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Account Number</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Balance</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {bankAccounts.map((account) => (
                <tr key={account.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{account.bankName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{account.accountNumber}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={account.accountType} />
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(account.balance)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={account.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="w-full">
            <Receipt className="w-4 h-4 mr-2" />
            Create Journal
          </Button>
          <Button variant="outline" className="w-full">
            <CreditCard className="w-4 h-4 mr-2" />
            Make Payment
          </Button>
          <Button variant="outline" className="w-full">
            <Receipt className="w-4 h-4 mr-2" />
            Receive Payment
          </Button>
          <Button variant="outline" className="w-full">
            <Activity className="w-4 h-4 mr-2" />
            Bank Reconciliation
          </Button>
        </div>
      </Card>
    </div>
  );
}

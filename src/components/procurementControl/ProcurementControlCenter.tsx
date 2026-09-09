// ============================================================
// BUILDCORE ERP - PROCUREMENT CONTROL CENTER
// Part 20: Integrated Procurement and Material Control Center
// ============================================================

import React, { useEffect } from 'react';
import { useProcurementControlStore } from '../../store/procurementControlStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  ShoppingCart, Package, Truck, AlertTriangle, CheckCircle,
  Clock, DollarSign, TrendingUp, TrendingDown, AlertCircle,
  RefreshCw, Eye, FileText
} from 'lucide-react';

export function ProcurementControlCenter() {
  const {
    procurementControlKPIs,
    materialControlKPIs,
    exceptions,
    approvalQueue,
    isLoading,
    loadProcurementControlKPIs,
    loadMaterialControlKPIs,
    loadExceptions,
    loadApprovalQueue
  } = useProcurementControlStore();

  useEffect(() => {
    const companyId = 'COMPANY_001'; // Would come from auth context
    const userId = 'USER_001'; // Would come from auth context
    
    loadProcurementControlKPIs(companyId);
    loadMaterialControlKPIs(companyId);
    loadExceptions(companyId);
    loadApprovalQueue(companyId, userId);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading && !procurementControlKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading procurement control center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procurement Control Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            End-to-end procurement orchestration and control
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button variant="primary" icon={<FileText className="w-4 h-4" />}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Procurement Pipeline KPIs */}
      {procurementControlKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Open MR</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.openMR}
                </p>
                <p className="text-xs text-gray-500 mt-1">Material requisitions</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Open PR</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.openPR}
                </p>
                <p className="text-xs text-gray-500 mt-1">Purchase requisitions</p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">RFQ Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.rfqPending}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting quotations</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Approval Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.approvalPending}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* PO & Delivery KPIs */}
      {procurementControlKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">PO Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.poPending}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Value: {formatCurrency(procurementControlKPIs.poValue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Due</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.deliveryDue}
                </p>
                <p className="text-xs text-gray-500 mt-1">Expected deliveries</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Overdue</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {procurementControlKPIs.deliveryOverdue}
                </p>
                <p className="text-xs text-gray-500 mt-1">Delayed deliveries</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">GRN Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.grnPending}
                </p>
                <p className="text-xs text-gray-500 mt-1">Goods receipt notes</p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quality & Invoice KPIs */}
      {procurementControlKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">QC Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.qcPending}
                </p>
                <p className="text-xs text-gray-500 mt-1">Quality checks</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.invoicePending}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting invoices</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mismatch</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {procurementControlKPIs.mismatch}
                </p>
                <p className="text-xs text-gray-500 mt-1">Quantity/price issues</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {procurementControlKPIs.paymentPending}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Exceptions Section */}
      {exceptions.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Exceptions</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {exceptions.slice(0, 5).map(exception => (
              <div
                key={exception.id}
                className={`p-3 rounded-lg border ${
                  exception.priority === 'CRITICAL'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : exception.priority === 'HIGH'
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    : exception.priority === 'MEDIUM'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <p className="text-sm font-medium">{exception.exceptionType.replace(/_/g, ' ')}</p>
                      <StatusBadge status={exception.status} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-6">
                      {exception.action}
                    </p>
                    {exception.projectName && (
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        Project: {exception.projectName}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Owner: {exception.ownerName}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(exception.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Approval Queue */}
      {approvalQueue.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Approval Queue</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {approvalQueue.slice(0, 5).map(item => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.approvalType}</p>
                      <p className="text-xs text-gray-500">{item.transactionNumber}</p>
                      <StatusBadge status={item.priority} />
                    </div>
                    {item.projectName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Project: {item.projectName}
                      </p>
                    )}
                    {item.vendorName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Vendor: {item.vendorName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Value: {formatCurrency(item.value)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Requested by: {item.requestedByName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

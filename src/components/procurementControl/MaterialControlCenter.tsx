// ============================================================
// BUILDCORE ERP - MATERIAL CONTROL CENTER
// Part 20: Integrated Procurement and Material Control Center
// ============================================================

import React, { useEffect } from 'react';
import { useProcurementControlStore } from '../../store/procurementControlStore';
import { Card, StatusBadge, Button } from '../ui';
import {
  Package, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Clock, RefreshCw, Eye, AlertCircle, DollarSign
} from 'lucide-react';

export function MaterialControlCenter() {
  const {
    materialControlKPIs,
    vendorPerformance,
    procurementSavings,
    poDeliveryPerformance,
    materialQualityPerformance,
    materialCostControl,
    isLoading,
    loadMaterialControlKPIs,
    loadVendorPerformance,
    loadProcurementSavings,
    loadPODeliveryPerformance,
    loadMaterialQualityPerformance,
    loadMaterialCostControl
  } = useProcurementControlStore();

  useEffect(() => {
    const companyId = 'COMPANY_001'; // Would come from auth context
    const projectId = 'PROJ_001'; // Would come from context
    
    loadMaterialControlKPIs(companyId);
    loadVendorPerformance(companyId);
    loadProcurementSavings(projectId);
    loadPODeliveryPerformance(companyId);
    loadMaterialQualityPerformance(companyId);
    loadMaterialCostControl(companyId);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  if (isLoading && !materialControlKPIs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading material control center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Material Control Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Material demand, stock, and consumption analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Material KPIs */}
      {materialControlKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Material Demand</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(materialControlKPIs.materialDemand)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total requirement</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Available Stock</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(materialControlKPIs.availableStock)}
                </p>
                <p className="text-xs text-gray-500 mt-1">In stock</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reserved Stock</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {formatCurrency(materialControlKPIs.reservedStock)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Reserved for projects</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Incoming PO</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {formatCurrency(materialControlKPIs.incomingPO)}
                </p>
                <p className="text-xs text-gray-500 mt-1">On order</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Stock Health KPIs */}
      {materialControlKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shortage</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(materialControlKPIs.shortage)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Material shortage</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reorder</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {materialControlKPIs.reorder}
                </p>
                <p className="text-xs text-gray-500 mt-1">Items to reorder</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Excess Stock</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {materialControlKPIs.excess}
                </p>
                <p className="text-xs text-gray-500 mt-1">Overstocked items</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Package className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dead Stock</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {materialControlKPIs.deadStock}
                </p>
                <p className="text-xs text-gray-500 mt-1">No movement {'>'}180 days</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Variance KPIs */}
      {materialControlKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Consumption Variance</p>
                <p className={`text-2xl font-bold mt-1 ${
                  materialControlKPIs.consumptionVariance > 5 ? 'text-red-600' :
                  materialControlKPIs.consumptionVariance > 2 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {materialControlKPIs.consumptionVariance.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Actual vs theoretical</p>
              </div>
              <div className={`p-3 rounded-lg ${
                materialControlKPIs.consumptionVariance > 5 ? 'bg-red-100 dark:bg-red-900/30' :
                materialControlKPIs.consumptionVariance > 2 ? 'bg-orange-100 dark:bg-orange-900/30' :
                'bg-green-100 dark:bg-green-900/30'
              }`}>
                <TrendingUp className={`w-6 h-6 ${
                  materialControlKPIs.consumptionVariance > 5 ? 'text-red-600 dark:text-red-400' :
                  materialControlKPIs.consumptionVariance > 2 ? 'text-orange-600 dark:text-orange-400' :
                  'text-green-600 dark:text-green-400'
                }`} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wastage</p>
                <p className={`text-2xl font-bold mt-1 ${
                  materialControlKPIs.wastage > 5 ? 'text-red-600' :
                  materialControlKPIs.wastage > 2 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {materialControlKPIs.wastage.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Material wastage</p>
              </div>
              <div className={`p-3 rounded-lg ${
                materialControlKPIs.wastage > 5 ? 'bg-red-100 dark:bg-red-900/30' :
                materialControlKPIs.wastage > 2 ? 'bg-orange-100 dark:bg-orange-900/30' :
                'bg-green-100 dark:bg-green-900/30'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  materialControlKPIs.wastage > 5 ? 'text-red-600 dark:text-red-400' :
                  materialControlKPIs.wastage > 2 ? 'text-orange-600 dark:text-orange-400' :
                  'text-green-600 dark:text-green-400'
                }`} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Price Variance</p>
                <p className={`text-2xl font-bold mt-1 ${
                  materialControlKPIs.priceVariance > 5 ? 'text-red-600' :
                  materialControlKPIs.priceVariance > 2 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {materialControlKPIs.priceVariance.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Budget vs actual</p>
              </div>
              <div className={`p-3 rounded-lg ${
                materialControlKPIs.priceVariance > 5 ? 'bg-red-100 dark:bg-red-900/30' :
                materialControlKPIs.priceVariance > 2 ? 'bg-orange-100 dark:bg-orange-900/30' :
                'bg-green-100 dark:bg-green-900/30'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  materialControlKPIs.priceVariance > 5 ? 'text-red-600 dark:text-red-400' :
                  materialControlKPIs.priceVariance > 2 ? 'text-orange-600 dark:text-orange-400' :
                  'text-green-600 dark:text-green-400'
                }`} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Vendor Performance */}
      {vendorPerformance.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vendor Performance</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Spend</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">PO Count</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Delivery %</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quality %</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rejection %</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {vendorPerformance.slice(0, 5).map(vendor => (
                  <tr key={vendor.vendorId} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {vendor.vendorName}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(vendor.spend)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {vendor.poCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={vendor.deliveryPerformance >= 90 ? 'text-green-600' : vendor.deliveryPerformance >= 80 ? 'text-orange-600' : 'text-red-600'}>
                        {vendor.deliveryPerformance.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={vendor.qualityPerformance >= 95 ? 'text-green-600' : vendor.qualityPerformance >= 90 ? 'text-orange-600' : 'text-red-600'}>
                        {vendor.qualityPerformance.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={vendor.rejectionRate <= 2 ? 'text-green-600' : vendor.rejectionRate <= 5 ? 'text-orange-600' : 'text-red-600'}>
                        {vendor.rejectionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(vendor.outstanding)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Procurement Savings */}
      {procurementSavings.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procurement Savings</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Material</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Budget</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quoted</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Negotiated</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Final</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Savings</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">%</th>
                </tr>
              </thead>
              <tbody>
                {procurementSavings.slice(0, 5).map((saving, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {saving.materialName}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(saving.budget)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(saving.quoted)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(saving.negotiated)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(saving.final)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      {formatCurrency(saving.savings)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      {saving.savingsPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* PO Delivery Performance */}
      {poDeliveryPerformance.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PO Delivery Performance</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">PO Number</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Promised Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actual Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Delay Days</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {poDeliveryPerformance.slice(0, 5).map(po => (
                  <tr key={po.poId} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {po.poNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {po.vendorName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {new Date(po.promisedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {po.actualDate ? new Date(po.actualDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={po.delayDays === 0 ? 'text-green-600' : po.delayDays <= 3 ? 'text-orange-600' : 'text-red-600'}>
                        {po.delayDays}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={po.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Material Quality Performance */}
      {materialQualityPerformance.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Material Quality Performance</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Material</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">GRN Count</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Accepted</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rejected</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Conditional</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">NCR</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Acceptance %</th>
                </tr>
              </thead>
              <tbody>
                {materialQualityPerformance.slice(0, 5).map(material => (
                  <tr key={material.materialId} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {material.materialName}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {material.grnCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      {material.accepted}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">
                      {material.rejected}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-orange-600">
                      {material.conditional}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-orange-600">
                      {material.ncrCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={material.acceptanceRate >= 95 ? 'text-green-600' : material.acceptanceRate >= 90 ? 'text-orange-600' : 'text-red-600'}>
                        {material.acceptanceRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Material Cost Control */}
      {materialCostControl.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Material Cost Control</h3>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Material</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Budget Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">PO Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actual Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">PO Variance</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actual Variance</th>
                </tr>
              </thead>
              <tbody>
                {materialCostControl.slice(0, 5).map(material => (
                  <tr key={material.materialId} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {material.materialName}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(material.budgetRate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(material.poRate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(material.actualRate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={material.poVariance <= 0 ? 'text-green-600' : material.poVariance <= material.budgetRate * 0.05 ? 'text-orange-600' : 'text-red-600'}>
                        {material.poVariancePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={material.actualVariance <= 0 ? 'text-green-600' : material.actualVariance <= material.budgetRate * 0.05 ? 'text-orange-600' : 'text-red-600'}>
                        {material.actualVariancePercent.toFixed(2)}%
                      </span>
                    </td>
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

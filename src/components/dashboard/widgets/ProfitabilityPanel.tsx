// ============================================================
// PROFITABILITY PANEL WIDGET
// ============================================================

import React from 'react';
import type { ProjectProfitability } from '../../../types/dashboard';

interface ProfitabilityPanelProps {
  data: ProjectProfitability;
}

export const ProfitabilityPanel: React.FC<ProfitabilityPanelProps> = ({ data }) => {
  const formatCurrency = (value: number): string => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Profitability</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          data.status === 'PROFITABLE' ? 'bg-green-100 text-green-700' :
          data.status === 'BREAKEVEN' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {data.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Gross Margin</span>
            <span className="font-semibold text-gray-900">{data.grossMarginPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                data.grossMarginPercent > 15 ? 'bg-green-500' :
                data.grossMarginPercent > 5 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.max(data.grossMarginPercent, 0), 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500">Contract Revenue</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(data.contractRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Certified Revenue</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(data.certifiedRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Cost</p>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(data.totalCost)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Gross Margin</p>
            <p className={`text-lg font-semibold ${data.grossMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.grossMargin)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">Cost Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Material Cost</span>
              <span className="font-medium text-gray-900">{formatCurrency(data.materialCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Labour Cost</span>
              <span className="font-medium text-gray-900">{formatCurrency(data.labourCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plant Cost</span>
              <span className="font-medium text-gray-900">{formatCurrency(data.plantCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subcontract Cost</span>
              <span className="font-medium text-gray-900">{formatCurrency(data.subcontractCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Overheads</span>
              <span className="font-medium text-gray-900">{formatCurrency(data.overheads)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

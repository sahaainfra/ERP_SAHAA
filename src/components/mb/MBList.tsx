// ============================================================
// BUILDCORE ERP - MEASUREMENT BOOK LIST
// Part 21: Advanced Measurement Book (MB) / e-MB Module
// ============================================================

import React, { useEffect } from 'react';
import { useMBStore } from '../../store/mbStore';
import { Card, StatusBadge, Button } from '../ui';
import { FileText, Plus, Eye, Edit } from 'lucide-react';

export function MBList() {
  const { mbs, loadMBs, selectMB, isLoading } = useMBStore();

  useEffect(() => {
    const companyId = 'COMPANY_001'; // Would come from auth context
    loadMBs(companyId);
  }, []);

  const handleViewMB = (mbId: string) => {
    selectMB(mbId);
    // Navigate to MB detail view
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading measurement books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Measurement Book Register</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            List of all measurement books
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          Create New MB
        </Button>
      </div>

      {/* MB List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">MB Number</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Site</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Measurement Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mbs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No measurement books found
                  </td>
                </tr>
              ) : (
                mbs.map((mb) => (
                  <tr key={mb.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {mb.mbNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {mb.projectCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {mb.siteId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(mb.measurementDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={mb.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                      ₹{mb.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewMB(mb.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        {mb.status === 'DRAFT' && (
                          <button
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

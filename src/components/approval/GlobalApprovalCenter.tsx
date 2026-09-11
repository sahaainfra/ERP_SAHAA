// ============================================================
// BUILDCORE ERP - GLOBAL APPROVAL CENTER
// Part 30: Global Approval Center
// ============================================================

import React, { useEffect, useState } from 'react';
import { useApprovalStore } from '../../store/approvalStore';
import { useAuthStore } from '../../store';
import { Card, Button, StatusBadge } from '../ui';
import { 
  CheckCircle, XCircle, MessageSquare, Clock,
  AlertTriangle, Filter, Search, ArrowUpRight
} from 'lucide-react';

export const GlobalApprovalCenter: React.FC = () => {
  const { user } = useAuthStore();
  const {
    loadPendingApprovals,
    approveRequest,
    rejectRequest,
    queryRequest,
    returnRequest,
    forwardRequest,
    delegateRequest,
    pendingApprovals,
    loading
  } = useApprovalStore();

  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | 'query' | 'return' | 'forward' | 'delegate';
    requestId: string;
  }>({ open: false, action: 'approve', requestId: '' });
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      loadPendingApprovals(user.id);
    }
  }, [user?.id]);

  const handleAction = (action: 'approve' | 'reject' | 'query' | 'return' | 'forward' | 'delegate', requestId: string) => {
    setActionModal({ open: true, action, requestId });
    setComment('');
  };

  const submitAction = async () => {
    if (!actionModal.requestId) return;

    switch (actionModal.action) {
      case 'approve':
        await approveRequest(actionModal.requestId, user?.id || '', comment);
        break;
      case 'reject':
        await rejectRequest(actionModal.requestId, user?.id || '', comment);
        break;
      case 'query':
        await queryRequest(actionModal.requestId, user?.id || '', comment);
        break;
      case 'return':
        await returnRequest(actionModal.requestId, user?.id || '', comment);
        break;
      case 'forward':
        await forwardRequest(actionModal.requestId, user?.id || '', comment);
        break;
      case 'delegate':
        await delegateRequest(actionModal.requestId, user?.id || '', comment);
        break;
    }

    setActionModal({ open: false, action: 'approve', requestId: '' });
    setComment('');
  };

  const filteredApprovals = pendingApprovals.filter(approval => {
    if (filterModule !== 'all' && approval.module !== filterModule) return false;
    if (filterStatus !== 'all' && approval.status !== filterStatus) return false;
    if (searchQuery && !approval.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const modules = ['all', 'Procurement', 'Commercial', 'QA', 'HSE', 'HR', 'Plant', 'RMC'];
  const statuses = ['all', 'PENDING', 'UNDER_REVIEW', 'QUERY_RAISED', 'APPROVED', 'REJECTED'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Approval Center</h1>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Module
            </label>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              {modules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search document number..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Approvals List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Document</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Module</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Project</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Requester</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Age</span>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">SLA</span>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Priority</span>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</span>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map(approval => (
                <tr key={approval.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{approval.documentNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{approval.module}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{approval.projectName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {approval.amount ? `₹${approval.amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{approval.requesterName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {Math.ceil((Date.now() - new Date(approval.requestedAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={approval.slaStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={approval.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleAction('approve', approval.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleAction('reject', approval.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction('query', approval.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {actionModal.action === 'approve' && 'Approve Request'}
              {actionModal.action === 'reject' && 'Reject Request'}
              {actionModal.action === 'query' && 'Query Request'}
              {actionModal.action === 'return' && 'Return Request'}
              {actionModal.action === 'forward' && 'Forward Request'}
              {actionModal.action === 'delegate' && 'Delegate Request'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  rows={4}
                  placeholder="Enter your comment..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setActionModal({ open: false, action: 'approve', requestId: '' })}
                >
                  Cancel
                </Button>
                <Button
                  variant={actionModal.action === 'approve' ? 'success' : actionModal.action === 'reject' ? 'danger' : 'outline'}
                  onClick={submitAction}
                >
                  {actionModal.action === 'approve' && 'Approve'}
                  {actionModal.action === 'reject' && 'Reject'}
                  {actionModal.action === 'query' && 'Submit Query'}
                  {actionModal.action === 'return' && 'Return'}
                  {actionModal.action === 'forward' && 'Forward'}
                  {actionModal.action === 'delegate' && 'Delegate'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

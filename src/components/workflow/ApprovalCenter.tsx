// ============================================================
// BUILDCORE ERP - APPROVAL CENTER
// Part 04: Enterprise Workflow & Approval Engine
// ============================================================

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageSquare, ArrowRight, Clock, AlertTriangle, Filter, Search } from 'lucide-react';
import { Card, Button, StatusBadge, Input } from '../ui';
import { useWorkflowStore } from '../../store/workflowStore';
import { useAuthStore } from '../../store';
import type { WorkflowInstance } from '../../types/workflow';

export function ApprovalCenter() {
  const { user } = useAuthStore();
  const { pendingApprovals, dashboardKPIs, refresh, approve, reject, returnToMaker, raiseQuery } = useWorkflowStore();
  
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'return' | 'query'>('approve');
  const [comments, setComments] = useState('');
  const [reason, setReason] = useState('');
  const [question, setQuestion] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      refresh(user.companyId, user.id);
    }
  }, [user, refresh]);

  if (!user) return null;

  const filteredApprovals = pendingApprovals.filter(instance => {
    if (filterStatus !== 'all' && instance.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        instance.entityNumber.toLowerCase().includes(query) ||
        instance.requesterName.toLowerCase().includes(query) ||
        instance.entityType.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleApprove = () => {
    if (!selectedInstance) return;
    const result = approve(selectedInstance.id, user.id, comments);
    if (result.success) {
      setShowActionModal(false);
      setComments('');
      setSelectedInstance(null);
    } else {
      alert(result.message);
    }
  };

  const handleReject = () => {
    if (!selectedInstance || !reason) return;
    const result = reject(selectedInstance.id, user.id, reason);
    if (result.success) {
      setShowActionModal(false);
      setReason('');
      setSelectedInstance(null);
    } else {
      alert(result.message);
    }
  };

  const handleReturn = () => {
    if (!selectedInstance || !reason) return;
    const result = returnToMaker(selectedInstance.id, user.id, reason);
    if (result.success) {
      setShowActionModal(false);
      setReason('');
      setSelectedInstance(null);
    } else {
      alert(result.message);
    }
  };

  const handleQuery = () => {
    if (!selectedInstance || !question) return;
    const result = raiseQuery(
      selectedInstance.id,
      user.id,
      question,
      undefined,
      comments,
      undefined,
      'MEDIUM'
    );
    if (result.success) {
      setShowActionModal(false);
      setQuestion('');
      setComments('');
      setSelectedInstance(null);
    } else {
      alert(result.message);
    }
  };

  const openActionModal = (instance: WorkflowInstance, type: 'approve' | 'reject' | 'return' | 'query') => {
    setSelectedInstance(instance);
    setActionType(type);
    setShowActionModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard KPIs */}
      {dashboardKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardKPIs.pendingApprovals}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardKPIs.approvedToday}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardKPIs.overdue}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Approval Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardKPIs.averageApprovalTime}h
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by document number, requester, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="QUERY_RAISED">Query Raised</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Approval List */}
      <Card>
        <div className="space-y-4">
          {filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending approvals</p>
            </div>
          ) : (
            filteredApprovals.map((instance) => {
              const levelStatus = instance.levelStatuses.find(ls => ls.levelNumber === instance.currentLevel);
              
              return (
                <div
                  key={instance.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {instance.entityNumber}
                        </h3>
                        <StatusBadge status={instance.status} />
                        {levelStatus?.slaStatus === 'OVERDUE' && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded">
                            OVERDUE
                          </span>
                        )}
                        {levelStatus?.slaStatus === 'AT_RISK' && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded">
                            AT RISK
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Type</p>
                          <p className="font-medium text-gray-900 dark:text-white">{instance.entityType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Amount</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            ₹{instance.entityAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Requester</p>
                          <p className="font-medium text-gray-900 dark:text-white">{instance.requesterName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Level</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {instance.currentLevel} of {instance.totalLevels}
                          </p>
                        </div>
                      </div>

                      {levelStatus && (
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">
                            Due: {new Date(levelStatus.slaDueAt).toLocaleString()}
                          </span>
                          {levelStatus.approverName && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="text-gray-500 dark:text-gray-400">
                                Approver: {levelStatus.approverName}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openActionModal(instance, 'approve')}
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openActionModal(instance, 'query')}
                        icon={<MessageSquare className="w-4 h-4" />}
                      >
                        Query
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openActionModal(instance, 'return')}
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Return
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openActionModal(instance, 'reject')}
                        icon={<XCircle className="w-4 h-4" />}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Action Modal */}
      {showActionModal && selectedInstance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
              {actionType === 'return' && 'Return to Maker'}
              {actionType === 'query' && 'Raise Query'}
            </h2>

            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedInstance.entityNumber} - {selectedInstance.entityType}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ₹{selectedInstance.entityAmount.toLocaleString()}
              </p>
            </div>

            {(actionType === 'approve' || actionType === 'query') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Add comments..."
                />
              </div>
            )}

            {(actionType === 'reject' || actionType === 'return') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason (Required)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Provide reason..."
                  required
                />
              </div>
            )}

            {actionType === 'query' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question (Required)
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="What clarification do you need?"
                  required
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              {actionType === 'approve' && (
                <Button variant="primary" onClick={handleApprove}>
                  Approve
                </Button>
              )}
              {actionType === 'reject' && (
                <Button variant="danger" onClick={handleReject} disabled={!reason}>
                  Reject
                </Button>
              )}
              {actionType === 'return' && (
                <Button variant="outline" onClick={handleReturn} disabled={!reason}>
                  Return
                </Button>
              )}
              {actionType === 'query' && (
                <Button variant="primary" onClick={handleQuery} disabled={!question}>
                  Raise Query
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

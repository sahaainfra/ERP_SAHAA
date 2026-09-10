// ============================================================
// BUILDCORE ERP - QA/QC + HSE + DOCUMENT MANAGEMENT + COMMUNICATION DASHBOARD
// Part 06: Quality, Safety, Documents & Communication
// ============================================================

import React, { useEffect, useState } from 'react';
import { useQualitySafetyDocsCommsStore } from '../../store/quality-safety-docs-comms-store';
import { useAuthStore, useProjectStore } from '../../store';
import { Card, Button, StatusBadge } from '../ui';
import { 
  FileCheck, Shield, FileText, MessageSquare, 
  AlertTriangle, CheckCircle, Clock, 
  FileText as DocumentIcon, MessageCircle
} from 'lucide-react';

export const QualitySafetyDocsCommsDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { project } = useProjectStore();
  const {
    loadITPs, loadWIRs, loadMIRs, loadInspections, loadTests, loadNCRs, loadCAPAs,
    loadMaterialApprovals, loadCalibrations,
    loadSafetyInductions, loadToolboxTalks, loadPPEs, loadSafetyInspections,
    loadPermits, loadIncidents, loadNearMisses, loadSafetyObservations,
    loadDocuments, loadDrawings, loadRFIs,
    loadChats, loadChatMessages,
    itps, wirs, mirs, inspections, tests, ncrs, capas, materialApprovals, calibrations,
    safetyInductions, toolboxTalks, ppes, safetyInspections, permits, incidents, nearMisses, safetyObservations,
    documents, drawings, rfis, chats
  } = useQualitySafetyDocsCommsStore();

  const [activeTab, setActiveTab] = useState<'qaqc' | 'hse' | 'docs' | 'comms'>('qaqc');

  useEffect(() => {
    if (project?.id) {
      // Load QA/QC data
      loadITPs(project.id);
      loadWIRs(project.id);
      loadMIRs(project.id);
      loadInspections(project.id);
      loadTests(project.id);
      loadNCRs(project.id);
      loadCAPAs(project.id);
      loadMaterialApprovals(project.id);
      loadCalibrations();
      
      // Load HSE data
      loadSafetyInductions(project.id);
      loadToolboxTalks(project.id);
      loadPPEs(project.id);
      loadSafetyInspections(project.id);
      loadPermits(project.id);
      loadIncidents(project.id);
      loadNearMisses(project.id);
      loadSafetyObservations(project.id);
      
      // Load Document Management data
      loadDocuments(project.id);
      loadDrawings(project.id);
      loadRFIs(project.id);
      
      // Load Communication data
      if (user?.id) {
        loadChats(user.id);
      }
    }
  }, [project?.id, user?.id]);

  // Calculate KPIs
  const qaqcKPIs = {
    pendingWIRs: wirs.filter(w => w.status === 'PENDING').length,
    pendingMIRs: mirs.filter(m => m.status === 'PENDING').length,
    openNCRs: ncrs.filter(n => n.status === 'OPEN' || n.status === 'IN_PROGRESS').length,
    pendingTests: tests.filter(t => t.status !== 'COMPLETED').length,
    pendingApprovals: materialApprovals.filter(m => m.status === 'PENDING').length,
    expiringCalibrations: calibrations.filter(c => c.status === 'DUE_SOON' || c.status === 'EXPIRED').length,
  };

  const hseKPIs = {
    openIncidents: incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
    openNearMisses: nearMisses.filter(n => n.status === 'REPORTED').length,
    openObservations: safetyObservations.filter(o => o.status !== 'CLOSED').length,
    activePermits: permits.filter(p => p.status === 'APPROVED').length,
    pendingInductions: safetyInductions.filter(i => i.status === 'PENDING').length,
    toolboxTalksThisMonth: toolboxTalks.filter(t => {
      const date = new Date(t.talkDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
  };

  const docsKPIs = {
    totalDocuments: documents.length,
    pendingApprovals: documents.filter(d => d.status === 'PENDING_APPROVAL').length,
    totalDrawings: drawings.length,
    pendingDrawingApprovals: drawings.filter(d => d.status === 'PENDING_APPROVAL').length,
    openRFIs: rfis.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length,
  };

  const commsKPIs = {
    totalChats: chats.length,
    unreadMessages: chats.reduce((total, chat) => {
      const messages = useQualitySafetyDocsCommsStore.getState().chatMessages[chat.id] || [];
      return total + messages.filter(m => !m.readBy.includes(user?.id || '')).length;
    }, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quality, Safety, Documents & Communication
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('qaqc')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'qaqc'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            QA/QC
          </div>
        </button>
        <button
          onClick={() => setActiveTab('hse')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'hse'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            HSE
          </div>
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'docs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <DocumentIcon className="w-4 h-4" />
            Documents
          </div>
        </button>
        <button
          onClick={() => setActiveTab('comms')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'comms'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Communication
          </div>
        </button>
      </div>

      {/* QA/QC Tab */}
      {activeTab === 'qaqc' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending WIRs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {qaqcKPIs.pendingWIRs}
                  </p>
                </div>
                <FileCheck className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending MIRs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {qaqcKPIs.pendingMIRs}
                  </p>
                </div>
                <FileCheck className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Open NCRs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {qaqcKPIs.openNCRs}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {qaqcKPIs.pendingTests}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {qaqcKPIs.pendingApprovals}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Calibrations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {qaqcKPIs.expiringCalibrations}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Recent Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent WIRs */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent WIRs
              </h3>
              <div className="space-y-3">
                {wirs.slice(0, 5).map(wir => (
                  <div key={wir.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {wir.wirNumber}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {wir.activity}
                      </p>
                    </div>
                    <StatusBadge status={wir.status}>
                      {wir.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent NCRs */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent NCRs
              </h3>
              <div className="space-y-3">
                {ncrs.slice(0, 5).map(ncr => (
                  <div key={ncr.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {ncr.ncrNumber}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {ncr.activity}
                      </p>
                    </div>
                    <Badge variant={ncr.status === 'CLOSED' ? 'success' : 'warning'}>
                      {ncr.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* HSE Tab */}
      {activeTab === 'hse' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Open Incidents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {hseKPIs.openIncidents}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Open Near Misses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {hseKPIs.openNearMisses}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Open Observations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {hseKPIs.openObservations}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Permits</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {hseKPIs.activePermits}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Inductions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {hseKPIs.pendingInductions}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toolbox Talks (This Month)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {hseKPIs.toolboxTalksThisMonth}
                  </p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Recent Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Incidents
              </h3>
              <div className="space-y-3">
                {incidents.slice(0, 5).map(incident => (
                  <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {incident.incidentNumber}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {incident.incidentType} - {incident.severity}
                      </p>
                    </div>
                    <Badge variant={incident.status === 'CLOSED' ? 'success' : 'warning'}>
                      {incident.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Safety Observations */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Safety Observations
              </h3>
              <div className="space-y-3">
                {safetyObservations.slice(0, 5).map(obs => (
                  <div key={obs.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {obs.observationNumber}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {obs.location}
                      </p>
                    </div>
                    <Badge variant={obs.status === 'CLOSED' ? 'success' : 'warning'}>
                      {obs.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {docsKPIs.totalDocuments}
                  </p>
                </div>
                <DocumentIcon className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {docsKPIs.pendingApprovals}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Drawings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {docsKPIs.totalDrawings}
                  </p>
                </div>
                <DocumentIcon className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Drawing Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {docsKPIs.pendingDrawingApprovals}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Open RFIs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {docsKPIs.openRFIs}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Recent Documents */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Documents
            </h3>
            <div className="space-y-3">
              {documents.slice(0, 10).map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.documentNumber}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {doc.title}
                    </p>
                  </div>
                  <Badge variant={doc.status === 'APPROVED' ? 'success' : doc.status === 'REJECTED' ? 'danger' : 'warning'}>
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Communication Tab */}
      {activeTab === 'comms' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Chats</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {commsKPIs.totalChats}
                  </p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {commsKPIs.unreadMessages}
                  </p>
                </div>
                <MessageCircle className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Chat List */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Chats
            </h3>
            <div className="space-y-3">
              {chats.slice(0, 10).map(chat => (
                <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {chat.name || chat.chatType}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {chat.participants.length} participants
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {chat.lastMessage?.substring(0, 30)}...
                    </p>
                    <p className="text-xs text-gray-400">
                      {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

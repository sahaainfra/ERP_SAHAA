// ============================================================
// ACTIVITY FEED WIDGET
// ============================================================

import React from 'react';
import { CheckCircle, FileText, AlertTriangle, Users, Package, Truck } from 'lucide-react';

interface Activity {
  id: string;
  type: 'approval' | 'submission' | 'alert' | 'user' | 'material' | 'equipment';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status?: string;
}

export const ActivityFeed: React.FC = () => {
  // Mock activity data
  const activities: Activity[] = [
    {
      id: '1',
      type: 'approval',
      title: 'Purchase Order Approved',
      description: 'PO-2026-000012 for structural steel approved',
      user: 'Rajesh Kumar',
      timestamp: '2026-01-15T10:30:00Z',
      status: 'APPROVED',
    },
    {
      id: '2',
      type: 'submission',
      title: 'RA Bill Submitted',
      description: 'RA Bill #45 submitted for Mumbai-Pune Expressway',
      user: 'Priya Sharma',
      timestamp: '2026-01-15T09:15:00Z',
      status: 'SUBMITTED',
    },
    {
      id: '3',
      type: 'alert',
      title: 'Low Stock Alert',
      description: 'Cement stock below minimum level at Site A',
      user: 'System',
      timestamp: '2026-01-15T08:45:00Z',
      status: 'ACTIVE',
    },
    {
      id: '4',
      type: 'material',
      title: 'Material Received',
      description: '45 MT of TMT bars received at Site A',
      user: 'Amit Patel',
      timestamp: '2026-01-15T08:00:00Z',
      status: 'RECEIVED',
    },
    {
      id: '5',
      type: 'equipment',
      title: 'Plant Maintenance Completed',
      description: 'Excavator EX-001 maintenance completed',
      user: 'Ravi Singh',
      timestamp: '2026-01-14T17:30:00Z',
      status: 'COMPLETED',
    },
    {
      id: '6',
      type: 'user',
      title: 'New User Created',
      description: 'Site engineer Amit Patel added to project',
      user: 'Admin',
      timestamp: '2026-01-14T16:00:00Z',
      status: 'ACTIVE',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'submission':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'user':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'material':
        return <Package className="w-5 h-5 text-teal-600" />;
      case 'equipment':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="flex-shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
                {activity.status && (
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    activity.status === 'APPROVED' || activity.status === 'COMPLETED' || activity.status === 'RECEIVED'
                      ? 'bg-green-100 text-green-700'
                      : activity.status === 'SUBMITTED'
                      ? 'bg-blue-100 text-blue-700'
                      : activity.status === 'ACTIVE'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

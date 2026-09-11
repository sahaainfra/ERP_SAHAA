// ============================================================
// BUILDCORE ERP - PLANT DASHBOARD
// Part 27: Plant / Machinery / Equipment Management
// ============================================================

import React, { useEffect } from 'react';
import { usePlantStore } from '../../store/plantStore';
import { Card, Button, StatusBadge } from '../ui';
import { 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wrench,
  TrendingUp,
  Fuel,
  DollarSign
} from 'lucide-react';

export const PlantDashboard: React.FC = () => {
  const { 
    plants, 
    dashboardKPIs, 
    alerts,
    loadPlants,
    loadDashboardKPIs,
    generateAlerts,
    acknowledgeAlert
  } = usePlantStore();

  useEffect(() => {
    loadPlants();
    loadDashboardKPIs();
    generateAlerts();
  }, [loadPlants, loadDashboardKPIs, generateAlerts]);

  if (!dashboardKPIs) {
    return <div>Loading...</div>;
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged);
  const highAlerts = alerts.filter(a => a.severity === 'HIGH' && !a.acknowledged);
  const mediumAlerts = alerts.filter(a => a.severity === 'MEDIUM' && !a.acknowledged);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plant & Machinery Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalEquipment}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Working</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.working}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Utilization</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.utilization.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Breakdown</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.breakdown}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Fuel</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.totalFuel.toFixed(0)} L
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Fuel className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Maintenance Cost</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(dashboardKPIs.maintenanceCost / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Wrench className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Idle</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.idle}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardKPIs.available}
              </p>
            </div>
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {(criticalAlerts.length > 0 || highAlerts.length > 0 || mediumAlerts.length > 0) && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alerts</h2>
          <div className="space-y-3">
            {criticalAlerts.map(alert => (
              <div key={alert.id} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-300">{alert.message}</p>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}

            {highAlerts.map(alert => (
              <div key={alert.id} className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-300">{alert.message}</p>
                      <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}

            {mediumAlerts.map(alert => (
              <div key={alert.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">{alert.message}</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Equipment List */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Equipment List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Asset ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Make/Model</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Current Project</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Operator</th>
              </tr>
            </thead>
            <tbody>
              {plants.map(plant => (
                <tr key={plant.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{plant.assetId}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {plant.make} {plant.model}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{plant.category}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={plant.status} />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {plant.currentProject || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {plant.operator || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

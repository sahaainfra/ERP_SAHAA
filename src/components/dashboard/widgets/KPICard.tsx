// ============================================================
// KPI CARD WIDGET
// ============================================================

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'emerald' | 'teal';
  format?: 'number' | 'currency' | 'percent';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  format = 'number',
  trend,
  trendValue,
}) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
        return `₹${val.toLocaleString('en-IN')}`;
      case 'percent':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('en-IN');
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    teal: 'bg-teal-50 border-teal-200 text-teal-600',
  };

  const iconMap: Record<string, React.ReactNode> = {
    'trending-up': <TrendingUp className="w-6 h-6" />,
    'trending-down': <TrendingDown className="w-6 h-6" />,
    'check-circle': <span>✓</span>,
    'alert-circle': <span>⚠</span>,
    'alert-triangle': <span>⚡</span>,
    'clock': <span>⏰</span>,
    'users': <span>👥</span>,
    'building': <span>🏢</span>,
    'folder': <span>📁</span>,
    'dollar-sign': <span>💰</span>,
    'file-text': <span>📄</span>,
    'shield': <span>🛡️</span>,
    'activity': <span>📊</span>,
    'bar-chart': <span>📈</span>,
    'pie-chart': <span>🥧</span>,
    'award': <span>🏆</span>,
    'wallet': <span>💳</span>,
    'truck': <span>🚛</span>,
    'package': <span>📦</span>,
    'target': <span>🎯</span>,
    'user-check': <span>✓</span>,
    'search': <span>🔍</span>,
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && trendValue !== undefined && (
            <div className="flex items-center mt-2 text-xs">
              {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1 text-green-600" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3 mr-1 text-red-600" />}
              {trend === 'stable' && <Minus className="w-3 h-3 mr-1 text-gray-600" />}
              <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                {trendValue.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        {icon && iconMap[icon] && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]} opacity-50`}>
            {iconMap[icon]}
          </div>
        )}
      </div>
    </div>
  );
};

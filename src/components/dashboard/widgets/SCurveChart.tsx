// ============================================================
// S-CURVE CHART WIDGET
// ============================================================

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SCurveData } from '../../../types/dashboard';

interface SCurveChartProps {
  data: SCurveData;
}

export const SCurveChart: React.FC<SCurveChartProps> = ({ data }) => {
  const chartData = data.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short' }),
    planned: data.planned[index],
    actual: data.actual[index] || null,
    forecast: data.forecast[index] || null,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} unit="%" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="planned"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Planned"
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Actual"
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4 }}
          name="Forecast"
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

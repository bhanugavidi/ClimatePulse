"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Forecast } from "@/lib/mockData";

export function ForecastChart({ data }: { data: Forecast[] }) {
  // We'll prepare data to display correctly, merging actual and predicted
  const chartData = data.map(d => ({
    time: d.time,
    actual: d.actual || null,
    predicted: d.predicted || null,
  }));

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          
          <Line 
            type="monotone" 
            dataKey="actual" 
            name="Actual AQI"
            stroke="#0f172a" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            name="Predicted AQI"
            stroke="#10b981" 
            strokeWidth={3} 
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

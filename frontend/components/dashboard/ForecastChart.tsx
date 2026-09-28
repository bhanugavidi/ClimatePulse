"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Forecast } from "@/lib/mockData";

interface ForecastChartProps {
  data: Forecast[];
}

export function ForecastChart({ data }: ForecastChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
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
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
          />
          <ReferenceLine x="24:00" stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Now', fill: '#64748b', fontSize: 12 }} />
          
          <Line 
            type="monotone" 
            dataKey="actual_aqi" 
            name="Actual AQI"
            stroke="#0f172a" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="predicted_aqi" 
            name="Predicted AQI"
            stroke="#10b981" 
            strokeWidth={3} 
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, FileText, Wind, MapPin, Search } from "lucide-react";
import { 
  getDashboardStats, 
  getForecast, 
  getHotspots, 
  getAlerts, 
  getCities 
} from "@/lib/api";
import dynamic from "next/dynamic";
import { AlertItem } from "@/components/alerts/AlertItem";
import { DashboardStats, Forecast, Hotspot, Alert, City } from "@/lib/mockData";
import { toast } from "sonner";

const ForecastChart = dynamic(
  () => import("@/components/dashboard/ForecastChart").then((mod) => mod.ForecastChart),
  { ssr: false, loading: () => <div className="w-full h-[300px] bg-slate-100 animate-pulse rounded-xl" /> }
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [st, fc, hs, al, ci] = await Promise.all([
          getDashboardStats(),
          getForecast(),
          getHotspots(),
          getAlerts(),
          getCities()
        ]);
        setStats(st);
        setForecast(fc);
        setHotspots(hs);
        setAlerts(al);
        setCities(ci);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-emerald-700">
          <Activity className="h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Loading intelligence dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Authority Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time climate and pollution intelligence overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search regions..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Top Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <Wind className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Current AQI</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.current_aqi}</p>
              <p className="text-xs font-medium text-red-500 mt-2">↑ 12% from yesterday</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <MapPin className="h-5 w-5 text-orange-600" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Active Hotspots</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.active_hotspots}</p>
              <p className="text-xs font-medium text-slate-500 mt-2">Across 8 monitored zones</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Critical Alerts</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.critical_alerts}</p>
              <p className="text-xs font-medium text-red-500 mt-2">Requires immediate attention</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 text-slate-500 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Reports Today</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.reports_today}</p>
              <p className="text-xs font-medium text-emerald-600 mt-2">↑ 24% engagement</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Charts & Tables (Left Col - spans 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Forecast Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">AQI Trend & Forecast</h3>
                  <p className="text-sm text-slate-500">Historical data vs AI predictive model</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-900"></span> Actual</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-dashed border-emerald-500 bg-transparent"></span> Predicted</div>
                </div>
              </div>
              <ForecastChart data={forecast} />
            </div>

            {/* Hotspots Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Active Hotspots</h3>
                <p className="text-sm text-slate-500">Prioritized by severity and AI confidence.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Location</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Severity</th>
                      <th className="px-6 py-4 font-semibold">AQI (PM2.5)</th>
                      <th className="px-6 py-4 font-semibold">AI Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((hotspot) => (
                      <tr key={hotspot.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{hotspot.location}</td>
                        <td className="px-6 py-4 text-slate-600">{hotspot.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            hotspot.risk_level === 'severe' ? 'bg-red-100 text-red-700' :
                            hotspot.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                            hotspot.risk_level === 'poor' ? 'bg-yellow-100 text-yellow-700' :
                            hotspot.risk_level === 'moderate' ? 'bg-green-100 text-green-700' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {hotspot.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{hotspot.pm25} µg/m³</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${hotspot.ai_score}%` }}></div>
                            </div>
                            <span className="text-xs font-semibold text-slate-600">{hotspot.ai_score}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>

          {/* Sidebar (Right Col) */}
          <div className="space-y-8">
            
            {/* Alerts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Active Alerts</h3>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">{alerts.length} New</span>
              </div>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <AlertItem 
                    key={alert.id}
                    id={alert.id}
                    title="System Alert"
                    location="Regional Network"
                    description={alert.message}
                    severity={alert.severity as any}
                    time={new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  />
                ))}
              </div>
            </div>

            {/* City Overview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">City Overview</h3>
              <div className="space-y-4">
                {cities.map((city) => (
                  <div key={city.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{city.name}</h4>
                      <p className="text-xs text-slate-500">{city.active_hotspots} active hotspots</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">AQI {city.aqi}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${
                        city.risk_level === 'severe' ? 'text-red-600' :
                        city.risk_level === 'high' ? 'text-orange-600' :
                        city.risk_level === 'poor' ? 'text-yellow-600' :
                        city.risk_level === 'moderate' ? 'text-green-600' : 'text-emerald-600'
                      }`}>
                        {city.risk_level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

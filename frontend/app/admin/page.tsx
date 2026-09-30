"use client";

import { useState, useEffect } from "react";
import { 
  getRegions, 
  getHotspots, 
  getReports, 
  getForecast, 
  getAlerts,
  getCombinedFederatedRisk,
  shareFederatedPrediction,
  updateAlertStatus,
  Region,
  Hotspot,
  CitizenReport,
  ForecastResponse,
  Alert,
  CombinedFederatedRisk
} from "@/lib/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { ForecastChart } from "@/components/dashboard/ForecastChart";
import { HotspotTable } from "@/components/dashboard/HotspotTable";
import { AlertList } from "@/components/dashboard/AlertList";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { Activity, AlertTriangle, FileText, Map as MapIcon, ChevronDown, Loader2, Share2, Wind, Globe } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin');
    }
  }, [user, isAdmin, authLoading, router]);

  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [federatedRisk, setFederatedRisk] = useState<CombinedFederatedRisk | null>(null);
  
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRegions() {
      try {
        const data = await getRegions();
        setRegions(data);
        if (data.length > 0) {
          setSelectedRegionId(data[0].id);
        }
      } catch (err) {
        setError("Unable to connect to ClimatePulse backend.");
      } finally {
        setLoadingRegions(false);
      }
    }
    loadRegions();
  }, []);

  const loadData = async (regionId: string) => {
    setLoadingData(true);
    setError(null);
    try {
      const [hData, rData, fData, aData, fedData] = await Promise.all([
        getHotspots({ region_id: regionId }),
        getReports({ region_id: regionId }),
        getForecast(regionId),
        getAlerts({ region_id: regionId }),
        getCombinedFederatedRisk(regionId)
      ]);
      setHotspots(hData);
      setReports(rData);
      setForecast(fData);
      setAlerts(aData);
      setFederatedRisk(fedData);
    } catch (err) {
      setError("Unable to connect to ClimatePulse backend.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (selectedRegionId) {
      loadData(selectedRegionId);
    }
  }, [selectedRegionId]);

  const handleShareRisk = async (signal: any) => {
    try {
      await shareFederatedPrediction({
        source_region_id: signal.source_region_id,
        target_region_id: selectedRegionId,
        risk_summary_json: {
          zone: "Impact Zone",
          plume_vector_degrees: signal.plume_direction,
          projected_drift_km: signal.projected_drift,
          severity_index: 8,
          confidence: 0.9
        }
      });
      toast.success("Risk summary shared successfully!");
    } catch (error) {
      toast.error("Failed to share risk summary.");
    }
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (loadingRegions) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-600 font-medium">Loading regions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">{error}</h2>
        <button 
          onClick={() => {
            if (!regions.length) {
              window.location.reload();
            } else {
              loadData(selectedRegionId);
            }
          }}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const activeHotspots = hotspots.length;
  const reportsToday = reports.filter(r => {
    const today = new Date();
    const rDate = new Date(r.created_at);
    return rDate.toDateString() === today.toDateString();
  }).length;
  const criticalAlerts = alerts.filter(a => a.severity.toLowerCase() === 'critical').length;
  const currentWeather = forecast?.current_weather;
  const currentAqi = forecast?.baseline_pm25;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 1. Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Authority Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Monitor pollution activity, hotspots, alerts and air-quality trends.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="relative">
              <select 
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="appearance-none flex items-center gap-2 bg-white border border-slate-200 pl-4 pr-10 py-1.5 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loadingData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-slate-600 font-medium">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* 2. Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <StatCard 
                title="Active Hotspots" 
                value={activeHotspots} 
                description="Currently active" 
                icon={Activity} 
              />
              <StatCard 
                title="Critical Alerts" 
                value={criticalAlerts} 
                description="Require attention" 
                icon={AlertTriangle} 
              />
              <StatCard 
                title="Reports Today" 
                value={reportsToday} 
                description="Filed last 24h" 
                icon={FileText} 
              />
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-slate-500">Current AQI</h3>
                  <Wind className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">{currentAqi?.toFixed(1) || '--'}</div>
                  <p className="text-sm text-slate-500 mt-1 font-medium">PM2.5 Baseline</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-slate-500">Weather</h3>
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 tracking-tight">{currentWeather?.temperature || '--'}°C</div>
                  <p className="text-sm text-slate-500 mt-1 font-medium">{currentWeather?.wind_speed || '--'} km/h Wind</p>
                </div>
              </div>
            </div>

            {/* 3. AQI Forecast */}
            {forecast && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">24-Hour AQI Forecast</h2>
                  <p className="text-sm text-slate-500">Predicted AQI based on current weather and baseline PM2.5</p>
                </div>
                <ForecastChart data={forecast.forecast.map(f => ({
                  time: `+${f.hour_offset}h`,
                  predicted: f.predicted_aqi,
                })) as any} />
              </div>
            )}

            {/* 4. Critical Alerts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Alert Center</h2>
                  <p className="text-sm text-slate-500">Manage and resolve active alerts.</p>
                </div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">{alerts.length} Total</span>
              </div>
              <AlertList alerts={alerts as any} onUpdate={() => loadData(selectedRegionId)} regionId={selectedRegionId} />
            </div>

            {/* 5. Live Hotspots Map */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Admin Map: Hotspots & Cross-Border Signals</h2>
              </div>
              <div className="h-96 bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                {hotspots.map(h => (
                  <div key={h.id} className="absolute w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%` }}></div>
                ))}
                {federatedRisk?.inbound_cross_border_signals.map((s, i) => (
                  <div key={i} className="absolute w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%` }}></div>
                ))}
                <p className="text-sm font-semibold text-slate-700 z-10 bg-white/90 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-200 shadow-sm">Interactive Map Placeholder</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 6. Hotspot Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Active Pollution Hotspots</h2>
                    <p className="text-sm text-slate-500">Detailed list of hotspots in region.</p>
                  </div>
                </div>
                <HotspotTable hotspots={hotspots} />
              </div>

              {/* 7. Citizen Reports */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Report Monitoring</h2>
                  <p className="text-sm text-slate-500">Citizen submitted reports and AI analysis.</p>
                </div>
                <div className="p-2 h-[400px] overflow-y-auto">
                  <RecentReports reports={reports as any} />
                </div>
              </div>
            </div>

            {/* 8. Federated Intelligence */}
            {federatedRisk && (
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg text-white">
                <div className="mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Globe className="text-purple-400" />
                    Federated Intelligence
                  </h2>
                  <p className="text-slate-400 text-sm">Cross-border transboundary pollution risk analysis.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="text-sm text-slate-400 mb-1">Local Risk Profile</div>
                    <div className="text-2xl font-bold">{federatedRisk.local_hotspots_count} Hotspots</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="text-sm text-slate-400 mb-1">Transboundary Risk</div>
                    <div className="text-2xl font-bold text-amber-400 capitalize">{federatedRisk.transboundary_risk}</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="text-sm text-slate-400 mb-1">Inbound Signals</div>
                    <div className="text-2xl font-bold">{federatedRisk.inbound_cross_border_signals.length} Detected</div>
                  </div>
                </div>

                {federatedRisk.inbound_cross_border_signals.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-slate-700 pb-2">Inbound Cross-Border Signals</h3>
                    <div className="grid gap-4">
                      {federatedRisk.inbound_cross_border_signals.map((signal: any, idx: number) => (
                        <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="font-medium text-slate-200">Source: Region {signal.source_region_id}</div>
                            <div className="text-sm text-slate-400 mt-1">
                              Plume Direction: {signal.plume_direction}° | Projected Drift: {signal.projected_drift}km
                            </div>
                          </div>
                          <button
                            onClick={() => handleShareRisk(signal)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            Share Risk Summary
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 text-center text-slate-400">
                    No active cross-border pollution signals detected for this region.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

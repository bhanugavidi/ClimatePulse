import { 
  HOTSPOTS_MOCK, 
  DASHBOARD_STATS_MOCK, 
  AQI_HISTORY_MOCK, 
  FORECAST_MOCK, 
  ALERTS_MOCK, 
  CITIES_MOCK, 
  POLLUTION_SOURCES_MOCK, 
  CITIZEN_REPORTS_MOCK 
} from "@/lib/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
import { AqiChart } from "@/components/dashboard/AqiChart";
import { ForecastChart } from "@/components/dashboard/ForecastChart";
import { HotspotTable } from "@/components/dashboard/HotspotTable";
import { AlertList } from "@/components/dashboard/AlertList";
import { CityOverview } from "@/components/dashboard/CityOverview";
import { PollutionBreakdown } from "@/components/dashboard/PollutionBreakdown";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { Activity, AlertTriangle, FileText, Map as MapIcon, ChevronDown, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Authority Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Monitor pollution activity, hotspots, alerts and air-quality trends.</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs font-medium text-slate-500">Last updated: 2 min ago</p>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">System operational</span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4 items-center justify-end mb-8">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            All Cities <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            24 Hours <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Current AQI" 
            value={DASHBOARD_STATS_MOCK.currentAqi || 0} 
            status={DASHBOARD_STATS_MOCK.aqiStatus} 
            trend={DASHBOARD_STATS_MOCK.aqiTrend} 
          />
          <StatCard 
            title="Active Hotspots" 
            value={DASHBOARD_STATS_MOCK.activeHotspots || 0} 
            description={DASHBOARD_STATS_MOCK.hotspotsDesc} 
            icon={Activity} 
          />
          <StatCard 
            title="Critical Alerts" 
            value={DASHBOARD_STATS_MOCK.criticalAlerts || 0} 
            description={DASHBOARD_STATS_MOCK.alertsDesc} 
            icon={AlertTriangle} 
          />
          <StatCard 
            title="Reports Today" 
            value={DASHBOARD_STATS_MOCK.reportsToday || 0} 
            description={DASHBOARD_STATS_MOCK.reportsDesc} 
            icon={FileText} 
          />
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Spans 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AQI Overview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Air Quality Overview</h2>
                  <p className="text-sm text-slate-500">AQI trends over the last 24 hours.</p>
                </div>
                <div className="flex gap-3 text-xs font-medium">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Good</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Moderate</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Unhealthy</div>
                </div>
              </div>
              <AqiChart data={AQI_HISTORY_MOCK} />
            </div>

            {/* Forecast */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">24-Hour AQI Forecast</h2>
                <p className="text-sm text-slate-500">Forecast generated from current pollution and weather signals.</p>
              </div>
              <div className="flex justify-end gap-4 text-xs font-medium mb-2">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-900"></span> Actual</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-500 bg-transparent"></span> Predicted</div>
              </div>
              <ForecastChart data={FORECAST_MOCK} />
            </div>

            {/* Active Hotspots */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Active Pollution Hotspots</h2>
                  <p className="text-sm text-slate-500">Click a row to view details.</p>
                </div>
              </div>
              <HotspotTable hotspots={HOTSPOTS_MOCK} />
            </div>

            {/* Recent Citizen Reports */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Recent Citizen Reports</h2>
                <p className="text-sm text-slate-500">Reports filed by citizens and analyzed by AI.</p>
              </div>
              <div className="p-2">
                <RecentReports reports={CITIZEN_REPORTS_MOCK} />
              </div>
            </div>

            {/* Workflow Diagram */}
            <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200">
                Citizen Reports
              </div>
              <div className="hidden sm:block text-slate-400">→</div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200">
                AI Analysis
              </div>
              <div className="hidden sm:block text-slate-400">→</div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-teal-700 border-teal-100 bg-teal-50">
                Authority Alert
              </div>
              <div className="hidden sm:block text-slate-400">→</div>
              <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-2 rounded-lg shadow-sm">
                Response
              </div>
            </div>

          </div>

          {/* Right Column (Spans 1) */}
          <div className="space-y-8">
            
            {/* Map Preview */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Hotspot Map</h2>
              </div>
              <div className="h-48 bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
                {/* Simulated map background for prototype */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute w-4 h-4 bg-red-500 rounded-full top-1/3 left-1/4 animate-pulse"></div>
                <div className="absolute w-3 h-3 bg-orange-500 rounded-full top-1/2 left-2/3 animate-pulse"></div>
                <div className="absolute w-3 h-3 bg-yellow-500 rounded-full bottom-1/4 left-1/2 animate-pulse"></div>
                
                <p className="text-xs font-semibold text-slate-500 z-10 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-200 shadow-sm">Live Map Region</p>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-b-2xl border-t border-slate-100">
                <Link href="/map" className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  <MapIcon className="w-4 h-4" />
                  Open Live Map →
                </Link>
              </div>
            </div>

            {/* Alerts Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Active Alerts</h2>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">{ALERTS_MOCK.length} New</span>
              </div>
              <AlertList alerts={ALERTS_MOCK} />
            </div>

            {/* City Overview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">City Overview</h2>
              <CityOverview cities={CITIES_MOCK} />
            </div>

            {/* Pollution Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Pollution Sources</h2>
              <PollutionBreakdown data={POLLUTION_SOURCES_MOCK} />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

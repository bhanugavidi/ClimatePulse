"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, X } from "lucide-react";
import { Hotspot, getHotspots, getReports, CitizenReport } from "@/lib/api";
import { HotspotPopup } from "@/components/map/HotspotPopup";

const MapComponent = dynamic(() => import("@/components/map/PollutionMap"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4 text-emerald-700">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Loading map intelligence...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [hotspotsData, reportsData] = await Promise.all([
          getHotspots(),
          getReports()
        ]);
        setHotspots(hotspotsData);
        setReports(reportsData);
      } catch (err) {
        setError("Unable to connect to ClimatePulse backend.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-red-500">
          <p className="font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      
      {/* Full Width/Height Map Area */}
      <div className="absolute inset-0 z-0">
        {!loading && (
          <MapComponent 
            hotspots={hotspots}
            reports={reports}
            selectedHotspot={selectedHotspot} 
            onHotspotSelect={setSelectedHotspot} 
          />
        )}
      </div>

      {/* Floating Panel (Desktop left side, Mobile bottom) */}
      <div 
        className={`absolute z-[1001] transition-all duration-300 ease-in-out
          ${selectedHotspot 
            ? "translate-y-0 opacity-100" 
            : "translate-y-8 opacity-0 pointer-events-none"
          }
          /* Desktop styling */
          md:top-6 md:left-6 md:bottom-auto md:w-[340px] md:rounded-2xl md:translate-y-0
          ${!selectedHotspot && "md:-translate-x-8"}
          /* Mobile styling */
          bottom-0 left-0 w-full rounded-t-3xl md:rounded-b-2xl
          bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]
        `}
      >
        {selectedHotspot && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h2 className="font-bold text-slate-900 tracking-tight">Intelligence Report</h2>
              </div>
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-slate-50/50">
              <HotspotPopup hotspot={selectedHotspot} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

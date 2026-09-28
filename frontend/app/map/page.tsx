"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, X } from "lucide-react";
import { Hotspot } from "@/lib/mockData";
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
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      
      {/* Full Width/Height Map Area */}
      <div className="absolute inset-0 z-0">
        <MapComponent 
          selectedHotspot={selectedHotspot} 
          onHotspotSelect={setSelectedHotspot} 
        />
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
          <div className="flex flex-col p-6 h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Intelligence Report</h2>
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <HotspotPopup hotspot={selectedHotspot} />
            </div>
            
            <div className="mt-6 pt-4 space-y-3 bg-white">
              <button className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm">
                View Full Analysis
              </button>
              <button className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all">
                Share Alert
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Info, AlertCircle } from "lucide-react";

export function MapLegend() {
  return (
    <div className="absolute bottom-6 right-20 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto hidden sm:flex gap-6">
      
      {/* Hotspots Legend */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-500" /> Hotspot Risk
        </h4>
        <div className="space-y-2 text-xs font-medium text-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7f1d1d]"></span> Severe
            </div>
            <span className="text-slate-400">Hazardous</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span> High
            </div>
            <span className="text-slate-400">Unhealthy</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f97316]"></span> Poor
            </div>
            <span className="text-slate-400">Sensitive</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#eab308]"></span> Moderate
            </div>
            <span className="text-slate-400">Acceptable</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#22c55e]"></span> Good
            </div>
            <span className="text-slate-400">Clean</span>
          </div>
        </div>
      </div>

      {/* Citizen Reports Legend */}
      <div className="border-l border-slate-200 pl-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-slate-500" /> Pollution Intensity
        </h4>
        <div className="space-y-2 text-xs font-medium text-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#dc2626] border border-white shadow-sm"></span> Severe
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ea580c] border border-white shadow-sm"></span> High
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f97316] border border-white shadow-sm"></span> Moderate
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#fdba74] border border-white shadow-sm"></span> Low
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

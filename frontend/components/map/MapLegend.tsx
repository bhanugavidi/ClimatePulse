import { Info } from "lucide-react";

export function MapLegend() {
  return (
    <div className="absolute bottom-6 right-20 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto hidden sm:block">
      <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <Info className="h-4 w-4 text-slate-500" /> Risk Legend
      </h4>
      <div className="space-y-2 text-xs font-medium text-slate-700">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-900"></span> Severe
          </div>
          <span className="text-slate-400">Hazardous</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> High
          </div>
          <span className="text-slate-400">Unhealthy</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> Poor
          </div>
          <span className="text-slate-400">Sensitive</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Moderate
          </div>
          <span className="text-slate-400">Acceptable</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> Good
          </div>
          <span className="text-slate-400">Clean</span>
        </div>
      </div>
    </div>
  );
}

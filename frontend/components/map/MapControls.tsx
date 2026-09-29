import { Filter } from "lucide-react";

export type FilterType = "All" | "Air Quality" | "Fires" | "Industrial" | "Traffic" | "Smoke" | "Dust";

interface MapControlsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function MapControls({ activeFilter, onFilterChange }: MapControlsProps) {
  const filters: FilterType[] = ["All", "Air Quality", "Fires", "Industrial", "Traffic", "Smoke", "Dust"];

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto w-[calc(100%-48px)] sm:w-auto">
      <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl border border-slate-200/60 flex flex-row items-center gap-1 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:flex">
          <Filter className="h-3 w-3" /> Filters
        </div>
        <div className="flex flex-wrap gap-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? "bg-slate-900 text-white shadow-md scale-100"
                  : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

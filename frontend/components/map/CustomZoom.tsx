import { useMap } from "react-leaflet";
import { Plus, Minus } from "lucide-react";

export function CustomZoom() {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-6 z-[1000] pointer-events-auto flex flex-col gap-2">
      <button 
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-white hover:text-slate-900 transition-colors"
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button 
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-white hover:text-slate-900 transition-colors"
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
}

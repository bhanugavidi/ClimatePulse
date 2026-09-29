import { MapPin, Loader2, AlertTriangle, Navigation } from "lucide-react";
import { useCurrentLocation, LocationState } from "@/hooks/useCurrentLocation";

interface CurrentLocationButtonProps {
  onLocationFound: (location: LocationState) => void;
  className?: string;
  variant?: "map-overlay" | "text-button";
}

export function CurrentLocationButton({ onLocationFound, className = "", variant = "map-overlay" }: CurrentLocationButtonProps) {
  const { location, loading, error, getCurrentLocation } = useCurrentLocation();

  const handleClick = () => {
    getCurrentLocation((loc) => {
      onLocationFound(loc);
    });
  };

  if (variant === "text-button") {
    return (
      <div className="flex flex-col">
        <button 
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={`text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 ${className}
            ${error ? "text-red-500 hover:text-red-600" : "text-emerald-600 hover:text-emerald-700"}`}
        >
          {loading ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Getting location...</>
          ) : location ? (
            <span className="text-emerald-600">✓ Location detected</span>
          ) : error ? (
            <><AlertTriangle className="w-3 h-3 text-red-500" /> Try again</>
          ) : (
            <><MapPin className="w-3 h-3" /> Use current location</>
          )}
        </button>
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Map Overlay Variant
  return (
    <div className={`absolute bottom-32 right-6 z-[1000] pointer-events-auto ${className}`}>
      <div className="relative group">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-white hover:text-emerald-600 transition-all disabled:opacity-50"
          aria-label="Use current location"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          ) : location ? (
            <Navigation className="w-5 h-5 text-emerald-600 fill-emerald-100" />
          ) : error ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
        
        {/* Tooltip for map overlay */}
        {error && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-48 bg-red-50 text-red-600 text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

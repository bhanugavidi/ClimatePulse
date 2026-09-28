import { useState, useEffect } from "react";
import { Search, X, Loader2, MapPin, AlertCircle } from "lucide-react";

interface PlaceResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

interface PlaceSearchProps {
  onPlaceSelect: (lat: number, lng: number, name: string) => void;
  onClear: () => void;
}

export function PlaceSearch({ onPlaceSelect, onClear }: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch from Nominatim
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedQuery
          )}&limit=5`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data: PlaceResult[] = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        setError("Failed to fetch locations.");
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    searchPlaces();
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onClear();
  };

  const handleSelect = (place: PlaceResult) => {
    onPlaceSelect(parseFloat(place.lat), parseFloat(place.lon), place.display_name);
    setQuery(place.display_name);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto w-[calc(100%-48px)] sm:w-full max-w-md">
      {/* Search Input */}
      <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/60 flex items-center px-4 py-3 transition-all focus-within:shadow-xl focus-within:ring-2 focus-within:ring-emerald-500/20 relative z-10">
        <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Search any place..."
          className="bg-transparent border-none outline-none w-full text-sm text-slate-900 placeholder:text-slate-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <div className="flex items-center gap-2 ml-2 shrink-0">
          {isLoading && <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />}
          {query && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden z-0">
          <ul className="max-h-60 overflow-y-auto custom-scrollbar">
            {error ? (
              <li className="px-4 py-4 text-center text-sm text-red-500 flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </li>
            ) : results.length > 0 ? (
              results.map((place) => (
                <li key={place.place_id}>
                  <button
                    onClick={() => handleSelect(place)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50/80 flex items-start gap-3 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {place.display_name}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-sm text-slate-500">
                No places found matching "{debouncedQuery}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

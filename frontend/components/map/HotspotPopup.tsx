import { Hotspot } from "@/lib/mockData";
import { Flame, Factory, Wind, Brain, MapPin, Clock, Users, Car, Cloud, CloudFog } from "lucide-react";

export function HotspotPopup({ hotspot }: { hotspot: Hotspot }) {
  const getCategoryIcon = () => {
    switch (hotspot.category) {
      case "Fires": return <Flame className="h-5 w-5 text-red-500" />;
      case "Industrial": return <Factory className="h-5 w-5 text-orange-500" />;
      case "Traffic": return <Car className="h-5 w-5 text-blue-500" />;
      case "Smoke": return <Cloud className="h-5 w-5 text-slate-500" />;
      case "Dust": return <CloudFog className="h-5 w-5 text-yellow-600" />;
      default: return <Wind className="h-5 w-5 text-teal-500" />;
    }
  };

  const getRiskColorClass = () => {
    switch (hotspot.risk_level) {
      case "severe": 
      case "Critical": return "text-red-700 bg-red-100";
      case "high": 
      case "High": return "text-orange-700 bg-orange-100";
      case "poor": 
      case "Medium": return "text-yellow-700 bg-yellow-100";
      case "moderate": 
      case "Low": return "text-green-700 bg-green-100";
      case "good": return "text-emerald-700 bg-emerald-100";
      default: return "text-slate-700 bg-slate-100";
    }
  };

  return (
    <div className="p-1 w-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
            {getCategoryIcon()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-tight">
              {hotspot.category} Event
            </h3>
            <div className="flex items-center text-xs text-slate-500 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[200px]">{hotspot.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-2 mb-3 border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">Risk Level</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getRiskColorClass()}`}>
            {hotspot.risk_level}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Brain className="h-3 w-3" /> AI Score
          </span>
          <span className="text-xs font-bold text-slate-900">{hotspot.ai_score}/100</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">PM2.5</span>
          <span className="text-xs font-bold text-slate-900">{hotspot.pm25} µg/m³</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
        {hotspot.description}
      </p>

      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 border-t pt-2">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" /> {hotspot.reports_count} Reports
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {new Date(hotspot.last_updated || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

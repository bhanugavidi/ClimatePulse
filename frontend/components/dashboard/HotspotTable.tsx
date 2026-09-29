"use client";

import { Hotspot } from "@/lib/mockData";
import { useState } from "react";
import { X, Map as MapIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HotspotTable({ hotspots }: { hotspots: Hotspot[] }) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-700";
      case "High": return "bg-orange-100 text-orange-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      default: return "bg-green-100 text-green-700";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold rounded-tl-xl">Location</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">AQI</th>
              <th className="px-6 py-4 font-semibold">Severity</th>
              <th className="px-6 py-4 font-semibold">Confidence</th>
              <th className="px-6 py-4 font-semibold rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((hotspot) => (
              <tr 
                key={hotspot.id} 
                onClick={() => setSelectedHotspot(hotspot)}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-slate-900">{hotspot.location}</td>
                <td className="px-6 py-4 text-slate-600">{hotspot.category}</td>
                <td className="px-6 py-4 font-semibold text-slate-700">{hotspot.pm25}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getSeverityStyles(hotspot.risk_level)}`}>
                    {hotspot.risk_level}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-600">{hotspot.ai_score}%</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium ${
                    hotspot.status === 'Active' ? 'text-red-600' :
                    hotspot.status === 'Investigating' ? 'text-orange-600' :
                    'text-teal-600'
                  }`}>
                    {hotspot.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel / Modal */}
      {selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedHotspot(null)}>
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedHotspot.location}</h3>
                <p className="text-slate-500 text-sm mt-1">Detected {selectedHotspot.detectedTime}</p>
              </div>
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Pollution Type</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.category}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">AQI</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.pm25}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Severity</p>
                  <span className={`px-2.5 py-1 inline-block rounded-md text-xs font-bold uppercase tracking-wider ${getSeverityStyles(selectedHotspot.risk_level)}`}>
                    {selectedHotspot.risk_level}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">AI Confidence</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.ai_score}%</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Estimated Source</h4>
                <p className="text-sm text-slate-600 mb-4">{selectedHotspot.estimatedSource}</p>
                
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Recommended Action</h4>
                <p className="text-sm text-slate-600">{selectedHotspot.recommendedAction}</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <Link href="/map" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <MapIcon className="w-4 h-4" />
                View on Map
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

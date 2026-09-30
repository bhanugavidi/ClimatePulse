"use client";

import { Hotspot } from "@/lib/api";
import { useState } from "react";
import { X, Map as MapIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HotspotTable({ hotspots }: { hotspots: Hotspot[] }) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const getSeverityStyles = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "bg-red-100 text-red-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      default: return "bg-green-100 text-green-700";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold rounded-tl-xl">Coordinates</th>
              <th className="px-6 py-4 font-semibold">Risk Level</th>
              <th className="px-6 py-4 font-semibold">Radius</th>
              <th className="px-6 py-4 font-semibold">Reports</th>
              <th className="px-6 py-4 font-semibold rounded-tr-xl">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((hotspot) => (
              <tr 
                key={hotspot.id} 
                onClick={() => setSelectedHotspot(hotspot)}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-slate-900">{hotspot.center_lat.toFixed(4)}, {hotspot.center_lng.toFixed(4)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getSeverityStyles(hotspot.risk_level)}`}>
                    {hotspot.risk_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{hotspot.radius_m}m</td>
                <td className="px-6 py-4 font-semibold text-slate-700">{hotspot.report_count}</td>
                <td className="px-6 py-4 text-slate-600">{new Date(hotspot.last_updated).toLocaleString()}</td>
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
                <h3 className="text-xl font-bold text-slate-900">Hotspot Details</h3>
                <p className="text-slate-500 text-sm mt-1">Updated {new Date(selectedHotspot.last_updated).toLocaleString()}</p>
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
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Coordinates</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.center_lat.toFixed(4)}, {selectedHotspot.center_lng.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Risk Level</p>
                  <span className={`px-2.5 py-1 inline-block rounded-md text-xs font-bold uppercase tracking-wider ${getSeverityStyles(selectedHotspot.risk_level)}`}>
                    {selectedHotspot.risk_level}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Radius</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.radius_m} meters</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Report Count</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.report_count}</p>
                </div>
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

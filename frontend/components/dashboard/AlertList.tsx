"use client";

import { Alert, updateAlertStatus, CitizenReport, Hotspot } from "@/lib/api";
import { AlertCircle, AlertTriangle, Info, Check, ArrowUpCircle, MapPin, ImageIcon, Camera, Activity, FileText } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

interface AlertListProps {
  alerts: Alert[];
  reports: CitizenReport[];
  hotspots: Hotspot[];
  onUpdate: (rId: string) => void;
  regionId: string;
}

export function AlertList({ alerts, reports, hotspots, onUpdate, regionId }: AlertListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [sort, setSort] = useState<"Newest" | "Oldest">("Newest");
  const [locationNames, setLocationNames] = useState<Record<string, string>>({});
  
  // Detail Modal State
  const [selectedAlertData, setSelectedAlertData] = useState<{
    alert: Alert,
    hotspot?: Hotspot,
    reports: CitizenReport[]
  } | null>(null);

  // Stats
  const openCount = alerts.filter(a => ["open", "new"].includes(a.status?.toLowerCase())).length;
  const escalatedCount = alerts.filter(a => a.status?.toLowerCase() === "escalated").length;
  const resolvedCount = alerts.filter(a => a.status?.toLowerCase() === "resolved").length;

  const filteredAlerts = useMemo(() => {
    let res = [...alerts];
    if (filter !== "All") {
      res = res.filter(a => {
        if (filter === "Open") return ["open", "new"].includes(a.status?.toLowerCase());
        if (filter === "Acknowledged") return a.status?.toLowerCase() === "acknowledged";
        if (filter === "Escalated") return a.status?.toLowerCase() === "escalated";
        if (filter === "Resolved") return a.status?.toLowerCase() === "resolved";
        // Severities
        if (["Low", "Moderate", "High", "Severe"].includes(filter)) {
          return a.severity?.toLowerCase() === filter.toLowerCase();
        }
        return true;
      });
    }
    
    res.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sort === "Newest" ? timeB - timeA : timeA - timeB;
    });
    
    return res;
  }, [alerts, filter, sort]);

  // Pre-fetch location names based on hotspot lat/lng
  useEffect(() => {
    const fetchNames = async () => {
      const names: Record<string, string> = { ...locationNames };
      let changed = false;
      for (const alert of alerts) {
        const hotspot = hotspots.find(h => h.id === alert.hotspot_id);
        if (hotspot && !names[hotspot.id]) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${hotspot.center_lat}&lon=${hotspot.center_lng}&zoom=10`);
            const data = await res.json();
            names[hotspot.id] = data.name || data.display_name?.split(',')[0] || "Unknown location";
            changed = true;
          } catch (e) {
            names[hotspot.id] = "Unknown location";
            changed = true;
          }
        }
      }
      if (changed) setLocationNames(names);
    };
    if (alerts.length > 0 && hotspots.length > 0) fetchNames();
  }, [alerts, hotspots]);

  const getSeverityStyle = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "SEVERE":
      case "CRITICAL": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-500" };
      case "HIGH": return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-500" };
      case "MODERATE":
      case "MEDIUM": return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-400" };
      case "LOW": default: return { bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-300" };
    }
  };

  const handleUpdateStatus = async (alertId: string, status: string) => {
    setUpdatingId(alertId);
    try {
      await updateAlertStatus(alertId, status);
      toast.success(`Alert marked as ${status}`);
      onUpdate(regionId);
      
      // Close modal if open
      if (selectedAlertData?.alert.id === alertId) {
        setSelectedAlertData(prev => prev ? { ...prev, alert: { ...prev.alert, status } } : null);
      }
    } catch (error) {
      toast.error(`Failed to update alert status.`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Alert Center</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor and respond to active pollution incidents.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">{alerts.length} Total</span>
          {openCount > 0 && <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">{openCount} Open</span>}
          {escalatedCount > 0 && <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full">{escalatedCount} Escalated</span>}
          {resolvedCount > 0 && <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">{resolvedCount} Resolved</span>}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Open", "Acknowledged", "Escalated", "Resolved"].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${filter === f ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value as any)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>
      </div>

      {/* LIST */}
      <div className="space-y-4 flex-1">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <Check className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No active pollution alerts</h3>
            <p className="text-xs text-slate-500 mt-1">No incidents currently require attention.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const hotspot = hotspots.find(h => h.id === alert.hotspot_id);
            const relatedReports = reports.filter(r => hotspot && Math.abs(r.lat - hotspot.center_lat) < 0.05 && Math.abs(r.lng - hotspot.center_lng) < 0.05); // Rough matching for frontend since we don't have explicit foreign key in Report for Hotspot
            const sStyle = getSeverityStyle(alert.severity);
            const mainPhoto = relatedReports.find(r => r.photo_url)?.photo_url;
            
            const highestPm25 = relatedReports.reduce((max, r) => r.reported_pm25 ? Math.max(max, r.reported_pm25) : max, 0);
            const avgAiScore = relatedReports.length ? Math.round(relatedReports.reduce((sum, r) => sum + (r.ai_score || 0), 0) / relatedReports.length) : 0;
            const primaryCategory = relatedReports.find(r => r.ai_category)?.ai_category || "Unknown";
            const locName = hotspot ? locationNames[hotspot.id] : "Unknown";

            return (
              <div key={alert.id} className={`flex flex-col md:flex-row bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-l-4 ${sStyle.border} hover:shadow-md transition-shadow`}>
                
                {/* IMAGE (LEFT) */}
                <div className="w-full md:w-[180px] h-40 md:h-auto bg-slate-100 flex-shrink-0 relative">
                  {mainPhoto ? (
                    <img src={mainPhoto} alt="Pollution evidence" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Camera className="w-8 h-8 opacity-50" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">No Photo</span>
                    </div>
                  )}
                  {relatedReports.filter(r => r.photo_url).length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                      +{relatedReports.filter(r => r.photo_url).length - 1} photos
                    </div>
                  )}
                </div>

                {/* INFO (CENTER) */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${sStyle.bg} ${sStyle.text}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">
                        Status: {alert.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug mb-3">
                      {alert.message}
                    </h4>
                    
                    {hotspot && (
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{locName}</span>
                          <span className="text-slate-400">({hotspot.center_lat.toFixed(3)}, {hotspot.center_lng.toFixed(3)})</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">AI Category</span>
                      <span className="text-xs font-semibold text-slate-700 capitalize">{primaryCategory}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">AI Score</span>
                      <span className="text-xs font-semibold text-slate-700">{avgAiScore || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">PM2.5</span>
                      <span className="text-xs font-semibold text-slate-700">{highestPm25 > 0 ? `${highestPm25} Âµg/mÂ³` : "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Reports</span>
                      <span className="text-xs font-semibold text-slate-700">{relatedReports.length}</span>
                    </div>
                  </div>
                </div>

                {/* ACTIONS (RIGHT) */}
                <div className="w-full md:w-[180px] p-4 bg-slate-50/50 flex flex-col justify-between border-l border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-500 block mb-1">Created</span>
                    <span className="text-xs font-medium text-slate-700">{new Date(alert.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <button 
                      onClick={() => setSelectedAlertData({ alert, hotspot, reports: relatedReports })}
                      className="w-full py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Report
                    </button>
                    {hotspot && (
                      <a 
                        href={`/map?lat=${hotspot.center_lat}&lng=${hotspot.center_lng}&zoom=14`}
                        target="_blank" rel="noreferrer"
                        className="w-full py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5" /> View on Map
                      </a>
                    )}
                    
                    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200">
                      <button 
                        disabled={updatingId === alert.id || alert.status === "escalated" || alert.status === "resolved"}
                        onClick={() => handleUpdateStatus(alert.id, "escalated")}
                        className="flex-1 py-1.5 text-[10px] font-bold text-orange-600 border border-orange-200 hover:bg-orange-50 rounded disabled:opacity-30 transition-colors"
                      >
                        Escalate
                      </button>
                      <button 
                        disabled={updatingId === alert.id || alert.status === "resolved"}
                        onClick={() => handleUpdateStatus(alert.id, "resolved")}
                        className="flex-1 py-1.5 text-[10px] font-bold text-teal-600 border border-teal-200 hover:bg-teal-50 rounded disabled:opacity-30 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedAlertData && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Incident Report Details</h3>
              <button 
                onClick={() => setSelectedAlertData(null)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm"
              >
                Close
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-6 flex-1">
              {/* Main Image Gallery */}
              {selectedAlertData.reports.filter(r => r.photo_url).length > 0 ? (
                <div className="mb-6">
                  <div className="w-full h-64 bg-slate-900 rounded-xl overflow-hidden mb-3">
                    <img src={selectedAlertData.reports.find(r => r.photo_url)?.photo_url || undefined} alt="Evidence" className="w-full h-full object-contain" />
                  </div>
                  {selectedAlertData.reports.filter(r => r.photo_url).length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedAlertData.reports.filter(r => r.photo_url).map(r => (
                        <img key={r.id} src={r.photo_url || undefined} alt="Thumbnail" className="w-16 h-16 object-cover rounded-lg border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-colors" />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-40 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-6">
                  <Camera className="w-8 h-8 opacity-50" />
                </div>
              )}

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Alert Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Message</span><span className="font-medium text-slate-900 text-right ml-4">{selectedAlertData.alert.message}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Severity</span><span className="font-bold text-red-600">{selectedAlertData.alert.severity}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium text-slate-900 capitalize">{selectedAlertData.alert.status}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-medium text-slate-900">{new Date(selectedAlertData.alert.created_at).toLocaleString()}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Location & Metrics</h4>
                  <div className="space-y-3 text-sm">
                    {selectedAlertData.hotspot && (
                      <>
                        <div className="flex justify-between"><span className="text-slate-500">Area</span><span className="font-medium text-slate-900">{locationNames[selectedAlertData.hotspot.id] || "Unknown"}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Coordinates</span><span className="font-medium text-slate-900">{selectedAlertData.hotspot.center_lat.toFixed(4)}, {selectedAlertData.hotspot.center_lng.toFixed(4)}</span></div>
                      </>
                    )}
                    <div className="flex justify-between"><span className="text-slate-500">Citizen Reports</span><span className="font-medium text-slate-900">{selectedAlertData.reports.length}</span></div>
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className="mt-8">
                <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Citizen Descriptions</h4>
                <div className="space-y-3">
                  {selectedAlertData.reports.filter(r => r.description).length > 0 ? (
                    selectedAlertData.reports.filter(r => r.description).map(r => (
                      <div key={r.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-700 italic">"{r.description}"</p>
                        <div className="mt-2 text-xs text-slate-500 flex gap-4">
                          <span>PM2.5: {r.reported_pm25 || "N/A"}</span>
                          <span>AI: {r.ai_category} ({r.ai_score})</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No text descriptions provided by citizens.</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
               <button 
                 disabled={updatingId === selectedAlertData.alert.id || selectedAlertData.alert.status === "escalated" || selectedAlertData.alert.status === "resolved"}
                 onClick={() => handleUpdateStatus(selectedAlertData.alert.id, "escalated")}
                 className="px-6 py-2 text-sm font-bold text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg disabled:opacity-30 transition-colors"
               >
                 Escalate Incident
               </button>
               <button 
                 disabled={updatingId === selectedAlertData.alert.id || selectedAlertData.alert.status === "resolved"}
                 onClick={() => handleUpdateStatus(selectedAlertData.alert.id, "resolved")}
                 className="px-6 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg disabled:opacity-50 transition-colors"
               >
                 Mark as Resolved
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



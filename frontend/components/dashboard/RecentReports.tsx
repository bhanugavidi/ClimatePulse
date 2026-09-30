"use client";

import { CitizenReport, updateReportStatus } from "@/lib/api";
import { CheckCircle2, Clock, Check, Loader2, MapPin, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function RecentReports({ reports, onUpdate }: { reports: CitizenReport[], onUpdate?: () => void }) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [locationNames, setLocationNames] = useState<Record<string, string>>({});

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved": return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "reviewed": return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleResolve = async (id: string) => {
    setUpdatingId(id);
    try {
      await updateReportStatus(id, "resolved");
      toast.success("Citizen report marked as resolved.");
      if (onUpdate) onUpdate();
    } catch (e) {
      toast.error("Failed to update report status.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      const names: Record<string, string> = { ...locationNames };
      for (const report of reports) {
        if (!names[report.id]) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.lat}&lon=${report.lng}&zoom=10`);
            const data = await res.json();
            names[report.id] = data.name || data.display_name?.split(',')[0] || "Unknown location";
          } catch (e) {
            names[report.id] = "Unknown location";
          }
        }
      }
      setLocationNames(names);
    };
    
    if (reports.length > 0) {
      fetchNames();
    }
  }, [reports]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold rounded-tl-xl">Photo</th>
            <th className="px-4 py-3 font-semibold">Time</th>
            <th className="px-4 py-3 font-semibold">Location</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">AI Severity</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold rounded-tr-xl">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-4 text-center text-slate-500">No reports found.</td></tr>
          ) : reports.map((report) => (
            <tr key={report.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-2">
                {report.photo_url ? (
                  <a href={report.photo_url} target="_blank" rel="noreferrer" className="block w-10 h-10 rounded-md overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                    <img src={report.photo_url} alt="Report" className="w-full h-full object-cover" />
                  </a>
                ) : (
                  <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(report.created_at).toLocaleString()}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-900">{locationNames[report.id] || "Loading..."}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{report.lat.toFixed(4)}, {report.lng.toFixed(4)}</span>
                    <a href={`/map?lat=${report.lat}&lng=${report.lng}&zoom=14`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      <MapPin className="w-3 h-3" /> Map
                    </a>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600 capitalize">{report.ai_category || "Unknown"}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  report.severity?.toLowerCase() === 'severe' ? 'bg-red-100 text-red-700' :
                  report.severity?.toLowerCase() === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {report.severity || "Pending"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(report.status)}
                  <span className="text-xs font-medium text-slate-700 capitalize">{report.status}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {report.status !== 'resolved' && (
                  <button 
                    disabled={updatingId === report.id}
                    onClick={() => handleResolve(report.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                  >
                    {updatingId === report.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Resolve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

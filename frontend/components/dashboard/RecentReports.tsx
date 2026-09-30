import { CitizenReport } from "@/lib/api";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export function RecentReports({ reports }: { reports: CitizenReport[] }) {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved": return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "reviewed": return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold rounded-tl-xl">Time</th>
            <th className="px-4 py-3 font-semibold">Location</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">AI Severity</th>
            <th className="px-4 py-3 font-semibold rounded-tr-xl">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-500">No reports found.</td></tr>
          ) : reports.map((report) => (
            <tr key={report.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(report.created_at).toLocaleString()}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{report.lat.toFixed(4)}, {report.lng.toFixed(4)}</td>
              <td className="px-4 py-3 text-slate-600">{report.ai_category || "Unknown"}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

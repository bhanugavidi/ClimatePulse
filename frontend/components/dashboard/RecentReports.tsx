import { CitizenReport } from "@/lib/mockData";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export function RecentReports({ reports }: { reports: CitizenReport[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified": return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "Reviewing": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Rejected": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
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
            <th className="px-4 py-3 font-semibold">AI Result</th>
            <th className="px-4 py-3 font-semibold rounded-tr-xl">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{report.time}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{report.location}</td>
              <td className="px-4 py-3 text-slate-600">{report.type}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  report.aiResult.includes('Critical') ? 'bg-red-100 text-red-700' :
                  report.aiResult.includes('High') ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {report.aiResult}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(report.status)}
                  <span className="text-xs font-medium text-slate-700">{report.status}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

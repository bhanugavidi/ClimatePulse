import { Alert } from "@/lib/mockData";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

export function AlertList({ alerts }: { alerts: Alert[] }) {
  const getIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />;
      case "HIGH": return <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />;
      case "MEDIUM": return <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />;
      default: return <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />;
    }
  };

  const getBadgeStyle = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-100 text-red-700";
      case "HIGH": return "bg-orange-100 text-orange-700";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex gap-3">
            {getIcon(alert.severity)}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getBadgeStyle(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
              <h4 className="font-semibold text-sm text-slate-900 mt-2">{alert.title}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{alert.location}</p>
              <p className="text-sm text-slate-600 mt-2">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Link href="#" className="block text-center text-sm font-medium text-teal-600 hover:text-teal-700 mt-6 pt-4 border-t border-slate-100">
        View all alerts →
      </Link>
    </div>
  );
}

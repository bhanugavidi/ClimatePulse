import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  status?: string;
  icon?: LucideIcon;
  trend?: string;
}

export function StatCard({ title, value, description, status, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-teal-600" />}
      </div>
      
      <div>
        <div className="flex items-end gap-3 mb-1">
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          {status && (
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full mb-1 ${
              status === "Unhealthy" ? "bg-red-100 text-red-700" :
              status === "Moderate" ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"
            }`}>
              {status}
            </span>
          )}
        </div>
        
        {(description || trend) && (
          <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1">
            {trend && <span className={trend.includes('↑') ? 'text-red-500' : 'text-teal-600'}>{trend}</span>}
            {description && <span>{description}</span>}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AlertCircle, AlertTriangle, Info, ShieldAlert, X } from "lucide-react";

export type AlertSeverity = "critical" | "high" | "medium" | "warning" | "info";

interface AlertItemProps {
  id: string;
  title: string;
  location: string;
  description: string;
  time: string;
  severity: AlertSeverity;
  onDismiss?: (id: string) => void;
}

export function AlertItem({ id, title, location, description, time, severity, onDismiss }: AlertItemProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss(id);
  };

  const config: Record<string, any> = {
    critical: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
      title: "text-red-900",
      badge: "bg-red-100 text-red-700 border-red-200"
    },
    high: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      title: "text-orange-900",
      badge: "bg-orange-100 text-orange-700 border-orange-200"
    },
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      title: "text-orange-900",
      badge: "bg-orange-100 text-orange-700 border-orange-200"
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      title: "text-amber-900",
      badge: "bg-amber-100 text-amber-700 border-amber-200"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: <Info className="h-5 w-5 text-blue-600" />,
      title: "text-blue-900",
      badge: "bg-blue-100 text-blue-700 border-blue-200"
    }
  };

  const style = config[severity] || config["info"];

  return (
    <div className={`relative flex gap-4 p-4 rounded-xl border ${style.bg} ${style.border} transition-all duration-300`}>
      <div className="shrink-0 mt-1">
        {style.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className={`text-sm font-bold ${style.title}`}>{title}</h4>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${style.badge}`}>
                {severity}
              </span>
              <span className="text-xs font-medium text-slate-500">{location}</span>
              <span className="text-xs text-slate-400">• {time}</span>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

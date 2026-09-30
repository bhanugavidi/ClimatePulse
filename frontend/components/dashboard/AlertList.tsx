"use client";

import { Alert, updateAlertStatus } from "@/lib/api";
import { AlertCircle, AlertTriangle, Info, Check, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

export function AlertList({ alerts, onUpdate, regionId }: { alerts: Alert[], onUpdate: (rId: string) => void, regionId: string }) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getIcon = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL": return <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />;
      case "HIGH": return <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />;
      case "MEDIUM": return <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />;
      default: return <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />;
    }
  };

  const getBadgeStyle = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL": return "bg-red-100 text-red-700";
      case "HIGH": return "bg-orange-100 text-orange-700";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const handleUpdateStatus = async (alertId: string, status: string) => {
    setUpdatingId(alertId);
    try {
      await updateAlertStatus(alertId, status);
      toast.success(`Alert marked as ${status}`);
      onUpdate(regionId);
    } catch (error) {
      toast.error(`Failed to update alert status.`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-1">
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No active alerts.</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex gap-3">
              {getIcon(alert.severity)}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getBadgeStyle(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(alert.created_at).toLocaleString()}</span>
                </div>
                <h4 className="font-semibold text-sm text-slate-900 mt-2">{alert.message}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">Status: {alert.status}</span>
                </div>
                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                  <button 
                    disabled={updatingId === alert.id || alert.status === "escalated"}
                    onClick={() => handleUpdateStatus(alert.id, "escalated")}
                    className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-50"
                  >
                    <ArrowUpCircle className="w-3 h-3" /> Escalate
                  </button>
                  <button 
                    disabled={updatingId === alert.id || alert.status === "resolved"}
                    onClick={() => handleUpdateStatus(alert.id, "resolved")}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 disabled:opacity-50"
                  >
                    <Check className="w-3 h-3" /> Resolve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Link href="#" className="block text-center text-sm font-medium text-teal-600 hover:text-teal-700 mt-6 pt-4 border-t border-slate-100">
        View all alerts →
      </Link>
    </div>
  );
}

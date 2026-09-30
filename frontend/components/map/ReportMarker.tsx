import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CitizenReport } from "@/lib/api";

const getIntensityProperties = (report: CitizenReport) => {
  let intensity = "low";
  
  if (report.severity) {
    const s = report.severity.toLowerCase();
    if (["severe", "critical"].includes(s)) intensity = "severe";
    else if (["high"].includes(s)) intensity = "high";
    else if (["moderate", "poor"].includes(s)) intensity = "moderate";
  } else if (report.ai_score !== undefined && report.ai_score !== null) {
    if (report.ai_score >= 75) intensity = "severe";
    else if (report.ai_score >= 50) intensity = "high";
    else if (report.ai_score >= 25) intensity = "moderate";
  }

  switch (intensity) {
    case "severe": return { color: "#dc2626", size: 14, label: "SEVERE" };
    case "high": return { color: "#ea580c", size: 12, label: "HIGH" };
    case "moderate": return { color: "#f97316", size: 10, label: "MODERATE" };
    case "low": default: return { color: "#fdba74", size: 8, label: "LOW" };
  }
};

export function ReportMarker({ report }: { report: CitizenReport }) {
  const props = getIntensityProperties(report);

  const markerHtmlStyles = `
    background-color: ${props.color};
    width: ${props.size}px;
    height: ${props.size}px;
    display: block;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    transform: translate(-50%, -50%);
  `;

  const customIcon = L.divIcon({
    className: "custom-report-marker",
    html: `<span style="${markerHtmlStyles}" />`,
    iconSize: [props.size, props.size],
    iconAnchor: [props.size / 2, props.size / 2],
    popupAnchor: [0, -props.size / 2]
  });

  return (
    <Marker 
      position={[report.lat, report.lng]}
      icon={customIcon}
    >
      <Popup className="report-popup font-sans rounded-xl overflow-hidden p-0">
        <div className="w-[220px]">
          {report.photo_url && (
            <div className="w-full h-32 bg-slate-100 border-b border-slate-200">
              <img src={report.photo_url} alt="Report evidence" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900">Citizen Report</h4>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{report.status}</span>
            </div>
            
            <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-500">Severity</span>
              <span className="font-bold" style={{ color: props.color }}>{props.label}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-500">AI Category</span>
              <span className="font-medium capitalize">{report.ai_category || "Unknown"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-500">AI Score</span>
              <span className="font-medium">{report.ai_score !== undefined ? report.ai_score : "N/A"}</span>
            </div>

            {report.reported_pm25 !== undefined && report.reported_pm25 !== null && (
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">PM2.5</span>
                <span className="font-medium">{report.reported_pm25} Âµg/mÂ³</span>
              </div>
            )}
            
            {report.created_at && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1">
                <span className="font-semibold text-slate-500">Time</span>
                <span className="font-medium">{new Date(report.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            )}
          </div>

          {report.description && (
            <div className="mt-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</span>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{report.description}"
              </p>
            </div>
          )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}


import { Marker, Popup, Circle, LayerGroup } from "react-leaflet";
import L from "leaflet";
import { Hotspot } from "@/lib/mockData";
import { HotspotPopup } from "./HotspotPopup";

// Fix for default Leaflet icon issues in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getRiskColor = (risk: Hotspot["risk_level"]) => {
  switch (risk) {
    case "severe": return "#7f1d1d"; // dark red
    case "high": return "#ef4444"; // red
    case "poor": return "#f97316"; // orange
    case "moderate": return "#eab308"; // yellow
    case "good": return "#22c55e"; // green
    default: return "#3b82f6";
  }
};

interface HotspotMarkerProps {
  hotspot: Hotspot;
  onSelect?: (hotspot: Hotspot) => void;
}

export function HotspotMarker({ hotspot, onSelect }: HotspotMarkerProps) {
  const color = getRiskColor(hotspot.risk_level);

  return (
    <LayerGroup>
      <Circle 
        center={[hotspot.lat, hotspot.lng]} 
        radius={hotspot.radius}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          weight: 1
        }}
      />
      <Marker 
        position={[hotspot.lat, hotspot.lng]}
        icon={customIcon}
        eventHandlers={{
          click: () => onSelect && onSelect(hotspot),
        }}
      />
    </LayerGroup>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOTSPOTS_MOCK, Hotspot } from "@/lib/mockData";
import { MapLegend } from "./MapLegend";
import { MapControls, FilterType } from "./MapControls";
import { HotspotMarker } from "./HotspotMarker";
import { CustomZoom } from "./CustomZoom";
import { PlaceSearch } from "./PlaceSearch";

// Default Leaflet Icon for the searched place marker
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle imperative map operations
function MapEffects({ targetCoords }: { targetCoords: { lat: number, lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo([targetCoords.lat, targetCoords.lng], 13, { duration: 1.5 });
    }
  }, [targetCoords, map]);
  return null;
}

interface SearchedPlace {
  lat: number;
  lng: number;
  name: string;
}

interface PollutionMapProps {
  selectedHotspot?: Hotspot | null;
  onHotspotSelect?: (hotspot: Hotspot | null) => void;
  className?: string;
  previewMode?: boolean;
}

export default function PollutionMap({ selectedHotspot, onHotspotSelect, className = "w-full h-full", previewMode = false }: PollutionMapProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchedPlace, setSearchedPlace] = useState<SearchedPlace | null>(null);

  // Base hotspots (filtered only by category)
  const categoryHotspots = useMemo(() => {
    if (activeFilter === "All") return HOTSPOTS_MOCK;
    return HOTSPOTS_MOCK.filter((h) => h.category === activeFilter);
  }, [activeFilter]);

  const handleSelect = (hotspot: Hotspot) => {
    if (onHotspotSelect && !previewMode) {
      onHotspotSelect(hotspot);
    }
  };

  const handlePlaceSelect = (lat: number, lng: number, name: string) => {
    setSearchedPlace({ lat, lng, name });
    if (onHotspotSelect) {
      onHotspotSelect(null); // Clear selected hotspot when searching a new place
    }
  };

  // Determine where the map should fly to
  const flyTarget = searchedPlace 
    ? { lat: searchedPlace.lat, lng: searchedPlace.lng } 
    : selectedHotspot 
      ? { lat: selectedHotspot.lat, lng: selectedHotspot.lng } 
      : null;

  return (
    <div className={`relative ${className}`}>
      <MapContainer 
        center={[28.5355, 77.2090]} // Centered around New Delhi region
        zoom={previewMode ? 10 : 11} 
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        zoomControl={false}
        dragging={!previewMode}
        scrollWheelZoom={!previewMode}
        doubleClickZoom={!previewMode}
        touchZoom={!previewMode}
      >
        <MapEffects targetCoords={flyTarget} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {categoryHotspots.map((hotspot) => (
          <HotspotMarker 
            key={hotspot.id} 
            hotspot={hotspot} 
            onSelect={handleSelect} 
          />
        ))}

        {/* Temporary Marker for Searched Place */}
        {searchedPlace && (
          <Marker position={[searchedPlace.lat, searchedPlace.lng]} icon={defaultIcon}>
            <Popup className="font-semibold text-sm rounded-xl">
              {searchedPlace.name}
            </Popup>
          </Marker>
        )}
        
        {/* Custom Zoom Controls */}
        {!previewMode && <CustomZoom />}
      </MapContainer>
      
      {/* Absolute Overlays */}
      {!previewMode && (
        <>
          <PlaceSearch 
            onPlaceSelect={handlePlaceSelect}
            onClear={() => setSearchedPlace(null)}
          />
          <MapControls activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <MapLegend />
        </>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
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

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
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
  pickingMode?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  pickedLocation?: { lat: number, lng: number } | null;
}

import { CurrentLocationButton } from "./CurrentLocationButton";
import { LocationState } from "@/hooks/useCurrentLocation";

export default function PollutionMap({ 
  selectedHotspot, 
  onHotspotSelect, 
  className = "w-full h-full", 
  previewMode = false,
  pickingMode = false,
  onMapClick,
  pickedLocation
}: PollutionMapProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchedPlace, setSearchedPlace] = useState<SearchedPlace | null>(null);
  const [userLocation, setUserLocation] = useState<LocationState | null>(null);

  // User location marker icon
  const userIcon = useMemo(() => new L.Icon({
    iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="%233b82f6"><circle cx="12" cy="12" r="8" stroke="%23ffffff" stroke-width="3"/></svg>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  }), []);

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
    setUserLocation(null); // Clear user location when searching a place
    if (onHotspotSelect) {
      onHotspotSelect(null); // Clear selected hotspot when searching a new place
    }
    if (pickingMode && onMapClick) {
      onMapClick(lat, lng);
    }
  };

  const handleUserLocation = (loc: LocationState) => {
    setUserLocation(loc);
    setSearchedPlace(null);
    if (pickingMode && onMapClick) {
      onMapClick(loc.lat, loc.lng);
    }
  };

  // Determine where the map should fly to
  const flyTarget = userLocation
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : searchedPlace 
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

        {/* Map Click Handler for picking mode */}
        {pickingMode && <MapClickHandler onMapClick={onMapClick} />}

        {/* Temporary Marker for Searched Place */}
        {searchedPlace && (
          <Marker position={[searchedPlace.lat, searchedPlace.lng]} icon={defaultIcon}>
            <Popup className="font-semibold text-sm rounded-xl">
              {searchedPlace.name}
            </Popup>
          </Marker>
        )}

        {/* Marker for Picked Location */}
        {pickedLocation && (
          <Marker position={[pickedLocation.lat, pickedLocation.lng]} icon={defaultIcon}>
            <Popup className="font-semibold text-sm rounded-xl">Selected Location</Popup>
          </Marker>
        )}
        
        {/* Marker for User Location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="font-semibold text-sm rounded-xl">
              <div>
                <p className="font-bold text-emerald-700">You are here</p>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
                <p className="text-xs text-slate-500">
                  Accuracy: ±{Math.round(userLocation.accuracy)} m
                </p>
              </div>
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
          {!pickingMode && (
            <>
              <MapControls activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              <MapLegend />
            </>
          )}
          <CurrentLocationButton onLocationFound={handleUserLocation} />
        </>
      )}
    </div>
  );
}

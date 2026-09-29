"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Camera, MapPin, Brain, AlertTriangle, ChevronRight, Loader2, Map as MapIcon, X } from "lucide-react";
import { submitPollutionReport } from "@/lib/api";

import { useCurrentLocation } from "@/hooks/useCurrentLocation";

const PollutionMap = dynamic(() => import("@/components/map/PollutionMap"), { ssr: false });

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    lat: null as number | null,
    lng: null as number | null,
    type: "Smoke",
    pm25: "",
    pm10: "",
    co2: ""
  });

  const { location, loading: isGettingLocation, error: locationError, getCurrentLocation } = useCurrentLocation();

  const handleGetLocation = () => {
    getCurrentLocation(async (loc) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`);
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const cleanParts = [
            addr.road || addr.pedestrian || addr.building,
            addr.suburb || addr.neighbourhood || addr.village,
            addr.city || addr.town || addr.county
          ].filter(Boolean);
          
          const cleanAddress = cleanParts.length > 0 ? cleanParts.join(", ") : data.display_name;
          setFormData(prev => ({ ...prev, location: cleanAddress, lat: loc.lat, lng: loc.lng }));
        } else {
          setFormData(prev => ({ ...prev, location: `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`, lat: loc.lat, lng: loc.lng }));
        }
      } catch (error) {
        setFormData(prev => ({ ...prev, location: `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`, lat: loc.lat, lng: loc.lng }));
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitPollutionReport(formData);
      if (res.success) {
        setResult(res.aiAnalysis);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Report Pollution</h1>
          <p className="text-slate-600">Submit an environmental observation for AI analysis.</p>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Photo Evidence <span className="text-red-500">*</span></label>
                
                {photoPreview ? (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200">
                    <img src={photoPreview} alt="Preview" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/10" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-slate-700 hover:text-red-600 hover:bg-white shadow-sm transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg font-medium max-w-[80%] truncate">
                      {photo?.name}
                    </div>
                  </div>
                ) : (
                  <label className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-10 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-slate-300 group-hover:text-emerald-500 transition-colors" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                        <span className="relative cursor-pointer rounded-md bg-transparent font-semibold text-emerald-600 focus-within:outline-none hover:text-emerald-500">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPhotoPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-900">Location <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setShowMapModal(true)}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      >
                        <MapIcon className="w-3 h-3" />
                        Choose on Map
                      </button>
                      <button 
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        className="text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50
                          text-emerald-600 hover:text-emerald-700"
                      >
                        {isGettingLocation ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Getting location...
                          </>
                        ) : location ? (
                          <>
                            <span className="text-emerald-600">✓ Location detected</span>
                          </>
                        ) : locationError ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-red-500 hover:text-red-600">Try again</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3 h-3" />
                            Use current location
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="relative rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 transition-all shadow-sm">
                    <div className="flex items-center px-3 pt-3 pb-2">
                      <MapPin className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                      <input
                        required
                        type="text"
                        placeholder="Enter address or coordinates"
                        className="w-full border-0 p-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm font-medium bg-transparent"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value, lat: null, lng: null})}
                      />
                    </div>
                    {(formData.lat !== null && formData.lng !== null) && (
                      <div className="bg-slate-50 px-10 py-2 border-t border-slate-100 flex gap-6">
                        <span className="text-xs font-mono text-slate-600">
                          Lat: {formData.lat.toFixed(4)}
                        </span>
                        <span className="text-xs font-mono text-slate-600">
                          Long: {formData.lng.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Status Messages */}
                  {locationError && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                      {locationError}
                    </p>
                  )}
                </div>

                {/* Pollution Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Pollution Type <span className="text-red-500">*</span></label>
                  <select
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-white"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Smoke">Smoke</option>
                    <option value="Fire">Fire</option>
                    <option value="Industrial">Industrial Emissions</option>
                    <option value="Traffic">Traffic Exhaust</option>
                    <option value="Dust">Dust / Construction</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                  placeholder="Provide any additional context..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Optional Readings */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-4">Optional Sensor Readings</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">PM2.5 (µg/m³)</label>
                    <input
                      type="number"
                      className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
                      value={formData.pm25}
                      onChange={(e) => setFormData({...formData, pm25: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">PM10 (µg/m³)</label>
                    <input
                      type="number"
                      className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
                      value={formData.pm10}
                      onChange={(e) => setFormData({...formData, pm10: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">CO2 (ppm)</label>
                    <input
                      type="number"
                      className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
                      value={formData.co2}
                      onChange={(e) => setFormData({...formData, co2: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex items-center justify-end border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Brain className="h-5 w-5" /> Analyze Report</>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Brain className="h-6 w-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold">AI Analysis Complete</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-white">{result.confidence}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Severity</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                    {result.severity}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm font-semibold text-white">{result.category}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Est. Source</p>
                  <p className="text-sm font-semibold text-white">{result.estimated_source}</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Recommended Action</h4>
                  <p className="text-sm mt-1">{result.recommended_action}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" /> {result.location} • {new Date(result.timestamp).toLocaleString()}
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button onClick={() => setResult(null)} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Submit Another
                </button>
                <a href="/map" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2">
                  View on Map <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Picker Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">Choose Location</h3>
                <p className="text-xs text-slate-500">Click anywhere on the map to place a pin</p>
              </div>
              <button 
                onClick={() => setShowMapModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 relative bg-slate-100">
              <PollutionMap 
                pickingMode={true} 
                onMapClick={(lat, lng) => setPickedLocation({ lat, lng })}
                pickedLocation={pickedLocation}
              />
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <div className="text-sm font-medium text-slate-600">
                {pickedLocation ? `${pickedLocation.lat.toFixed(6)}, ${pickedLocation.lng.toFixed(6)}` : "No location selected"}
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={!pickedLocation}
                  onClick={async () => {
                    if (pickedLocation) {
                      setIsGettingAddress(true);
                      setShowMapModal(false);
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pickedLocation.lat}&lon=${pickedLocation.lng}`);
                        if (res.ok) {
                          const data = await res.json();
                          const addr = data.address || {};
                          const cleanParts = [
                            addr.road || addr.pedestrian || addr.building,
                            addr.suburb || addr.neighbourhood || addr.village,
                            addr.city || addr.town || addr.county
                          ].filter(Boolean);
                          const cleanAddress = cleanParts.length > 0 ? cleanParts.join(", ") : data.display_name;
                          setFormData(prev => ({ ...prev, location: cleanAddress, lat: pickedLocation.lat, lng: pickedLocation.lng }));
                        } else {
                          setFormData(prev => ({ ...prev, location: `${pickedLocation.lat.toFixed(6)}, ${pickedLocation.lng.toFixed(6)}`, lat: pickedLocation.lat, lng: pickedLocation.lng }));
                        }
                      } catch (error) {
                        setFormData(prev => ({ ...prev, location: `${pickedLocation.lat.toFixed(6)}, ${pickedLocation.lng.toFixed(6)}`, lat: pickedLocation.lat, lng: pickedLocation.lng }));
                      }
                      setIsGettingAddress(false);
                    }
                  }}
                  className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

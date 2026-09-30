"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Camera, MapPin, Brain, AlertTriangle, ChevronRight, Loader2, Map as MapIcon, X } from "lucide-react";
import { submitReport, getRegions, Region, CitizenReport } from "@/lib/api";

import { useCurrentLocation } from "@/hooks/useCurrentLocation";

const PollutionMap = dynamic(() => import("@/components/map/PollutionMap"), { ssr: false });

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function getClosestRegion(lat: number, lng: number, regions: Region[]) {
  if (regions.length === 0) return "";
  let closest = regions[0];
  let minDistance = getDistance(lat, lng, closest.center_lat, closest.center_lng);
  
  for (let i = 1; i < regions.length; i++) {
    const d = getDistance(lat, lng, regions[i].center_lat, regions[i].center_lng);
    if (d < minDistance) {
      minDistance = d;
      closest = regions[i];
    }
  }
  return closest.id;
}

import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

export default function ReportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/report');
    }
  }, [user, authLoading, router]);

  const [regions, setRegions] = useState<Region[]>([]);
  const [isRegionsLoading, setIsRegionsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CitizenReport | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    description: "",
    location: "", // Just for UI address
    lat: null as number | null,
    lng: null as number | null,
    pm25: "",
  });

  const { location, loading: isGettingLocation, error: locationError, getCurrentLocation } = useCurrentLocation();

  useEffect(() => {
    async function loadRegions() {
      setIsRegionsLoading(true);
      try {
        const data = await getRegions();
        setRegions(data);
      } catch (error) {
        console.error("Failed to load regions", error);
        setErrorMsg("Unable to load location data. Please try again.");
      } finally {
        setIsRegionsLoading(false);
      }
    }
    loadRegions();
  }, []);

  const handleGetLocation = () => {
    setErrorMsg(null);
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
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!photo) {
      setErrorMsg("Please upload a photo for evidence.");
      return;
    }

    if (formData.lat === null || formData.lng === null) {
      setErrorMsg("Please select a location before submitting.");
      return;
    }
    
    if (isRegionsLoading) {
      setErrorMsg("Regions are still loading. Please wait.");
      return;
    }

    if (regions.length === 0) {
      setErrorMsg("Unable to determine the reporting region. Please select a location again.");
      return;
    }

    const selectedRegionId = getClosestRegion(formData.lat, formData.lng, regions);
    if (!selectedRegionId) {
      setErrorMsg("Unable to determine the reporting region. Please select a location again.");
      return;
    }
    
    

    setIsSubmitting(true);
    let photoUrl = null;

    if (photo) {
      try {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `reports/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('report-photos')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false,
            contentType: photo.type
          });

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          setErrorMsg("Photo upload failed. Please try again.");
          setIsSubmitting(false);
          return;
        }

        const { data } = supabase.storage
          .from('report-photos')
          .getPublicUrl(filePath);

        photoUrl = data.publicUrl;
      } catch (error) {
        console.error("Error uploading photo:", error);
        setErrorMsg("Photo upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await submitReport({
        region_id: selectedRegionId,
        lat: formData.lat,
        lng: formData.lng,
        photo_url: photoUrl || undefined,
        description: formData.description,
        reported_pm25: formData.pm25 ? parseFloat(formData.pm25) : undefined,
        user_id: user?.id || null
      });

      setResult(response);
      setSuccessMsg("Report submitted successfully!");
      setPhoto(null);
      setPhotoPreview(null);
      setFormData(prev => ({
        ...prev,
        description: "",
        pm25: "",
      }));
    } catch (error: any) {
      console.error("FastAPI submission error:", error);
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        setErrorMsg("Unable to connect to the server. Please try again.");
      } else {
        setErrorMsg("Unable to submit report. Please try again.");
      }
    }
    setIsSubmitting(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Citizen Report</h1>
          <p className="text-slate-600 mt-2 font-medium">Submit an environmental observation for AI analysis.</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-8">
        {!result ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Form Error Message */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  {errorMsg}
                </div>
              )}
              
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
                  <label 
                    className={`mt-2 flex justify-center rounded-xl border border-dashed px-6 py-10 transition-colors cursor-pointer group ${isDragging ? 'bg-emerald-50 border-emerald-500' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        setPhoto(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPhotoPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  >
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
                      className="text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 text-emerald-600 hover:text-emerald-700"
                    >
                      {isGettingLocation ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Getting location...</>
                      ) : location ? (
                        <span className="text-emerald-600">âœ“ Location detected</span>
                      ) : locationError ? (
                        <><AlertTriangle className="w-3 h-3 text-red-500" /> <span className="text-red-500 hover:text-red-600">Try again</span></>
                      ) : (
                        <><MapPin className="w-3 h-3" /> Use current location</>
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 transition-all shadow-sm">
                  <div className="flex items-center px-3 pt-3 pb-2">
                    <MapPin className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Enter address or coordinates"
                      className="w-full border-0 p-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-transparent focus:outline-none outline-none sm:text-sm font-medium bg-transparent"
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

              {/* Device metrics */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Device Metrics <span className="text-slate-400 font-normal">(Optional)</span></label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm font-semibold text-slate-400">PM2.5</span>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      className="block w-full rounded-lg border-0 py-3 pl-14 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                      value={formData.pm25}
                      onChange={(e) => setFormData({...formData, pm25: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 rounded-xl bg-slate-900 px-3 py-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                  {isSubmitting ? "AI is analyzing..." : "Submit for AI Analysis"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 p-8 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400"></div>
              <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-full mb-4">
                <Brain className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">AI Analysis Complete</h2>
              <p className="text-slate-400 mt-2 font-medium">Your report has been successfully processed and categorized.</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Category</p>
                  <p className="text-lg font-semibold text-slate-900">{result.ai_category || "Uncategorized"}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Severity</p>
                  <p className={`text-lg font-bold capitalize ${
                    result.severity?.toLowerCase() === 'severe' ? 'text-red-600' :
                    result.severity?.toLowerCase() === 'high' ? 'text-orange-600' :
                    result.severity?.toLowerCase() === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{result.severity || "Pending"}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Score / Confidence</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-slate-900 leading-none">{result.ai_score || 0}</p>
                    <p className="text-sm font-semibold text-slate-500 mb-0.5">%</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{result.status}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Submit Another
                </button>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1 bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors"
                >
                  View Dashboard <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Map Picker Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Choose Location</h3>
                <p className="text-xs text-slate-500 font-medium">Click anywhere on the map to place a pin.</p>
              </div>
              <button 
                onClick={() => setShowMapModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
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
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="text-sm font-mono text-slate-500">
                {pickedLocation ? `${pickedLocation.lat.toFixed(6)}, ${pickedLocation.lng.toFixed(6)}` : "No location selected"}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!pickedLocation || isGettingAddress}
                  onClick={async () => {
                    if (pickedLocation) {
                      setIsGettingAddress(true);
                      setErrorMsg(null);
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
                      setShowMapModal(false);
                    }
                  }}
                  className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isGettingAddress && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


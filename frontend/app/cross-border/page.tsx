"use client";

import { useEffect, useState } from "react";
import { Globe, ArrowRight, ShieldCheck, Activity, MapPin, Radio, Network, Send } from "lucide-react";
import { getRegions, getCombinedFederatedRisk, shareFederatedPrediction, Region, CombinedFederatedRisk } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function CrossBorderPage() {
  const { isAdmin } = useAuth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [viewRegionId, setViewRegionId] = useState<string>("");
  const [combinedRisk, setCombinedRisk] = useState<CombinedFederatedRisk | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [sourceRegionId, setSourceRegionId] = useState("");
  const [targetRegionId, setTargetRegionId] = useState("");
  const [zone, setZone] = useState("Industrial Plume");
  const [plumeVector, setPlumeVector] = useState(45);
  const [driftKm, setDriftKm] = useState(150);
  const [severityIndex, setSeverityIndex] = useState(8);
  const [confidence, setConfidence] = useState(85);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    async function loadRegions() {
      try {
        const data = await getRegions();
        setRegions(data);
        if (data.length > 0) {
          setViewRegionId(data[0].id);
          setSourceRegionId(data[0].id);
          if (data.length > 1) {
            setTargetRegionId(data[1].id);
          } else {
            setTargetRegionId(data[0].id);
          }
        }
      } catch (err) {
        toast.error("Failed to load regions");
      } finally {
        setIsLoading(false);
      }
    }
    loadRegions();
  }, []);

  const loadCombinedRisk = async (rId: string) => {
    if (!rId) return;
    try {
      const data = await getCombinedFederatedRisk(rId);
      setCombinedRisk(data);
    } catch (error) {
      toast.error("Failed to load combined risk");
    }
  };

  useEffect(() => {
    if (viewRegionId) {
      loadCombinedRisk(viewRegionId);
    }
  }, [viewRegionId]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceRegionId || !targetRegionId) return toast.error("Select both source and target regions");
    setIsSharing(true);
    try {
      await shareFederatedPrediction({
        source_region_id: sourceRegionId,
        target_region_id: targetRegionId,
        risk_summary_json: {
          zone,
          plume_vector_degrees: Number(plumeVector),
          projected_drift_km: Number(driftKm),
          severity_index: Number(severityIndex),
          confidence: Number(confidence)
        }
      });
      toast.success("Federated prediction shared successfully");
      if (viewRegionId === targetRegionId || viewRegionId === sourceRegionId) {
        loadCombinedRisk(viewRegionId);
      }
    } catch (err) {
      toast.error("Failed to share prediction");
    } finally {
      setIsSharing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-emerald-700">
          <Activity className="h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Syncing federated nodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-2">
            <Globe className="h-4 w-4" /> Global Network
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Federated Climate Intelligence
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Climate boundaries don't exist. Our federated learning network allows regions to share high-level predictive signals and early warnings securely, without exchanging raw citizen data.
          </p>
        </div>

        {/* Share Prediction Form - ADMIN ONLY */}
        {isAdmin && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" /> Share Predictive Signal
            </h2>
            <form onSubmit={handleShare} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Source Region</label>
                <select required className="w-full rounded-lg border-slate-300 p-2.5 text-sm" value={sourceRegionId} onChange={e => setSourceRegionId(e.target.value)}>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Target Region</label>
                <select required className="w-full rounded-lg border-slate-300 p-2.5 text-sm" value={targetRegionId} onChange={e => setTargetRegionId(e.target.value)}>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Risk Zone / Type</label>
                <input required type="text" className="w-full rounded-lg border-slate-300 p-2.5 text-sm" value={zone} onChange={e => setZone(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Plume Vector (Degrees)</label>
                <input required type="number" className="w-full rounded-lg border-slate-300 p-2.5 text-sm" value={plumeVector} onChange={e => setPlumeVector(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Projected Drift (km)</label>
                <input required type="number" className="w-full rounded-lg border-slate-300 p-2.5 text-sm" value={driftKm} onChange={e => setDriftKm(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Severity Index (1-10)</label>
                <input required type="number" min="1" max="10" className="w-full rounded-lg border-slate-300 p-2.5 text-sm" value={severityIndex} onChange={e => setSeverityIndex(Number(e.target.value))} />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button disabled={isSharing} type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                  {isSharing ? <Activity className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Broadcast Signal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View Combined Risk */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <Radio className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">Combined Regional Risk</h2>
            </div>
            <select 
              value={viewRegionId} 
              onChange={e => setViewRegionId(e.target.value)}
              className="rounded-lg border-slate-300 p-2 text-sm font-medium shadow-sm bg-white"
            >
              <option value="">Select Region to View</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {combinedRisk ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Local Hotspots</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{combinedRisk.local_hotspots_count}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Inbound Signals</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{combinedRisk.inbound_cross_border_signals.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Transboundary Risk</p>
                  <p className={`text-xl font-black mt-2 capitalize ${
                    combinedRisk.transboundary_risk === 'high' ? 'text-red-600' : 
                    combinedRisk.transboundary_risk === 'moderate' ? 'text-orange-600' : 'text-green-600'
                  }`}>{combinedRisk.transboundary_risk}</p>
                </div>
              </div>

              {combinedRisk.inbound_cross_border_signals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {combinedRisk.inbound_cross_border_signals.map((signal: any, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-full h-1 ${
                        signal.risk_summary_json.severity_index > 7 ? 'bg-red-500' :
                        signal.risk_summary_json.severity_index > 4 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}></div>
                      
                      <div className="flex justify-between items-center mb-4 mt-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                          signal.risk_summary_json.severity_index > 7 ? 'bg-red-50 text-red-700 border-red-200' :
                          signal.risk_summary_json.severity_index > 4 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          Severity: {signal.risk_summary_json.severity_index}/10
                        </span>
                        <span className="text-xs text-slate-400">Shared: {new Date(signal.shared_at).toLocaleTimeString()}</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Source:</span>
                          <span className="font-semibold text-slate-900">{regions.find(r => r.id === signal.source_region_id)?.name || signal.source_region_id}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Risk Zone:</span>
                          <span className="font-semibold text-slate-900">{signal.risk_summary_json.zone}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Plume Direction:</span>
                          <span className="font-semibold text-slate-900">{signal.risk_summary_json.plume_vector_degrees}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No active inbound cross-border signals detected for this region.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">Select a region to view its federated risk profile.</div>
          )}
        </div>

      </div>
    </div>
  );
}

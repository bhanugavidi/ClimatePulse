"use client";

import { useEffect, useState } from "react";
import { Globe, ArrowRight, ShieldCheck, Activity, MapPin, Radio, Network } from "lucide-react";
import { getCrossBorderSignals } from "@/lib/api";
import { CrossBorderSignal } from "@/lib/mockData";

export default function CrossBorderPage() {
  const [signals, setSignals] = useState<CrossBorderSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getCrossBorderSignals();
      setSignals(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

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

        {/* Visual Flow Diagram */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-12">How Signals Propagate</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            {/* Region A */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4">
              <div className="h-16 w-16 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900">Region A</h4>
              <p className="text-xs text-slate-500 mt-2">Detects local anomaly</p>
            </div>

            {/* Arrow 1 */}
            <div className="flex flex-col items-center text-emerald-600 hidden md:flex">
              <span className="text-[10px] font-bold uppercase tracking-widest mb-2">Extract Pattern</span>
              <ArrowRight className="h-6 w-6" />
            </div>
            <ArrowRight className="h-6 w-6 text-slate-300 md:hidden rotate-90" />

            {/* Federated Layer */}
            <div className="flex flex-col items-center text-center w-full md:w-1/3">
              <div className="h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 relative shadow-xl">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl animate-pulse"></div>
                <Network className="h-10 w-10 text-emerald-400" />
              </div>
              <h4 className="font-bold text-slate-900">Federated Intelligence</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-[200px]">Aggregates privacy-preserving signal</p>
            </div>

            {/* Arrow 2 */}
            <div className="flex flex-col items-center text-orange-600 hidden md:flex">
              <span className="text-[10px] font-bold uppercase tracking-widest mb-2">Early Warning</span>
              <ArrowRight className="h-6 w-6" />
            </div>
            <ArrowRight className="h-6 w-6 text-slate-300 md:hidden rotate-90" />

            {/* Region B */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4">
              <div className="h-16 w-16 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="h-7 w-7 text-orange-600" />
              </div>
              <h4 className="font-bold text-slate-900">Region B</h4>
              <p className="text-xs text-slate-500 mt-2">Receives preemptive alert</p>
            </div>
          </div>
        </div>

        {/* Live Signals Feed */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <Radio className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Active Cross-Border Signals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signals.map((signal) => (
              <div key={signal.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  signal.risk_level === 'high' ? 'bg-red-500' :
                  signal.risk_level === 'moderate' ? 'bg-orange-500' : 'bg-yellow-500'
                }`}></div>
                
                <div className="flex items-center justify-between mb-4 mt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                    signal.risk_level === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                    signal.risk_level === 'moderate' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {signal.risk_level} Risk
                  </span>
                  <span className="text-xs text-slate-400">{new Date(signal.last_updated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Source:</span>
                    <span className="font-semibold text-slate-900">{signal.source_region}</span>
                  </div>
                  
                  <div className="relative py-2">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                    <ArrowRight className="h-4 w-4 text-slate-300 absolute left-[10px] top-1/2 -translate-y-1/2 rotate-90" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Target:</span>
                    <span className="font-semibold text-slate-900">{signal.target_region}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Signal Type</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{signal.signal_type.replace('_', ' ')}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Forecasted Impact</span>
                    <span className="text-sm font-bold text-red-600">+{signal.aqi_impact} AQI</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

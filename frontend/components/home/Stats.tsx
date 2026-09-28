import { FileText, Flame, Activity, Globe } from "lucide-react";

export function Stats() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4">
          <div className="bg-white px-6 py-8 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">128</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Citizen Reports</p>
          </div>
          <div className="bg-white px-6 py-8 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">24</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Active Hotspots</p>
          </div>
          <div className="bg-white px-6 py-8 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">8</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Cities Monitored</p>
          </div>
          <div className="bg-white px-6 py-8 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">94%</p>
            <p className="mt-1 text-sm font-medium text-slate-500">AI Detection Confidence</p>
          </div>
        </div>
      </div>
    </section>
  );
}

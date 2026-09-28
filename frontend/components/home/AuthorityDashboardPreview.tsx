import { AlertTriangle, TrendingDown, Clock } from "lucide-react";

export function AuthorityDashboardPreview() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for decision makers
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            A unified dashboard providing authorities with a clear view of critical alerts, forecasts, and citizen reports to act quickly.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl sm:p-8 p-4">
            <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">City Overview</h3>
                <p className="text-sm text-slate-500">Real-time environmental metrics</p>
              </div>
              <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-100 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                2 Critical Alerts
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-6">
                <p className="text-sm font-medium text-slate-500">Current AQI</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">142</span>
                  <span className="text-sm font-semibold text-orange-600">Poor</span>
                </div>
              </div>
              
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-6">
                <p className="text-sm font-medium text-slate-500">Active Hotspots</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">8</span>
                  <span className="text-sm text-slate-500">detected today</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-6">
                <p className="text-sm font-medium text-slate-500">Forecast Trend</p>
                <div className="mt-2 flex items-center gap-2 text-emerald-600">
                  <TrendingDown className="h-8 w-8" />
                  <div>
                    <span className="block text-lg font-bold">Improving</span>
                    <span className="block text-xs">next 24h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-medium text-slate-900 mb-4">Recent Citizen Reports</h4>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded bg-slate-200"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Industrial Smoke Reported</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {i * 15} mins ago
                        </p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Review &rarr;</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

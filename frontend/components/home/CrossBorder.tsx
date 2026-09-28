import Link from "next/link";
import { Network } from "lucide-react";

export function CrossBorder() {
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Pollution doesn't stop at borders.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              ClimatePulse enables participating countries to share model signals and pollution intelligence without exposing raw citizen data. A federated approach to a healthier planet.
            </p>
            <div className="mt-10">
              <Link
                href="/cross-border"
                className="inline-flex items-center gap-2 font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                Explore Cross-Border Intelligence <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-video w-full rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <div className="flex h-full flex-col items-center justify-center">
                <Network className="mb-8 h-12 w-12 text-slate-300" />
                
                <div className="flex w-full max-w-md flex-col gap-6">
                  <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">IN</div>
                      <span className="font-medium text-slate-700">India Node</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Signal Shared</span>
                  </div>
                  
                  <div className="flex justify-center -my-3 z-10">
                    <div className="w-0.5 h-6 bg-slate-300"></div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">ZA</div>
                      <span className="font-medium text-slate-700">South Africa Node</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">Receiving</span>
                  </div>

                  <div className="flex justify-center -my-3 z-10">
                    <div className="w-0.5 h-6 bg-slate-300"></div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-xs">BR</div>
                      <span className="font-medium text-slate-700">Brazil Node</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">Receiving</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

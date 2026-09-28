"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Plus, Minus, Crosshair, Flame, Factory, Wind } from "lucide-react";

const PreviewMap = dynamic(() => import("@/components/map/PollutionMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl" />
});

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-16 md:pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col lg:max-w-none lg:flex-row lg:items-center lg:gap-16">
          
          {/* Left Column */}
          <div className="lg:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Real-time Climate Intelligence
            </p>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Smarter data. <br />
              <span className="text-emerald-600">Cleaner cities.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              ClimatePulse combines citizen reports, AI analysis, weather and
              environmental data to detect and respond to localized pollution
              events in real time.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/map"
                className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-emerald-800"
              >
                Explore Live Map &rarr;
              </Link>
              <Link
                href="/report"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
              >
                Report Pollution
              </Link>
            </div>
            <p className="mt-6 text-sm font-medium text-slate-500">
              Citizen-powered &bull; AI-assisted &bull; Federated
            </p>
          </div>

          {/* Right Column - Map Prototype */}
          <div className="mt-16 lg:mt-0 lg:w-1/2">
            <Link href="/map" className="block relative aspect-[4/3] w-full rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-xl sm:p-4 group transition-transform hover:scale-[1.02]">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#e5f0e6]">
                {/* Overlay on hover */}
                <div className="absolute inset-0 z-[1000] bg-slate-900/0 flex items-center justify-center opacity-0 group-hover:bg-slate-900/10 group-hover:opacity-100 transition-all duration-300">
                  <span className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Open Live Map &rarr;
                  </span>
                </div>

                {/* Actual Real Map Instance in Preview Mode */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <PreviewMap previewMode={true} />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

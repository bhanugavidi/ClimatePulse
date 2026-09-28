import Link from "next/link";

export function VisionCTA() {
  return (
    <section className="bg-emerald-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Build cleaner cities with better intelligence.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-emerald-100">
            From a single citizen report to a city-wide pollution alert, ClimatePulse turns scattered environmental signals into actionable insight.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Platform
            </Link>
            <Link
              href="/report"
              className="text-sm font-semibold leading-6 text-white hover:text-emerald-100 transition-colors"
            >
              Report Pollution <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

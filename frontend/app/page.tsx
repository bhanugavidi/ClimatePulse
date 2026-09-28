export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-green-400">
          Climate Intelligence Platform
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          See pollution before it becomes a crisis.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          ClimatePulse combines citizen reports, AI, weather and air-quality
          data to detect pollution hotspots in real time.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-black">
            Report Pollution
          </button>

          <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold">
            View Live Map
          </button>
        </div>
      </section>
    </main>
  );
}
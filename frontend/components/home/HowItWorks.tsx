export function HowItWorks() {
  const steps = [
    { id: "01", name: "Citizen reports an event" },
    { id: "02", name: "AI analyzes the report" },
    { id: "03", name: "Hotspots and risk are detected" },
    { id: "04", name: "Authorities receive actionable insights" },
  ];

  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How it works
          </h2>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-8 -bottom-8 w-0.5 bg-slate-200 md:bottom-auto md:left-0 md:top-8 md:h-0.5 md:w-full" aria-hidden="true"></div>
            
            <div className="relative flex flex-col gap-12 md:flex-row md:justify-between md:gap-4">
              {steps.map((step) => (
                <div key={step.id} className="relative flex items-center gap-6 md:flex-col md:items-start md:gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-slate-50 bg-white shadow-sm">
                    <span className="text-lg font-bold text-emerald-700">{step.id}</span>
                  </div>
                  <div className="md:pt-4">
                    <p className="text-lg font-medium text-slate-900 md:max-w-[150px]">{step.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

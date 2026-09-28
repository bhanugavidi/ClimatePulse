import { Camera, BrainCircuit, MapPin, ShieldAlert, ArrowRight } from "lucide-react";

export function Features() {
  const features = [
    {
      name: "Citizen Reporting",
      description: "Report smoke, fires, industrial emissions or other pollution events with a photo and location.",
      icon: Camera,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      name: "AI-Powered Detection",
      description: "Analyze reported images and contextual data to identify potential pollution events and estimate severity.",
      icon: BrainCircuit,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Live Hotspot Mapping",
      description: "Visualize detected and predicted pollution hotspots on an interactive map.",
      icon: MapPin,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      name: "Authority Dashboard",
      description: "Give authorities a clear view of hotspots, alerts, forecasts and reported pollution events.",
      icon: ShieldAlert,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">What We Do</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From local reports to global action
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            ClimatePulse connects citizen observations, AI analysis and environmental data to help identify pollution events and support faster response.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="group relative flex flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                <div className="flex w-full flex-col items-start">
                  <div className={`rounded-xl p-3 ${feature.bg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-8 text-slate-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 flex w-full items-center justify-end opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

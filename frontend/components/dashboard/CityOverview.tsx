import { City } from "@/lib/mockData";

export function CityOverview({ cities }: { cities: City[] }) {
  return (
    <div className="space-y-3">
      {cities.map((city) => (
        <div key={city.name} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors shadow-sm">
          <div>
            <h4 className="font-semibold text-sm text-slate-900">{city.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{city.hotspots} hotspots</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">AQI {city.aqi}</p>
            <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
              city.status === 'High Risk' ? 'text-red-600' :
              city.status === 'Moderate' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {city.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

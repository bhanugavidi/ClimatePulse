export type Hotspot = {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  risk_level: "good" | "moderate" | "poor" | "high" | "severe";
  category: "Air Quality" | "Fires" | "Industrial";
  location: string;
  description: string;
  ai_score: number;
  pm25: number;
  reports_count: number;
  last_updated: string;
};

export type Report = {
  id: string;
  lat: number;
  lng: number;
  photo_url: string;
  description: string;
  ai_score: number;
  ai_category: "smoke" | "haze" | "burning" | "normal";
  severity: "low" | "moderate" | "high" | "severe";
  status: "new" | "reviewed" | "resolved";
  created_at: string;
};

export type Alert = {
  id: string;
  message: string;
  severity: "info" | "warning" | "critical";
  status: "open" | "acknowledged" | "resolved";
  created_at: string;
};

export const HOTSPOTS_MOCK: Hotspot[] = [
  {
    id: "hs-1",
    lat: 28.6139,
    lng: 77.2090,
    radius: 4000,
    risk_level: "severe",
    category: "Industrial",
    location: "New Delhi Industrial Zone",
    description: "High concentration of industrial smoke reported.",
    ai_score: 94,
    pm25: 350,
    reports_count: 12,
    last_updated: new Date().toISOString(),
  },
  {
    id: "hs-2",
    lat: 28.5355,
    lng: 77.3910,
    radius: 3000,
    risk_level: "high",
    category: "Fires",
    location: "Noida Sector 62",
    description: "Agricultural burning detected via citizen reports.",
    ai_score: 88,
    pm25: 220,
    reports_count: 5,
    last_updated: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "hs-3",
    lat: 28.4595,
    lng: 77.0266,
    radius: 2000,
    risk_level: "moderate",
    category: "Air Quality",
    location: "Gurugram Central",
    description: "Construction dust and heavy traffic emissions.",
    ai_score: 65,
    pm25: 140,
    reports_count: 3,
    last_updated: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "hs-4",
    lat: 28.7041,
    lng: 77.1025,
    radius: 2500,
    risk_level: "poor",
    category: "Air Quality",
    location: "Rohini",
    description: "Elevated PM2.5 from local sources.",
    ai_score: 75,
    pm25: 180,
    reports_count: 8,
    last_updated: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "hs-5",
    lat: 28.3800,
    lng: 77.3000,
    radius: 1500,
    risk_level: "good",
    category: "Air Quality",
    location: "Faridabad Edge",
    description: "Clear conditions, normal baseline.",
    ai_score: 20,
    pm25: 45,
    reports_count: 1,
    last_updated: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const REPORTS_MOCK: Report[] = [
  {
    id: "rep-1",
    lat: 28.6139,
    lng: 77.2090,
    photo_url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?q=80&w=600&auto=format&fit=crop",
    description: "Thick black smoke coming from the factory area.",
    ai_score: 92,
    ai_category: "smoke",
    severity: "severe",
    status: "new",
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "rep-2",
    lat: 28.5355,
    lng: 77.3910,
    photo_url: "https://images.unsplash.com/photo-1530968033775-2c92736b131e?q=80&w=600&auto=format&fit=crop",
    description: "Burning fields outside the city limit.",
    ai_score: 85,
    ai_category: "burning",
    severity: "high",
    status: "reviewed",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const ALERTS_MOCK: Alert[] = [
  {
    id: "alt-1",
    message: "Severe pollution spike detected in New Delhi (Industrial Zone). Multiple reports confirmed.",
    severity: "critical",
    status: "open",
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "alt-2",
    message: "Air quality forecasted to degrade in Gurugram within the next 4 hours due to stagnant wind.",
    severity: "warning",
    status: "open",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

export type Forecast = {
  time: string;
  actual_aqi?: number;
  predicted_aqi: number;
};

export const FORECAST_MOCK: Forecast[] = [
  { time: "00:00", actual_aqi: 120, predicted_aqi: 125 },
  { time: "04:00", actual_aqi: 140, predicted_aqi: 145 },
  { time: "08:00", actual_aqi: 180, predicted_aqi: 175 },
  { time: "12:00", actual_aqi: 220, predicted_aqi: 230 },
  { time: "16:00", actual_aqi: 190, predicted_aqi: 195 },
  { time: "20:00", predicted_aqi: 160 },
  { time: "24:00", predicted_aqi: 140 },
  { time: "+6h", predicted_aqi: 130 },
  { time: "+12h", predicted_aqi: 125 },
];

export type City = {
  id: string;
  name: string;
  country: string;
  aqi: number;
  risk_level: "good" | "moderate" | "poor" | "high" | "severe";
  active_hotspots: number;
};

export const CITIES_MOCK: City[] = [
  { id: "c-1", name: "New Delhi", country: "India", aqi: 245, risk_level: "severe", active_hotspots: 14 },
  { id: "c-2", name: "Gurugram", country: "India", aqi: 180, risk_level: "poor", active_hotspots: 5 },
  { id: "c-3", name: "Noida", country: "India", aqi: 195, risk_level: "poor", active_hotspots: 8 },
  { id: "c-4", name: "Faridabad", country: "India", aqi: 140, risk_level: "moderate", active_hotspots: 2 },
];

export type CrossBorderSignal = {
  id: string;
  source_region: string;
  target_region: string;
  signal_type: "smoke_drift" | "dust_storm" | "industrial_plume";
  risk_level: "high" | "moderate" | "low";
  aqi_impact: number;
  last_updated: string;
};

export const CROSS_BORDER_MOCK: CrossBorderSignal[] = [
  {
    id: "cb-1",
    source_region: "Punjab (India)",
    target_region: "Delhi NCR (India)",
    signal_type: "smoke_drift",
    risk_level: "high",
    aqi_impact: +85,
    last_updated: new Date().toISOString(),
  },
  {
    id: "cb-2",
    source_region: "Sindh (Pakistan)",
    target_region: "Gujarat (India)",
    signal_type: "dust_storm",
    risk_level: "moderate",
    aqi_impact: +40,
    last_updated: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "cb-3",
    source_region: "Rajshahi (Bangladesh)",
    target_region: "West Bengal (India)",
    signal_type: "industrial_plume",
    risk_level: "moderate",
    aqi_impact: +30,
    last_updated: new Date(Date.now() - 7200000).toISOString(),
  }
];

export type DashboardStats = {
  current_aqi: number;
  active_hotspots: number;
  critical_alerts: number;
  reports_today: number;
};

export const DASHBOARD_STATS_MOCK: DashboardStats = {
  current_aqi: 215,
  active_hotspots: 24,
  critical_alerts: 3,
  reports_today: 128,
};

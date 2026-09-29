export type Hotspot = {
  id: string;
  lat: number;
  lng: number;
  radius?: number;
  risk_level: "good" | "moderate" | "poor" | "high" | "severe" | "Critical" | "High" | "Medium" | "Low";
  category: "Air Quality" | "Fires" | "Industrial" | "Traffic" | "Smoke" | "Dust" | string;
  location: string;
  description?: string;
  ai_score: number;
  pm25: number;
  reports_count?: number;
  last_updated?: string;
  status?: "Active" | "Investigating" | "Monitoring";
  detectedTime?: string;
  estimatedSource?: string;
  recommendedAction?: string;
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
  message?: string;
  severity: "info" | "warning" | "critical" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status?: "open" | "acknowledged" | "resolved";
  created_at?: string;
  title?: string;
  time?: string;
  description?: string;
  location?: string;
};

export type Forecast = {
  time: string;
  actual_aqi?: number;
  predicted_aqi?: number;
  actual?: number;
  predicted?: number;
};

export type City = {
  id?: string;
  name: string;
  country?: string;
  aqi: number;
  risk_level?: "good" | "moderate" | "poor" | "high" | "severe";
  active_hotspots?: number;
  status?: string;
  hotspots?: number;
};

export type CrossBorderSignal = {
  id: string;
  source_region: string;
  target_region: string;
  signal_type: "smoke_drift" | "dust_storm" | "industrial_plume";
  risk_level: "high" | "moderate" | "low";
  aqi_impact: number;
  last_updated: string;
};

export type DashboardStats = {
  current_aqi?: number;
  active_hotspots?: number;
  critical_alerts?: number;
  reports_today?: number;
  
  currentAqi?: number;
  aqiStatus?: string;
  aqiTrend?: string;
  activeHotspots?: number;
  hotspotsDesc?: string;
  criticalAlerts?: number;
  alertsDesc?: string;
  reportsToday?: number;
  reportsDesc?: string;
};

export type AqiHistory = {
  time: string;
  aqi: number;
};

export type PollutionSource = {
  name: string;
  value: number;
};

export type CitizenReport = {
  id: string;
  time: string;
  location: string;
  type: string;
  aiResult: string;
  status: "Verified" | "Reviewing" | "Rejected";
};

// Original Mocks + My Dashboard Mocks Merged

export let HOTSPOTS_MOCK: Hotspot[] = [
  {
    id: "hs-1",
    location: "Delhi Industrial Area",
    category: "Industrial",
    pm25: 186,
    risk_level: "Critical",
    ai_score: 94,
    status: "Active",
    detectedTime: "2 hours ago",
    estimatedSource: "Industrial emissions",
    recommendedAction: "Inspect the affected area and review nearby pollution reports.",
    lat: 28.6139,
    lng: 77.2090,
    radius: 4000,
    description: "High concentration of industrial smoke reported.",
  },
  {
    id: "hs-2",
    location: "Anand Nagar",
    category: "Traffic",
    pm25: 151,
    risk_level: "High",
    ai_score: 89,
    status: "Active",
    detectedTime: "3 hours ago",
    estimatedSource: "Heavy traffic congestion",
    recommendedAction: "Deploy traffic management units and issue local advisory.",
    lat: 28.6499,
    lng: 77.3000,
    radius: 3000,
  },
  {
    id: "hs-3",
    location: "Yamuna Region",
    category: "Smoke",
    pm25: 164,
    risk_level: "High",
    ai_score: 91,
    status: "Investigating",
    detectedTime: "5 hours ago",
    estimatedSource: "Waste burning or agricultural fire",
    recommendedAction: "Dispatch field team for immediate investigation.",
    lat: 28.5355,
    lng: 77.3910,
    radius: 2000,
  },
  {
    id: "hs-4",
    location: "Airport Road",
    category: "Dust",
    pm25: 118,
    risk_level: "Medium",
    ai_score: 84,
    status: "Monitoring",
    detectedTime: "8 hours ago",
    estimatedSource: "Construction activity and wind",
    recommendedAction: "Continue monitoring. Ensure construction dust control measures are in place.",
    lat: 28.5562,
    lng: 77.1000,
    radius: 2500,
  },
];

export const addMockHotspot = (hotspot: Hotspot) => {
  HOTSPOTS_MOCK = [...HOTSPOTS_MOCK, hotspot];
};

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
    severity: "CRITICAL",
    title: "High pollution detected",
    location: "Industrial Area",
    time: "12 minutes ago",
    description: "Rapid increase in PM2.5 and PM10 levels.",
  },
  {
    id: "alt-2",
    severity: "HIGH",
    title: "Smoke concentration increased",
    location: "Yamuna Region",
    time: "28 minutes ago",
    description: "Visible smoke plumes reported by citizens.",
  },
  {
    id: "alt-3",
    severity: "MEDIUM",
    title: "Traffic-related pollution rising",
    location: "Airport Road",
    time: "42 minutes ago",
    description: "Slow moving traffic causing localized emission spike.",
  },
];

export const FORECAST_MOCK: Forecast[] = [
  { time: "Current", actual: 142, predicted: 142, actual_aqi: 142, predicted_aqi: 142 },
  { time: "+6h", predicted: 148, predicted_aqi: 148 },
  { time: "+12h", predicted: 156, predicted_aqi: 156 },
  { time: "+18h", predicted: 139, predicted_aqi: 139 },
  { time: "+24h", predicted: 121, predicted_aqi: 121 },
];

export const CITIES_MOCK: City[] = [
  { name: "New Delhi", aqi: 142, status: "High Risk", hotspots: 12, risk_level: "severe", active_hotspots: 14 },
  { name: "Mumbai", aqi: 96, status: "Moderate", hotspots: 7, risk_level: "poor", active_hotspots: 5 },
  { name: "Bengaluru", aqi: 78, status: "Moderate", hotspots: 4, risk_level: "poor", active_hotspots: 8 },
  { name: "Hyderabad", aqi: 64, status: "Good", hotspots: 2, risk_level: "moderate", active_hotspots: 2 },
];

export const CROSS_BORDER_MOCK: CrossBorderSignal[] = [
  {
    id: "cb-1",
    source_region: "Punjab (India)",
    target_region: "Delhi NCR (India)",
    signal_type: "smoke_drift",
    risk_level: "high",
    aqi_impact: +85,
    last_updated: new Date().toISOString(),
  }
];

export const DASHBOARD_STATS_MOCK: DashboardStats = {
  currentAqi: 142,
  aqiStatus: "Unhealthy",
  aqiTrend: "↑ 12% vs yesterday",
  activeHotspots: 24,
  hotspotsDesc: "8 high-risk",
  criticalAlerts: 6,
  alertsDesc: "Requires attention",
  reportsToday: 128,
  reportsDesc: "34 verified",
  
  current_aqi: 215,
  active_hotspots: 24,
  critical_alerts: 3,
  reports_today: 128,
};

export const AQI_HISTORY_MOCK: AqiHistory[] = [
  { time: "00:00", aqi: 86 },
  { time: "04:00", aqi: 91 },
  { time: "08:00", aqi: 118 },
  { time: "12:00", aqi: 142 },
  { time: "16:00", aqi: 151 },
  { time: "20:00", aqi: 137 },
  { time: "24:00", aqi: 129 },
];

export const POLLUTION_SOURCES_MOCK: PollutionSource[] = [
  { name: "Industrial", value: 32 },
  { name: "Traffic", value: 27 },
  { name: "Smoke / Fire", value: 21 },
  { name: "Dust", value: 13 },
  { name: "Other", value: 7 },
];

export const CITIZEN_REPORTS_MOCK: CitizenReport[] = [
  {
    id: "cr-1",
    time: "10:42 AM",
    location: "Industrial Area",
    type: "Smoke",
    aiResult: "High severity",
    status: "Verified",
  },
  {
    id: "cr-2",
    time: "10:18 AM",
    location: "Airport Road",
    type: "Dust",
    aiResult: "Medium severity",
    status: "Reviewing",
  },
  {
    id: "cr-3",
    time: "09:51 AM",
    location: "Yamuna Region",
    type: "Fire",
    aiResult: "Critical",
    status: "Verified",
  },
];

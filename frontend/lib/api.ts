import { 
  HOTSPOTS_MOCK, REPORTS_MOCK, ALERTS_MOCK, FORECAST_MOCK, CITIES_MOCK, CROSS_BORDER_MOCK, DASHBOARD_STATS_MOCK,
  Hotspot, Report, Alert, Forecast, City, CrossBorderSignal, DashboardStats 
} from "./mockData";

// Simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getHotspots(): Promise<Hotspot[]> {
  await delay(600);
  return HOTSPOTS_MOCK;
}

export async function getReports(): Promise<Report[]> {
  await delay(600);
  return REPORTS_MOCK;
}

export async function getAlerts(): Promise<Alert[]> {
  await delay(600);
  return ALERTS_MOCK;
}

export async function getForecast(): Promise<Forecast[]> {
  await delay(600);
  return FORECAST_MOCK;
}

export async function getCities(): Promise<City[]> {
  await delay(600);
  return CITIES_MOCK;
}

export async function getCrossBorderSignals(): Promise<CrossBorderSignal[]> {
  await delay(600);
  return CROSS_BORDER_MOCK;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(600);
  return DASHBOARD_STATS_MOCK;
}

export async function submitPollutionReport(data: any): Promise<{ success: boolean; aiAnalysis: any }> {
  await delay(1500); // Simulate upload and AI processing
  return {
    success: true,
    aiAnalysis: {
      category: data.type || "Smoke / Haze",
      severity: "High",
      confidence: 91,
      estimated_source: data.type === "Traffic" ? "Vehicle emissions" : "Industrial / Burning",
      recommended_action: "Avoid prolonged outdoor exposure.",
      location: data.location || "User Location",
      timestamp: new Date().toISOString()
    }
  };
}

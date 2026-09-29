import { 
  HOTSPOTS_MOCK, REPORTS_MOCK, ALERTS_MOCK, FORECAST_MOCK, CITIES_MOCK, CROSS_BORDER_MOCK, DASHBOARD_STATS_MOCK,
  Hotspot, Report, Alert, Forecast, City, CrossBorderSignal, DashboardStats, addMockHotspot
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

export interface AIAnalysisResult {
  category: string;
  severity: string;
  confidence: number;
  estimated_source: string;
  recommended_action: string;
  location: string;
  timestamp: string;
}

export async function submitPollutionReport(data: any): Promise<{ success: boolean; aiAnalysis: AIAnalysisResult }> {
  await delay(1500); // Simulate upload and AI processing
  
  const aiAnalysis = {
    category: data.type || "Smoke",
    severity: "High",
    confidence: 91,
    estimated_source: data.type === "Traffic" ? "Vehicle emissions" : "Industrial / Burning",
    recommended_action: "Avoid prolonged outdoor exposure.",
    location: data.location || "User Location",
    timestamp: new Date().toISOString()
  };

  if (data.lat && data.lng) {
    addMockHotspot({
      id: `hs-new-${Date.now()}`,
      location: aiAnalysis.location,
      category: aiAnalysis.category,
      pm25: parseInt(data.pm25) || Math.floor(Math.random() * 100) + 150,
      risk_level: "High",
      ai_score: aiAnalysis.confidence,
      status: "Active",
      detectedTime: "Just now",
      estimatedSource: aiAnalysis.estimated_source,
      recommendedAction: aiAnalysis.recommended_action,
      lat: data.lat,
      lng: data.lng,
      radius: 2000,
      description: data.description || "Reported by user.",
    });
  }

  return {
    success: true,
    aiAnalysis
  };
}

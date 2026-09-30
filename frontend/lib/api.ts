const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- TYPES ---

export type Region = {
  id: string;
  name: string;
  country_code: string;
  center_lat: number;
  center_lng: number;
  created_at: string;
};

export type CitizenReport = {
  id: string;
  region_id: string;
  user_id: string | null;
  lat: number;
  lng: number;
  photo_url: string | null;
  description: string;
  reported_pm25: number | null;
  ai_score: number | null;
  ai_category: string | null;
  severity: string | null;
  status: string;
  created_at: string;
};

export type Hotspot = {
  id: string;
  region_id: string;
  center_lat: number;
  center_lng: number;
  radius_m: number;
  risk_level: string;
  report_count: number;
  last_updated: string;
};

export type ForecastPoint = {
  hour_offset: number;
  predicted_aqi: number;
  confidence: number;
};

export type Weather = {
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  fetched_at: string;
};

export type ForecastResponse = {
  region_id: string;
  region_name: string;
  current_weather: Weather;
  baseline_pm25: number;
  forecast: ForecastPoint[];
};

export type Alert = {
  id: string;
  hotspot_id: string;
  region_id: string;
  message: string;
  severity: string;
  status: string;
  created_at: string;
};

export type FederatedShareRequest = {
  source_region_id: string;
  target_region_id: string;
  risk_summary_json: {
    zone: string;
    plume_vector_degrees: number;
    projected_drift_km: number;
    severity_index: number;
    confidence: number;
  };
};

export type CombinedFederatedRisk = {
  region_id: string;
  local_hotspots_count: number;
  inbound_cross_border_signals: any[];
  transboundary_risk: string;
};

// --- HELPER ---

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error; // Re-throw to handle in UI components (e.g. "Unable to connect")
  }
}

// --- API METHODS ---

export async function getRegions(): Promise<Region[]> {
  return fetchAPI<Region[]>("/api/regions");
}

export async function getReports(params?: { region_id?: string; severity?: string; user_id?: string }): Promise<CitizenReport[]> {
  const searchParams = new URLSearchParams();
  if (params?.region_id) searchParams.append("region_id", params.region_id);
  if (params?.severity) searchParams.append("severity", params.severity);
  if (params?.user_id) searchParams.append("user_id", params.user_id);
  const query = searchParams.toString();
  return fetchAPI<CitizenReport[]>(`/api/reports${query ? `?${query}` : ""}`);
}

export async function submitReport(data: {
  region_id: string;
  lat: number;
  lng: number;
  photo_url?: string;
  description?: string;
  reported_pm25?: number;
  user_id?: string | null;
}): Promise<CitizenReport> {
  return fetchAPI<CitizenReport>("/api/reports", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getHotspots(params?: { region_id?: string; risk_level?: string }): Promise<Hotspot[]> {
  const searchParams = new URLSearchParams();
  if (params?.region_id) searchParams.append("region_id", params.region_id);
  if (params?.risk_level) searchParams.append("risk_level", params.risk_level);
  const query = searchParams.toString();
  return fetchAPI<Hotspot[]>(`/api/hotspots${query ? `?${query}` : ""}`);
}

export async function getForecast(regionId: string): Promise<ForecastResponse> {
  return fetchAPI<ForecastResponse>(`/api/forecast?region_id=${regionId}`);
}

export async function getAlerts(params?: { region_id?: string; status?: string }): Promise<Alert[]> {
  const searchParams = new URLSearchParams();
  if (params?.region_id) searchParams.append("region_id", params.region_id);
  if (params?.status) searchParams.append("status", params.status);
  const query = searchParams.toString();
  return fetchAPI<Alert[]>(`/api/alerts${query ? `?${query}` : ""}`);
}

export async function updateAlertStatus(alertId: string, status: string): Promise<any> {
  return fetchAPI<any>(`/api/alerts/${alertId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function shareFederatedPrediction(data: FederatedShareRequest): Promise<any> {
  return fetchAPI<any>("/api/federated/share", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCombinedFederatedRisk(regionId: string): Promise<CombinedFederatedRisk> {
  return fetchAPI<CombinedFederatedRisk>(`/api/federated/combined?region_id=${regionId}`);
}

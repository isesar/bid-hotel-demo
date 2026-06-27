import type { PropertiesResponse, UnitsResponse } from "@/lib/booking/types";

const API_BASE = "/api/booking";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Booking API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function listProperties() {
  return fetchJson<PropertiesResponse>("/properties");
}

export function listUnits(propertyId: string) {
  return fetchJson<UnitsResponse>(`/properties/${propertyId}/units`);
}

import type {
  CalendarResponse,
  PropertiesResponse,
  UnitsResponse,
} from "@/lib/booking/types";

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

export function getCalendar(propertyId: string, start: string, end: string) {
  const params = new URLSearchParams({ start, end });
  return fetchJson<CalendarResponse>(
    `/properties/${propertyId}/calendar?${params.toString()}`
  );
}

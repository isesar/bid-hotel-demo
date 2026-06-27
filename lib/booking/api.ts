import type {
  AvailabilityResponse,
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

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Booking API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getAvailability(
  propertyId: string,
  checkin: string,
  nights: number
) {
  return postJson<AvailabilityResponse>(
    `/properties/${propertyId}/availability`,
    { checkin, nights }
  );
}

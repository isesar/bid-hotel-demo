const COMPLETED_KEY = "booking-completed";

export function markBookingCompleted() {
  sessionStorage.setItem(COMPLETED_KEY, "1");
}

export function clearBookingCompleted() {
  sessionStorage.removeItem(COMPLETED_KEY);
}

export function isBookingCompleted() {
  return sessionStorage.getItem(COMPLETED_KEY) === "1";
}

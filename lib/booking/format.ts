const BOARD_TYPE_LABELS: Record<string, string> = {
  RO: "Room Only",
  BB: "Bed & Breakfast",
  HB: "Half Board",
  FB: "Full Board",
  AI: "All Inclusive",
};

export function formatBoardType(boardType: string) {
  return BOARD_TYPE_LABELS[boardType] ?? boardType;
}

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export function formatEuro(value: number) {
  return euroFormatter.format(value);
}

export function formatNightsLabel(nights: number) {
  return nights === 1 ? "1 night" : `${nights} nights`;
}

export function formatConfirmationDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatGuestsLabel(adults: number, children: number) {
  const adultLabel = adults === 1 ? "1 adult" : `${adults} adults`;

  if (children <= 0) {
    return adultLabel;
  }

  const childLabel = children === 1 ? "1 child" : `${children} children`;
  return `${adultLabel}, ${childLabel}`;
}

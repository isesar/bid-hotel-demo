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

const CARD_BRANDS = [
  { name: "American Express", color: "#006FCF", label: "AMEX" },
  { name: "Visa", color: "#1434CB", label: "VISA" },
  { name: "Maestro", color: "#7375CF", label: "Maestro" },
  { name: "Mastercard", color: "#EB001B", label: "MC" },
  { name: "Diners Club", color: "#0069AA", label: "DC" },
  { name: "Discover", color: "#201D1C", label: "DISC" },
] as const;

export function AcceptedCards() {
  return (
    <div className="w-full bg-surface px-4 py-3">
      <p className="mb-2 text-center text-micro tracking-label text-ink">
        ACCEPTED CREDIT CARDS
      </p>
      <div className="flex items-center justify-between gap-2">
        {CARD_BRANDS.map((brand) => (
          <div
            key={brand.name}
            title={brand.name}
            className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-line bg-white text-[8px] font-semibold tracking-label text-ink"
            style={{ color: brand.color }}
          >
            {brand.label}
          </div>
        ))}
      </div>
    </div>
  );
}

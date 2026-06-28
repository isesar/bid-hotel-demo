import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroupItem } from "@/components/ui/radio-group";

type HotelOptionCardProps = {
  id: string;
  name: string;
  subtitle?: string;
  selected?: boolean;
  layout?: "desktop" | "mobile";
  showSubtitle?: boolean;
};

export function HotelOptionCard({
  id,
  name,
  subtitle,
  selected = false,
  layout = "desktop",
  showSubtitle = true,
  onSelect,
}: HotelOptionCardProps & { onSelect?: () => void }) {
  return (
    <label
      htmlFor={id}
      onClick={onSelect}
      className={cn(
        "group relative flex cursor-pointer flex-col border border-line text-left transition-colors hover:bg-surface-hover",
        selected && "bg-surface",
        layout === "desktop"
          ? "min-h-[87px] justify-center px-10 py-4"
          : "gap-2 border-x-0 border-t p-4 first:border-t"
      )}
    >
      <RadioGroupItem id={id} value={id} className="sr-only" />
      <Card
        className={cn(
          "gap-2 rounded-none border-0 bg-transparent py-0 shadow-none ring-0",
          layout === "mobile" && "[--card-spacing:0px]"
        )}
      >
        <CardContent className="px-0">
          <p className="font-serif text-title tracking-label text-ink">
            {name}
          </p>
          {showSubtitle && subtitle ? (
            <p className="text-base leading-6 tracking-label text-ink">
              {subtitle}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </label>
  );
}

type SeeAllHotelsCardProps = {
  layout?: "desktop" | "mobile";
  onClick?: () => void;
};

export function SeeAllHotelsCard({
  layout = "desktop",
  onClick,
}: SeeAllHotelsCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-auto min-h-[87px] cursor-pointer flex-col items-start justify-center rounded-none border border-line text-left transition-colors hover:bg-surface-hover",
        layout === "desktop" ? "px-10 py-4" : "border-x-0 border-t p-4"
      )}
    >
      <p className="font-serif text-title tracking-label text-ink">
        See All Hotels
      </p>
    </Button>
  );
}

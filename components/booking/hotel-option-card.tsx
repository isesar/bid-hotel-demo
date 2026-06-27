import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
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
}: HotelOptionCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex cursor-pointer flex-col border border-[#c6c6c6] text-left transition-colors hover:bg-[#fafafa]",
        selected && "bg-[#f3f3f3]",
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
          <p className="font-serif text-[23px] tracking-[0.2px] text-[#1f1f1f]">
            {name}
          </p>
          {showSubtitle && subtitle ? (
            <p className="text-base leading-6 tracking-[0.2px] text-[#1f1f1f]">
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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[87px] cursor-pointer flex-col justify-center border border-[#c6c6c6] text-left transition-colors hover:bg-[#fafafa]",
        layout === "desktop" ? "px-10 py-4" : "border-x-0 border-t p-4"
      )}
    >
      <p className="font-serif text-[23px] tracking-[0.2px] text-[#1f1f1f]">
        See All Hotels
      </p>
    </button>
  );
}

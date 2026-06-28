"use client";

import type { Property } from "@/lib/booking/types";
import { formatPropertyType } from "@/lib/booking/format-property-type";
import { cn } from "@/lib/utils";

import { RadioGroup } from "@/components/ui/radio-group";
import {
  HotelOptionCard,
  SeeAllHotelsCard,
} from "@/components/booking/hotel/hotel-option-card";

type HotelListProps = {
  properties: Property[];
  selectedPropertyId: string | null;
  onSelectProperty: (propertyId: string) => void;
  layout?: "desktop" | "mobile";
};

export function HotelList({
  properties,
  selectedPropertyId,
  onSelectProperty,
  layout = "desktop",
}: HotelListProps) {
  return (
    <div
      className={cn(
        layout === "desktop" ? "grid grid-cols-2" : "flex flex-col"
      )}
    >
      <RadioGroup
        value={selectedPropertyId ?? ""}
        onValueChange={onSelectProperty}
        className={cn(
          "gap-0",
          layout === "desktop" ? "contents" : "flex flex-col"
        )}
      >
        {properties.map((property) => (
          <HotelOptionCard
            key={property.id}
            id={property.id}
            name={property.name}
            subtitle={formatPropertyType(property.type)}
            selected={selectedPropertyId === property.id}
            layout={layout}
            onSelect={() => onSelectProperty(property.id)}
          />
        ))}
      </RadioGroup>
      <SeeAllHotelsCard layout={layout} />
    </div>
  );
}

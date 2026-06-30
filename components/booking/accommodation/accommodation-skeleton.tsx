import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

type AccommodationSkeletonProps = {
  layout?: "desktop" | "mobile";
};

export function AccommodationSkeleton({
  layout = "desktop",
}: AccommodationSkeletonProps) {
  const count = layout === "desktop" ? 8 : 6;

  return (
    <div
      className={cn(
        layout === "desktop" ? "grid grid-cols-2" : "flex flex-col"
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "border border-line",
            layout === "desktop" ? "px-10 py-4" : "border-x-0 border-t p-4"
          )}
        >
          <Skeleton className="mb-2 h-7 w-3/4 rounded-none bg-surface" />
          <Skeleton className="h-5 w-1/2 rounded-none bg-surface" />
        </div>
      ))}
    </div>
  );
}

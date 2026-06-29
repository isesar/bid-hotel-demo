import { cn } from "@/lib/utils";

type PaginationDotsProps = {
  activeIndex?: number;
  className?: string;
};

export function PaginationDots({
  activeIndex = 0,
  className,
}: PaginationDotsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            "size-2 rounded-full",
            index === activeIndex ? "bg-white" : "bg-white/40"
          )}
        />
      ))}
    </div>
  );
}

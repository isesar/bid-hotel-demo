import { cn } from "@/lib/utils";

function LegendItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-[13px] tracking-[0.2px] text-[#1f1f1f]">
        {label}
      </span>
    </div>
  );
}

function DaySwatch({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-14 items-center justify-center overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CalendarLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-center gap-6 px-4 pb-6 pt-4",
        className
      )}
    >
      <LegendItem label="Available">
        <DaySwatch>
          <span className="text-[13px] text-[#1f1f1f]">1</span>
        </DaySwatch>
      </LegendItem>

      <LegendItem label="Unavailable">
        <DaySwatch className="bg-[#f3f3f3]">
          <span className="text-[13px] text-[#5e5e5e] opacity-70">1</span>
        </DaySwatch>
      </LegendItem>

      <LegendItem label="Check-in">
        <DaySwatch>
          <div className="absolute right-0 top-0 h-10 w-[29px] bg-[#1f1f1f]" />
          <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-[#1f1f1f] text-[13px] text-white">
            1
          </div>
        </DaySwatch>
      </LegendItem>

      <LegendItem label="Check-out">
        <DaySwatch>
          <div className="absolute left-0 top-0 h-10 w-[29px] bg-[#1f1f1f]" />
          <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-[#1f1f1f] text-[13px] text-white">
            1
          </div>
        </DaySwatch>
      </LegendItem>

      <LegendItem label="Check-out only">
        <DaySwatch>
          <div className="flex size-10 items-center justify-center rounded-full border border-[#c6c6c6] text-[13px] text-[#5e5e5e]">
            1
          </div>
        </DaySwatch>
      </LegendItem>
    </div>
  );
}

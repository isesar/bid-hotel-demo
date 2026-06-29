"use client";

import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AccommodationTabsProps = {
  activeTab: "accommodation" | "dates";
  onTabChange: (tab: "accommodation" | "dates") => void;
  accommodationContent: React.ReactNode;
  datesContent: React.ReactNode;
};

export function AccommodationTabs({
  activeTab,
  onTabChange,
  accommodationContent,
  datesContent,
}: AccommodationTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        onTabChange(value as "accommodation" | "dates")
      }
      className="flex min-h-0 flex-1 flex-col gap-0"
    >
      <TabsList
        variant="line"
        className="h-[54px] w-full rounded-none border-0 bg-white p-0 shadow-none"
      >
        <TabsTrigger
          value="accommodation"
          className={cn(
            "h-full flex-1 rounded-none border-0 border-b-2 border-line bg-transparent px-0 py-2 text-caption tracking-label text-ink-muted shadow-none",
            "data-[state=active]:border-ink data-[state=active]:font-semibold data-[state=active]:text-ink"
          )}
        >
          ACCOMMODATION
        </TabsTrigger>
        <TabsTrigger
          value="dates"
          className={cn(
            "h-full flex-1 rounded-none border-0 border-b-2 border-line bg-transparent px-0 py-2 text-caption tracking-label text-ink-muted shadow-none",
            "data-[state=active]:border-ink data-[state=active]:font-semibold data-[state=active]:text-ink"
          )}
        >
          DATES
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="accommodation"
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {accommodationContent}
      </TabsContent>
      <TabsContent value="dates" className="min-h-0 flex-1 overflow-y-auto p-4">
        {datesContent}
      </TabsContent>
    </Tabs>
  );
}

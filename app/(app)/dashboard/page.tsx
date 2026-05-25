import type { Metadata } from "next";
import { HeroBanner }     from "@/components/dashboard/hero-banner";
import { StatsRow }       from "@/components/dashboard/stats-row";
import { QuickLaunch }    from "@/components/dashboard/quick-launch";
import { WeeklyChart }    from "@/components/dashboard/weekly-chart";
import { ActivityFeed }   from "@/components/dashboard/activity-feed";
import { AISuggestions }  from "@/components/dashboard/ai-suggestions";
import { SubjectMastery } from "@/components/dashboard/subject-mastery";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      {/* Hero */}
      <HeroBanner />

      {/* Stat cards */}
      <StatsRow />

      {/* Quick actions */}
      <QuickLaunch />

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <WeeklyChart />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>

      {/* AI Suggestions + Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AISuggestions />
        <SubjectMastery />
      </div>
    </>
  );
}

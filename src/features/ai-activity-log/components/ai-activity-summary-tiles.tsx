import type { AiActivityLogSummary } from '@/features/ai-activity-log/types/ai-activity-log.type';

type AiActivitySummaryTilesProps = {
  summary: AiActivityLogSummary | null;
  isLoading: boolean;
};

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-on-surface">{value}</p>
    </div>
  );
}

export function AiActivitySummaryTiles({ summary, isLoading }: AiActivitySummaryTilesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Calls today" value={isLoading || !summary ? '—' : String(summary.totalToday)} />
      <StatTile label="Calls this month" value={isLoading || !summary ? '—' : String(summary.totalThisMonth)} />
      <StatTile
        label="Success rate"
        value={isLoading || !summary || summary.successRate === null ? '—' : `${summary.successRate}%`}
      />
      <StatTile
        label="Avg. response time"
        value={isLoading || !summary || summary.avgLatencyMs === null ? '—' : `${summary.avgLatencyMs}ms`}
      />
    </div>
  );
}

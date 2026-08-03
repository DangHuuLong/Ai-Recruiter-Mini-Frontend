'use client';

import { useState } from 'react';

import {
  FUNCTION_TYPE_LABELS,
  type AiFunctionType,
  type TimeseriesBucket,
} from '@/features/ai-activity-log/types/ai-activity-log.type';

// Validated CVD-safe categorical slots 1-3 (blue/orange/aqua) from the dataviz palette —
// the only 3 slots that pass the strict all-pairs check, exactly matching our 3 series.
const SERIES: { key: AiFunctionType; light: string; dark: string }[] = [
  { key: 'PARSE_RESUME', light: '#2a78d6', dark: '#3987e5' },
  { key: 'PARSE_JOB_DESCRIPTION', light: '#eb6834', dark: '#d95926' },
  { key: 'SCORE_APPLICATION', light: '#1baf7a', dark: '#199e70' },
];

// Matches the `h-40` (10rem) Tailwind class on the chart's plot area below.
const CHART_HEIGHT_PX = 160;

type AiActivityTimeseriesChartProps = {
  title: string;
  buckets: TimeseriesBucket[];
  isLoading: boolean;
};

export function AiActivityTimeseriesChart({ title, buckets, isLoading }: AiActivityTimeseriesChartProps) {
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  const max = Math.max(1, ...buckets.map((b) => b.PARSE_RESUME + b.PARSE_JOB_DESCRIPTION + b.SCORE_APPLICATION));
  const hovered = buckets.find((b) => b.bucket === hoveredBucket) ?? null;

  return (
    <div className="viz-root rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
      <style>{`
        .viz-root {
          --series-parse-resume: #2a78d6;
          --series-parse-jd: #eb6834;
          --series-score: #1baf7a;
        }
        :root[data-theme="dark"] .viz-root {
          --series-parse-resume: #3987e5;
          --series-parse-jd: #d95926;
          --series-score: #199e70;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .viz-root {
            --series-parse-resume: #3987e5;
            --series-parse-jd: #d95926;
            --series-score: #199e70;
          }
        }
      `}</style>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-on-surface">{title}</h3>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="cursor-pointer text-xs font-semibold text-primary hover:text-primary-hover"
        >
          {showTable ? 'Show chart' : 'Show table'}
        </button>
      </div>

      {/* Legend — always shown for 3 series */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-on-surface-variant">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: `var(--series-${s.key === 'PARSE_RESUME' ? 'parse-resume' : s.key === 'PARSE_JOB_DESCRIPTION' ? 'parse-jd' : 'score'})` }}
            />
            {FUNCTION_TYPE_LABELS[s.key]}
          </span>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-4 flex h-40 items-center justify-center text-sm text-on-surface-muted">Loading...</div>
      ) : showTable ? (
        <div className="mt-4 max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-on-surface-muted">
                <th className="py-1 pr-2">Bucket</th>
                {SERIES.map((s) => (
                  <th key={s.key} className="py-1 pr-2">
                    {FUNCTION_TYPE_LABELS[s.key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buckets.map((b) => (
                <tr key={b.bucket} className="border-t border-outline text-on-surface">
                  <td className="py-1 pr-2 font-semibold">{b.bucket}</td>
                  <td className="py-1 pr-2">{b.PARSE_RESUME}</td>
                  <td className="py-1 pr-2">{b.PARSE_JOB_DESCRIPTION}</td>
                  <td className="py-1 pr-2">{b.SCORE_APPLICATION}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative mt-4">
          <div className="flex h-40 items-end gap-[3px]">
            {buckets.map((b) => {
              const total = b.PARSE_RESUME + b.PARSE_JOB_DESCRIPTION + b.SCORE_APPLICATION;
              // Percentage heights need a parent with a definite pixel height, which a
              // row-flex item under `items-end` doesn't have — so segment heights are
              // computed in pixels against CHART_HEIGHT_PX instead of as CSS percentages.
              const barHeightPx = total > 0 ? Math.max(2, Math.round((total / max) * CHART_HEIGHT_PX)) : 0;
              const scoreHeightPx = total > 0 ? Math.round((b.SCORE_APPLICATION / total) * barHeightPx) : 0;
              const jdHeightPx = total > 0 ? Math.round((b.PARSE_JOB_DESCRIPTION / total) * barHeightPx) : 0;
              const resumeHeightPx = total > 0 ? barHeightPx - scoreHeightPx - jdHeightPx : 0;

              return (
                <div
                  key={b.bucket}
                  className="group relative flex-1 cursor-default"
                  onMouseEnter={() => setHoveredBucket(b.bucket)}
                  onMouseLeave={() => setHoveredBucket(null)}
                >
                  <div
                    className="flex flex-col justify-end overflow-hidden rounded-t-sm"
                    style={{ height: `${barHeightPx}px` }}
                  >
                    {b.SCORE_APPLICATION > 0 ? (
                      <div style={{ height: `${scoreHeightPx}px`, backgroundColor: 'var(--series-score)' }} />
                    ) : null}
                    {b.PARSE_JOB_DESCRIPTION > 0 ? (
                      <div
                        style={{
                          height: `${jdHeightPx}px`,
                          backgroundColor: 'var(--series-parse-jd)',
                          marginTop: b.SCORE_APPLICATION > 0 ? '2px' : 0,
                        }}
                      />
                    ) : null}
                    {b.PARSE_RESUME > 0 ? (
                      <div
                        style={{
                          height: `${resumeHeightPx}px`,
                          backgroundColor: 'var(--series-parse-resume)',
                          marginTop: b.SCORE_APPLICATION > 0 || b.PARSE_JOB_DESCRIPTION > 0 ? '2px' : 0,
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1.5 flex gap-[3px] text-[10px] text-on-surface-muted">
            {buckets.map((b, index) => (
              <div key={b.bucket} className="flex-1 text-center">
                {index % Math.ceil(buckets.length / 12) === 0 ? b.bucket : ''}
              </div>
            ))}
          </div>

          {hovered ? (
            <div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-outline bg-surface-lowest px-3 py-2 text-xs shadow-panel">
              <p className="font-bold text-on-surface">{hovered.bucket}</p>
              <p className="text-on-surface-variant">Parse Resume: {hovered.PARSE_RESUME}</p>
              <p className="text-on-surface-variant">Parse JD: {hovered.PARSE_JOB_DESCRIPTION}</p>
              <p className="text-on-surface-variant">Score: {hovered.SCORE_APPLICATION}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

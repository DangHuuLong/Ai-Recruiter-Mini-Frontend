import { FUNCTION_TYPE_LABELS, type AiActivityLog } from '@/features/ai-activity-log/types/ai-activity-log.type';

// Packages selected AI activity logs (possibly mixing different function types, e.g. a
// PARSE_RESUME + a SCORE_APPLICATION for the same case) into one copyable Markdown block —
// so a DEV can hand the full pipeline for one case to an external AI for a second opinion.
export function buildDebugReport(logs: AiActivityLog[]): string {
  const ordered = [...logs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return ordered
    .map((log) => {
      const heading = `## ${FUNCTION_TYPE_LABELS[log.functionType]} (${log.status}) — called ${log.createdAt}, took ${log.latencyMs}ms`;
      const errorLine = log.errorMessage ? `\n**Error:** ${log.errorMessage}\n` : '';

      return [
        heading,
        errorLine,
        '**Input:**',
        '```json',
        JSON.stringify(log.input, null, 2),
        '```',
        '**Output:**',
        '```json',
        JSON.stringify(log.output, null, 2),
        '```',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n---\n\n');
}

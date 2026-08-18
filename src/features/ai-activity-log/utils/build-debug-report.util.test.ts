import { describe, expect, it } from 'vitest';

import type { AiActivityLog } from '@/features/ai-activity-log/types/ai-activity-log.type';

import { buildDebugReport } from './build-debug-report.util';

function buildLog(overrides: Partial<AiActivityLog> = {}): AiActivityLog {
  return {
    id: 'log-1',
    functionType: 'PARSE_RESUME',
    tier: 'ENTERPRISE',
    status: 'SUCCESS',
    organizationId: 'org-1',
    batchId: null,
    evaluationId: null,
    resumeId: null,
    jobDescriptionId: null,
    errorMessage: null,
    latencyMs: 120,
    createdAt: '2026-01-01T00:00:00.000Z',
    input: { raw_text: 'input text' },
    output: { parsed: true },
    ...overrides,
  };
}

describe('buildDebugReport', () => {
  it('returns an empty string for an empty log list', () => {
    expect(buildDebugReport([])).toBe('');
  });

  it('includes the function label, status, and latency in the heading', () => {
    const report = buildDebugReport([buildLog()]);
    expect(report).toContain('## Parse Resume (SUCCESS) — called 2026-01-01T00:00:00.000Z, took 120ms');
  });

  it('includes formatted input and output JSON blocks', () => {
    const report = buildDebugReport([buildLog({ input: { a: 1 }, output: { b: 2 } })]);
    expect(report).toContain('**Input:**');
    expect(report).toContain(JSON.stringify({ a: 1 }, null, 2));
    expect(report).toContain('**Output:**');
    expect(report).toContain(JSON.stringify({ b: 2 }, null, 2));
  });

  it('omits the error line entirely when there is no errorMessage', () => {
    const report = buildDebugReport([buildLog({ errorMessage: null })]);
    expect(report).not.toContain('**Error:**');
  });

  it('includes an error line when errorMessage is present', () => {
    const report = buildDebugReport([buildLog({ status: 'FAILED', errorMessage: 'AI service timed out' })]);
    expect(report).toContain('**Error:** AI service timed out');
  });

  it('orders multiple logs chronologically by createdAt regardless of input order', () => {
    const later = buildLog({ id: 'later', createdAt: '2026-01-02T00:00:00.000Z', functionType: 'SCORE_APPLICATION' });
    const earlier = buildLog({ id: 'earlier', createdAt: '2026-01-01T00:00:00.000Z', functionType: 'PARSE_RESUME' });

    const report = buildDebugReport([later, earlier]);
    const earlierIndex = report.indexOf('Parse Resume');
    const laterIndex = report.indexOf('Score Application');

    expect(earlierIndex).toBeGreaterThanOrEqual(0);
    expect(laterIndex).toBeGreaterThan(earlierIndex);
  });

  it('joins multiple logs with a horizontal-rule separator', () => {
    const report = buildDebugReport([buildLog({ id: 'a' }), buildLog({ id: 'b', functionType: 'PARSE_JOB_DESCRIPTION' })]);
    expect(report).toContain('\n\n---\n\n');
  });
});

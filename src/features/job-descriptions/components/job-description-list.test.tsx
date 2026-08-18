import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import en from '../../../../messages/en.json';
import { renderWithIntl } from '@/test/render-with-intl';

import {
  bulkDeactivateJobDescriptions,
  deactivateJobDescription,
  getJobDescriptions,
} from '@/features/job-descriptions/api/job-description.api';
import type { JobDescription } from '@/features/job-descriptions/types/job-description.type';

import { JobDescriptionList } from './job-description-list';

vi.mock('@/features/job-descriptions/api/job-description.api', () => ({
  getJobDescriptions: vi.fn(),
  deactivateJobDescription: vi.fn(),
  bulkDeactivateJobDescriptions: vi.fn(),
}));

const mockedGetJobDescriptions = vi.mocked(getJobDescriptions);
const mockedDeactivateJobDescription = vi.mocked(deactivateJobDescription);
const mockedBulkDeactivateJobDescriptions = vi.mocked(bulkDeactivateJobDescriptions);

function buildJobDescription(overrides: Partial<JobDescription> = {}): JobDescription {
  return {
    id: 'jd-1',
    title: 'Senior Backend Engineer',
    companyName: 'Acme Inc',
    rawText: 'We are looking for...',
    parseStatus: 'SUCCESS',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mockJobDescriptionsResponse(jobDescriptions: JobDescription[]) {
  mockedGetJobDescriptions.mockResolvedValue({
    success: true,
    message: 'OK',
    data: jobDescriptions,
    meta: { page: 1, limit: 10, total: jobDescriptions.length, totalPages: 1 },
  });
}

function renderJobDescriptionList() {
  return renderWithIntl(<JobDescriptionList />, en);
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('JobDescriptionList', () => {
  it('shows a loading state while the initial request is in flight', () => {
    mockedGetJobDescriptions.mockReturnValue(new Promise(() => {}));
    renderJobDescriptionList();

    expect(screen.getByText('Loading job descriptions...')).toBeInTheDocument();
  });

  it('renders job descriptions once loaded, including the active badge', async () => {
    mockJobDescriptionsResponse([buildJobDescription()]);
    renderJobDescriptionList();

    expect(await screen.findByText('Senior Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('does not show a deactivate action for an already-inactive job description', async () => {
    mockJobDescriptionsResponse([buildJobDescription({ isActive: false })]);
    renderJobDescriptionList();

    await screen.findByText('Senior Backend Engineer');
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Deactivate' })).not.toBeInTheDocument();
  });

  it('shows an empty state when there are no job descriptions', async () => {
    mockJobDescriptionsResponse([]);
    renderJobDescriptionList();

    expect(await screen.findByText('No job descriptions found')).toBeInTheDocument();
  });

  it('shows an error state with a retry action when the request fails', async () => {
    mockedGetJobDescriptions.mockRejectedValue(new Error('Network down'));
    renderJobDescriptionList();

    expect(await screen.findByText('Network down')).toBeInTheDocument();

    mockJobDescriptionsResponse([buildJobDescription()]);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Senior Backend Engineer')).toBeInTheDocument();
  });

  it('deactivates a single job description after confirming', async () => {
    mockJobDescriptionsResponse([buildJobDescription()]);
    mockedDeactivateJobDescription.mockResolvedValue(buildJobDescription({ isActive: false }));
    renderJobDescriptionList();

    await screen.findByText('Senior Backend Engineer');
    fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Deactivate job description?')).toBeInTheDocument();

    mockJobDescriptionsResponse([buildJobDescription({ isActive: false })]);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Deactivate JD' }));

    expect(await screen.findByText('Inactive')).toBeInTheDocument();
    expect(mockedDeactivateJobDescription).toHaveBeenCalledWith('jd-1');
  });

  it('bulk-deactivates selected job descriptions', async () => {
    mockJobDescriptionsResponse([
      buildJobDescription(),
      buildJobDescription({ id: 'jd-2', title: 'Product Manager' }),
    ]);
    mockedBulkDeactivateJobDescriptions.mockResolvedValue([
      { id: 'jd-1', success: true, data: buildJobDescription({ isActive: false }) },
      { id: 'jd-2', success: true, data: buildJobDescription({ id: 'jd-2', isActive: false }) },
    ]);
    renderJobDescriptionList();

    await screen.findByText('Senior Backend Engineer');

    const rowCheckboxes = screen
      .getAllByRole('checkbox')
      .filter((el) => el.getAttribute('aria-label') !== 'Select all rows');
    fireEvent.click(rowCheckboxes[0]);
    fireEvent.click(rowCheckboxes[1]);

    fireEvent.click(screen.getByRole('button', { name: 'Deactivate selected' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Deactivate 2 job descriptions?')).toBeInTheDocument();

    mockJobDescriptionsResponse([]);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Deactivate selected' }));

    await screen.findByText('No job descriptions found');
    expect(mockedBulkDeactivateJobDescriptions).toHaveBeenCalledWith(['jd-1', 'jd-2']);
  });
});

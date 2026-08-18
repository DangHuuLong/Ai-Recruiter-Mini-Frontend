import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import en from '../../../../messages/en.json';
import { renderWithIntl } from '@/test/render-with-intl';

import { bulkDeleteCandidates, deleteCandidate, getCandidates } from '@/features/candidates/api/candidate.api';
import type { Candidate } from '@/features/candidates/types/candidate.type';

import { CandidateList } from './candidate-list';

vi.mock('@/features/candidates/api/candidate.api', () => ({
  getCandidates: vi.fn(),
  deleteCandidate: vi.fn(),
  bulkDeleteCandidates: vi.fn(),
}));

const mockedGetCandidates = vi.mocked(getCandidates);
const mockedDeleteCandidate = vi.mocked(deleteCandidate);
const mockedBulkDeleteCandidates = vi.mocked(bulkDeleteCandidates);

function buildCandidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    id: 'candidate-1',
    fullName: 'Jane Doe',
    primaryEmail: 'jane@example.com',
    primaryPhone: '+1 555 000 1234',
    linkedinUrl: null,
    githubUrl: null,
    portfolioUrl: null,
    location: 'San Francisco, CA',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mockCandidatesResponse(candidates: Candidate[]) {
  mockedGetCandidates.mockResolvedValue({
    success: true,
    message: 'OK',
    data: candidates,
    meta: { page: 1, limit: 10, total: candidates.length, totalPages: 1 },
  });
}

function renderCandidateList() {
  return renderWithIntl(<CandidateList />, en);
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CandidateList', () => {
  it('shows a loading state while the initial request is in flight', () => {
    mockedGetCandidates.mockReturnValue(new Promise(() => {}));
    renderCandidateList();

    expect(screen.getByText('Loading candidates...')).toBeInTheDocument();
  });

  it('renders candidates once loaded', async () => {
    mockCandidatesResponse([buildCandidate()]);
    renderCandidateList();

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows an empty state when there are no candidates', async () => {
    mockCandidatesResponse([]);
    renderCandidateList();

    expect(await screen.findByText('No candidates found')).toBeInTheDocument();
  });

  it('shows an error state with a retry action when the request fails', async () => {
    mockedGetCandidates.mockRejectedValue(new Error('Network down'));
    renderCandidateList();

    expect(await screen.findByText('Network down')).toBeInTheDocument();

    mockCandidatesResponse([buildCandidate()]);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
  });

  it('deletes a single candidate after confirming', async () => {
    mockCandidatesResponse([buildCandidate()]);
    mockedDeleteCandidate.mockResolvedValue({ id: 'candidate-1', deleted: true });
    renderCandidateList();

    await screen.findByText('Jane Doe');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    const dialog = await screen.findByText('Delete candidate?');
    expect(dialog).toBeInTheDocument();

    mockCandidatesResponse([]);
    fireEvent.click(screen.getByRole('button', { name: 'Delete candidate' }));

    await waitFor(() => expect(mockedDeleteCandidate).toHaveBeenCalledWith('candidate-1'));
  });

  it('bulk-deletes selected candidates', async () => {
    mockCandidatesResponse([buildCandidate(), buildCandidate({ id: 'candidate-2', fullName: 'John Smith' })]);
    mockedBulkDeleteCandidates.mockResolvedValue([
      { id: 'candidate-1', success: true, data: { id: 'candidate-1', deleted: true } },
      { id: 'candidate-2', success: true, data: { id: 'candidate-2', deleted: true } },
    ]);
    renderCandidateList();

    await screen.findByText('Jane Doe');

    const rowCheckboxes = screen.getAllByRole('checkbox').filter((el) => el.getAttribute('aria-label') !== 'Select all rows');
    fireEvent.click(rowCheckboxes[0]);
    fireEvent.click(rowCheckboxes[1]);

    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Delete 2 candidates?')).toBeInTheDocument();

    mockCandidatesResponse([]);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete selected' }));

    await waitFor(() => expect(mockedBulkDeleteCandidates).toHaveBeenCalledWith(['candidate-1', 'candidate-2']));
  });
});

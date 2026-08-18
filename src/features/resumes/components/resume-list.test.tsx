import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import en from '../../../../messages/en.json';
import { renderWithIntl } from '@/test/render-with-intl';

import { deleteResume, getResumes } from '@/features/resumes/api/resume.api';
import type { Resume } from '@/features/resumes/types/resume.type';

import { ResumeList } from './resume-list';

vi.mock('@/features/resumes/api/resume.api', () => ({
  getResumes: vi.fn(),
  deleteResume: vi.fn(),
}));

const mockedGetResumes = vi.mocked(getResumes);
const mockedDeleteResume = vi.mocked(deleteResume);

function buildResume(overrides: Partial<Resume> = {}): Resume {
  return {
    id: 'resume-1',
    candidateId: 'candidate-1',
    fileAssetId: 'file-1',
    parseStatus: 'SUCCESS',
    parserVersion: 'v1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    fileAsset: { id: 'file-1', fileName: 'resume.pdf' } as Resume['fileAsset'],
    ...overrides,
  };
}

function mockResumesResponse(resumes: Resume[]) {
  mockedGetResumes.mockResolvedValue({
    success: true,
    message: 'OK',
    data: resumes,
    meta: { page: 1, limit: 10, total: resumes.length, totalPages: 1 },
  });
}

function renderResumeList() {
  return renderWithIntl(<ResumeList />, en);
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ResumeList', () => {
  it('shows a loading state while the initial request is in flight', () => {
    mockedGetResumes.mockReturnValue(new Promise(() => {}));
    renderResumeList();

    expect(screen.getByText('Loading resumes...')).toBeInTheDocument();
  });

  it('renders resumes once loaded, including the parse status badge', async () => {
    mockResumesResponse([buildResume()]);
    renderResumeList();

    expect(await screen.findByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
  });

  it('shows an empty state when there are no resumes', async () => {
    mockResumesResponse([]);
    renderResumeList();

    expect(await screen.findByText('No resumes found')).toBeInTheDocument();
  });

  it('shows an error state with a retry action when the request fails', async () => {
    mockedGetResumes.mockRejectedValue(new Error('Network down'));
    renderResumeList();

    expect(await screen.findByText('Network down')).toBeInTheDocument();

    mockResumesResponse([buildResume()]);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('resume.pdf')).toBeInTheDocument();
  });

  it('re-fetches with the parseStatus filter when a status option is chosen', async () => {
    mockResumesResponse([buildResume()]);
    renderResumeList();

    await screen.findByText('resume.pdf');
    mockedGetResumes.mockClear();
    mockResumesResponse([buildResume({ id: 'resume-2', parseStatus: 'FAILED' })]);

    fireEvent.click(screen.getByRole('button', { name: /Parse Status/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Failed' }));

    await screen.findByText('resume-2', { exact: false });
    expect(mockedGetResumes).toHaveBeenCalledWith(
      expect.objectContaining({ parseStatus: 'FAILED', page: 1 }),
    );
  });

  it('deletes a resume after confirming', async () => {
    mockResumesResponse([buildResume()]);
    mockedDeleteResume.mockResolvedValue({ id: 'resume-1', deleted: true });
    renderResumeList();

    await screen.findByText('resume.pdf');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Delete resume?')).toBeInTheDocument();

    mockResumesResponse([]);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete resume' }));

    await screen.findByText('No resumes found');
    expect(mockedDeleteResume).toHaveBeenCalledWith('resume-1');
  });
});

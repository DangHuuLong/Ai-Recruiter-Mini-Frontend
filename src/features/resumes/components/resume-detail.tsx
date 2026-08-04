'use client';

import { DownloadIcon, EyeIcon, FileTextIcon, Loader2Icon, UserIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

import { DetailItem, DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { getFileDownloadUrl } from '@/features/files/api/file.api';
import { ResumeParsedData } from '@/features/resumes/components/resume-parsed-data';
import { useParseResume } from '@/features/resumes/hooks/use-parse-resume';
import { useResumeDetail } from '@/features/resumes/hooks/use-resume-detail';
import type { ResumeDetailProps } from '@/features/resumes/types/resume-detail-ui.type';

const PARSE_STATUS_CLASSES: Record<string, string> = {
  PENDING: 'bg-surface-variant text-on-surface-variant',
  PROCESSING: 'bg-info/15 text-info',
  SUCCESS: 'bg-success-container text-success',
  FAILED: 'bg-error-container text-error',
};

export function ResumeDetail({ resumeId }: ResumeDetailProps) {
  const { resume, isLoading, errorMessage, refetchResume } =
    useResumeDetail(resumeId);
  const { isParsing, parseErrorMessage, parseResume, resetParseError } =
    useParseResume(resumeId);
  const [fileAction, setFileAction] = useState<'view' | 'download' | null>(null);
  const [fileErrorMessage, setFileErrorMessage] = useState<string | null>(null);

  const isParseRunning = isParsing || resume?.parseStatus === 'PROCESSING';
  const canRetryParse = resume?.parseStatus === 'FAILED';
  const parseButtonLabel = isParseRunning
    ? 'Parsing CV...'
    : canRetryParse
      ? 'Retry parse'
      : 'Parse CV';

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    showToast.error('Failed to load resume detail', {
      description: errorMessage,
    });
  }, [errorMessage]);

  useEffect(() => {
    if (!parseErrorMessage) {
      return;
    }

    showToast.error('Failed to parse CV', {
      description: parseErrorMessage,
    });
  }, [parseErrorMessage]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading resume detail..."
        description="Please wait while the resume record is being loaded."
      />
    );
  }

  if (errorMessage) {
    return (
      <EmptyState
        title="Failed to load resume detail"
        description={errorMessage}
        action={
          <button
            type="button"
            onClick={() => {
              void refetchResume();
            }}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Try again
          </button>
        }
      />
    );
  }

  const handleOpenFile = async (mode: 'view' | 'download') => {
    if (!resume) return;

    try {
      setFileAction(mode);
      setFileErrorMessage(null);
      const fileName = resume.fileAsset?.fileName || resume.fileAssetId;
      const { url } = await getFileDownloadUrl(resume.fileAssetId, fileName);

      if (mode === 'view') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to prepare the file link.';
      setFileErrorMessage(message);
    } finally {
      setFileAction(null);
    }
  };

  if (!resume) {
    return (
      <EmptyState
        title="Resume not found"
        description="The resume record could not be found."
        action={
          <Link
            href="/resumes"
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
          >
            Back to Resumes
          </Link>
        }
      />
    );
  }

  return (
    <DetailPageLayout
      title="Resume detail"
      description="View resume record information, parsing status, and linked candidate data."
      backHref="/resumes"
      backLabel="Back to Resumes"
      actions={
        <button
          type="button"
          disabled={isParseRunning}
          onClick={async () => {
            resetParseError();
            const parsedResume = await parseResume();

            if (!parsedResume) {
              return;
            }

            showToast.success('CV parsed successfully', {
              description: 'Parsed CV data is now available on this resume.',
            });
          }}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled"
        >
          {parseButtonLabel}
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
            Resume information
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <DetailItem label="Resume ID" value={resume.id} />
            <DetailItem label="Candidate ID" value={resume.candidateId} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">Parse status</p>
              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PARSE_STATUS_CLASSES[resume.parseStatus] ?? 'bg-surface-variant text-on-surface-variant'}`}
              >
                {resume.parseStatus}
              </span>
            </div>
            <div className="min-w-0 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">CV file</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="flex min-w-0 items-center gap-2 rounded-xl border border-outline bg-surface-variant px-3 py-2 text-sm">
                  <FileTextIcon className="size-4 shrink-0 text-on-surface-muted" />
                  <span className="truncate text-on-surface">{resume.fileAsset?.fileName || resume.fileAssetId}</span>
                </span>
                <button
                  type="button"
                  disabled={fileAction !== null}
                  onClick={() => void handleOpenFile('view')}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-sm font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {fileAction === 'view' ? <Loader2Icon className="size-4 animate-spin" /> : <EyeIcon className="size-4" />}
                  View CV
                </button>
                <button
                  type="button"
                  disabled={fileAction !== null}
                  aria-label="Download CV"
                  onClick={() => void handleOpenFile('download')}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-outline text-on-surface-variant transition hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {fileAction === 'download' ? <Loader2Icon className="size-4 animate-spin" /> : <DownloadIcon className="size-4" />}
                </button>
              </div>
              {fileErrorMessage ? (
                <p className="mt-1.5 text-xs font-medium text-warning">{fileErrorMessage}</p>
              ) : null}
            </div>
          </div>
        </div>

        <Link
          href={`/candidates/${resume.candidateId}`}
          className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-outline bg-surface-lowest p-5 shadow-card transition hover:border-primary"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <UserIcon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">Linked candidate</p>
            <p className="font-mono text-sm font-semibold text-primary group-hover:underline">{resume.candidateId}</p>
          </div>
        </Link>
      </div>

      <DetailSection
        title="Parse status"
        description="Track CV parsing and retry if the parsing pipeline fails."
      >
        <div className="rounded-2xl border border-outline bg-surface-variant p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-on-surface">
                Current status:
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PARSE_STATUS_CLASSES[resume.parseStatus] ?? 'bg-surface-variant text-on-surface-variant'}`}
                >
                  {resume.parseStatus}
                </span>
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {isParseRunning
                  ? 'Parsing is running. Parsed data will appear after completion.'
                  : resume.parseStatus === 'SUCCESS'
                    ? 'The CV has been parsed successfully.'
                    : resume.parseStatus === 'FAILED'
                      ? 'Parsing failed. Review the error below and retry when ready.'
                      : 'This CV is ready to be parsed.'}
              </p>
            </div>

            {isParseRunning ? (
              <span className="inline-flex h-9 items-center justify-center rounded-xl border border-outline bg-primary-container px-4 text-sm font-semibold text-on-primary-container">
                Loading...
              </span>
            ) : null}
          </div>

          {(parseErrorMessage || resume.parsingError) && (
            <div className="mt-4 rounded-xl border border-error/30 bg-error-container px-4 py-3 text-sm text-error">
              {parseErrorMessage ?? resume.parsingError}
            </div>
          )}
        </div>
      </DetailSection>

      <DetailSection
        title="Parsed CV profile"
        description="Readable CV data grouped by profile, skills, work history, education, projects, certifications, and languages."
      >
        {isParseRunning ? (
          <div className="rounded-2xl border border-outline bg-surface-lowest p-5">
            <LoadingState
              title="Parsing CV..."
              description="Please wait while the system extracts and structures this CV."
            />
          </div>
        ) : resume.parsedData ? (
          <ResumeParsedData parsedData={resume.parsedData} />
        ) : (
          <p className="text-sm text-on-surface-variant">
            No parsed data is available yet.
          </p>
        )}
      </DetailSection>
    </DetailPageLayout>
  );
}

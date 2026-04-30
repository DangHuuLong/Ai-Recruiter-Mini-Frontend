'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { DetailPageLayout, DetailSection } from '@/components/common';
import { EmptyState, LoadingState, showToast } from '@/components/feedback';
import { ResumeParsedData } from '@/features/resumes/components/resume-parsed-data';
import { useParseResume } from '@/features/resumes/hooks/use-parse-resume';
import { useResumeDetail } from '@/features/resumes/hooks/use-resume-detail';
import type {
  DetailItemProps,
  DetailLinkItemProps,
  ResumeDetailProps,
} from '@/features/resumes/types/resume-detail-ui.type';
import { getDisplayValue } from '@/lib/utils/display-value.util';

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {getDisplayValue(value ? String(value) : null)}
      </p>
    </div>
  );
}

function DetailLinkItem({ label, href }: DetailLinkItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      {href ? (
        <a
          href={href}
          className="mt-1 block max-w-full break-words text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
        >
          {href}
        </a>
      ) : (
        <p className="mt-1 text-sm font-medium text-slate-900">
          {getDisplayValue(href)}
        </p>
      )}
    </div>
  );
}

export function ResumeDetail({ resumeId }: ResumeDetailProps) {
  const { resume, isLoading, errorMessage, refetchResume } =
    useResumeDetail(resumeId);
  const { isParsing, parseErrorMessage, parseResume, resetParseError } =
    useParseResume(resumeId);

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
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Try again
          </button>
        }
      />
    );
  }

  if (!resume) {
    return (
      <EmptyState
        title="Resume not found"
        description="The resume record could not be found."
        action={
          <Link
            href="/resumes"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
          className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {parseButtonLabel}
        </button>
      }
    >
      <DetailSection
        title="Resume information"
        description="Core information for this resume record."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <DetailItem label="Resume ID" value={resume.id} />
          <DetailItem label="Candidate ID" value={resume.candidateId} />
          <DetailItem label="Parse status" value={resume.parseStatus} />
          <DetailItem label="File asset ID" value={resume.fileAssetId} />
        </div>
      </DetailSection>

      <DetailSection
        title="Parse status"
        description="Track CV parsing and retry if the parsing pipeline fails."
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Current status: {resume.parseStatus}
              </p>
              <p className="mt-1 text-sm text-slate-600">
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
              <span className="inline-flex h-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-4 text-sm font-semibold text-blue-700">
                Loading...
              </span>
            ) : null}
          </div>

          {(parseErrorMessage || resume.parsingError) && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {parseErrorMessage ?? resume.parsingError}
            </div>
          )}
        </div>
      </DetailSection>

      <DetailSection
        title="Linked candidate"
        description="Candidate profile associated with this resume."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <DetailLinkItem
            label="Candidate detail"
            href={`/candidates/${resume.candidateId}`}
          />
        </div>
      </DetailSection>

      <DetailSection
        title="Parsed CV profile"
        description="Readable CV data grouped by profile, skills, work history, education, projects, certifications, and languages."
      >
        {isParseRunning ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <LoadingState
              title="Parsing CV..."
              description="Please wait while the system extracts and structures this CV."
            />
          </div>
        ) : resume.parsedData ? (
          <ResumeParsedData parsedData={resume.parsedData} />
        ) : (
          <p className="text-sm text-slate-600">
            No parsed data is available yet.
          </p>
        )}
      </DetailSection>
    </DetailPageLayout>
  );
}

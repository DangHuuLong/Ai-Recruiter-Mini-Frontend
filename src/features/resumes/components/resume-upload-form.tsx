'use client';

import { UploadCloudIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { showToast } from '@/components/feedback/toast';
import { useUploadResume } from '@/features/resumes/hooks/use-upload-resume';
import { resumeUploadSchema } from '@/features/resumes/validations/resume.validation';
import { DEFAULT_MAX_FILE_SIZE } from '@/lib/constants/file.constants';
import { formatFileSize } from '@/lib/utils/format-file-size';
import {
  getAcceptedResumeFileInputValue,
  isAcceptedResumeFile,
  isValidResumeFileSize,
} from '@/lib/utils/resume-file.util';

export function ResumeUploadForm() {
  const t = useTranslations('resumes.upload');
  const [candidateId, setCandidateId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    isUploading,
    uploadProgress,
    uploadStep,
    uploadResume,
    resetUploadProgress,
  } = useUploadResume();

  const maxFileSizeLabel = formatFileSize(DEFAULT_MAX_FILE_SIZE);

  const shouldShowProgress = uploadStep !== 'idle';

  const uploadProgressLabel =
    uploadStep === 'processing'
      ? t('progress.processing')
      : uploadStep === 'success'
        ? t('progress.success')
        : uploadStep === 'error'
          ? t('progress.error')
          : t('progress.uploading');

  const handleFileChange = (file?: File) => {
    resetUploadProgress();

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!isAcceptedResumeFile(file)) {
      setSelectedFile(null);

      showToast.error(t('invalidFormatTitle'), {
        description: t('invalidFormatDescription'),
      });

      return;
    }

    if (!isValidResumeFileSize(file)) {
      setSelectedFile(null);

      showToast.error(t('fileTooLargeTitle'), {
        description: t('fileTooLargeDescription', { size: maxFileSizeLabel }),
      });

      return;
    }

    setSelectedFile(file);

    showToast.info(t('fileSelectedTitle'), {
      description: file.name,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = resumeUploadSchema.safeParse({
      candidateId: candidateId.trim(),
      file: selectedFile,
    });

    if (!validation.success) {
      showToast.error(t('invalidDataTitle'), {
        description: validation.error.issues[0]?.message ?? t('invalidDataFallback'),
      });

      return;
    }

    try {
      const createdResume = await uploadResume({
        candidateId: validation.data.candidateId,
        file: validation.data.file,
      });

      showToast.success(t('successTitle'), {
        description: t('successDescription', { status: createdResume.parseStatus }),
      });

      setCandidateId('');
      setSelectedFile(null);
    } catch (error) {
      showToast.error(t('failedTitle'), {
        description: error instanceof Error ? error.message : t('failedFallback'),
      });
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-outline bg-surface-lowest shadow-card">
      <div className="flex items-center gap-3 border-b border-outline px-6 py-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
          <UploadCloudIcon className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-on-surface">{t('title')}</h2>
          <p className="mt-0.5 text-sm text-on-surface-muted">{t('subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        <div className="space-y-2">
          <label
            htmlFor="candidateId"
            className="block text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
          >
            {t('candidateIdLabel')}
          </label>

          <input
            id="candidateId"
            name="candidateId"
            type="text"
            value={candidateId}
            onChange={(event) => setCandidateId(event.target.value)}
            placeholder="candidate_123"
            disabled={isUploading}
            className="h-11 w-full rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
          />

          <p className="text-xs leading-5 text-on-surface-muted">{t('candidateIdHint')}</p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="resumeFile"
            className="block text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
          >
            {t('fileLabel')}
          </label>

          <label
            htmlFor="resumeFile"
            className={`flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition ${isUploading
                ? 'cursor-not-allowed border-outline bg-surface-variant opacity-70'
                : 'cursor-pointer border-outline bg-surface-variant hover:border-primary hover:bg-primary-container'
              }`}
          >
            <input
              id="resumeFile"
              name="resumeFile"
              type="file"
              accept={getAcceptedResumeFileInputValue()}
              disabled={isUploading}
              className="sr-only"
              onChange={(event) => {
                handleFileChange(event.target.files?.[0]);
                event.target.value = '';
              }}
            />

            <div className="flex size-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm">
              <UploadCloudIcon className="size-5" />
            </div>

            <p className="mt-4 max-w-full truncate text-sm font-medium text-on-surface">
              {selectedFile?.name || t('chooseFile')}
            </p>

            <p className="mt-1 text-xs text-on-surface-muted">
              {t('fileSizeHint', { size: maxFileSizeLabel })}
            </p>
          </label>
        </div>

        {shouldShowProgress ? (
          <div className="rounded-2xl border border-outline bg-surface-variant px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-on-surface-variant">
                {uploadProgressLabel}
              </p>

              <p className="text-sm font-semibold text-on-surface">
                {uploadProgress}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-outline">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="space-y-3 border-t border-outline pt-5">
          <p className="text-xs text-on-surface-muted">{t('footerNote')}</p>

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-disabled"
          >
            {isUploading ? t('submitting') : t('submit')}
          </button>
        </div>
      </form>
    </section>
  );
}
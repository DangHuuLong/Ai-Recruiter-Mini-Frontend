'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

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
      ? 'Processing uploaded file...'
      : uploadStep === 'success'
        ? 'Upload completed'
        : uploadStep === 'error'
          ? 'Upload failed'
          : 'Uploading file...';

  const handleFileChange = (file?: File) => {
    resetUploadProgress();

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!isAcceptedResumeFile(file)) {
      setSelectedFile(null);

      showToast.error('Invalid file format', {
        description: 'Please upload a PDF or DOCX resume file.',
      });

      return;
    }

    if (!isValidResumeFileSize(file)) {
      setSelectedFile(null);

      showToast.error('File is too large', {
        description: `Please upload a file smaller than ${maxFileSizeLabel}.`,
      });

      return;
    }

    setSelectedFile(file);

    showToast.info('CV file selected', {
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
      showToast.error('Invalid upload data', {
        description:
          validation.error.issues[0]?.message ??
          'Please check the candidate ID and CV file.',
      });

      return;
    }

    try {
      const createdResume = await uploadResume({
        candidateId: validation.data.candidateId,
        file: validation.data.file,
      });

      showToast.success('CV uploaded successfully', {
        description: `Resume status: ${createdResume.parseStatus}`,
      });

      setCandidateId('');
      setSelectedFile(null);
    } catch (error) {
      showToast.error('Failed to upload CV', {
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while uploading the resume. Please try again.',
      });
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-950">Upload CV</h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload a PDF or DOCX file and link it to an existing candidate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-2">
            <label
              htmlFor="candidateId"
              className="block text-sm font-medium text-slate-800"
            >
              Candidate ID
            </label>

            <input
              id="candidateId"
              name="candidateId"
              type="text"
              value={candidateId}
              onChange={(event) => setCandidateId(event.target.value)}
              placeholder="candidate_123"
              disabled={isUploading}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              This temporary field will be replaced by candidate detail upload
              later.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="resumeFile"
              className="block text-sm font-medium text-slate-800"
            >
              CV file
            </label>

            <label
              htmlFor="resumeFile"
              className={`flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition ${isUploading
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70'
                  : 'cursor-pointer border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50'
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

              <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <span className="text-lg font-semibold text-blue-600">↑</span>
              </div>

              <p className="mt-4 max-w-full truncate text-sm font-medium text-slate-900">
                {selectedFile?.name || 'Choose a CV file'}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PDF or DOCX files up to {maxFileSizeLabel} are supported.
              </p>
            </label>
          </div>
        </div>

        {shouldShowProgress ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-700">
                {uploadProgressLabel}
              </p>

              <p className="text-sm font-semibold text-slate-900">
                {uploadProgress}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            The uploaded file will be stored and prepared for resume parsing.
          </p>

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isUploading ? 'Uploading...' : 'Upload CV'}
          </button>
        </div>
      </form>
    </section>
  );
}
'use client';

import { useState } from 'react';

import { useUploadResume } from '@/features/resumes/hooks/use-upload-resume';
import type { Resume } from '@/features/resumes/types/resume.type';
import { resumeUploadSchema } from '@/features/resumes/validations/resume.validation';

export function ResumeUploadForm() {
  const [candidateId, setCandidateId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdResume, setCreatedResume] = useState<Resume | null>(null);

  const { isUploading, uploadResume } = useUploadResume();

  const handleUpload = async () => {
    setErrorMessage(null);
    setCreatedResume(null);

    const validation = resumeUploadSchema.safeParse({
      candidateId,
      file,
    });

    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message ?? 'Invalid upload data');
      return;
    }

    try {
      const resume = await uploadResume({
        candidateId: validation.data.candidateId,
        file: validation.data.file,
      });

      setCreatedResume(resume);
      setFile(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to upload resume',
      );
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleUpload();
      }}
      className="rounded-card border border-border-default bg-bg-card p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Upload CV</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Upload a PDF or DOCX file and link it to an existing candidate.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label
            htmlFor="candidateId"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            Candidate ID
          </label>
          <input
            id="candidateId"
            value={candidateId}
            onChange={(event) => setCandidateId(event.target.value)}
            placeholder="candidate_123"
            disabled={isUploading}
            className="w-full rounded-input border border-border-default bg-bg-card px-3 py-2 text-sm text-text-primary outline-none transition focus:border-border-focus"
          />
          <p className="mt-1 text-xs text-text-muted">
            This temporary field will be replaced by candidate detail upload later.
          </p>
        </div>

        <div>
          <label
            htmlFor="resumeFile"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            CV file
          </label>
          <input
            id="resumeFile"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={isUploading}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-input border border-border-default bg-bg-card px-3 py-2 text-sm text-text-primary file:mr-4 file:rounded-button file:border-0 file:bg-bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text-primary"
          />

          {file ? (
            <p className="mt-2 text-xs text-text-secondary">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="rounded-card border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        ) : null}

        {createdResume ? (
          <div className="rounded-card border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
            Resume created successfully. Status: {createdResume.parseStatus}
          </div>
        ) : null}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? 'Uploading...' : 'Upload CV'}
          </button>
        </div>
      </div>
    </form>
  );
}
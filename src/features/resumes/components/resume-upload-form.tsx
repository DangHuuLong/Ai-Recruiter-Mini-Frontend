'use client';

import { FormEvent, useState } from 'react';

import { showToast } from '@/components/feedback/toast';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxFileSizeLabel = formatFileSize(DEFAULT_MAX_FILE_SIZE);

  const handleFileChange = (file?: File) => {
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

    const normalizedCandidateId = candidateId.trim();

    if (!normalizedCandidateId) {
      showToast.error('Candidate ID is required', {
        description: 'Please enter the candidate ID before uploading a CV.',
      });

      return;
    }

    if (!selectedFile) {
      showToast.error('CV file is required', {
        description: 'Please choose a PDF or DOCX file to upload.',
      });

      return;
    }

    if (!isAcceptedResumeFile(selectedFile)) {
      showToast.error('Invalid file format', {
        description: 'Please upload a PDF or DOCX resume file.',
      });

      return;
    }

    if (!isValidResumeFileSize(selectedFile)) {
      showToast.error('File is too large', {
        description: `Please upload a file smaller than ${maxFileSizeLabel}.`,
      });

      return;
    }

    try {
      setIsSubmitting(true);

      /**
       * TODO:
       * Replace this mock delay with the real upload API later.
       */
      await new Promise((resolve) => setTimeout(resolve, 800));

      showToast.success('CV uploaded successfully', {
        description: `${selectedFile.name} has been linked to candidate ${normalizedCandidateId}.`,
      });

      setCandidateId('');
      setSelectedFile(null);
    } catch {
      showToast.error('Failed to upload CV', {
        description:
          'Something went wrong while uploading the resume. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              This temporary field will be replaced by candidate detail upload
              later.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-800">
              CV file
            </label>

            <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <input
                type="file"
                accept={getAcceptedResumeFileInputValue()}
                disabled={isSubmitting}
                className="sr-only"
                onChange={(event) => {
                  handleFileChange(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />

              <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <span className="text-lg font-semibold text-blue-600">↑</span>
              </div>

              <p className="mt-4 text-sm font-medium text-slate-900">
                {selectedFile?.name || 'Choose a CV file'}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PDF or DOCX files up to {maxFileSizeLabel} are supported.
              </p>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-500">
            The uploaded file will be stored and prepared for resume parsing.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? 'Uploading...' : 'Upload CV'}
          </button>
        </div>
      </form>
    </section>
  );
}
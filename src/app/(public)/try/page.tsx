'use client';

import { ArrowLeftIcon, FileTextIcon, PlusIcon, UploadIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { AnimatedGlowBackground } from '@/components/decorative/animated-glow-background';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { CvStructuredForm } from '@/features/public-batches/components/cv-structured-form';
import { JdStructuredForm } from '@/features/public-batches/components/jd-structured-form';
import {
  EMPTY_JD_STRUCTURED,
  EMPTY_RESUME_STRUCTURED,
  type JobDescriptionStructuredValues,
  type ResumeStructuredValues,
} from '@/features/public-batches/types/structured-input.type';
import { cn } from '@/lib/utils/cn';

const MAX_CVS = 2;
const MAX_JDS = 10;

type InputMode = 'upload' | 'paste' | 'structured';

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-lg px-3.5 py-2 text-sm font-semibold transition',
        active
          ? 'bg-primary-container text-on-primary-container'
          : 'text-on-surface-variant hover:bg-surface-variant',
      )}
    >
      {children}
    </button>
  );
}

export default function PublicBatchCreationPage() {
  const router = useRouter();
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  const [cvMode, setCvMode] = useState<InputMode>('upload');
  const [cvFiles, setCvFiles] = useState<string[]>([]);
  const [cvTexts, setCvTexts] = useState<string[]>(['']);
  const [cvStructured, setCvStructured] = useState<ResumeStructuredValues>(EMPTY_RESUME_STRUCTURED);

  const [jdMode, setJdMode] = useState<InputMode>('paste');
  const [jdFiles, setJdFiles] = useState<string[]>([]);
  const [jdTexts, setJdTexts] = useState<string[]>(['']);
  const [jdStructured, setJdStructured] = useState<JobDescriptionStructuredValues>(EMPTY_JD_STRUCTURED);

  const cvCount =
    cvMode === 'upload'
      ? cvFiles.length
      : cvMode === 'paste'
        ? cvTexts.filter((t) => t.trim()).length
        : cvStructured.personal.fullName.trim()
          ? 1
          : 0;

  const jdCount =
    jdMode === 'upload'
      ? jdFiles.length
      : jdMode === 'paste'
        ? jdTexts.filter((t) => t.trim()).length
        : jdStructured.title.trim()
          ? 1
          : 0;

  const isOverLimit = cvCount === 0 || jdCount === 0;

  const handleCvFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map((file) => file.name);
    setCvFiles((current) => [...current, ...names].slice(0, MAX_CVS));
    event.target.value = '';
  };

  const handleJdFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map((file) => file.name);
    setJdFiles((current) => [...current, ...names].slice(0, MAX_JDS));
    event.target.value = '';
  };

  const handleSubmit = () => {
    router.push('/try/preview');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <AnimatedGlowBackground />

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.ROOT}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface">Try AI Recruiter for free</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Add a few CVs and job descriptions to see instant AI match scores.
          </p>
        </div>

        <section className="rounded-2xl border border-outline bg-surface-lowest/95 p-6 shadow-card backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Add your CVs</h2>
            <span className="text-xs font-semibold text-on-surface-muted">
              {cvCount} / {MAX_CVS}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <TabButton active={cvMode === 'upload'} onClick={() => setCvMode('upload')}>
              Upload files
            </TabButton>
            <TabButton active={cvMode === 'paste'} onClick={() => setCvMode('paste')}>
              Paste text
            </TabButton>
            <TabButton active={cvMode === 'structured'} onClick={() => setCvMode('structured')}>
              Structured form
            </TabButton>
          </div>

          {cvMode === 'upload' ? (
            <div className="mt-4">
              <input
                ref={cvFileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleCvFilesSelected}
              />
              <button
                type="button"
                onClick={() => cvFileInputRef.current?.click()}
                disabled={cvFiles.length >= MAX_CVS}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline py-8 text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UploadIcon className="size-6" />
                <span className="text-sm font-semibold">Click to upload PDF or DOCX</span>
              </button>

              {cvFiles.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {cvFiles.map((name, index) => (
                    <li
                      key={`${name}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-outline bg-surface-variant px-3 py-2 text-sm text-on-surface"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <FileTextIcon className="size-4 shrink-0 text-on-surface-muted" />
                        {name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCvFiles((current) => current.filter((_, i) => i !== index))}
                        className="cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {cvMode === 'paste' ? (
            <div className="mt-4 space-y-3">
              {cvTexts.map((text, index) => (
                <div key={index} className="relative">
                  <textarea
                    value={text}
                    onChange={(event) =>
                      setCvTexts((current) =>
                        current.map((t, i) => (i === index ? event.target.value : t)),
                      )
                    }
                    rows={4}
                    placeholder="Paste resume text here..."
                    className="w-full rounded-lg border border-outline bg-surface-lowest p-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  />
                  {cvTexts.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCvTexts((current) => current.filter((_, i) => i !== index))}
                      className="absolute right-2 top-2 cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
                    >
                      <XIcon className="size-4" />
                    </button>
                  ) : null}
                </div>
              ))}
              {cvTexts.length < MAX_CVS ? (
                <button
                  type="button"
                  onClick={() => setCvTexts((current) => [...current, ''])}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container hover:underline"
                >
                  <PlusIcon className="size-4" />
                  Add another
                </button>
              ) : null}
            </div>
          ) : null}

          {cvMode === 'structured' ? (
            <CvStructuredForm value={cvStructured} onChange={setCvStructured} />
          ) : null}
        </section>

        <section className="mt-6 rounded-2xl border border-outline bg-surface-lowest/95 p-6 shadow-card backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Add job descriptions</h2>
            <span className="text-xs font-semibold text-on-surface-muted">
              {jdCount} / {MAX_JDS}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <TabButton active={jdMode === 'upload'} onClick={() => setJdMode('upload')}>
              Upload files
            </TabButton>
            <TabButton active={jdMode === 'paste'} onClick={() => setJdMode('paste')}>
              Paste text
            </TabButton>
            <TabButton active={jdMode === 'structured'} onClick={() => setJdMode('structured')}>
              Structured form
            </TabButton>
          </div>

          {jdMode === 'upload' ? (
            <div className="mt-4">
              <input
                ref={jdFileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleJdFilesSelected}
              />
              <button
                type="button"
                onClick={() => jdFileInputRef.current?.click()}
                disabled={jdFiles.length >= MAX_JDS}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline py-8 text-on-surface-variant transition-colors hover:border-primary hover:bg-primary-container/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UploadIcon className="size-6" />
                <span className="text-sm font-semibold">Click to upload PDF or DOCX</span>
              </button>

              {jdFiles.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {jdFiles.map((name, index) => (
                    <li
                      key={`${name}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-outline bg-surface-variant px-3 py-2 text-sm text-on-surface"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <FileTextIcon className="size-4 shrink-0 text-on-surface-muted" />
                        {name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setJdFiles((current) => current.filter((_, i) => i !== index))}
                        className="cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {jdMode === 'paste' ? (
            <div className="mt-4 space-y-3">
              {jdTexts.map((text, index) => (
                <div key={index} className="relative">
                  <textarea
                    value={text}
                    onChange={(event) =>
                      setJdTexts((current) =>
                        current.map((t, i) => (i === index ? event.target.value : t)),
                      )
                    }
                    rows={4}
                    placeholder="Paste job description text here..."
                    className="w-full rounded-lg border border-outline bg-surface-lowest p-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-muted focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
                  />
                  {jdTexts.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setJdTexts((current) => current.filter((_, i) => i !== index))}
                      className="absolute right-2 top-2 cursor-pointer rounded-full p-1 text-on-surface-muted transition-colors hover:bg-error-container hover:text-error"
                    >
                      <XIcon className="size-4" />
                    </button>
                  ) : null}
                </div>
              ))}
              {jdTexts.length < MAX_JDS ? (
                <button
                  type="button"
                  onClick={() => setJdTexts((current) => [...current, ''])}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-container hover:text-on-primary-container hover:underline"
                >
                  <PlusIcon className="size-4" />
                  Add another
                </button>
              ) : null}
            </div>
          ) : null}

          {jdMode === 'structured' ? (
            <JdStructuredForm value={jdStructured} onChange={setJdStructured} />
          ) : null}
        </section>

        <Button className="mt-6" disabled={isOverLimit} onClick={handleSubmit}>
          See my results
        </Button>
      </div>
    </div>
  );
}

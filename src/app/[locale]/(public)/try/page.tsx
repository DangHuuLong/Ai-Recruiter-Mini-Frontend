'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { BatchInputTabs, type InputMode } from '@/components/batch-input/batch-input-tabs';
import { CvStructuredForm } from '@/components/batch-input/cv-structured-form';
import { JdStructuredForm } from '@/components/batch-input/jd-structured-form';
import { MultiStructuredForm } from '@/components/batch-input/multi-structured-form';
import {
  EMPTY_JD_STRUCTURED,
  EMPTY_RESUME_STRUCTURED,
  type JobDescriptionStructuredValues,
  type ResumeStructuredValues,
} from '@/components/batch-input/structured-input.type';
import { AnimatedGlowBackground } from '@/components/decorative/animated-glow-background';
import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { getPublicUploadUrls, createPublicBatch } from '@/features/public-batches/api/public-batch.api';
import type { CreatePublicBatchPayload } from '@/features/public-batches/types/public-batch.type';
import { uploadFilesForBatch } from '@/features/batch-scoring/utils/batch-file-upload.util';
import {
  toJobDescriptionStructuredInput,
  toResumeStructuredInput,
} from '@/features/batch-scoring/utils/structured-input-mapper.util';

const MAX_CVS = 2;
const MAX_JDS = 10;

export default function PublicBatchCreationPage() {
  const t = useTranslations('publicTry');
  const router = useRouter();

  const [cvMode, setCvMode] = useState<InputMode>('upload');
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [cvTexts, setCvTexts] = useState<string[]>(['']);
  const [cvStructuredList, setCvStructuredList] = useState<ResumeStructuredValues[]>([
    EMPTY_RESUME_STRUCTURED,
  ]);

  const [jdMode, setJdMode] = useState<InputMode>('paste');
  const [jdFiles, setJdFiles] = useState<File[]>([]);
  const [jdTexts, setJdTexts] = useState<string[]>(['']);
  const [jdStructuredList, setJdStructuredList] = useState<JobDescriptionStructuredValues[]>([
    EMPTY_JD_STRUCTURED,
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState('');

  const cvCount =
    cvMode === 'upload'
      ? cvFiles.length
      : cvMode === 'paste'
        ? cvTexts.filter((t) => t.trim()).length
        : cvStructuredList.filter((entry) => entry.personal.fullName.trim()).length;

  const jdCount =
    jdMode === 'upload'
      ? jdFiles.length
      : jdMode === 'paste'
        ? jdTexts.filter((t) => t.trim()).length
        : jdStructuredList.filter((entry) => entry.title.trim()).length;

  const isOverLimit = cvCount === 0 || jdCount === 0;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const payload: CreatePublicBatchPayload = {};

      if (cvMode === 'upload') {
        setSubmitStage(t('uploadingResumes'));
        payload.resumeFiles = await uploadFilesForBatch(cvFiles, 'RESUME', getPublicUploadUrls);
      } else if (cvMode === 'paste') {
        payload.resumeTexts = cvTexts.filter((text) => text.trim()).map((rawText) => ({ rawText }));
      } else {
        payload.resumeStructured = cvStructuredList
          .filter((entry) => entry.personal.fullName.trim())
          .map(toResumeStructuredInput);
      }

      if (jdMode === 'upload') {
        setSubmitStage(t('uploadingJds'));
        payload.jobDescriptionFiles = await uploadFilesForBatch(jdFiles, 'JOB_DESCRIPTION', getPublicUploadUrls);
      } else if (jdMode === 'paste') {
        payload.jobDescriptions = jdTexts.filter((text) => text.trim()).map((rawText) => ({ rawText }));
      } else {
        payload.jobDescriptionStructured = jdStructuredList
          .filter((entry) => entry.title.trim())
          .map(toJobDescriptionStructuredInput);
      }

      setSubmitStage(t('starting'));
      const result = await createPublicBatch(payload);
      router.push(`/try/${result.batchId}`);
    } catch (error) {
      showToast.error(t('errorTitle'), {
        description: error instanceof Error ? error.message : t('errorFallback'),
      });
      setIsSubmitting(false);
      setSubmitStage('');
    }
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
          {t('back')}
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="mt-2 text-sm text-on-surface-variant">{t('subtitle')}</p>
        </div>

        <BatchInputTabs
          title={t('addCvs')}
          maxCount={MAX_CVS}
          count={cvCount}
          mode={cvMode}
          onModeChange={setCvMode}
          files={cvFiles}
          onFilesChange={setCvFiles}
          texts={cvTexts}
          onTextsChange={setCvTexts}
          pastePlaceholder={t('pasteResumePlaceholder')}
          structuredForm={
            <MultiStructuredForm
              entryLabel={t('candidateEntry')}
              items={cvStructuredList}
              emptyItem={EMPTY_RESUME_STRUCTURED}
              maxCount={MAX_CVS}
              onChange={setCvStructuredList}
              renderForm={(value, onChange) => (
                <CvStructuredForm value={value} onChange={onChange} />
              )}
            />
          }
        />

        <div className="mt-6">
          <BatchInputTabs
            title={t('addJds')}
            maxCount={MAX_JDS}
            count={jdCount}
            mode={jdMode}
            onModeChange={setJdMode}
            files={jdFiles}
            onFilesChange={setJdFiles}
            texts={jdTexts}
            onTextsChange={setJdTexts}
            pastePlaceholder={t('pasteJdPlaceholder')}
            structuredForm={
              <MultiStructuredForm
                entryLabel={t('jobDescriptionEntry')}
                items={jdStructuredList}
                emptyItem={EMPTY_JD_STRUCTURED}
                maxCount={MAX_JDS}
                onChange={setJdStructuredList}
                renderForm={(value, onChange) => (
                  <JdStructuredForm value={value} onChange={onChange} />
                )}
              />
            }
          />
        </div>

        <Button
          className="mt-6"
          disabled={isOverLimit}
          isLoading={isSubmitting}
          onClick={() => void handleSubmit()}
        >
          {isSubmitting ? submitStage || t('starting') : t('submit')}
        </Button>
      </div>
    </div>
  );
}

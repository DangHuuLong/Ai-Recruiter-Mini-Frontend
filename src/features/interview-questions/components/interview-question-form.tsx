'use client';

import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { LoadingState, showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes.config';
import { TagListInput } from '@/features/interview-questions/components/tag-list-input';
import {
  createInterviewQuestion,
  getInterviewQuestionById,
  updateInterviewQuestion,
} from '@/features/interview-questions/api/interview-question.api';
import {
  ASSESSMENT_TARGET_LABEL_KEYS,
  AUTONOMY_LEVEL_LABEL_KEYS,
  COMPETENCY_TYPE_LABEL_KEYS,
  EXPERIENCE_BUCKET_LABEL_KEYS,
  QUALITY_GATE_LABEL_KEYS,
  QUESTION_TYPE_LABEL_KEYS,
  type AssessmentTarget,
  type AutonomyLevel,
  type CompetencyType,
  type ExperienceBucket,
  type InterviewQuestionType,
  type QuestionQualityGateStatus,
} from '@/features/interview-questions/types/interview-question.type';
import {
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABEL_KEYS,
  type OccupationFamily,
} from '@/features/interview-questions/types/interview-question-taxonomy.type';
import { ApiError } from '@/lib/api/api-error';

const OCCUPATION_FAMILIES = Object.keys(OCCUPATION_FAMILY_LABEL_KEYS) as OccupationFamily[];
const COMPETENCY_TYPES = Object.keys(COMPETENCY_TYPE_LABEL_KEYS) as CompetencyType[];
const ASSESSMENT_TARGETS = Object.keys(ASSESSMENT_TARGET_LABEL_KEYS) as AssessmentTarget[];
const QUESTION_TYPES = Object.keys(QUESTION_TYPE_LABEL_KEYS) as InterviewQuestionType[];
const EXPERIENCE_BUCKETS = Object.keys(EXPERIENCE_BUCKET_LABEL_KEYS) as ExperienceBucket[];
const AUTONOMY_LEVELS = Object.keys(AUTONOMY_LEVEL_LABEL_KEYS) as AutonomyLevel[];
const QUALITY_GATE_STATUSES = Object.keys(QUALITY_GATE_LABEL_KEYS) as QuestionQualityGateStatus[];

type InterviewQuestionFormProps = {
  questionId?: string;
};

export function InterviewQuestionForm({ questionId }: InterviewQuestionFormProps) {
  const router = useRouter();
  const t = useTranslations('interviewQuestions');

  const [isLoadingExisting, setIsLoadingExisting] = useState(Boolean(questionId));
  const [loadError, setLoadError] = useState<string | null>(null);

  const [questionText, setQuestionText] = useState('');
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [enablers, setEnablers] = useState<string[]>([]);
  const [businessContext, setBusinessContext] = useState('');
  const [competency, setCompetency] = useState('');
  const [competencyType, setCompetencyType] = useState<CompetencyType | ''>('');
  const [assessmentTarget, setAssessmentTarget] = useState<AssessmentTarget | ''>('');
  const [experienceBucket, setExperienceBucket] = useState<ExperienceBucket | ''>('');
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel | ''>('');
  const [questionType, setQuestionType] = useState<InterviewQuestionType | ''>('');
  const [rubric, setRubric] = useState<string[]>([]);
  const [qualityGateStatus, setQualityGateStatus] = useState<QuestionQualityGateStatus>('PENDING_REVIEW');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!questionId) return;

    getInterviewQuestionById(questionId)
      .then((question) => {
        setQuestionText(question.questionText);
        setOccupationFamily(question.occupationFamily);
        setSpecialization(question.specialization);
        setEnablers(question.enablers);
        setBusinessContext(question.businessContext);
        setCompetency(question.competency);
        setCompetencyType(question.competencyType);
        setAssessmentTarget(question.assessmentTarget);
        setExperienceBucket(question.experienceBucket);
        setAutonomyLevel(question.autonomyLevel);
        setQuestionType(question.questionType);
        setRubric(question.rubric);
        setQualityGateStatus(question.qualityGateStatus);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : t('form.loadErrorFallback'));
      })
      .finally(() => setIsLoadingExisting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const specializationOptions = getSpecializationsFor(occupationFamily);

  const isValid = useMemo(() => {
    return (
      questionText.trim().length > 0 &&
      questionText.length <= 2000 &&
      occupationFamily !== '' &&
      specialization.trim().length > 0 &&
      businessContext.trim().length > 0 &&
      competency.trim().length > 0 &&
      competencyType !== '' &&
      assessmentTarget !== '' &&
      experienceBucket !== '' &&
      autonomyLevel !== '' &&
      questionType !== '' &&
      rubric.length > 0
    );
  }, [
    questionText,
    occupationFamily,
    specialization,
    businessContext,
    competency,
    competencyType,
    assessmentTarget,
    experienceBucket,
    autonomyLevel,
    questionType,
    rubric,
  ]);

  const handleSubmit = async () => {
    if (!isValid || !occupationFamily || !competencyType || !assessmentTarget || !experienceBucket || !autonomyLevel || !questionType) {
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        questionText: questionText.trim(),
        occupationFamily,
        specialization: specialization.trim(),
        enablers,
        businessContext: businessContext.trim(),
        competency: competency.trim(),
        competencyType,
        assessmentTarget,
        experienceBucket,
        autonomyLevel,
        questionType,
        rubric,
        qualityGateStatus,
      };

      if (questionId) {
        await updateInterviewQuestion(questionId, payload);
      } else {
        await createInterviewQuestion(payload);
      }

      showToast.success(questionId ? t('form.toast.updateSuccess') : t('form.toast.createSuccess'));
      router.push(ROUTES.INTERVIEW_QUESTIONS);
    } catch (error) {
      showToast.error(questionId ? t('form.toast.updateFailedTitle') : t('form.toast.createFailedTitle'), {
        description: error instanceof ApiError ? error.message : t('form.toast.saveFailedFallback'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingExisting) {
    return <LoadingState title={t('form.loadingTitle')} description={t('form.loadingDescription')} />;
  }

  if (loadError) {
    return (
      <div className="max-w-3xl space-y-4">
        <Link
          href={ROUTES.INTERVIEW_QUESTIONS}
          className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
        >
          {t('backToBank')}
        </Link>
        <p className="rounded-xl border border-error bg-error-container p-4 text-sm text-error">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href={ROUTES.INTERVIEW_QUESTIONS}
        className="inline-flex cursor-pointer text-sm font-semibold text-primary transition hover:underline"
      >
        {t('backToBank')}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-on-surface">
          {questionId ? t('form.titleEdit') : t('form.titleNew')}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">{t('form.subtitle')}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {t('form.questionTextLabel')}
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            placeholder={t('form.questionTextPlaceholder')}
          />
          <p className="mt-1.5 text-right text-xs text-on-surface-muted">
            {t('form.charCount', { count: questionText.length, max: 2000 })}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('fields.occupationFamilyLabel')}
            </label>
            <select
              value={occupationFamily}
              onChange={(e) => {
                setOccupationFamily(e.target.value as OccupationFamily | '');
                setSpecialization('');
              }}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">{t('fields.selectFamily')}</option>
              {OCCUPATION_FAMILIES.map((family) => (
                <option key={family} value={family}>
                  {t(`labels.occupationFamily.${OCCUPATION_FAMILY_LABEL_KEYS[family]}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('fields.specializationLabel')}
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              disabled={!occupationFamily}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
            >
              <option value="">{t('fields.selectSpecialization')}</option>
              {specializationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TagListInput
          label={t('form.enablersLabel')}
          hint={t('form.enablersHint')}
          placeholder={t('tagListInput.defaultPlaceholder')}
          values={enablers}
          onChange={setEnablers}
        />

        <Input
          label={t('form.businessContextLabel')}
          value={businessContext}
          onChange={(e) => setBusinessContext(e.target.value)}
          placeholder={t('form.businessContextPlaceholder')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('form.competencyLabel')}
            value={competency}
            onChange={(e) => setCompetency(e.target.value)}
            placeholder={t('form.competencyPlaceholder')}
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('form.competencyTypeLabel')}
            </label>
            <select
              value={competencyType}
              onChange={(e) => setCompetencyType(e.target.value as CompetencyType | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">{t('form.selectType')}</option>
              {COMPETENCY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`labels.competencyType.${COMPETENCY_TYPE_LABEL_KEYS[type]}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('form.assessmentTargetLabel')}
            </label>
            <select
              value={assessmentTarget}
              onChange={(e) => setAssessmentTarget(e.target.value as AssessmentTarget | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">{t('form.selectTarget')}</option>
              {ASSESSMENT_TARGETS.map((target) => (
                <option key={target} value={target}>
                  {t(`labels.assessmentTarget.${ASSESSMENT_TARGET_LABEL_KEYS[target]}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('form.questionTypeLabel')}
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as InterviewQuestionType | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">{t('form.selectType')}</option>
              {QUESTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`labels.questionType.${QUESTION_TYPE_LABEL_KEYS[type]}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('form.experienceBucketLabel')}
            </label>
            <select
              value={experienceBucket}
              onChange={(e) => setExperienceBucket(e.target.value as ExperienceBucket | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">{t('form.selectRange')}</option>
              {EXPERIENCE_BUCKETS.map((bucket) => (
                <option key={bucket} value={bucket}>
                  {t(`labels.experienceBucket.${EXPERIENCE_BUCKET_LABEL_KEYS[bucket]}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {t('form.autonomyLevelLabel')}
            </label>
            <select
              value={autonomyLevel}
              onChange={(e) => setAutonomyLevel(e.target.value as AutonomyLevel | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">{t('form.selectLevel')}</option>
              {AUTONOMY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {t(`labels.autonomyLevel.${AUTONOMY_LEVEL_LABEL_KEYS[level]}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TagListInput
          label={t('form.rubricLabel')}
          hint={t('form.rubricHint')}
          placeholder={t('tagListInput.defaultPlaceholder')}
          values={rubric}
          onChange={setRubric}
        />

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {t('form.qualityGateStatusLabel')}
          </label>
          <select
            value={qualityGateStatus}
            onChange={(e) => setQualityGateStatus(e.target.value as QuestionQualityGateStatus)}
            className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          >
            {QUALITY_GATE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`labels.qualityGate.${QUALITY_GATE_LABEL_KEYS[status]}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          className="w-auto px-4"
          onClick={() => router.push(ROUTES.INTERVIEW_QUESTIONS)}
        >
          {t('form.cancel')}
        </Button>
        <Button
          type="button"
          className="w-auto px-4"
          disabled={!isValid}
          isLoading={isSubmitting}
          onClick={() => void handleSubmit()}
        >
          {questionId ? t('form.saveChanges') : t('form.createQuestion')}
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { showToast } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes.config';
import { TagListInput } from '@/features/interview-questions/components/tag-list-input';
import {
  ASSESSMENT_TARGET_LABELS,
  AUTONOMY_LEVEL_LABELS,
  COMPETENCY_TYPE_LABELS,
  EXPERIENCE_BUCKET_LABELS,
  getMockInterviewQuestion,
  QUALITY_GATE_LABELS,
  QUESTION_TYPE_LABELS,
  type AssessmentTarget,
  type AutonomyLevel,
  type CompetencyType,
  type ExperienceBucket,
  type InterviewQuestionType,
  type QuestionQualityGateStatus,
} from '@/features/interview-questions/mock/interview-question-mock-data';
import {
  getSpecializationsFor,
  OCCUPATION_FAMILY_LABELS,
  type OccupationFamily,
} from '@/features/interview-questions/mock/interview-question-taxonomy';

type InterviewQuestionFormProps = {
  questionId?: string;
};

export function InterviewQuestionForm({ questionId }: InterviewQuestionFormProps) {
  const router = useRouter();
  const existing = questionId ? getMockInterviewQuestion(questionId) : null;

  const [questionText, setQuestionText] = useState(existing?.questionText ?? '');
  const [occupationFamily, setOccupationFamily] = useState<OccupationFamily | ''>(
    existing?.occupationFamily ?? '',
  );
  const [specialization, setSpecialization] = useState(existing?.specialization ?? '');
  const [enablers, setEnablers] = useState<string[]>(existing?.enablers ?? []);
  const [businessContext, setBusinessContext] = useState(existing?.businessContext ?? '');
  const [competency, setCompetency] = useState(existing?.competency ?? '');
  const [competencyType, setCompetencyType] = useState<CompetencyType | ''>(
    existing?.competencyType ?? '',
  );
  const [assessmentTarget, setAssessmentTarget] = useState<AssessmentTarget | ''>(
    existing?.assessmentTarget ?? '',
  );
  const [experienceBucket, setExperienceBucket] = useState<ExperienceBucket | ''>(
    existing?.experienceBucket ?? '',
  );
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel | ''>(existing?.autonomyLevel ?? '');
  const [questionType, setQuestionType] = useState<InterviewQuestionType | ''>(
    existing?.questionType ?? '',
  );
  const [rubric, setRubric] = useState<string[]>(existing?.rubric ?? []);
  const [qualityGateStatus, setQualityGateStatus] = useState<QuestionQualityGateStatus>(
    existing?.qualityGateStatus ?? 'PENDING_REVIEW',
  );

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

  const handleSubmit = () => {
    if (!isValid) return;
    showToast.success(existing ? 'Question updated' : 'Question created');
    router.push(ROUTES.INTERVIEW_QUESTIONS);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">
          {existing ? 'Edit question' : 'New interview question'}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Curated content used by the retrieval/search-or-generate engine (DEV role only).
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-outline bg-surface-lowest p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Question text
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full rounded-lg border border-outline bg-surface-lowest px-3 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            placeholder="Walk me through how you would..."
          />
          <p className="mt-1.5 text-right text-xs text-on-surface-muted">{questionText.length} / 2000</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Occupation family
            </label>
            <select
              value={occupationFamily}
              onChange={(e) => {
                setOccupationFamily(e.target.value as OccupationFamily | '');
                setSpecialization('');
              }}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">Select a family</option>
              {(Object.keys(OCCUPATION_FAMILY_LABELS) as OccupationFamily[]).map((family) => (
                <option key={family} value={family}>
                  {OCCUPATION_FAMILY_LABELS[family]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              disabled={!occupationFamily}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-surface-variant disabled:text-disabled"
            >
              <option value="">Select a specialization</option>
              {specializationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TagListInput
          label="Enablers"
          hint="Tools, methodologies, or frameworks — e.g. Docker, SPIN Selling"
          values={enablers}
          onChange={setEnablers}
        />

        <Input
          label="Business context"
          value={businessContext}
          onChange={(e) => setBusinessContext(e.target.value)}
          placeholder="e.g. E-commerce, Enterprise Deal Closing"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Competency"
            value={competency}
            onChange={(e) => setCompetency(e.target.value)}
            placeholder="e.g. Caching Strategies"
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Competency type
            </label>
            <select
              value={competencyType}
              onChange={(e) => setCompetencyType(e.target.value as CompetencyType | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">Select a type</option>
              {(Object.keys(COMPETENCY_TYPE_LABELS) as CompetencyType[]).map((type) => (
                <option key={type} value={type}>
                  {COMPETENCY_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Assessment target
            </label>
            <select
              value={assessmentTarget}
              onChange={(e) => setAssessmentTarget(e.target.value as AssessmentTarget | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">Select a target</option>
              {(Object.keys(ASSESSMENT_TARGET_LABELS) as AssessmentTarget[]).map((target) => (
                <option key={target} value={target}>
                  {ASSESSMENT_TARGET_LABELS[target]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Question type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as InterviewQuestionType | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">Select a type</option>
              {(Object.keys(QUESTION_TYPE_LABELS) as InterviewQuestionType[]).map((type) => (
                <option key={type} value={type}>
                  {QUESTION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Experience bucket
            </label>
            <select
              value={experienceBucket}
              onChange={(e) => setExperienceBucket(e.target.value as ExperienceBucket | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">Select a range</option>
              {(Object.keys(EXPERIENCE_BUCKET_LABELS) as ExperienceBucket[]).map((bucket) => (
                <option key={bucket} value={bucket}>
                  {EXPERIENCE_BUCKET_LABELS[bucket]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Autonomy level
            </label>
            <select
              value={autonomyLevel}
              onChange={(e) => setAutonomyLevel(e.target.value as AutonomyLevel | '')}
              className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
            >
              <option value="">Select a level</option>
              {(Object.keys(AUTONOMY_LEVEL_LABELS) as AutonomyLevel[]).map((level) => (
                <option key={level} value={level}>
                  {AUTONOMY_LEVEL_LABELS[level]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TagListInput
          label="Rubric"
          hint="Key points a good answer should cover (not a fixed model answer)"
          values={rubric}
          onChange={setRubric}
        />

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Quality gate status
          </label>
          <select
            value={qualityGateStatus}
            onChange={(e) => setQualityGateStatus(e.target.value as QuestionQualityGateStatus)}
            className="h-11 w-full cursor-pointer rounded-lg border border-outline bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-focus-ring/30"
          >
            {(Object.keys(QUALITY_GATE_LABELS) as QuestionQualityGateStatus[]).map((status) => (
              <option key={status} value={status}>
                {QUALITY_GATE_LABELS[status]}
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
          Cancel
        </Button>
        <Button type="button" className="w-auto px-4" disabled={!isValid} onClick={handleSubmit}>
          {existing ? 'Save changes' : 'Create question'}
        </Button>
      </div>
    </div>
  );
}

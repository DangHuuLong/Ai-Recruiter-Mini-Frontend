import { FileTextIcon, ShieldCheckIcon, SparklesIcon, UploadIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { AnimatedGlowBackground } from '@/components/decorative/animated-glow-background';
import { ROUTES } from '@/config/routes.config';

const STEPS = [
  {
    icon: UploadIcon,
    title: 'Upload your CVs',
    description: 'Drop in a couple of resumes as files or plain text.',
  },
  {
    icon: FileTextIcon,
    title: 'Add job descriptions',
    description: 'Paste in the roles you want to match candidates against.',
  },
  {
    icon: SparklesIcon,
    title: 'See AI match scores instantly',
    description: 'Get a full CV × JD scoring matrix in seconds.',
  },
];

export default function PublicLandingPage() {
  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col justify-between overflow-hidden">
      <AnimatedGlowBackground />

      <section className="relative mx-auto w-full max-w-5xl px-4 pt-10 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
          Instantly match CVs to job descriptions with AI
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg">
          Upload a few resumes and job descriptions and see AI-powered match scores in
          seconds — no account required.
        </p>
        <Link
          href={ROUTES.PUBLIC_TRY}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          Try it free — no signup required
        </Link>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-outline bg-surface-lowest/90 p-5 shadow-card backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                  <step.icon className="size-4.5" />
                </span>
                <span className="text-xs font-bold text-on-surface-muted">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-on-surface">{step.title}</h3>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative border-t border-outline bg-surface-variant/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 py-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-on-surface">
            <ShieldCheckIcon className="size-4.5 text-success" />
            Your files are never stored
          </div>
          <p className="text-xs text-on-surface-variant">
            Free trials are limited to 2 CVs and 10 job descriptions per try.
          </p>
        </div>
      </section>
    </div>
  );
}

import { SparklesIcon } from 'lucide-react';

type AuthBrandPanelProps = {
  eyebrow: string;
  headline: string;
  description: string;
};

export function AuthBrandPanel({ eyebrow, headline, description }: AuthBrandPanelProps) {
  return (
    <section className="hidden flex-1 flex-col justify-between bg-[#0F172A] px-12 py-10 text-white lg:flex">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-on-primary">
          <SparklesIcon className="size-5" />
        </span>
        <span className="text-lg font-bold">AI Recruiter</span>
      </div>

      <div className="max-w-xl space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-hover">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-bold leading-tight">{headline}</h1>
        <p className="text-base leading-7 text-slate-300">{description}</p>
      </div>

      <p className="text-xs text-slate-400">
        © {new Date().getFullYear()} AI Recruiter. All rights reserved.
      </p>
    </section>
  );
}

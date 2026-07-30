import Image from 'next/image';
import Link from 'next/link';

import { ROUTES } from '@/config/routes.config';

type AuthBrandPanelProps = {
  eyebrow: string;
  headline: string;
  description: string;
  backgroundImageSrc: string;
};

export function AuthBrandPanel({
  eyebrow,
  headline,
  description,
  backgroundImageSrc,
}: AuthBrandPanelProps) {
  return (
    <section className="relative hidden h-full flex-1 flex-col justify-between overflow-hidden bg-[#0F172A] px-12 py-10 text-white lg:flex">
      <Image
        src={backgroundImageSrc}
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 0vw"
        className="object-cover"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/75 to-[#0F172A]/35" />

      <Link href={ROUTES.ROOT} className="relative z-10 flex w-fit items-center gap-3">
        <span className="relative flex size-16 shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
          <Image src="/images/logo.svg" alt="AI Recruiter logo" fill className="object-contain p-1.5" />
        </span>
        <span className="text-lg font-bold">AI Recruiter</span>
      </Link>

      <div className="relative z-10 max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-hover">
          {eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight">{headline}</h1>
        <p className="mt-5 text-base leading-7 text-slate-300">{description}</p>
      </div>

      <p className="relative z-10 text-xs text-slate-400">
        © {new Date().getFullYear()} AI Recruiter. Cognitive Talent System.
      </p>
    </section>
  );
}

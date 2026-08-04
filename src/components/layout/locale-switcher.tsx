'use client';

import { useLocale } from 'next-intl';
import { GlobeIcon } from 'lucide-react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  vi: 'Tiếng Việt',
  en: 'English',
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface">
      <GlobeIcon className="size-4 shrink-0" />
      <select
        aria-label="Language"
        value={locale}
        onChange={(event) => router.replace(pathname, { locale: event.target.value })}
        className="cursor-pointer appearance-none bg-transparent py-2 pr-1 text-sm font-medium outline-none"
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}

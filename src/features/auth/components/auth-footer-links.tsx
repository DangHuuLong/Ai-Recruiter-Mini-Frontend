import { useTranslations } from 'next-intl';

export function AuthFooterLinks() {
  const t = useTranslations('auth.footer');

  return (
    <div className="mt-8 flex flex-col items-center gap-2 text-xs text-on-surface-muted">
      <p>{t('copyright', { year: new Date().getFullYear() })}</p>
      <div className="flex items-center gap-3">
        <a href="#" className="hover:text-on-surface-variant">
          {t('privacy')}
        </a>
        <span aria-hidden>·</span>
        <a href="#" className="hover:text-on-surface-variant">
          {t('terms')}
        </a>
        <span aria-hidden>·</span>
        <a href="#" className="hover:text-on-surface-variant">
          {t('help')}
        </a>
      </div>
    </div>
  );
}

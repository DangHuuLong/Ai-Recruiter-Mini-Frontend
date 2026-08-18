import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

// Shared helper for component tests that render anything using next-intl's useTranslations —
// wraps with a real NextIntlClientProvider instead of mocking the hook, so translation-key
// typos/mismatches would actually surface as missing text in the rendered output.
export function renderWithIntl(
  ui: ReactElement,
  messages: Record<string, unknown>,
  options?: RenderOptions,
) {
  const result = render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
    options,
  );

  return {
    ...result,
    // Overrides RTL's rerender so callers can pass the bare component again — re-wrapping
    // in the provider here, since a raw rerender(ui) would otherwise drop the i18n context
    // and any useTranslations() call in the new tree would throw.
    rerender: (nextUi: ReactElement) =>
      result.rerender(
        <NextIntlClientProvider locale="en" messages={messages}>
          {nextUi}
        </NextIntlClientProvider>,
      ),
  };
}

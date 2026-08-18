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
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
    options,
  );
}

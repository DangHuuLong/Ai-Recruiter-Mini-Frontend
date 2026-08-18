import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithIntl } from '@/test/render-with-intl';

import { BulkActionBar } from './bulk-action-bar';

const MESSAGES = {
  common: {
    bulkActionBar: {
      selected: '{count, plural, one {# item selected} other {# items selected}}',
      clear: 'Clear',
    },
  },
};

describe('BulkActionBar', () => {
  it('renders nothing when count is 0', () => {
    const { container } = renderWithIntl(
      <BulkActionBar count={0} onClear={vi.fn()}>
        <button type="button">Delete selected</button>
      </BulkActionBar>,
      MESSAGES,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the singular count label for exactly 1 selected', () => {
    renderWithIntl(
      <BulkActionBar count={1} onClear={vi.fn()}>
        <button type="button">Delete selected</button>
      </BulkActionBar>,
      MESSAGES,
    );

    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('shows the plural count label for more than 1 selected', () => {
    renderWithIntl(
      <BulkActionBar count={5} onClear={vi.fn()}>
        <button type="button">Delete selected</button>
      </BulkActionBar>,
      MESSAGES,
    );

    expect(screen.getByText('5 items selected')).toBeInTheDocument();
  });

  it('renders the children action buttons', () => {
    renderWithIntl(
      <BulkActionBar count={2} onClear={vi.fn()}>
        <button type="button">Delete selected</button>
      </BulkActionBar>,
      MESSAGES,
    );

    expect(screen.getByRole('button', { name: 'Delete selected' })).toBeInTheDocument();
  });

  it('fires onClear when the Clear button is clicked', () => {
    const onClear = vi.fn();
    renderWithIntl(
      <BulkActionBar count={3} onClear={onClear}>
        <button type="button">Delete selected</button>
      </BulkActionBar>,
      MESSAGES,
    );

    fireEvent.click(screen.getByRole('button', { name: /Clear/ }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

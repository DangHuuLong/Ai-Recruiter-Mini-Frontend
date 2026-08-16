import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithIntl } from '@/test/render-with-intl';

import { EmptyState } from './empty-state';

const MESSAGES = {
  common: {
    emptyState: { title: 'No data', description: "There's nothing to show here yet." },
  },
};

describe('EmptyState', () => {
  it('uses the translated defaults when title/description are not given', () => {
    renderWithIntl(<EmptyState />, MESSAGES);

    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText("There's nothing to show here yet.")).toBeInTheDocument();
  });

  it('uses custom title/description when given', () => {
    renderWithIntl(<EmptyState title="No candidates found" description="Try adjusting your search." />, MESSAGES);

    expect(screen.getByText('No candidates found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search.')).toBeInTheDocument();
  });

  it('renders the action node when given', () => {
    renderWithIntl(<EmptyState action={<button type="button">Create candidate</button>} />, MESSAGES);

    expect(screen.getByRole('button', { name: 'Create candidate' })).toBeInTheDocument();
  });

  it('renders no description paragraph when an explicit empty string is given (does not fall back)', () => {
    renderWithIntl(<EmptyState description="" />, MESSAGES);

    expect(screen.queryByText("There's nothing to show here yet.")).not.toBeInTheDocument();
  });
});

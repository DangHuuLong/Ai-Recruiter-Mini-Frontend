import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithIntl } from '@/test/render-with-intl';

import { ListControls } from './list-controls';

const MESSAGES = {
  common: {
    listControls: {
      searchLabel: 'Search',
      searchPlaceholder: 'Search...',
      previous: 'Previous',
      next: 'Next',
      pageInfo: 'Page <b>{page}</b> of <b>{totalPages}</b> · <b>{total}</b> total',
    },
  },
};

describe('ListControls', () => {
  it('renders nothing extra when neither search nor pagination is given', () => {
    renderWithIntl(<ListControls />, MESSAGES);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls search.onChange as the user types', () => {
    const onChange = vi.fn();
    renderWithIntl(
      <ListControls search={{ value: '', placeholder: 'Search candidates...', onChange }} />,
      MESSAGES,
    );

    fireEvent.change(screen.getByPlaceholderText('Search candidates...'), { target: { value: 'jane' } });

    expect(onChange).toHaveBeenCalledWith('jane');
  });

  it('disables Previous on the first page and Next on the last page', () => {
    renderWithIntl(
      <ListControls pagination={{ page: 1, totalPages: 1, total: 3, limit: 10, onPageChange: vi.fn() }} />,
      MESSAGES,
    );

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('enables Previous/Next and calls onPageChange with the adjacent page', () => {
    const onPageChange = vi.fn();
    renderWithIntl(
      <ListControls pagination={{ page: 2, totalPages: 5, total: 50, limit: 10, onPageChange }} />,
      MESSAGES,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it('does not go below page 1 or above totalPages', () => {
    const onPageChange = vi.fn();
    const { rerender } = renderWithIntl(
      <ListControls pagination={{ page: 1, totalPages: 3, total: 30, limit: 10, onPageChange }} />,
      MESSAGES,
    );

    // Previous is disabled at page 1, so clicking it (if it were enabled) shouldn't go below 1 — verified via the disabled test above.
    // Here we confirm Next is clamped to totalPages when already on the last page.
    rerender(<ListControls pagination={{ page: 3, totalPages: 3, total: 30, limit: 10, onPageChange }} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('renders the page info text with the current values', () => {
    renderWithIntl(
      <ListControls pagination={{ page: 2, totalPages: 5, total: 42, limit: 10, onPageChange: vi.fn() }} />,
      MESSAGES,
    );

    // Each {page}/{totalPages}/{total} placeholder renders inside its own <b> chunk span,
    // so each number is an exact-match text node on its own.
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});

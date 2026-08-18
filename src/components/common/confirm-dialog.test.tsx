import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithIntl } from '@/test/render-with-intl';

import { ConfirmDialog } from './confirm-dialog';

const MESSAGES = {
  common: {
    confirmDialog: { confirm: 'Confirm', cancel: 'Cancel', processing: 'Processing...' },
  },
};

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = renderWithIntl(
      <ConfirmDialog open={false} title="Delete?" onConfirm={vi.fn()} onCancel={vi.fn()} />,
      MESSAGES,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the title and description when open', () => {
    renderWithIntl(
      <ConfirmDialog
        open
        title="Delete candidate?"
        description="This cannot be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
      MESSAGES,
    );

    expect(screen.getByText('Delete candidate?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('uses the default translated labels when confirmLabel/cancelLabel are not given', () => {
    renderWithIntl(<ConfirmDialog open title="Delete?" onConfirm={vi.fn()} onCancel={vi.fn()} />, MESSAGES);

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('uses custom confirmLabel/cancelLabel when given', () => {
    renderWithIntl(
      <ConfirmDialog
        open
        title="Delete?"
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
      MESSAGES,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
  });

  it('shows the processing label and disables both buttons while isLoading', () => {
    renderWithIntl(<ConfirmDialog open title="Delete?" isLoading onConfirm={vi.fn()} onCancel={vi.fn()} />, MESSAGES);

    expect(screen.getByRole('button', { name: 'Processing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('fires onConfirm/onCancel when their buttons are clicked', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    renderWithIntl(<ConfirmDialog open title="Delete?" onConfirm={onConfirm} onCancel={onCancel} />, MESSAGES);

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

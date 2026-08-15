import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AvatarChip } from './avatar-chip';

describe('AvatarChip', () => {
  it('renders both-initials for a two-word name', () => {
    render(<AvatarChip name="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders the first two letters for a single-word name', () => {
    render(<AvatarChip name="Cher" />);
    expect(screen.getByText('CH')).toBeInTheDocument();
  });

  it('falls back to "?" for an empty/whitespace-only name', () => {
    render(<AvatarChip name="   " />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('uses the first and last initial for names with more than two words', () => {
    render(<AvatarChip name="Mary Jane Watson" />);
    expect(screen.getByText('MW')).toBeInTheDocument();
  });

  it('picks the same tone class for the same seed every render', () => {
    const { container: first } = render(<AvatarChip name="Jane Doe" seed="candidate-42" />);
    const { container: second } = render(<AvatarChip name="Someone Else" seed="candidate-42" />);

    const firstClasses = first.firstElementChild?.className;
    const secondClasses = second.firstElementChild?.className;

    expect(firstClasses).toBe(secondClasses);
  });

  it('applies the larger size classes by default and smaller ones for size="sm"', () => {
    const { container: md } = render(<AvatarChip name="Jane Doe" />);
    const { container: sm } = render(<AvatarChip name="Jane Doe" size="sm" />);

    expect(md.firstElementChild?.className).toContain('size-10');
    expect(sm.firstElementChild?.className).toContain('size-8');
  });
});

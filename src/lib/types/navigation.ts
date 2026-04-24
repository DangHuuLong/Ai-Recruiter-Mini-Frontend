import type { ComponentType } from 'react';

export type NavigationItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
};
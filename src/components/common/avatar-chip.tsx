import { cn } from '@/lib/utils/cn';

const TONE_CLASSES = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning'];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function toneForSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return TONE_CLASSES[hash % TONE_CLASSES.length];
}

type AvatarChipProps = {
  name: string;
  seed?: string;
  size?: 'sm' | 'md';
  className?: string;
};

export function AvatarChip({ name, seed, size = 'md', className }: AvatarChipProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ring-2 ring-surface-lowest',
        size === 'md' ? 'size-10 text-sm' : 'size-8 text-xs',
        toneForSeed(seed ?? name),
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}

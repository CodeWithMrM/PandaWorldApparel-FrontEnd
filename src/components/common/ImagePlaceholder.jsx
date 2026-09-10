import { cn } from '@/lib/utils';

/**
 * Marketing sections (hero, category tiles, flash sale banner) are meant
 * to be dressed with real campaign photography — swap the `<img>` back in
 * once you have shoots to use. Until then, this renders a tasteful,
 * on-brand placeholder so the layout/hierarchy reads correctly.
 */
export function ImagePlaceholder({ label, className, dark = false }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        dark ? 'bg-ink' : 'bg-surface-muted',
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0 140 Q 50 100 100 140 T 200 140 V200 H0 Z"
          fill={dark ? '#FFFFFF' : '#111111'}
        />
        <circle cx="150" cy="50" r="40" fill={dark ? '#FFFFFF' : '#111111'} />
      </svg>
      {label && (
        <span
          className={cn(
            'relative font-display text-sm font-bold uppercase tracking-widest2',
            dark ? 'text-white/40' : 'text-ink/25'
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

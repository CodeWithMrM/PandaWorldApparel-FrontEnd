import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuantitySelector({ value, onChange, min = 1, max = 99, className }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('inline-flex items-center rounded-sm border border-ink/25', className)}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="flex h-12 w-12 items-center justify-center text-ink transition-colors hover:bg-surface-muted disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="flex h-12 w-12 items-center justify-center text-ink transition-colors hover:bg-surface-muted disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

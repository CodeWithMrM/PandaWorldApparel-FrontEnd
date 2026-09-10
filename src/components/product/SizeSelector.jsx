import { cn } from '@/lib/utils';

export function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(({ size, available }) => (
        <button
          key={size}
          type="button"
          disabled={!available}
          onClick={() => onSelect(size)}
          className={cn(
            'flex h-11 min-w-[44px] items-center justify-center rounded-sm border px-3 text-sm font-semibold transition-all duration-200',
            selected === size
              ? 'border-ink bg-ink text-white'
              : 'border-border text-ink hover:border-ink',
            !available && 'cursor-not-allowed border-border/60 text-ink/25 line-through hover:border-border/60'
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

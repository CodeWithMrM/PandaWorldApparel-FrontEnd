import { formatCurrency, cn } from '@/lib/utils';

export function PriceTag({ price, compareAtPrice, size = 'md', className }) {
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-display font-bold text-ink', textSize)}>{formatCurrency(price)}</span>
      {compareAtPrice && (
        <span className="text-sm text-ink/35 line-through">{formatCurrency(compareAtPrice)}</span>
      )}
    </div>
  );
}

import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/primitives';
import { EmptyState } from '@/components/common/EmptyState';

export function ProductGrid({ products, isLoading, columns = 4, emptyMessage = 'No products found.' }) {
  const colClass =
    columns === 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : columns === 2
      ? 'sm:grid-cols-2'
      : 'sm:grid-cols-2 lg:grid-cols-4';

  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 gap-x-4 gap-y-10 ${colClass}`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState title="Nothing here yet" description={emptyMessage} />;
  }

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 ${colClass}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/primitives';

export function ProductCarouselSection({ eyebrow, title, viewAllHref, products, isLoading }) {
  const scrollerRef = useRef(null);

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="container-px mx-auto py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="mr-2 hidden text-sm font-semibold text-ink underline underline-offset-4 sm:block"
            >
              View All
            </Link>
          )}
          <button
            onClick={() => scrollBy(-1)}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-ink sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-ink sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth pb-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex w-[220px] shrink-0 flex-col gap-3 sm:w-[260px]">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id} className="w-[220px] shrink-0 sm:w-[260px]">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
}

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
    <section className="container-px mx-auto py-8 sm:py-12 md:py-16">
      <div className="mb-6 sm:mb-8 flex flex-col items-start justify-between gap-3 sm:gap-4">
        <div>
          {eyebrow && <span className="eyebrow text-[9px] sm:text-[10px] md:text-[11px]">{eyebrow}</span>}
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="text-xs sm:text-sm font-semibold text-ink underline underline-offset-4"
            >
              View All
            </Link>
          )}
          <button
            onClick={() => scrollBy(-1)}
            className="hidden h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-ink sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="hidden h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-ink sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="scrollbar-none flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex w-40 sm:w-[220px] md:w-[260px] shrink-0 flex-col gap-2 sm:gap-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id} className="w-40 sm:w-[220px] md:w-[260px] shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
}

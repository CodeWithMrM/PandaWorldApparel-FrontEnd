import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PriceTag } from './PriceTag';
import { RatingStars } from './RatingStars';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { getDerivedPricing, getDerivedRating, getStockStatus } from '@/lib/productPresentation';
import { cn } from '@/lib/utils';

export function ProductCard({ product, className }) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const openQuickView = useUIStore((s) => s.openQuickView);

  const { onSale, compareAtPrice, percentOff } = getDerivedPricing(product);
  const { rating, reviewCount } = getDerivedRating();
  const stock = getStockStatus(product);
  const isSoldOut = product.stock <= 0;

  return (
    <div className={cn('group relative flex flex-col', className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-surface-muted">
        <Link to={`/product/${product.id}`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-ink/30">
              No image yet
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && <Badge variant="accent">-{percentOff}%</Badge>}
          {isSoldOut && <Badge variant="ink">Sold Out</Badge>}
          {!isSoldOut && stock.variant === 'accent' && <Badge variant="accentOutline">{stock.label}</Badge>}
        </div>

        <button
          onClick={() => toggleWishlist(product)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition-transform duration-200 hover:scale-110"
        >
          <Heart className={cn('h-4 w-4', isWishlisted && 'fill-accent text-accent')} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => !isSoldOut && openQuickView(product)}
            disabled={isSoldOut}
            className="flex-1 rounded-sm border border-ink bg-white/95 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSoldOut ? 'Sold Out' : 'Add to Bag'}
          </button>
          <button
            onClick={() => openQuickView(product)}
            aria-label="Quick view"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-ink bg-white/95 text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Link to={`/product/${product.id}`} className="mt-3.5 flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink/40">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold leading-snug text-ink line-clamp-1">{product.name}</h3>
        <RatingStars rating={rating} reviewCount={reviewCount} />
        <PriceTag price={product.price} compareAtPrice={compareAtPrice} className="mt-0.5" />
      </Link>
    </div>
  );
}

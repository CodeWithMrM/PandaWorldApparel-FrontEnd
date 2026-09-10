import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { Breadcrumbs } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/wishlistStore';

export function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div className="container-px mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />
      <div className="mt-4 mb-8 flex items-end justify-between">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Your Wishlist</h1>
        <span className="text-sm text-ink/45">{items.length} item{items.length !== 1 && 's'}</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save pieces you love while you browse — they'll show up here."
          action={
            <Button variant="solid" asChild>
              <Link to="/shop">Discover Products</Link>
            </Button>
          }
        />
      ) : (
        <ProductGrid products={items} columns={4} />
      )}
    </div>
  );
}

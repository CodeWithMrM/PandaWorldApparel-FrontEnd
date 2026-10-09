import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PriceTag } from './PriceTag';
import { RatingStars } from './RatingStars';
import { SizeSelector } from './SizeSelector';
import { QuantitySelector } from './QuantitySelector';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { getDerivedPricing, getDerivedRating, getDerivedSizes } from '@/lib/productPresentation';

export function QuickViewModal() {
  const product = useUIStore((s) => s.quickViewProduct);
  const closeQuickView = useUIStore((s) => s.closeQuickView);
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSize(null);
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const { compareAtPrice, onSale, percentOff } = getDerivedPricing(product);
  const { rating, reviewCount } = getDerivedRating();
  const sizes = getDerivedSizes(product);
  const isSoldOut = product.stock <= 0;

  const handleAdd = async () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }
    await addItem(product, quantity, size);
    closeQuickView();
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && closeQuickView()}>
      <DialogContent className="max-w-4xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square bg-surface-muted md:aspect-auto">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex flex-col gap-4 p-8">
            {onSale && (
              <span className="w-fit rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                -{percentOff}% Off
              </span>
            )}
            <h2 className="font-display text-2xl font-bold leading-tight text-ink pr-8">{product.name}</h2>
            <RatingStars rating={rating} reviewCount={reviewCount} />
            <PriceTag price={product.price} compareAtPrice={compareAtPrice} size="lg" />
            <p className="text-sm leading-relaxed text-ink/60 line-clamp-3">{product.description}</p>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Size</p>
              <SizeSelector sizes={sizes} selected={size} onSelect={setSize} />
            </div>

            <div className="flex items-center gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button variant="solid" size="lg" className="flex-1" onClick={handleAdd} disabled={isSoldOut}>
                {isSoldOut ? 'Sold Out' : 'Add to Bag'}
              </Button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={closeQuickView}
              className="text-center text-sm font-semibold text-ink underline underline-offset-4"
            >
              View full details
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

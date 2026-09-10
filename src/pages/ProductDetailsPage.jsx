import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { ProductGallery } from '@/components/product/ProductGallery';
import { PriceTag } from '@/components/product/PriceTag';
import { RatingStars } from '@/components/product/RatingStars';
import { SizeSelector } from '@/components/product/SizeSelector';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { ProductCarouselSection } from '@/components/home/ProductCarouselSection';
import { Breadcrumbs, PageSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchProductById, fetchProducts } from '@/services/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  getDerivedPricing,
  getDerivedRating,
  getDerivedSizes,
  getStockStatus,
} from '@/lib/productPresentation';
import { cn } from '@/lib/utils';

function generateMockReviews(product) {
  const names = ['Naledi M.', 'Sipho K.', 'Amara D.', 'Liam P.', 'Zanele T.'];
  const comments = [
    'Fit is spot on and the fabric feels way better than I expected for the price.',
    'Shipping was fast and it looked exactly like the photos. Ordering another color.',
    'True to size. Would recommend sizing down if you like a slimmer fit.',
    'Good quality, though I wish there were more colour options.',
    'Been on repeat in my wardrobe since it arrived. Great everyday piece.',
  ];
  const { rating, reviewCount } = getDerivedRating(product);
  return {
    rating,
    reviewCount,
    reviews: names.map((name, i) => ({
      name,
      rating: Math.max(3, Math.round(rating) - (i % 2)),
      comment: comments[i],
      date: new Date(Date.now() - i * 6 * 24 * 3600 * 1000).toLocaleDateString('en-ZA', {
        month: 'short',
        year: 'numeric',
      }),
    })),
  };
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => (product ? s.isWishlisted(product.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setSize(null);
    setQuantity(1);

    fetchProductById(id)
      .then(async (p) => {
        if (!mounted) return;
        setProduct(p);
        const { products } = await fetchProducts({ categoryId: p.categoryId, limit: 8 });
        if (!mounted) return;
        setRelated(products.filter((rp) => rp.id !== p.id));
      })
      .catch(() => toast.error('Could not load this product'))
      .finally(() => mounted && setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) return <PageSpinner />;
  if (!product) {
    return (
      <div className="container-px mx-auto py-24 text-center">
        <p className="text-ink/60">Product not found.</p>
        <Button className="mt-4" asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const { onSale, compareAtPrice, percentOff } = getDerivedPricing(product);
  const sizes = getDerivedSizes(product);
  const stock = getStockStatus(product);
  const isSoldOut = product.stock <= 0;
  const { rating, reviewCount, reviews } = generateMockReviews(product);

  const requiresSizeChoice = sizes.length > 0;
  const canAddToCart = !isSoldOut && (!requiresSizeChoice || size);

  const handleAdd = async () => {
    if (requiresSizeChoice && !size) {
      toast.error('Please select a size');
      return;
    }
    await addItem(product, quantity);
  };

  const handleBuyNow = async () => {
    if (requiresSizeChoice && !size) {
      toast.error('Please select a size');
      return;
    }
    await addItem(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container-px mx-auto py-8">
      <Breadcrumbs
        items={[
          { label: 'Shop', to: '/shop' },
          ...(product.category ? [{ label: product.category.name, to: `/shop?category=${product.categoryId}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery imageUrl={product.imageUrl} name={product.name} />

        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          {onSale && <Badge variant="accent" className="w-fit">-{percentOff}% Off</Badge>}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
              {product.category?.name}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-ink">{product.name}</h1>
          </div>

          <RatingStars rating={rating} reviewCount={reviewCount} size="md" />
          <PriceTag price={product.price} compareAtPrice={compareAtPrice} size="lg" />

          <p className={cn('text-sm font-semibold', isSoldOut ? 'text-ink/50' : stock.variant === 'accent' ? 'text-accent' : 'text-success')}>
            {stock.label}
          </p>

          {requiresSizeChoice && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  Size {size && <span className="text-ink">— {size}</span>}
                </p>
                <button className="text-xs font-medium text-ink underline underline-offset-4">
                  Size Guide
                </button>
              </div>
              <SizeSelector sizes={sizes} selected={size} onSelect={setSize} />
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Quantity</p>
            <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="default"
              className="flex-1"
              onClick={handleAdd}
              disabled={!canAddToCart}
            >
              {isSoldOut ? 'Sold Out' : 'Add to Bag'}
            </Button>
            <Button
              size="lg"
              variant="solid"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={!canAddToCart}
            >
              Buy Now
            </Button>
            <Button
              size="icon"
              variant="default"
              className="shrink-0"
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
            >
              <Heart className={cn('h-4 w-4', isWishlisted && 'fill-accent text-accent')} />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-3">
            {[
              [Truck, 'Free shipping over R899'],
              [RotateCcw, '30-day easy returns'],
              [ShieldCheck, 'Secure PayFast checkout'],
            ].map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-2 text-xs text-ink/55">
                <Icon className="h-4 w-4 shrink-0" />
                {text}
              </div>
            ))}
          </div>

          <Tabs defaultValue="description" className="mt-4">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <p className="text-sm leading-relaxed text-ink/65">
                {product.description || 'No description provided for this product yet.'}
              </p>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="flex flex-col gap-6">
                {reviews.map((review, i) => (
                  <div key={i} className="border-b border-border pb-6 last:border-0">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink">{review.name}</span>
                      <span className="text-xs text-ink/40">{review.date}</span>
                    </div>
                    <RatingStars rating={review.rating} />
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shipping">
              <p className="text-sm leading-relaxed text-ink/65">
                Standard delivery in 2–5 business days across South Africa. Free on orders over
                R899, otherwise a flat R99 shipping fee applies. Returns are accepted within 30
                days of delivery, provided items are unworn and in original packaging.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {related.length > 0 && (
        <ProductCarouselSection title="You May Also Like" products={related} isLoading={false} />
      )}
    </div>
  );
}

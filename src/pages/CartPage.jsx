import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/EmptyState';
import { PageSpinner, Breadcrumbs } from '@/components/common/LoadingSpinner';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

// The backend doesn't have a Coupon model yet, so this validates against a
// couple of demo codes client-side and applies a simple percentage
// discount to the displayed total. Swap for a real POST /api/coupons/apply
// once that endpoint exists.
const DEMO_COUPONS = { PANDA10: 0.1, WELCOME15: 0.15 };

export function CartPage() {
  const { cart, isLoading, fetchCart, updateItem, removeItem, clear } = useCartStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];
  const subtotal = cart?.total || 0;
  const shipping = subtotal > 0 && subtotal < 899 ? 99 : 0;
  const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    const rate = DEMO_COUPONS[code];
    if (!rate) {
      toast.error('That coupon code is not valid');
      return;
    }
    setAppliedCoupon({ code, rate });
    toast.success(`Coupon "${code}" applied`);
  };

  if (isLoading && !cart) return <PageSpinner />;

  return (
    <div className="container-px mx-auto py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />
      <h1 className="mt-3 sm:mt-4 mb-6 sm:mb-8 font-display text-2xl sm:text-3xl font-bold text-ink">Your Bag</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet. Let's find something you'll love."
          action={
            <Button variant="solid" asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="hidden border-b border-border pb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-ink/40 sm:grid sm:grid-cols-[1fr_120px_120px_40px]">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[80px_1fr] items-center gap-4 border-b border-border py-6 sm:grid-cols-[1fr_120px_120px_40px]"
                >
                  <div className="flex items-center gap-4 sm:col-span-1">
                  <div className="h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                      {item.product.imageUrl && (
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <Link to={`/product/${item.product.id}`} className="text-xs sm:text-sm font-semibold text-ink hover:underline">
                        {item.product.name}
                      </Link>
                      {item.size && <p className="mt-1 text-xs text-ink/50">Size: {item.size}</p>}
                      <p className="mt-1 text-xs sm:text-sm font-bold text-ink sm:hidden">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:justify-center">
                    <div className="flex items-center rounded-sm border border-border">
                      <button
                        className="flex h-9 w-9 items-center justify-center disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        className="flex h-9 w-9 items-center justify-center"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-ink/40 transition-colors hover:text-accent sm:hidden"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="hidden text-right text-sm font-bold text-ink sm:block">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="hidden text-ink/40 transition-colors hover:text-accent sm:flex sm:justify-end"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 sm:mt-6 flex items-center justify-between">
              <Button variant="link" size="sm" asChild>
                <Link to="/shop">← Continue Shopping</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear Bag
              </Button>
            </div>
          </div>

          <div className="h-fit rounded-md border border-border bg-surface p-4 sm:p-6">
            <h2 className="mb-4 sm:mb-5 font-display text-base sm:text-lg font-bold">Order Summary</h2>

            <form onSubmit={applyCoupon} className="mb-4 sm:mb-5 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 sm:left-3.5 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-ink/35" />
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="pl-8 sm:pl-10 text-xs sm:text-sm"
                />
              </div>
              <Button type="submit" variant="default" size="sm">
                Apply
              </Button>
            </form>
            {appliedCoupon && (
              <p className="mb-4 text-[10px] sm:text-xs font-semibold text-success">
                "{appliedCoupon.code}" applied — {Math.round(appliedCoupon.rate * 100)}% off
              </p>
            )}

            <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex justify-between text-ink/65">
                <span>Subtotal</span>
                <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/65">
                <span>Shipping</span>
                <span className="font-medium text-ink">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span className="font-medium">-{formatCurrency(discount)}</span>
                </div>
              )}
            </div>

            <div className="my-4 sm:my-5 h-px bg-border" />

            <div className="mb-4 sm:mb-6 flex items-baseline justify-between">
              <span className="font-display text-sm sm:text-base font-bold">Total</span>
              <span className="font-display text-xl sm:text-2xl font-bold">{formatCurrency(total)}</span>
            </div>

            <Button variant="solid" size="sm" className="w-full sm:size-md" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <p className="mt-3 text-center text-xs text-ink/40">
              Free shipping on orders over R899 · Secure PayFast checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

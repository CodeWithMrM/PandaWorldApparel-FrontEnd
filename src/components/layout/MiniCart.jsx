import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

export function MiniCart() {
  const { cart, isOpen, closeCart, updateItem, removeItem } = useCartStore();
  const items = cart?.items || [];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Bag {items.length > 0 && `(${items.length})`}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-ink/20" strokeWidth={1.25} />
            <p className="text-sm text-ink/60">Your bag is empty. Let's fix that.</p>
            <Button onClick={closeCart} asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug text-ink line-clamp-2">
                          {item.product.name}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 text-ink/40 transition-colors hover:text-accent"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            className="p-1.5 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            className="p-1.5"
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-ink">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-display text-lg font-bold">{formatCurrency(cart?.total)}</span>
              </div>
              <Button variant="solid" size="lg" className="w-full" onClick={closeCart} asChild>
                <Link to="/checkout">Checkout Now</Link>
              </Button>
              <Button variant="link" className="mt-3 w-full justify-center" onClick={closeCart} asChild>
                <Link to="/cart">View Full Bag</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

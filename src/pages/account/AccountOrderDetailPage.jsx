import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchOrderById } from '@/services/orders';
import { ORDER_STATUS_STEPS } from '@/lib/constants';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export function AccountOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(id)
      .then(setOrder)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center text-sm text-ink/55">
        Order not found. <Link to="/account/orders" className="underline">Back to orders</Link>
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(order.status);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h2>
          <p className="text-sm text-ink/50">Placed on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="rounded-md border border-border p-4 sm:p-6">
        {isCancelled ? (
          <div className="rounded-sm bg-accent/10 p-4 text-center text-sm font-semibold text-accent">
            This order was cancelled.
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {ORDER_STATUS_STEPS.map((stepStatus, i) => (
              <div key={stepStatus} className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                      i <= currentStepIndex ? 'border-ink bg-ink text-white' : 'border-border text-ink/30'
                    )}
                  >
                    {i < currentStepIndex ? <Check className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                  </div>
                  {i < ORDER_STATUS_STEPS.length - 1 && (
                    <div className={cn('h-0.5 flex-1', i < currentStepIndex ? 'bg-ink' : 'bg-border')} />
                  )}
                </div>
                <span className={cn('mt-2 break-all text-center text-[9px] font-semibold leading-tight sm:break-normal sm:text-[11px]', i <= currentStepIndex ? 'text-ink' : 'text-ink/35')}>
                  {stepStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-display text-lg font-bold">Items</h3>
        <ul className="divide-y divide-border rounded-md border border-border">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4">
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                {item.product?.imageUrl && (
                  <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{item.product?.name}</p>
                <p className="text-xs text-ink/45">
                  {item.size && `Size ${item.size} · `}Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-bold text-ink">{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-border p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/45">Shipping Address</p>
          <p className="text-sm text-ink/70">{order.shippingAddress}</p>
        </div>
        <div className="rounded-md border border-border p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/45">Payment</p>
          <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'accentOutline'}>
            {order.paymentStatus}
          </Badge>
          <p className="mt-3 flex items-baseline justify-between text-sm">
            <span className="text-ink/60">Order Total</span>
            <span className="font-display text-lg font-bold text-ink">{formatCurrency(order.total)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

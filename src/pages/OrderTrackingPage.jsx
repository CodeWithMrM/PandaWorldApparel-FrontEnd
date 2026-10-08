import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/EmptyState';
import { Breadcrumbs, LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchOrderTracking } from '@/services/orders';
import { ORDER_STATUS_STEPS } from '@/lib/constants';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const requestedOrderId = searchParams.get('orderId')?.trim() || '';
  const [orderId, setOrderId] = useState(requestedOrderId);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const trackOrder = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    setOrder(null);
    try {
      const data = await fetchOrderTracking(id);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'We could not find that order');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!requestedOrderId) return;
    setOrderId(requestedOrderId);
    trackOrder(requestedOrderId);
  }, [requestedOrderId, trackOrder]);

  const handleTrack = (e) => {
    e.preventDefault();
    const id = orderId.trim();
    if (!id) return;
    trackOrder(id);
  };

  const isCancelled = order?.status === 'CANCELLED';
  const currentStepIndex = order ? ORDER_STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="container-px mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Track Order' }]} />
      <h1 className="mt-4 mb-3 font-display text-3xl font-bold sm:text-4xl">Track Your Order</h1>
      <p className="mb-8 max-w-lg text-sm text-ink/55">
        Enter your order ID (from your confirmation email or Order History) to see its current status.
      </p>

      <form onSubmit={handleTrack} className="mb-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row">
        <Input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. cljk3f9h20001abcd"
          required
          className="min-w-0"
        />
        <Button type="submit" variant="solid" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <LoadingSpinner className="h-4 w-4 border-white/30 border-t-white" /> : 'Track'}
        </Button>
      </form>

      {error && (
        <EmptyState
          icon={Search}
          title="Order not found"
          description={error}
          action={
            <Button variant="default" asChild>
              <Link to="/account/orders">View My Orders</Link>
            </Button>
          }
        />
      )}

      {order && (
        <div className="w-full max-w-2xl rounded-md border border-border p-4 sm:p-6">
          <div className="mb-6 grid grid-cols-2 gap-4 border-b border-border pb-6 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Order ID</p>
              <p className="break-all font-mono text-sm text-ink">{order.id}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Placed On</p>
              <p className="text-sm text-ink">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Total</p>
              <p className="text-sm font-bold text-ink">{formatCurrency(order.total)}</p>
            </div>
          </div>

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
                  <span className={cn('mt-2 text-center text-[9px] font-semibold leading-tight sm:text-[11px]', i <= currentStepIndex ? 'text-ink' : 'text-ink/35')}>
                    {stepStatus}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between rounded-sm bg-surface-muted px-4 py-3 text-sm">
            <span className="text-ink/60">Payment Status</span>
            <span className={cn('font-semibold', order.paymentStatus === 'PAID' ? 'text-success' : 'text-accent')}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

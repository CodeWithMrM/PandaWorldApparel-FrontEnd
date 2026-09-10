import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/shop/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { fetchMyOrders } from '@/services/orders';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_VARIANT = {
  PENDING: 'outline',
  PROCESSING: 'muted',
  SHIPPED: 'accentOutline',
  DELIVERED: 'success',
  CANCELLED: 'ink',
};

export function AccountOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchMyOrders({ page, limit: 8 })
      .then((data) => {
        setOrders(data.orders);
        setMeta(data.meta);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place an order, it'll show up here."
        action={
          <Button variant="solid" asChild>
            <Link to="/shop">Start Shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Link key={order.id} to={`/account/orders/${order.id}`}>
          <Card className="transition-colors hover:border-ink/30">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-sm font-semibold text-ink">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-ink/45">
                  {formatDate(order.createdAt)} · {order.items?.length || 0} item(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={STATUS_VARIANT[order.status] || 'outline'}>{order.status}</Badge>
                <span className="text-sm font-bold text-ink">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      {meta && <Pagination page={page} totalPages={meta.totalPages} onChange={setPage} />}
    </div>
  );
}

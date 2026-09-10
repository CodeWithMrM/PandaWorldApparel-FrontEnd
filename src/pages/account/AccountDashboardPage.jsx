import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Package, Heart, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchMyOrders } from '@/services/orders';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAddressStore } from '@/store/addressStore';
import { formatCurrency, formatDate } from '@/lib/utils';

export function AccountDashboardPage() {
  const { user } = useUser();
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const addressCount = useAddressStore((s) => s.addresses.length);

  useEffect(() => {
    fetchMyOrders({ limit: 3 })
      .then(({ orders }) => setRecentOrders(orders))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl font-bold">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
        </h2>
        <p className="mt-1 text-sm text-ink/55">Here's what's happening with your account.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted">
              <Package className="h-5 w-5 text-ink" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">{recentOrders.length > 0 ? recentOrders.length : '—'}</p>
              <p className="text-xs text-ink/50">Recent Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted">
              <Heart className="h-5 w-5 text-ink" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">{wishlistCount}</p>
              <p className="text-xs text-ink/50">Wishlist Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted">
              <MapPin className="h-5 w-5 text-ink" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">{addressCount}</p>
              <p className="text-xs text-ink/50">Saved Addresses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Recent Orders</h3>
          <Link to="/account/orders" className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-4">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : recentOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-ink/55">
              You haven't placed any orders yet.
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/account/orders/${order.id}`}>
                <Card className="transition-colors hover:border-ink/30">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm font-semibold text-ink">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-ink/45">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={order.status === 'CANCELLED' ? 'accentOutline' : 'outline'}>
                        {order.status}
                      </Badge>
                      <span className="text-sm font-bold text-ink">{formatCurrency(order.total)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

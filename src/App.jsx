import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Toaster } from 'sonner';

import { RootLayout } from '@/components/layout/RootLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { registerAuthTokenGetter } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { SearchResultsPage } from '@/pages/SearchResultsPage';
import { OrderTrackingPage } from '@/pages/OrderTrackingPage';
import { SupportPage } from '@/pages/SupportPage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { AccountLayout } from '@/pages/account/AccountLayout';
import { AccountDashboardPage } from '@/pages/account/AccountDashboardPage';
import { AccountOrdersPage } from '@/pages/account/AccountOrdersPage';
import { AccountOrderDetailPage } from '@/pages/account/AccountOrderDetailPage';
import { AccountAddressesPage } from '@/pages/account/AccountAddressesPage';
import { AccountSettingsPage } from '@/pages/account/AccountSettingsPage';

function AuthBootstrap() {
  const { getToken, isSignedIn } = useAuth();
  const fetchCart = useCartStore((s) => s.fetchCart);
  const resetCart = useCartStore((s) => s.reset);

  // Give the axios client a way to fetch a fresh Clerk session token on
  // every outgoing request.
  useEffect(() => {
    registerAuthTokenGetter(getToken);
  }, [getToken]);

  // Load (or clear) the server-side cart whenever sign-in state changes.
  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [isSignedIn, fetchCart, resetCart]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <>
        <AuthBootstrap />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
        <Routes>
          <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AccountDashboardPage />} />
            <Route path="orders" element={<AccountOrdersPage />} />
            <Route path="orders/:id" element={<AccountOrderDetailPage />} />
            <Route path="addresses" element={<AccountAddressesPage />} />
            <Route path="settings" element={<AccountSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </>
    </ErrorBoundary>
  );
}

import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { MiniCart } from './MiniCart';
import { QuickViewModal } from '@/components/product/QuickViewModal';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <MobileMenu />
      <MiniCart />
      <QuickViewModal />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

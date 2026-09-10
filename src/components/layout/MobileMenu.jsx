import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/primitives';
import { NAV_LINKS } from '@/lib/constants';
import { useUIStore } from '@/store/uiStore';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const close = () => setMobileMenuOpen(false);

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="max-w-[85vw]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col px-6 py-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={close}
              className="border-b border-border py-4 text-base font-semibold text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="flex flex-col gap-1 px-6 py-5">
          <SignedIn>
            <Link to="/account" onClick={close} className="py-2.5 text-sm font-medium text-ink/80">
              My Account
            </Link>
            <Link to="/account/orders" onClick={close} className="py-2.5 text-sm font-medium text-ink/80">
              My Orders
            </Link>
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in" onClick={close} className="py-2.5 text-sm font-medium text-ink/80">
              Sign In
            </Link>
          </SignedOut>
          <Link to="/wishlist" onClick={close} className="py-2.5 text-sm font-medium text-ink/80">
            Wishlist
          </Link>
          <Link to="/track-order" onClick={close} className="py-2.5 text-sm font-medium text-ink/80">
            Track Order
          </Link>
          <Link to="/support" onClick={close} className="py-2.5 text-sm font-medium text-ink/80">
            Customer Support
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

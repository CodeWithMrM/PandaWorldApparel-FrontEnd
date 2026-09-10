import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag, User, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Logo } from './Logo';
import { AnnouncementBar } from './AnnouncementBar';
import { NAV_LINKS } from '@/lib/constants';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useUIStore();
  const { cart, openCart } = useCartStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white">
      <AnnouncementBar />
      <div className="border-b border-border">
        <div className="container-px mx-auto flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="p-1 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="rounded-full p-2.5 transition-colors hover:bg-surface-muted"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <Link
              to="/wishlist"
              className="relative hidden rounded-full p-2.5 transition-colors hover:bg-surface-muted sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <SignedIn>
              <div className="hidden sm:block">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <Link
                to="/sign-in"
                className="hidden rounded-full p-2.5 transition-colors hover:bg-surface-muted sm:inline-flex"
                aria-label="Sign in"
              >
                <User className="h-5 w-5" />
              </Link>
            </SignedOut>

            <button
              className="relative rounded-full p-2.5 transition-colors hover:bg-surface-muted"
              onClick={openCart}
              aria-label="Open bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            'overflow-hidden border-t border-border transition-all duration-300 ease-premium',
            searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 border-t-0'
          )}
        >
          <form onSubmit={submitSearch} className="container-px mx-auto flex items-center gap-3 py-3">
            <Search className="h-4 w-4 shrink-0 text-ink/40" />
            <input
              autoFocus={searchOpen}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for products, brands, categories…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink/35 focus:outline-none"
            />
            <Button type="submit" size="sm" variant="ghost">
              Search
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

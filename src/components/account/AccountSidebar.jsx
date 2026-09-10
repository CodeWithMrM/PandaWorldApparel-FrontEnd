import { NavLink } from 'react-router-dom';
import { LayoutGrid, Package, MapPin, Settings, Heart, LogOut } from 'lucide-react';
import { SignOutButton } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/account', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/settings', label: 'Settings', icon: Settings },
];

export function AccountSidebar() {
  return (
    <aside className="flex shrink-0 flex-col gap-1 lg:w-64">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium transition-colors',
              isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-surface-muted'
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
      <SignOutButton>
        <button className="mt-2 flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium text-ink/70 transition-colors hover:bg-surface-muted">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </SignOutButton>
    </aside>
  );
}

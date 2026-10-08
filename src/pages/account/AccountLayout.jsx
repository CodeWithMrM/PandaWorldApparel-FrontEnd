import { Outlet } from 'react-router-dom';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Breadcrumbs } from '@/components/common/LoadingSpinner';

export function AccountLayout() {
  return (
    <div className="container-px mx-auto py-8">
      <Breadcrumbs items={[{ label: 'My Account' }]} />
      <h1 className="mt-4 mb-8 font-display text-3xl font-bold sm:text-4xl">My Account</h1>
      <div className="flex flex-col gap-10 lg:flex-row">
        <AccountSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FloatingField } from '@/components/ui/input';
import { Switch } from '@/components/ui/primitives';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchCurrentUser, updateProfile } from '@/services/orders';

export function AccountSettingsPage() {
  const { user } = useUser();
  const clerk = useClerk();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name || '', phone: data.phone || '' });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="mb-1 font-display text-xl font-bold">Profile Information</h2>
        <p className="mb-6 text-sm text-ink/55">Update your name and phone number.</p>
        <form onSubmit={handleSave} className="grid max-w-md grid-cols-1 gap-4">
          <FloatingField
            id="settings-name"
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <FloatingField
            id="settings-phone"
            label="Phone number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <FloatingField id="settings-email" label="Email" value={profile?.email || ''} disabled helperText="Managed via account security — see below to change it." />
          <Button type="submit" variant="solid" className="mt-1 w-fit" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </section>

      <div className="h-px bg-border" />

      <section>
        <h2 className="mb-1 font-display text-xl font-bold">Account Security</h2>
        <p className="mb-6 text-sm text-ink/55">
          Email, password, and two-factor authentication are managed securely via {' '}
          {user?.primaryEmailAddress ? 'Clerk' : 'your account provider'}.
        </p>
        <Button variant="default" onClick={() => clerk.openUserProfile()}>
          Manage Account Security
        </Button>
      </section>

      <div className="h-px bg-border" />

      <section>
        <h2 className="mb-1 font-display text-xl font-bold">Notifications</h2>
        <p className="mb-6 text-sm text-ink/55">Choose what you'd like to hear about.</p>
        <div className="flex max-w-md flex-col gap-4">
          <label className="flex items-center justify-between rounded-sm border border-border p-4">
            <div>
              <p className="text-sm font-semibold text-ink">Order Updates</p>
              <p className="text-xs text-ink/50">Shipping and delivery notifications</p>
            </div>
            <Switch checked={notifyOrders} onCheckedChange={setNotifyOrders} />
          </label>
          <label className="flex items-center justify-between rounded-sm border border-border p-4">
            <div>
              <p className="text-sm font-semibold text-ink">Promotions & Sales</p>
              <p className="text-xs text-ink/50">Flash sales, new drops, discounts</p>
            </div>
            <Switch checked={notifyPromos} onCheckedChange={setNotifyPromos} />
          </label>
        </div>
      </section>
    </div>
  );
}

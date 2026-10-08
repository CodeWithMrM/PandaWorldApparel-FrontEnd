import { useState } from 'react';
import { MapPin, Pencil, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloatingField } from '@/components/ui/input';
import { EmptyState } from '@/components/common/EmptyState';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAddressStore, formatAddressLine } from '@/store/addressStore';
import { toast } from 'sonner';

const emptyForm = { fullName: '', line1: '', line2: '', city: '', province: '', postalCode: '', country: 'South Africa', phone: '' };

export function AccountAddressesPage() {
  const { addresses, addAddress, updateAddress, removeAddress } = useAddressStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    setForm(address);
    setIsOpen(true);
  };

  const handleField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.line1 || !form.city || !form.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (editingId) {
      updateAddress(editingId, form);
      toast.success('Address updated');
    } else {
      addAddress(form);
      toast.success('Address saved');
    }
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Saved Addresses</h2>
        <Button variant="default" size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No saved addresses" description="Add an address to speed up checkout next time." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{address.fullName}</p>
                    <p className="mt-1 break-words text-sm text-ink/60">{formatAddressLine(address)}</p>
                    <p className="mt-1 text-sm text-ink/60">{address.phone}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(address)}
                      className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-ink"
                      aria-label="Edit address"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        removeAddress(address.id);
                        toast('Address removed');
                      }}
                      className="rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-accent"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg p-5 sm:p-8">
          <DialogTitle className="mb-6">{editingId ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FloatingField id="addr-fullName" label="Full name" value={form.fullName} onChange={handleField('fullName')} />
            <FloatingField id="addr-phone" label="Phone number" value={form.phone} onChange={handleField('phone')} />
            <FloatingField id="addr-line1" label="Address line 1" className="sm:col-span-2" value={form.line1} onChange={handleField('line1')} />
            <FloatingField id="addr-line2" label="Address line 2 (optional)" className="sm:col-span-2" value={form.line2} onChange={handleField('line2')} />
            <FloatingField id="addr-city" label="City" value={form.city} onChange={handleField('city')} />
            <FloatingField id="addr-province" label="Province" value={form.province} onChange={handleField('province')} />
            <FloatingField id="addr-postalCode" label="Postal code" value={form.postalCode} onChange={handleField('postalCode')} />
            <FloatingField id="addr-country" label="Country" value={form.country} onChange={handleField('country')} />
            <Button type="submit" variant="solid" size="lg" className="sm:col-span-2 mt-2">
              Save Address
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

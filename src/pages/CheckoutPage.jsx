import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, Truck, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingField } from '@/components/ui/input';
import { PageSpinner } from '@/components/common/LoadingSpinner';
import { useCartStore } from '@/store/cartStore';
import { useAddressStore, formatAddressLine } from '@/store/addressStore';
import { createOrder, payWithPaystack } from '@/services/orders';
import { formatCurrency, cn } from '@/lib/utils';

const STEPS = ['Shipping', 'Delivery', 'Payment', 'Review'];

const DELIVERY_METHODS = [
  { id: 'standard', label: 'Standard Delivery', eta: '2–5 business days', price: 0, icon: Truck },
  { id: 'express', label: 'Express Delivery', eta: '1–2 business days', price: 149, icon: Zap },
];

const emptyAddress = { fullName: '', line1: '', line2: '', city: '', province: '', postalCode: '', country: 'South Africa', phone: '' };

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, isLoading, fetchCart } = useCartStore();
  const { addresses, addAddress } = useAddressStore();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [delivery, setDelivery] = useState(DELIVERY_METHODS[0].id);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
      setAddress(addresses[0]);
    }
  }, [addresses, selectedAddressId]);

  if (isLoading && !cart) return <PageSpinner />;

  const items = cart?.items || [];
  const subtotal = cart?.total || 0;
  const deliveryMethod = DELIVERY_METHODS.find((m) => m.id === delivery);
  const shipping = deliveryMethod?.price ?? 0;
  const freeShippingApplies = subtotal >= 899 && delivery === 'standard';
  const total = subtotal + (freeShippingApplies ? 0 : shipping);

  if (items.length === 0 && !isPlacingOrder) {
    navigate('/cart');
    return null;
  }

  const handleAddressField = (field) => (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));

  const isAddressValid =
    address.fullName && address.line1 && address.city && address.province && address.postalCode && address.phone;

  const goToStep = (i) => {
    if (i === 1 && !isAddressValid) {
      toast.error('Please complete your shipping address first');
      return;
    }
    setStep(i);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      if (saveAddress && !selectedAddressId) {
        addAddress(address);
      }
      const shippingAddress = formatAddressLine(address);
      const order = await createOrder(shippingAddress);
      toast.success('Order placed — redirecting to secure payment…');
      await payWithPaystack(order.id);
      // payWithPaystack redirects to Paystack checkout, so execution normally doesn't reach here.
    } catch (err) {
      toast.error(err.message || 'Could not place your order');
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container-px mx-auto py-8">
      <h1 className="mb-8 font-display text-3xl font-bold sm:text-4xl">Checkout</h1>

      <div className="mb-10 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i < step && goToStep(i)}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                i < step && 'border-ink bg-ink text-white',
                i === step && 'border-ink text-ink',
                i > step && 'border-border text-ink/35'
              )}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </button>
            <span className={cn('whitespace-nowrap text-sm font-semibold', i === step ? 'text-ink' : 'text-ink/40')}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px w-8 bg-border sm:w-16" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-xl font-bold">Shipping Information</h2>

              {addresses.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Saved Addresses</p>
                  {addresses.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setSelectedAddressId(a.id);
                        setAddress(a);
                      }}
                      className={cn(
                        'rounded-sm border p-4 text-left text-sm transition-colors',
                        selectedAddressId === a.id ? 'border-ink bg-surface-muted' : 'border-border hover:border-ink/40'
                      )}
                    >
                      <p className="font-semibold text-ink">{a.fullName}</p>
                      <p className="text-ink/55">{formatAddressLine(a)}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedAddressId(null);
                      setAddress(emptyAddress);
                    }}
                    className="text-left text-sm font-semibold text-ink underline underline-offset-4"
                  >
                    + Use a new address
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FloatingField id="fullName" label="Full name" value={address.fullName} onChange={handleAddressField('fullName')} />
                <FloatingField id="phone" label="Phone number" value={address.phone} onChange={handleAddressField('phone')} />
                <FloatingField id="line1" label="Address line 1" className="sm:col-span-2" value={address.line1} onChange={handleAddressField('line1')} />
                <FloatingField id="line2" label="Address line 2 (optional)" className="sm:col-span-2" value={address.line2} onChange={handleAddressField('line2')} />
                <FloatingField id="city" label="City" value={address.city} onChange={handleAddressField('city')} />
                <FloatingField id="province" label="Province" value={address.province} onChange={handleAddressField('province')} />
                <FloatingField id="postalCode" label="Postal code" value={address.postalCode} onChange={handleAddressField('postalCode')} />
                <FloatingField id="country" label="Country" value={address.country} onChange={handleAddressField('country')} />
              </div>

              <label className="flex items-center gap-2.5 text-sm text-ink/65">
                <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 accent-ink" />
                Save this address for next time
              </label>

              <Button size="lg" variant="solid" className="mt-2 w-fit" onClick={() => goToStep(1)}>
                Continue to Delivery
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-xl font-bold">Delivery Method</h2>
              <div className="flex flex-col gap-3">
                {DELIVERY_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setDelivery(method.id)}
                    className={cn(
                      'flex items-center justify-between rounded-sm border p-4 text-left transition-colors',
                      delivery === method.id ? 'border-ink bg-surface-muted' : 'border-border hover:border-ink/40'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className="h-5 w-5 text-ink/60" />
                      <div>
                        <p className="text-sm font-semibold text-ink">{method.label}</p>
                        <p className="text-xs text-ink/50">{method.eta}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-ink">
                      {method.price === 0 ? 'Free' : formatCurrency(method.price)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-3">
                <Button variant="default" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button variant="solid" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-xl font-bold">Payment Method</h2>
              <div className="flex items-center gap-4 rounded-sm border border-ink bg-surface-muted p-5">
                <ShieldCheck className="h-6 w-6 text-ink" />
                <div>
                  <p className="text-sm font-semibold text-ink">Paystack Secure Checkout</p>
                  <p className="text-xs text-ink/55">
                    Card, Bank Transfer, USSD, and more via Paystack — secure payment processing.
                  </p>
                </div>
              </div>
              <div className="mt-2 flex gap-3">
                <Button variant="default" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="solid" onClick={() => setStep(3)}>
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-xl font-bold">Review Your Order</h2>

              <div className="rounded-sm border border-border p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/45">Shipping To</p>
                <p className="text-sm font-semibold text-ink">{address.fullName}</p>
                <p className="text-sm text-ink/60">{formatAddressLine(address)}</p>
                <p className="text-sm text-ink/60">{address.phone}</p>
              </div>

              <div className="rounded-sm border border-border p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/45">Delivery</p>
                <p className="text-sm text-ink">
                  {deliveryMethod.label} — {deliveryMethod.eta}
                </p>
              </div>

              <ul className="divide-y divide-border rounded-sm border border-border">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-4 text-sm">
                    <span className="text-ink/70">
                      {item.product.name} <span className="text-ink/40">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-ink">{formatCurrency(item.product.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex gap-3">
                <Button variant="default" onClick={() => setStep(2)} disabled={isPlacingOrder}>
                  Back
                </Button>
                <Button variant="accent" size="lg" className="flex-1" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                  {isPlacingOrder ? 'Placing Order…' : `Pay ${formatCurrency(total)} with Paystack`}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-md border border-border bg-surface p-6">
          <h3 className="mb-5 font-display text-lg font-bold">Order Summary</h3>
          <ul className="mb-4 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                  {item.product.imageUrl && (
                    <img src={item.product.imageUrl} alt="" className="h-full w-full object-cover" />
                  )}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <span className="flex-1 text-ink/70 line-clamp-1">{item.product.name}</span>
                <span className="font-semibold text-ink">{formatCurrency(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="h-px bg-border" />
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-ink/65">
              <span>Subtotal</span>
              <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/65">
              <span>Shipping</span>
              <span className="font-medium text-ink">
                {freeShippingApplies || shipping === 0 ? 'Free' : formatCurrency(shipping)}
              </span>
            </div>
          </div>
          <div className="my-4 h-px bg-border" />
          <div className="flex items-baseline justify-between">
            <span className="font-display font-bold">Total</span>
            <span className="font-display text-2xl font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

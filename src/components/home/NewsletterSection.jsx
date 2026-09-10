import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }
    toast.success("You're on the list — welcome to PandaWorld");
    setEmail('');
  };

  return (
    <section className="bg-surface-muted">
      <div className="container-px mx-auto flex flex-col items-center gap-6 py-16 text-center">
        <span className="eyebrow">Stay in the loop</span>
        <h2 className="max-w-lg font-display text-3xl font-bold text-ink">
          Get 10% off your first order
        </h2>
        <p className="max-w-md text-sm text-ink/55">
          Sign up for restock alerts, early access to drops, and subscriber-only discounts.
        </p>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-13 flex-1 rounded-sm border border-border bg-white px-4 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
          />
          <Button type="submit" variant="solid" size="lg">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}

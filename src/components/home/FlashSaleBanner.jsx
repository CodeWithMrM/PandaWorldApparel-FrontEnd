import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * The backend doesn't model sale windows/end-times yet, so this counts
 * down to midnight tonight as a stand-in for "flash sale ends soon".
 * Swap in a real `saleEndsAt` timestamp once promotions have a backend.
 */
function useMidnightCountdown() {
  const getRemaining = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.max(0, midnight - now);
  };

  const [remaining, setRemaining] = useState(getRemaining());

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(remaining / 3.6e6)).padStart(2, '0');
  const m = String(Math.floor((remaining % 3.6e6) / 6e4)).padStart(2, '0');
  const s = String(Math.floor((remaining % 6e4) / 1000)).padStart(2, '0');
  return { h, m, s };
}

export function FlashSaleBanner() {
  const { h, m, s } = useMidnightCountdown();

  return (
    <section className="border-y border-border bg-ink">
      <div className="container-px mx-auto flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-widest2 text-accent">
            Flash Sale
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold text-white">Up to 45% Off Today</h2>
        </div>

        <div className="flex items-center gap-3">
          {[
            ['H', h],
            ['M', m],
            ['S', s],
          ].map(([label, value]) => (
            <div key={label} className="flex h-16 w-16 flex-col items-center justify-center rounded-sm border border-white/20">
              <span className="font-display text-xl font-bold text-white tabular-nums">{value}</span>
              <span className="text-[10px] uppercase text-white/50">{label}</span>
            </div>
          ))}
        </div>

        <Button size="lg" className="border-white text-white hover:bg-white hover:text-ink" asChild>
          <Link to="/shop?sale=true">Shop the Sale</Link>
        </Button>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  return (
    <section className="border-b border-border">
      <div className="container-px mx-auto grid grid-cols-1 items-center gap-6 py-8 sm:gap-8 sm:py-10 lg:grid-cols-2 lg:py-0">
        <div className="order-2 flex flex-col items-start gap-4 sm:gap-5 lg:gap-6 lg:order-1 animate-fade-up">
          <span className="eyebrow text-[9px] sm:text-[10px] md:text-[11px]">Spring / Summer Drop</span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[0.95] tracking-tightest text-ink">
            DRESS
            <br />
            ON YOUR
            <br />
            OWN TERMS
          </h1>
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-ink/60">
            Considered essentials and fast-moving drops, cut for real life. New styles land every
            week — nothing precious, everything wearable.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button size="sm" variant="solid" asChild className="sm:size-md">
              <Link to="/shop?sort=newest">Shop New In</Link>
            </Button>
            <Button size="sm" variant="default" asChild className="sm:size-md">
              <Link to="/shop?sale=true">View Flash Sale</Link>
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <img
            src="/ImagePlaceholder.jpg"
            alt="Campaign Imagery"
            className="aspect-[4/5] w-full rounded-lg object-cover lg:aspect-[3/4]"
          />
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  return (
    <section className="border-b border-border">
      <div className="container-px mx-auto grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2 lg:py-0">
        <div className="order-2 flex flex-col items-start gap-6 lg:order-1 animate-fade-up">
          <span className="eyebrow">Spring / Summer Drop</span>
          <h1 className="font-display text-[13vw] font-extrabold leading-[0.95] tracking-tightest text-ink sm:text-6xl lg:text-7xl">
            DRESS
            <br />
            ON YOUR
            <br />
            OWN TERMS
          </h1>
          <p className="max-w-md text-base leading-relaxed text-ink/60">
            Considered essentials and fast-moving drops, cut for real life. New styles land every
            week — nothing precious, everything wearable.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="solid" asChild>
              <Link to="/shop?sort=newest">Shop New In</Link>
            </Button>
            <Button size="lg" variant="default" asChild>
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

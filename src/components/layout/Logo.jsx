import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * Signature brand mark: a tight, uppercase Syne wordmark with a small red
 * dot standing in for the panda's nose/accent — the one spot of color in
 * an otherwise black-and-white identity, echoing the accent's role
 * throughout the UI (badges, alerts, sale tags).
 */
export function Logo({ className }) {
  return (
    <Link
      to="/"
      className={cn(
        'font-display text-base sm:text-lg md:text-xl lg:text-[22px] font-extrabold tracking-tightest text-ink inline-flex items-baseline gap-[2px] transition-all duration-300',
        className
      )}
      aria-label="PandaWorld Apparel — home"
    >
      PANDA
      <span className="relative inline-block">
        W
        <span className="absolute -top-[2px] sm:-top-[2.5px] md:-top-[3px] right-[2px] sm:right-[2.5px] md:right-[3px] h-[3px] sm:h-[4px] md:h-[5px] w-[3px] sm:w-[4px] md:w-[5px] rounded-full bg-accent" />
      </span>
      ORLD
    </Link>
  );
}

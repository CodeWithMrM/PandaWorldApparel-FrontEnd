import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Logo } from './Logo';
import { FOOTER_LINKS } from '@/lib/constants';
import { Separator } from '@/components/ui/primitives';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container-px mx-auto grid grid-cols-2 gap-6 py-8 sm:gap-8 sm:py-12 md:grid-cols-6 md:gap-10 md:py-16">
        <div className="col-span-2">
          <Logo className="text-sm sm:text-base md:text-lg" />
          <p className="mt-3 sm:mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-ink/55">
            Considered essentials and fast fashion drops for people who move quickly and dress
            deliberately. Designed in-house, shipped from South Africa.
          </p>
          <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border text-ink/60 transition-colors hover:border-ink hover:text-ink"
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <h4 className="eyebrow mb-3 sm:mb-4 text-[9px] sm:text-[10px] md:text-[11px]">{group.heading}</h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-xs sm:text-sm text-ink/60 transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      <div className="container-px mx-auto flex flex-col items-center justify-between gap-2 py-4 sm:gap-3 sm:py-6 sm:flex-row">
        <p className="text-[11px] sm:text-xs text-ink/45">
          &copy; {new Date().getFullYear()} PandaWorld Apparel. All rights reserved.
        </p>
        <div className="flex flex-col items-center gap-2 text-[11px] sm:text-xs text-ink/45 sm:flex-row sm:gap-5">
          <Link to="/support#privacy" className="hover:text-ink">
            Privacy Policy
          </Link>
          <Link to="/support#terms" className="hover:text-ink">
            Terms of Service
          </Link>
          <span className="hidden sm:inline">Secure checkout via PayFast</span>
        </div>
      </div>
    </footer>
  );
}

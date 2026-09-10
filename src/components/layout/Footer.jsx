import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Logo } from './Logo';
import { FOOTER_LINKS } from '@/lib/constants';
import { Separator } from '@/components/ui/primitives';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container-px mx-auto grid grid-cols-2 gap-10 py-16 md:grid-cols-6">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/55">
            Considered essentials and fast fashion drops for people who move quickly and dress
            deliberately. Designed in-house, shipped from South Africa.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink/60 transition-colors hover:border-ink hover:text-ink"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <h4 className="eyebrow mb-4">{group.heading}</h4>
            <ul className="flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ink/60 transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      <div className="container-px mx-auto flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
        <p className="text-xs text-ink/45">
          &copy; {new Date().getFullYear()} PandaWorld Apparel. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-xs text-ink/45">
          <Link to="/support#privacy" className="hover:text-ink">
            Privacy Policy
          </Link>
          <Link to="/support#terms" className="hover:text-ink">
            Terms of Service
          </Link>
          <span>Secure checkout via PayFast</span>
        </div>
      </div>
    </footer>
  );
}

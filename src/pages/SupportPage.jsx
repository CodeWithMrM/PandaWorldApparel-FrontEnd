import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FloatingField } from '@/components/ui/input';
import { Textarea } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/common/LoadingSpinner';

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 2–5 business days across South Africa. Express delivery (1–2 business days) is available at checkout for a flat fee.',
  },
  {
    q: 'What is your returns policy?',
    a: 'We accept returns within 30 days of delivery provided items are unworn, unwashed, and in original packaging with tags attached.',
  },
  {
    q: 'How do I track my order?',
    a: 'Head to the Track Order page and enter your order ID from your confirmation email, or view it directly from My Account → Orders.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'All payments are processed securely through PayFast, supporting cards, Instant EFT, and more.',
  },
  {
    q: 'How do I know what size to order?',
    a: 'Check the size guide on each product page. Our fits tend to run true to size — if you\'re between sizes, we recommend sizing up.',
  },
];

export function SupportPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Please tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address';
    if (!form.message.trim()) nextErrors.message = 'Tell us how we can help';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    toast.success("Message sent — we'll get back to you within 24 hours");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-px mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Customer Support' }]} />
      <h1 className="mt-4 mb-3 font-display text-3xl font-bold sm:text-4xl">Customer Support</h1>
      <p className="mb-12 max-w-lg text-sm text-ink/55">
        Find answers below, or reach out directly — our team responds within one business day.
      </p>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_400px]">
        <div>
          <section id="faq" className="mb-14">
            <h2 className="mb-4 font-display text-xl font-bold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              {FAQS.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section id="shipping" className="mb-14">
            <h2 className="mb-4 font-display text-xl font-bold">Shipping & Returns</h2>
            <p className="text-sm leading-relaxed text-ink/65">
              We ship nationwide via trusted couriers. Standard delivery is free on orders over R899
              and takes 2–5 business days; express delivery arrives in 1–2 business days for a flat
              R149. Returns are accepted within 30 days of delivery — start a return from My Account
              → Orders, or contact support below for help.
            </p>
          </section>

          <section id="size-guide" className="mb-14">
            <h2 className="mb-4 font-display text-xl font-bold">Size Guide</h2>
            <div className="overflow-x-auto rounded-sm border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink/50">
                  <tr>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Chest (cm)</th>
                    <th className="px-4 py-3">Waist (cm)</th>
                    <th className="px-4 py-3">Hip (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['XS', '82–86', '64–68', '86–90'],
                    ['S', '87–91', '69–73', '91–95'],
                    ['M', '92–97', '74–79', '96–101'],
                    ['L', '98–104', '80–86', '102–108'],
                    ['XL', '105–112', '87–94', '109–116'],
                    ['XXL', '113–120', '95–102', '117–124'],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td key={i} className={`px-4 py-3 ${i === 0 ? 'font-semibold text-ink' : 'text-ink/65'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="about">
            <h2 className="mb-4 font-display text-xl font-bold">About PandaWorld</h2>
            <p className="text-sm leading-relaxed text-ink/65">
              PandaWorld Apparel designs considered essentials and fast-moving drops for people who
              move quickly and dress deliberately. We're based in South Africa and ship nationwide,
              with a small in-house design team releasing new styles every week.
            </p>
          </section>
        </div>

        <div id="contact" className="h-fit rounded-md border border-border bg-surface p-6">
          <h2 className="mb-1 font-display text-lg font-bold">Contact Us</h2>
          <p className="mb-6 text-sm text-ink/55">Send a message and we'll be in touch soon.</p>

          <div className="mb-6 flex flex-col gap-3 text-sm text-ink/70">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-ink/40" /> support@pandaworld.co.za
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-ink/40" /> +27 11 234 5678
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-ink/40" /> Live chat: Mon–Fri, 8am–5pm SAST
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FloatingField
              id="support-name"
              label="Your name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={errors.name}
            />
            <FloatingField
              id="support-email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
            />
            <div>
              <Textarea
                placeholder="How can we help?"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                error={errors.message}
              />
              {errors.message && <p className="mt-1.5 text-xs font-medium text-accent">{errors.message}</p>}
            </div>
            <Button type="submit" variant="solid" size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

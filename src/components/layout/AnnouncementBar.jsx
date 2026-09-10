import { useEffect, useState } from 'react';

const MESSAGES = [
  'Free shipping on orders over R899',
  'New drops every Friday — New In',
  'Flash Sale: up to 60% off, ends soon',
  'Easy 30-day returns, no questions asked',
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-ink text-white">
      <div className="container-px mx-auto flex h-8 sm:h-9 items-center justify-center overflow-hidden">
        <p key={index} className="animate-fade-in text-center text-[10px] sm:text-[11px] md:text-[12px] font-medium tracking-wide">
          {MESSAGES[index]}
        </p>
      </div>
    </div>
  );
}

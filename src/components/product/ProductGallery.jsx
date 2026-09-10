import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * The backend stores a single `imageUrl` per product (no gallery array
 * yet), so we repeat it to demonstrate the gallery/zoom UX. Once the
 * schema grows a ProductImage model, feed the real array in here.
 */
export function ProductGallery({ imageUrl, name }) {
  const images = imageUrl ? [imageUrl, imageUrl, imageUrl] : [];
  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  if (images.length === 0) {
    return <div className="aspect-[3/4] w-full rounded-md bg-surface-muted" />;
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex shrink-0 gap-3 overflow-x-auto md:flex-col md:overflow-visible">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'h-20 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-colors',
              active === i ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
            )}
          >
            <img src={src} alt={`${name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 cursor-zoom-in overflow-hidden rounded-md bg-surface-muted"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[active]}
          alt={name}
          className={cn(
            'aspect-[3/4] w-full object-cover transition-transform duration-300 ease-out md:aspect-auto md:h-[640px]',
            isZooming && 'scale-[1.9]'
          )}
          style={isZooming ? zoomStyle : undefined}
        />
      </div>
    </div>
  );
}

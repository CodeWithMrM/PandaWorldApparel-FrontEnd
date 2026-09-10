import { Link } from 'react-router-dom';
import { ImagePlaceholder } from '@/components/common/ImagePlaceholder';
import { ArrowUpRight } from 'lucide-react';

export function CategoryShowcase({ categories = [] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container-px mx-auto py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="eyebrow">Shop by Category</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Featured Categories</h2>
        </div>
        <Link to="/shop" className="hidden text-sm font-semibold text-ink underline underline-offset-4 sm:block">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.slice(0, 4).map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group relative overflow-hidden rounded-md"
          >
            <ImagePlaceholder label={cat.name} className="aspect-[3/4] w-full transition-transform duration-500 ease-premium group-hover:scale-[1.04]" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/95 px-4 py-3.5">
              <span className="text-sm font-bold text-ink">{cat.name}</span>
              <ArrowUpRight className="h-4 w-4 text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

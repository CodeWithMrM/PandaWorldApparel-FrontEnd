import { useEffect, useState } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { ProductCarouselSection } from '@/components/home/ProductCarouselSection';
import { FlashSaleBanner } from '@/components/home/FlashSaleBanner';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { fetchProducts, fetchCategories } from '@/services/products';

export function HomePage() {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [cats, newest, byNameAsc, byPriceDesc, byPriceAsc] = await Promise.all([
          fetchCategories(),
          fetchProducts({ limit: 8 }), // createdAt desc is the API's default sort
          fetchProducts({ limit: 8, sortBy: 'name', order: 'asc' }), // stand-in for "trending"
          fetchProducts({ limit: 8, sortBy: 'price', order: 'desc' }), // stand-in for "best sellers"
          fetchProducts({ limit: 8, sortBy: 'price', order: 'asc' }), // stand-in for "recommended"
        ]);
        if (!mounted) return;
        setCategories(cats);
        setNewArrivals(newest.products);
        setTrending(byNameAsc.products);
        setBestSellers(byPriceDesc.products);
        setRecommended(byPriceAsc.products);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <HeroBanner />
      <CategoryShowcase categories={categories} />
      <ProductCarouselSection
        eyebrow="Right Now"
        title="Trending Products"
        viewAllHref="/shop?sort=trending"
        products={trending}
        isLoading={isLoading}
      />
      <ProductCarouselSection
        eyebrow="Just Landed"
        title="New Arrivals"
        viewAllHref="/shop?sort=newest"
        products={newArrivals}
        isLoading={isLoading}
      />
      <FlashSaleBanner />
      <ProductCarouselSection
        eyebrow="Crowd Favorites"
        title="Best Sellers"
        viewAllHref="/shop?sort=bestsellers"
        products={bestSellers}
        isLoading={isLoading}
      />
      <ProductCarouselSection
        eyebrow="Picked for You"
        title="Recommended"
        viewAllHref="/shop"
        products={recommended}
        isLoading={isLoading}
      />
      <NewsletterSection />
    </div>
  );
}

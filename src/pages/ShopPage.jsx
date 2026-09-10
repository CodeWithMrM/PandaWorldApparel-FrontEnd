import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { Pagination } from '@/components/shop/Pagination';
import { Breadcrumbs } from '@/components/common/LoadingSpinner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { fetchProducts, fetchCategories } from '@/services/products';
import { getDerivedPricing } from '@/lib/productPresentation';

const SORT_MAP = {
  newest: {},
  trending: { sortBy: 'name', order: 'asc' },
  bestsellers: { sortBy: 'price', order: 'desc' },
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  'name-asc': { sortBy: 'name', order: 'asc' },
};

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';
  const categoryId = searchParams.get('category') || null;
  const saleOnly = searchParams.get('sale') === 'true';
  const [priceBracket, setPriceBracket] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    const sortParams = SORT_MAP[sort] || {};
    fetchProducts({ page, limit: 12, categoryId: categoryId || undefined, ...sortParams })
      .then(({ products, meta }) => {
        if (!mounted) return;
        setAllProducts(products);
        setMeta(meta);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [page, sort, categoryId]);

  // Client-side refinements for things the API doesn't filter on yet
  // (derived sale flag, price brackets, stock).
  const products = useMemo(() => {
    return allProducts.filter((p) => {
      if (saleOnly && !getDerivedPricing(p).onSale) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (priceBracket) {
        const price = Number(p.price);
        if (price < priceBracket.min) return false;
        if (priceBracket.max !== null && price >= priceBracket.max) return false;
      }
      return true;
    });
  }, [allProducts, saleOnly, inStockOnly, priceBracket]);

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) next.delete(key);
      else next.set(key, value);
    });
    if (!('page' in patch)) next.delete('page');
    setSearchParams(next);
  };

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="container-px mx-auto py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, ...(activeCategory ? [{ label: activeCategory.name }] : [])]} />

      <div className="mt-3 sm:mt-4 mb-6 sm:mb-8 flex flex-col items-start justify-between gap-2 sm:gap-4">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
          {activeCategory?.name || (saleOnly ? 'Sale' : 'All Products')}
        </h1>
        {meta && <span className="text-xs sm:text-sm text-ink/45">{meta.total} items</span>}
      </div>

      <div className="mb-4 sm:mb-6 flex items-center justify-between gap-2 sm:gap-3">
        <Button
          variant="default"
          size="sm"
          className="lg:hidden h-8 sm:h-9 text-xs sm:text-sm"
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
        <div className="ml-auto">
          <SortDropdown
            value={sort}
            onChange={(value) => updateParams({ sort: value })}
          />
        </div>
      </div>

      <div className="flex gap-10">
        <FilterSidebar
          className="hidden w-64 shrink-0 lg:flex"
          categories={categories}
          filters={{ categoryId, priceBracket, saleOnly, inStockOnly }}
          onChange={(patch) => {
            if ('categoryId' in patch) updateParams({ category: patch.categoryId });
            if ('priceBracket' in patch) setPriceBracket(patch.priceBracket);
            if ('saleOnly' in patch) updateParams({ sale: patch.saleOnly || null });
            if ('inStockOnly' in patch) setInStockOnly(patch.inStockOnly);
          }}
          onReset={() => {
            setPriceBracket(null);
            setInStockOnly(false);
            updateParams({ category: null, sale: null });
          }}
        />

        <div className="flex-1">
          <ProductGrid products={products} isLoading={isLoading} columns={3} />
          {meta && (
            <Pagination page={page} totalPages={meta.totalPages} onChange={(p) => updateParams({ page: p })} />
          )}
        </div>
      </div>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto p-6">
            <FilterSidebar
              categories={categories}
              filters={{ categoryId, priceBracket, saleOnly, inStockOnly }}
              onChange={(patch) => {
                if ('categoryId' in patch) updateParams({ category: patch.categoryId });
                if ('priceBracket' in patch) setPriceBracket(patch.priceBracket);
                if ('saleOnly' in patch) updateParams({ sale: patch.saleOnly || null });
                if ('inStockOnly' in patch) setInStockOnly(patch.inStockOnly);
              }}
              onReset={() => {
                setPriceBracket(null);
                setInStockOnly(false);
                updateParams({ category: null, sale: null });
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

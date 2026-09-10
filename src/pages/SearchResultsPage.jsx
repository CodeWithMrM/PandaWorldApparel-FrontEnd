import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { Breadcrumbs } from '@/components/common/LoadingSpinner';
import { fetchProducts } from '@/services/products';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setMeta(null);
      setIsLoading(false);
      return;
    }
    let mounted = true;
    setIsLoading(true);
    fetchProducts({ search: query, page, limit: 12 })
      .then(({ products, meta }) => {
        if (!mounted) return;
        setProducts(products);
        setMeta(meta);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [query, page]);

  const updatePage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
  };

  return (
    <div className="container-px mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />
      <div className="mt-4 mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
        {meta && <p className="mt-1 text-sm text-ink/45">{meta.total} products found</p>}
      </div>

      {!query ? (
        <EmptyState icon={Search} title="Search for something" description="Use the search bar above to find products." />
      ) : (
        <>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            columns={4}
            emptyMessage={`We couldn't find anything for "${query}". Try a different search term.`}
          />
          {meta && <Pagination page={page} totalPages={meta.totalPages} onChange={updatePage} />}
        </>
      )}
    </div>
  );
}

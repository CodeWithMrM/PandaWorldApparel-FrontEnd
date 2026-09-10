import api from '@/lib/api';

/**
 * Fetches products with pagination/search/filter/sort — maps straight onto
 * GET /api/products?search=&categoryId=&sortBy=price|name&order=asc|desc&page=&limit=
 */
export async function fetchProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return { products: data.data, meta: data.meta };
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
}

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data.data;
}

export async function fetchCategoryById(id) {
  const { data } = await api.get(`/categories/${id}`);
  return data.data;
}

/**
 * The backend's Product model (see prisma/schema.prisma in the API repo)
 * only has: id, name, description, price, stock, imageUrl, categoryId.
 * There's no reviews/rating, compareAtPrice/discount, or size-variant data
 * yet. Real fashion PLPs/PDPs need all three, so — until the schema is
 * extended — these helpers derive presentable, *deterministic* (same
 * product always looks the same) placeholder values from the product id.
 *
 * Swap these out once the backend grows a Review model, a
 * `compareAtPrice` column, and a ProductVariant model for sizes/colors.
 */

function hashString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/** Deterministic 1-in-3ish "on sale" flag + a plausible strikethrough price. */
export function getDerivedPricing(product) {
  const hash = hashString(product?.id);
  const onSale = hash % 3 === 0;
  if (!onSale) return { onSale: false, compareAtPrice: null, percentOff: 0 };

  const percentOff = 15 + (hash % 4) * 10; // 15/25/35/45%
  const compareAtPrice = Number(product.price) / (1 - percentOff / 100);
  return { onSale: true, compareAtPrice, percentOff };
}

/** Deterministic rating between 3.6 and 5.0, and a plausible review count. */
export function getDerivedRating(product) {
  const hash = hashString(product?.id);
  const rating = Math.round((3.6 + (hash % 15) / 10) * 10) / 10;
  const reviewCount = 8 + (hash % 240);
  return { rating: Math.min(rating, 5), reviewCount };
}

/** Deterministic subset of standard sizes marked available for a product. */
export function getDerivedSizes(product) {
  const hash = hashString(product?.id);
  return STANDARD_SIZES.map((size, i) => ({
    size,
    available: (hash >> i) % 5 !== 0, // most sizes in stock, occasional gaps
  }));
}

export function getStockStatus(product) {
  if (!product) return { label: '', variant: 'muted' };
  if (product.stock <= 0) return { label: 'Sold Out', variant: 'ink' };
  if (product.stock <= 5) return { label: `Only ${product.stock} left`, variant: 'accent' };
  return { label: 'In Stock', variant: 'success' };
}

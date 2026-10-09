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

/** Reviews are empty until customers can submit persisted reviews. */
export function getDerivedRating() {
  return { rating: 0, reviewCount: 0 };
}

/** Every size is offered whenever the product has stock. */
export function getDerivedSizes(product) {
  const available = product?.stock > 0;
  return STANDARD_SIZES.map((size) => ({
    size,
    available,
  }));
}

function hashString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getStockStatus(product) {
  if (!product) return { label: '', variant: 'muted' };
  if (product.stock <= 0) return { label: 'Sold Out', variant: 'ink' };
  if (product.stock <= 5) return { label: `Only ${product.stock} left`, variant: 'accent' };
  return { label: 'In Stock', variant: 'success' };
}

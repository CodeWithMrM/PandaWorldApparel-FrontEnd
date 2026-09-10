import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

/**
 * NOTE: the backend doesn't have a Wishlist model yet, so this is kept in
 * localStorage per-browser for now. It stores full product snapshots (not
 * just IDs) so the wishlist page can render without extra API calls, at
 * the cost of prices/stock going stale until the user revisits the product.
 * Swap this for real API calls once a /api/wishlist endpoint exists.
 */
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // Product snapshots

      isWishlisted: (productId) => get().items.some((p) => p.id === productId),

      toggle: (product) => {
        const exists = get().isWishlisted(product.id);
        if (exists) {
          set({ items: get().items.filter((p) => p.id !== product.id) });
          toast('Removed from wishlist');
        } else {
          set({ items: [...get().items, product] });
          toast.success('Saved to wishlist');
        }
      },

      remove: (productId) => {
        set({ items: get().items.filter((p) => p.id !== productId) });
      },

      clear: () => set({ items: [] }),
    }),
    { name: 'pandaworld-wishlist' }
  )
);

import { create } from 'zustand';
import * as cartService from '@/services/cart';
import { toast } from 'sonner';

export const useCartStore = create((set, get) => ({
  cart: null, // { id, items: [...], itemCount, total }
  isLoading: false,
  isOpen: false, // mini-cart drawer

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  async fetchCart() {
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      set({ cart, isLoading: false });
    } catch {
      // Most likely unauthenticated — leave cart empty rather than erroring loudly.
      set({ isLoading: false });
    }
  },

  async addItem(product, quantity = 1, size) {
    try {
      const cart = await cartService.addCartItem(product.id, quantity, size);
      set({ cart, isOpen: true });
      toast.success(`Added "${product.name}" (${size}) to your bag`);
    } catch (err) {
      toast.error(err.message || 'Could not add item to your bag');
      throw err;
    }
  },

  async updateItem(itemId, quantity) {
    const previous = get().cart;
    try {
      const cart = await cartService.updateCartItem(itemId, quantity);
      set({ cart });
    } catch (err) {
      set({ cart: previous });
      toast.error(err.message || 'Could not update quantity');
    }
  },

  async removeItem(itemId) {
    try {
      const cart = await cartService.removeCartItem(itemId);
      set({ cart });
      toast('Item removed from bag');
    } catch (err) {
      toast.error(err.message || 'Could not remove item');
    }
  },

  async clear() {
    try {
      const cart = await cartService.clearCart();
      set({ cart });
    } catch (err) {
      toast.error(err.message || 'Could not clear bag');
    }
  },

  reset() {
    set({ cart: null });
  },
}));

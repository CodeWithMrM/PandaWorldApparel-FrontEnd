import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isFilterDrawerOpen: false,
  quickViewProduct: null,

  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setFilterDrawerOpen: (isFilterDrawerOpen) => set({ isFilterDrawerOpen }),
  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),
}));

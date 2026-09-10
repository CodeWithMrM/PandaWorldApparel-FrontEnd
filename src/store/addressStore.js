import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * NOTE: the backend's Order model only stores a single `shippingAddress`
 * string per order — there's no dedicated Address model to persist a
 * customer's saved addresses server-side yet. Until that exists, saved
 * addresses live here (per-browser) so the account page and checkout can
 * still offer a "save & reuse address" experience.
 */
export const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: [],

      addAddress: (address) => {
        const newAddress = { id: crypto.randomUUID(), ...address };
        set({ addresses: [...get().addresses, newAddress] });
        return newAddress;
      },

      updateAddress: (id, patch) => {
        set({
          addresses: get().addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        });
      },

      removeAddress: (id) => {
        set({ addresses: get().addresses.filter((a) => a.id !== id) });
      },
    }),
    { name: 'pandaworld-addresses' }
  )
);

/** Flattens an address object into the single-line string the backend expects. */
export function formatAddressLine(address) {
  if (!address) return '';
  const { line1, line2, city, province, postalCode, country } = address;
  return [line1, line2, city, province, postalCode, country].filter(Boolean).join(', ');
}

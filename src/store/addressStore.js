import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ADDRESS_FIELDS = [
  'fullName',
  'line1',
  'line2',
  'city',
  'province',
  'postalCode',
  'country',
  'phone',
];

function createAddressId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `address-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeAddress(address) {
  if (!address || typeof address !== 'object' || Array.isArray(address)) return null;

  const normalized = { id: typeof address.id === 'string' ? address.id : createAddressId() };
  ADDRESS_FIELDS.forEach((field) => {
    normalized[field] = typeof address[field] === 'string' ? address[field] : '';
  });
  if (!normalized.country) normalized.country = 'South Africa';
  return normalized;
}

function normalizeAddresses(addresses) {
  return Array.isArray(addresses)
    ? addresses.map(normalizeAddress).filter(Boolean)
    : [];
}

/**
 * Saved addresses currently live in browser storage because the backend
 * doesn't have an Address model.
 */
export const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: [],

      addAddress: (address) => {
        const newAddress = normalizeAddress({ ...address, id: createAddressId() });
        set((state) => ({ addresses: [...normalizeAddresses(state.addresses), newAddress] }));
        return newAddress;
      },

      updateAddress: (id, patch) => {
        if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return;
        const normalizedPatch = Object.fromEntries(
          ADDRESS_FIELDS
            .filter((field) => typeof patch[field] === 'string')
            .map((field) => [field, patch[field]])
        );
        set((state) => ({
          addresses: normalizeAddresses(state.addresses).map((address) =>
            address.id === id
              ? { ...address, ...normalizedPatch, country: normalizedPatch.country || address.country, id }
              : address
          ),
        }));
      },

      removeAddress: (id) => {
        set((state) => ({
          addresses: normalizeAddresses(state.addresses).filter((address) => address.id !== id),
        }));
      },
    }),
    {
      name: 'pandaworld-addresses',
      version: 1,
      migrate: (persistedState) => ({
        addresses: normalizeAddresses(persistedState?.addresses),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        addresses: normalizeAddresses(persistedState?.addresses),
      }),
    }
  )
);

/** Flattens an address object into the single-line string the backend expects. */
export function formatAddressLine(address) {
  if (!address || typeof address !== 'object') return '';
  const { line1, line2, city, province, postalCode, country } = address;
  return [line1, line2, city, province, postalCode, country]
    .filter((part) => typeof part === 'string' && part.trim())
    .map((part) => part.trim())
    .join(', ');
}

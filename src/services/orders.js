import api from '@/lib/api';

export async function createOrder(shippingAddress) {
  const { data } = await api.post('/orders', { shippingAddress });
  return data.data;
}

export async function fetchMyOrders(params = {}) {
  const { data } = await api.get('/orders', { params });
  return { orders: data.data, meta: data.meta };
}

export async function fetchOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
}

export async function fetchOrderTracking(id) {
  const { data } = await api.get(`/orders/track/${id}`);
  return data.data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function updateProfile(payload) {
  const { data } = await api.put('/users/profile', payload);
  return data.data;
}

/**
 * Initialize Paystack checkout for an order.
 * Returns the authorization URL which the frontend redirects to.
 */
export async function initializePaystackCheckout(orderId) {
  const { data } = await api.post('/payments/paystack/checkout', { orderId });
  return data.data; // { authorizationUrl, accessCode, reference }
}

/**
 * Redirect to Paystack checkout page.
 * Paystack will handle the payment flow and redirect back to our success/cancel URLs.
 */
export async function payWithPaystack(orderId) {
  const checkout = await initializePaystackCheckout(orderId);
  // Redirect to Paystack checkout page
  window.location.href = checkout.authorizationUrl;
}

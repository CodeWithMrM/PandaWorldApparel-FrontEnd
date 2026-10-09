import api from '@/lib/api';

export async function getCart() {
  const { data } = await api.get('/cart');
  return data.data;
}

export async function addCartItem(productId, quantity = 1, size) {
  const { data } = await api.post('/cart/items', { productId, quantity, size });
  return data.data;
}

export async function updateCartItem(itemId, quantity) {
  const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
  return data.data;
}

export async function removeCartItem(itemId) {
  const { data } = await api.delete(`/cart/items/${itemId}`);
  return data.data;
}

export async function clearCart() {
  const { data } = await api.delete('/cart/clear');
  return data.data;
}

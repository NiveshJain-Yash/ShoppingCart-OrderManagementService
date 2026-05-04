import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const cartApi = {
  getCart: (sessionId) => api.get(`/cart/${sessionId}`),
  addItem: (sessionId, item) => api.post(`/cart/${sessionId}/items`, item),
  updateItem: (sessionId, itemId, quantity) => api.put(`/cart/${sessionId}/items/${itemId}`, { quantity }),
  removeItem: (sessionId, itemId) => api.delete(`/cart/${sessionId}/items/${itemId}`),
  applyCoupon: (sessionId, code) => api.post(`/cart/${sessionId}/coupon`, { code }),
  clearCart: (sessionId) => api.delete(`/cart/${sessionId}`)
};

export const orderApi = {
  createOrder: (sessionId, userId) => api.post('/orders', { sessionId, userId }),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  getAllOrders: () => api.get('/orders')
};

import api from './client';

export const subscriptionApi = {
  getSubscription: () => api.get('/subscription'),
  createSubscription: (payload) => api.post('/subscription', payload),
  cancelSubscription: () => api.patch('/subscription/cancel'),
};

export default subscriptionApi;
